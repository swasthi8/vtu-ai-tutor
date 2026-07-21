import os
import shutil

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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
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
        "pdf_uploaded": bool(notes_text)
    }

# ==========================================================
# Upload PDF
# ==========================================================

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global notes_text

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    notes_text = extract_text(file_path)

    if not notes_text.strip():
        return {
            "message": "No readable text found in the uploaded PDF."
        }

    chunks = create_vector_store(notes_text)

    return {
        "message": "PDF Uploaded Successfully",
        "filename": file.filename,
        "characters": len(notes_text),
        "chunks_created": chunks
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