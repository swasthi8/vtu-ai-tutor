import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Notes from "./pages/Notes";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import About from "./pages/About";

import { Routes, Route } from "react-router-dom";

import NoteDetail from "./pages/NoteDetail";

function App() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:filename" element={<NoteDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}

export default App;