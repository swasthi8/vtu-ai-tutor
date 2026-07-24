import os
import shutil
from datetime import datetime
from uuid import UUID

from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.pdf_reader import extract_text

from services.rag_service import (
    create_vector_store,
    load_vector_store
)

from services.ai_service import (
    get_ai_response,
    generate_summary,
    generate_two_marks,
    generate_five_marks,
    generate_ten_marks,
    generate_mcq_quiz,
    generate_flashcards
)
from services.session_manager import SessionManager, SESSION_ID

# Initialize session manager
session_manager = SessionManager(uploads_base="uploads", vector_base="vectorstore")

# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="VTU AI Tutor API",
    description="AI Powered VTU Learning Assistant using Groq + RAG",
    version="4.0.0"
)

# ==========================================================
# CORS Configuration
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Session-ID"],
)


# Middleware to ensure each request is associated with a session.
# If client provides X-Session-ID header, validate it and reject unknown sessions.
# If no session header is present, create a new session and return its id in the
# X-Session-ID response header.
@app.middleware("http")
async def session_middleware(request: Request, call_next):
    sid = request.headers.get("X-Session-ID")
    # also accept session id via query parameter for GET requests or where header is not set
    if not sid:
        sid = request.query_params.get("session_id")

    if sid:
        # Validate UUID format
        try:
            UUID(sid)
        except Exception:
            return JSONResponse(status_code=404, content={"error": "Session not found"})

        # If session does not exist on server, reject
        if not session_manager.session_exists(sid) and sid not in session_manager.sessions:
            return JSONResponse(status_code=404, content={"error": "Session not found"})

        # Bind to context for downstream services
        SESSION_ID.set(sid)

        response = await call_next(request)
        return response

    # No session provided: create one and attach header to response
    sess = session_manager.create_session()
    SESSION_ID.set(sess.id)
    response = await call_next(request)
    response.headers["X-Session-ID"] = sess.id
    return response

# ==========================================================
# Per-session storage
# Session folders and in-memory session state are managed by SessionManager
# ==========================================================

# ==========================================================
# Request Models
# ==========================================================

class ChatRequest(BaseModel):
    question: str

# ==========================================================
# Startup Event
# ==========================================================

@app.on_event("startup")
def startup():
    # Start session cleanup background task
    try:
        session_manager.start_cleanup()
    except Exception:
        pass

    print("===================================")
    print("VTU AI Tutor Backend Started")
    print("===================================")

# ==========================================================
# Home Route
# ==========================================================

@app.get("/")
def home():
    return {
        "project": "VTU AI Tutor",
        "version": "4.0.0",
        "status": "Running"
    }

# ==========================================================
# Health Check
# ==========================================================

@app.get("/health")
def health():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    return {
        "status": "Backend Running",
        "pdf_uploaded": bool(sess.notes_text) if sess else False,
        "note_count": len(sess.uploaded_notes) if sess else 0
    }

# ==========================================================
# Upload PDF
# ==========================================================

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), request: Request = None):
    # Use session created by middleware (or created here if missing)
    sid = SESSION_ID.get()
    if not sid:
        # Try to read session_id from the multipart form (smallest frontend change)
        try:
            form = await request.form()
            sid_from_form = form.get("session_id")
        except Exception:
            sid_from_form = None

        sid_value = sid_from_form if isinstance(sid_from_form, str) else None

        if sid_value:
            try:
                UUID(sid_value)
            except Exception:
                return JSONResponse(status_code=404, content={"error": "Session not found"})
            # if session does not exist, create it (safe fallback)
            if not session_manager.session_exists(sid_value):
                sess = session_manager.create_session(sid_value)
            else:
                sess = session_manager.get_session(sid_value) or session_manager.create_session(sid_value)
            SESSION_ID.set(sess.id)
        else:
            sess = session_manager.create_session()
            SESSION_ID.set(sess.id)
    else:
        # if client provided an id but it's unknown, create it (safe fallback)
        if not session_manager.session_exists(sid):
            sess = session_manager.create_session(sid)
        else:
            sess = session_manager.get_session(sid) or session_manager.create_session(sid)

    filename = file.filename or "uploaded_note.pdf"
    file_path = sess.upload_path / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    notes_text = extract_text(str(file_path))
    sess.notes_text = notes_text
    sess.current_note = filename

    if not notes_text.strip():
        return {"message": "No readable text found in the uploaded PDF."}

    note_info = {
        "filename": filename,
        "uploaded_at": datetime.utcnow().isoformat() + "Z",
        "characters": len(notes_text),
        "preview": notes_text.replace("\n", " ").strip()[:240],
        "text": notes_text
    }

    for note in sess.uploaded_notes:
        if note["filename"] == filename:
            note.update(note_info)
            break
    else:
        sess.uploaded_notes.append(note_info)

    chunks = create_vector_store(notes_text)

    resp = {
        "message": "PDF Uploaded Successfully",
        "filename": filename,
        "characters": len(notes_text),
        "chunks_created": chunks
    }

    return JSONResponse(content=resp, headers={"X-Session-ID": sess.id})
# ==========================================================
# Notes API
# ==========================================================

