import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteDetail } from '../services/api';

export default function NoteDetail() {
  const { filename } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNote() {
      try {
        const data = await getNoteDetail(filename);
        setNote(data.note || null);
      } catch (error) {
        console.error('Failed to load note', error);
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [filename]);

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto pb-16">
      {loading ? (
        <div className="glass rounded-[32px] p-10 text-slate-300">Loading note...</div>
      ) : !note ? (
        <div className="glass rounded-[32px] p-10 text-slate-300">Note not found.</div>
      ) : (
        <div className="glass rounded-[32px] border border-white/10 shadow-2xl p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Note Details</p>
          <h1 className="mt-4 text-4xl font-extrabold text-white">{note.filename}</h1>
          <p className="mt-2 text-slate-300">Uploaded at {new Date(note.uploaded_at).toLocaleString()}</p>
          <p className="mt-6 text-slate-300 whitespace-pre-wrap rounded-3xl border border-white/10 bg-slate-950/70 p-6">{note.text}</p>
        </div>
      )}
    </div>
  );
}
