import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNotesList } from '../services/api';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const result = await getNotesList();
        setNotes(result.notes || []);
      } catch (error) {
        console.error('Failed to load notes', error);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-[32px] border border-white/10 shadow-2xl p-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">My Notes</p>
            <h1 className="mt-4 text-4xl font-extrabold text-white">Your uploaded notes</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Browse the notes you have uploaded and open any file to review the extracted content.</p>
          </div>
          <div className="rounded-3xl bg-slate-950/30 border border-white/10 p-5 text-slate-300">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Uploaded notes</p>
            <p className="mt-3 text-lg font-semibold text-white">{notes.length} files</p>
            <p className="mt-1 text-slate-400">Available from your uploads</p>
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="text-slate-300">Loading your notes...</p>
          ) : notes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/30 p-10 text-center text-slate-400">
              <p className="text-white font-semibold">No uploaded notes found</p>
              <p className="mt-2">Upload a PDF first to see it listed here.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {notes.map((note) => (
                <div key={note.filename} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{note.filename}</p>
                      <h2 className="mt-4 text-2xl font-semibold text-white">{note.filename}</h2>
                      <p className="mt-3 text-slate-300">Uploaded {new Date(note.uploaded_at).toLocaleString()}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-400">{note.characters} chars</span>
                  </div>
                  <p className="mt-6 text-slate-300 min-h-[80px] whitespace-pre-wrap">{note.preview || 'No preview available.'}</p>
                  <Link
                    to={`/notes/${encodeURIComponent(note.filename)}`}
                    className="inline-flex mt-6 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Open note
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
