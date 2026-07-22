import os
import shutil
from datetime import datetime

from fastapi import FastAPI, UploadFile, File
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
)

# ==========================================================
# Upload Folder
# ==========================================================

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Stores extracted PDF text
notes_text = ""
current_note = None
uploaded_notes = []
quiz_request_count = 0
flashcard_request_count = 0
chat_request_count = 0

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
    try:
        load_vector_store()
        print("Vector Store Loaded Successfully.")
    except Exception as e:
        print("No previous vector database found.")
        print(e)

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
    return {
        "status": "Backend Running",
        "pdf_uploaded": bool(notes_text),
        "note_count": len(uploaded_notes)
    }

# ==========================================================
# Upload PDF
# ==========================================================

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global notes_text, current_note, uploaded_notes

    filename = file.filename or "uploaded_note.pdf"
    file_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    notes_text = extract_text(file_path)
    current_note = file.filename

    if not notes_text.strip():
        return {
            "message": "No readable text found in the uploaded PDF."
        }

    note_info = {
        "filename": file.filename,
        "uploaded_at": datetime.utcnow().isoformat() + "Z",
        "characters": len(notes_text),
        "preview": notes_text.replace("\n", " ").strip()[:240],
        "text": notes_text
    }

    for note in uploaded_notes:
        if note["filename"] == file.filename:
            note.update(note_info)
            break
    else:
        uploaded_notes.append(note_info)

    chunks = create_vector_store(notes_text)

    return {
        "message": "PDF Uploaded Successfully",
        "filename": file.filename,
        "characters": len(notes_text),
        "chunks_created": chunks
    }
# ==========================================================
# Notes API
# ==========================================================

@app.get("/notes")
def notes():
    return {"notes": uploaded_notes}


@app.get("/notes/{filename}")
def note_detail(filename: str):
    note = next((item for item in uploaded_notes if item["filename"] == filename), None)
    if not note:
        return {
            "error": "Note not found"
        }
    return {
        "note": note
    }


# ==========================================================
# Analytics
# ==========================================================

@app.get("/analytics")
def analytics():
    total_chars = sum(note.get("characters", 0) for note in uploaded_notes)
    note_count = len(uploaded_notes)
    if note_count:
        average_size = total_chars // note_count
        first_upload = min(note["uploaded_at"] for note in uploaded_notes)
        days = max(1, (datetime.utcnow() - datetime.fromisoformat(first_upload.replace("Z", ""))).days)
        upload_rate = round(note_count / max(days, 1) * 30, 1)
    else:
        average_size = 0
        upload_rate = 0

    top_subject = uploaded_notes[-1]["filename"].split(".")[0] if uploaded_notes else "No subject yet"
    review_cadence = f"{min(2 + note_count, 8)} revision sessions / week"

    return {
        "note_count": note_count,
        "total_characters": total_chars,
        "average_note_size": average_size,
        "upload_rate": f"{upload_rate} PDFs / month",
        "quiz_attempts": quiz_request_count,
        "flashcards_generated": flashcard_request_count,
        "average_answer_time": "1.2s",
        "top_subject": top_subject,
        "review_cadence": review_cadence,
        "notes": uploaded_notes,
        "last_upload": uploaded_notes[-1]["uploaded_at"] if uploaded_notes else None,
    }


# ==========================================================
# AI Chat
# ==========================================================

@app.post("/chat")
def chat(request: ChatRequest):

    if not notes_text:
        return {
            "answer": "Please upload a PDF first."
        }

    answer = get_ai_response(
        request.question,
        notes_text
    )

    return {
        "answer": answer
    }


# ==========================================================
# Summary
# ==========================================================

@app.get("/summary")
def summary():

    if not notes_text:
        return {
            "summary": "Please upload a PDF first."
        }

    return {
        "summary": generate_summary()
    }


# ==========================================================
# Generate 2-Mark Questions
# ==========================================================

@app.get("/generate-2marks")
def generate_2marks():

    if not notes_text:
        return {
            "questions": "Please upload a PDF first."
        }

    return {
        "questions": generate_two_marks()
    }


# ==========================================================
# Generate 5-Mark Questions
# ==========================================================

@app.get("/generate-5marks")
def generate_5marks():

    if not notes_text:
        return {
            "questions": "Please upload a PDF first."
        }

    return {
        "questions": generate_five_marks()
    }


# ==========================================================
# Generate 10-Mark Questions
# ==========================================================

@app.get("/generate-10marks")
def generate_10marks():

    if not notes_text:
        return {
            "questions": "Please upload a PDF first."
        }

    return {
        "questions": generate_ten_marks()
    }
# ==========================================================
# Quiz Generator
# ==========================================================

@app.get("/quiz")
def quiz():
    global quiz_request_count
    quiz_request_count += 1

    if not notes_text:
        return {
            "error": "Please upload a PDF first."
        }

    return generate_mcq_quiz()


# ==========================================================
# Flashcards
# ==========================================================

@app.get("/flashcards")
def flashcards():
    global flashcard_request_count
    flashcard_request_count += 1

    if not notes_text:
        return {
            "flashcards": [
                {
                    "question": "No PDF Uploaded",
                    "answer": "Please upload a PDF first."
                }
            ]
        }

    return {
        "flashcards": generate_flashcards()
    }


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