import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# ==========================================================
# Embedding Model
# ==========================================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

DB_PATH = "vectorstore"

vector_db = None


# ==========================================================
# Create Vector Store
# ==========================================================

def create_vector_store(text):
    global vector_db

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_text(text)

    vector_db = FAISS.from_texts(
        texts=chunks,
        embedding=embeddings
    )

    vector_db.save_local(DB_PATH)

    print(f"Vector Store Created with {len(chunks)} chunks.")

    return len(chunks)


# ==========================================================
# Load Vector Store
# ==========================================================

def load_vector_store():
    global vector_db

    if not os.path.exists(DB_PATH):
        print("No previous vector database found.")
        vector_db = None
        return

    try:
        vector_db = FAISS.load_local(
            DB_PATH,
            embeddings,
            allow_dangerous_deserialization=True
        )

        print("Vector Store Loaded Successfully.")

    except Exception as e:
        print("Failed to load vector store:", e)
        vector_db = None


# ==========================================================
# Search Notes
# ==========================================================

def search_notes(question, k=8):
    global vector_db

    if vector_db is None:
        load_vector_store()

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
    global vector_db

    vector_db = None

    if os.path.exists(DB_PATH):
        try:
            import shutil
            shutil.rmtree(DB_PATH)
            print("Vector Store Deleted.")
        except Exception as e:
            print("Unable to delete vector store:", e)