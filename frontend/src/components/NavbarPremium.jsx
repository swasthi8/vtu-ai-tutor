import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export default function NavbarPremium() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  return (
    <header className="fixed w-full z-40 top-4 px-6">
      <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">SC</div>
          <div>
            <div className="text-lg font-extrabold text-white">Semester Companion AI</div>
            <div className="text-xs text-slate-400">AI study companion</div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-4 items-center text-slate-200">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Dashboard</NavLink>
          <NavLink to="/notes" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>My Notes</NavLink>
          <NavLink to="/chat" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>AI Tutor</NavLink>
          <NavLink to="/flashcards" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Flashcards</NavLink>
          <NavLink to="/quiz" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Quiz</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Analytics</NavLink>
        </nav>

        <button aria-label="toggle dark" onClick={() => setDark(!dark)} className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 p-2 text-slate-100 transition hover:bg-white/20">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
