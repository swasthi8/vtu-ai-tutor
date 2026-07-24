from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from contextvars import ContextVar
from services.session_manager import SESSION_ID


# ==========================================================
# Embedding Model
# ==========================================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

BASE_DB_PATH = Path("vectorstore")

# Keep a per-session cache of loaded vectorstores
_vector_stores = {}


def _get_session_db_path() -> Path:
    sid = SESSION_ID.get()
    if not sid:
        raise RuntimeError("Session ID not set in context")
    return BASE_DB_PATH / sid


# ==========================================================
# Create Vector Store
# ==========================================================

def create_vector_store(text: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_text(text)

    db_path = _get_session_db_path()
    db_path.mkdir(parents=True, exist_ok=True)

    # If a vector DB already exists for this session, load it and append new texts
    existing_db = load_vector_store()
    if existing_db is not None:
        try:
            # Prefer add_texts if available
            if hasattr(existing_db, "add_texts"):
                existing_db.add_texts(chunks)
            else:
                # Fallback: create a new store from chunks and merge indices if supported
                new_db = FAISS.from_texts(texts=chunks, embedding=embeddings)
                if hasattr(existing_db, "merge_from"):
                    existing_db.merge_from(new_db)
                else:
                    # As a last resort, re-create by saving both
                    # (This is unlikely; most FAISS wrappers support add_texts)
                    pass

            existing_db.save_local(str(db_path))
            _vector_stores[SESSION_ID.get()] = existing_db
            print(f"Appended {len(chunks)} chunks to existing Vector Store for session {SESSION_ID.get()}.")
            return len(chunks)
        except Exception as e:
            print("Failed to append to existing vector store, recreating:", e)

    # No existing DB -> create new
    vector_db = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings
    )

    vector_db.save_local(str(db_path))
    _vector_stores[SESSION_ID.get()] = vector_db

    print(f"Vector Store Created for session {SESSION_ID.get()} with {len(chunks)} chunks.")

    return len(chunks)


# ==========================================================
# Load Vector Store
# ==========================================================

def load_vector_store():
    sid = SESSION_ID.get()
    if not sid:
        print("No session id in context for loading vector store.")
        return None

    if sid in _vector_stores:
        return _vector_stores[sid]

    db_path = _get_session_db_path()

    if not db_path.exists():
        print(f"No vector DB for session {sid}.")
        return None

    try:
        vector_db = FAISS.load_local(
            str(db_path),
            embeddings,
            allow_dangerous_deserialization=True
        )

        _vector_stores[sid] = vector_db
        print(f"Vector Store Loaded Successfully for session {sid}.")
        return vector_db

    except Exception as e:
        print("Failed to load vector store:", e)
        return None


# ==========================================================
# Search Notes
# ==========================================================

def search_notes(question: str, k: int = 8):
    vector_db = load_vector_store()

    if vector_db is None:
        return ""

    docs = vector_db.similarity_search(
        question,
        k=k
    )

    return "\n\n".join(doc.page_content for doc in docs)


# ==========================================================
# Clear Vector Store (Optional)
# ==========================================================

def clear_vector_store():
    sid = SESSION_ID.get()
    if not sid:
        return

    _vector_stores.pop(sid, None)

    db_path = _get_session_db_path()
    if db_path.exists():
        try:
            import shutil
            shutil.rmtree(db_path)
            print(f"Vector Store Deleted for session {sid}.")
        except Exception as e:
            print("Unable to delete vector store:", e)