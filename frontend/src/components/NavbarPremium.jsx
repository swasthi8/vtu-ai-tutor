import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function NavbarPremium() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-40 top-4 px-6 transition-transform duration-300 ease-out ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto rounded-3xl border border-white/12 bg-slate-950/60 shadow-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">SC</div>
          <div>
            <div className="text-lg font-extrabold text-white">Semester Companion AI</div>
            <div className="text-xs text-slate-300">AI study companion</div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-4 items-center text-slate-200">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Dashboard</NavLink>
          <NavLink to="/notes" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>My Notes</NavLink>
          <NavLink to="/chat" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>AI Tutor</NavLink>
          <NavLink to="/flashcards" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Flashcards</NavLink>
          <NavLink to="/quiz" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'hover:text-white'}>Quiz</NavLink>
        </nav>
      </div>
    </header>
  );
}