@app.get("/notes")
def notes():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    return {"notes": sess.uploaded_notes if sess else []}


@app.get("/notes/{filename}")
def note_detail(filename: str):
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess:
        return JSONResponse(status_code=404, content={"error": "Session not found"})

    note = next((item for item in sess.uploaded_notes if item["filename"] == filename), None)
    if not note:
        return {"error": "Note not found"}
    return {"note": note}


# ==========================================================
# Analytics
# ==========================================================

@app.get("/analytics")
def analytics():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    uploaded = sess.uploaded_notes if sess else []

    total_chars = sum(note.get("characters", 0) for note in uploaded)
    note_count = len(uploaded)
    if note_count:
        average_size = total_chars // note_count
        first_upload = min(note["uploaded_at"] for note in uploaded)
        days = max(1, (datetime.utcnow() - datetime.fromisoformat(first_upload.replace("Z", ""))).days)
        upload_rate = round(note_count / max(days, 1) * 30, 1)
    else:
        average_size = 0
        upload_rate = 0

    top_subject = uploaded[-1]["filename"].split(".")[0] if uploaded else "No subject yet"
    review_cadence = f"{min(2 + note_count, 8)} revision sessions / week"

    return {
        "note_count": note_count,
        "total_characters": total_chars,
        "average_note_size": average_size,
        "upload_rate": f"{upload_rate} PDFs / month",
        "quiz_attempts": sess.quiz_request_count if sess else 0,
        "flashcards_generated": sess.flashcard_request_count if sess else 0,
        "average_answer_time": "1.2s",
        "top_subject": top_subject,
        "review_cadence": review_cadence,
        "notes": uploaded,
        "last_upload": uploaded[-1]["uploaded_at"] if uploaded else None,
    }


# ==========================================================
# AI Chat
# ==========================================================

@app.post("/chat")
def chat(request: ChatRequest):
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None

    if not sess or not sess.notes_text:
        return {"answer": "Please upload a PDF first."}

    answer = get_ai_response(request.question, sess.notes_text)
    sess.chat_request_count += 1

    return {"answer": answer}


# ==========================================================
# Summary
# ==========================================================

@app.get("/summary")
def summary():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess or not sess.notes_text:
        return {"summary": "Please upload a PDF first."}

    return {"summary": generate_summary()}


# ==========================================================
# Generate 2-Mark Questions
# ==========================================================

@app.get("/generate-2marks")
def generate_2marks():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess or not sess.notes_text:
        return {"questions": "Please upload a PDF first."}

    return {"questions": generate_two_marks()}


# ==========================================================
# Generate 5-Mark Questions
# ==========================================================

@app.get("/generate-5marks")
def generate_5marks():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess or not sess.notes_text:
        return {"questions": "Please upload a PDF first."}

    return {"questions": generate_five_marks()}


# ==========================================================
# Generate 10-Mark Questions
# ==========================================================

@app.get("/generate-10marks")
def generate_10marks():
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess or not sess.notes_text:
        return {"questions": "Please upload a PDF first."}

    return {"questions": generate_ten_marks()}
# ==========================================================
# Quiz Generator
# ==========================================================

@app.get("/quiz")
def quiz(module: str | None = None):
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess or not sess.notes_text:
        return {"error": "Please upload a PDF first."}

    context_text = None
    if module and module != "all":
        selected_note = next((note for note in sess.uploaded_notes if note.get("filename") == module), None)
        if selected_note:
            context_text = selected_note.get("text", "")
        else:
            return {"error": "Selected module not found."}

    sess.quiz_request_count += 1
    return generate_mcq_quiz(context_text=context_text)


# ==========================================================
# Flashcards
# ==========================================================

@app.get("/flashcards")
def flashcards(module: str | None = None):
    sid = SESSION_ID.get()
    sess = session_manager.get_session(sid) if sid else None
    if not sess or not sess.notes_text:
        return {"flashcards": [{"question": "No PDF Uploaded", "answer": "Please upload a PDF first."}]}

    context_text = None
    if module and module != "all":
        selected_note = next((note for note in sess.uploaded_notes if note.get("filename") == module), None)
        if selected_note:
            context_text = selected_note.get("text", "")
        else:
            return {"flashcards": [{"question": "Module not found", "answer": "Please select a valid uploaded module."}]}

    sess.flashcard_request_count += 1
    return {"flashcards": generate_flashcards(context_text=context_text)}


# ==========================================================
# API Information
# ==========================================================

@app.get("/info")
def info():

    return {
        "project": "VTU AI Tutor",
        "version": "4.0.0",
        "backend": "FastAPI",
        "frontend": "React + Vite",
        "vector_database": "FAISS",
        "embeddings": "Sentence Transformers",
        "llm": "Groq - Llama 3.3 70B",
        "features": [
            "PDF Upload",
            "AI Chat",
            "Summary Generator",
            "2-Mark Questions",
            "5-Mark Questions",
            "10-Mark Questions",
            "Quiz Generator",
            "Flashcards",
            "RAG Search"
        ]
    }


# ==========================================================
# Run the Application
# ==========================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )