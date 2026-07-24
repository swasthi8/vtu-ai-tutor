import uuid
import shutil
import asyncio
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Optional
import contextvars

# Context variable to hold current request's session id
SESSION_ID: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar("session_id", default=None)


class Session:
    def __init__(self, session_id: str, base_uploads: Path, base_vector: Path):
        self.id = session_id
        self.upload_path = base_uploads / session_id
        self.vector_path = base_vector / session_id
        self.notes_text: str = ""
        self.current_note: Optional[str] = None
        self.uploaded_notes: list = []
        self.quiz_request_count: int = 0
        self.flashcard_request_count: int = 0
        self.chat_request_count: int = 0
        self.last_access: datetime = datetime.utcnow()

        # Ensure directories exist
        self.upload_path.mkdir(parents=True, exist_ok=True)
        self.vector_path.mkdir(parents=True, exist_ok=True)

    def touch(self):
        self.last_access = datetime.utcnow()


class SessionManager:
    def __init__(self, uploads_base: str = "uploads", vector_base: str = "vectorstore", expiry_minutes: int = 60):
        self.base_uploads = Path(uploads_base)
        self.base_vector = Path(vector_base)
        self.base_uploads.mkdir(parents=True, exist_ok=True)
        self.base_vector.mkdir(parents=True, exist_ok=True)

        self.sessions: Dict[str, Session] = {}
        self.expiry = timedelta(minutes=expiry_minutes)
        self._cleanup_task = None

    def create_session(self, session_id: Optional[str] = None) -> Session:
        # Generate UUID4 if not provided
        if session_id is None:
            session_id = str(uuid.uuid4())

        if session_id in self.sessions:
            sess = self.sessions[session_id]
            sess.touch()
            return sess

        # Create session directories and object
        sess = Session(session_id, self.base_uploads, self.base_vector)
        self.sessions[session_id] = sess
        return sess

    def get_session(self, session_id: str) -> Optional[Session]:
        sess = self.sessions.get(session_id)
        if sess:
            sess.touch()
        return sess

    def session_exists(self, session_id: str) -> bool:
        if session_id in self.sessions:
            return True
        # Fallback: check filesystem
        return (self.base_uploads / session_id).exists() or (self.base_vector / session_id).exists()

    def remove_session(self, session_id: str):
        sess = self.sessions.pop(session_id, None)
        # Remove folders on disk
        try:
            upload_dir = self.base_uploads / session_id
            vector_dir = self.base_vector / session_id
            if upload_dir.exists():
                shutil.rmtree(upload_dir)
            if vector_dir.exists():
                shutil.rmtree(vector_dir)
        except Exception:
            pass

    async def _cleanup_loop(self):
        while True:
            now = datetime.utcnow()
            expired = [sid for sid, s in list(self.sessions.items()) if now - s.last_access > self.expiry]
            for sid in expired:
                try:
                    self.remove_session(sid)
                except Exception:
                    pass
            await asyncio.sleep(60)

    def start_cleanup(self):
        # Start background cleanup task
        if self._cleanup_task is None:
            self._cleanup_task = asyncio.create_task(self._cleanup_loop())
