import { useEffect, useState } from "react";
import { getFlashcards, getNotesList } from "../services/api";
import "./Flashcards.css";

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("all");

  useEffect(() => {
    async function initFlashcards() {
      try {
        const notesData = await getNotesList();
        setModules(notesData.notes || []);
      } catch (error) {
        console.error("Error loading modules:", error);
        setModules([]);
      }

      await loadFlashcards("all");
    }

    initFlashcards();
  }, []);

  async function loadFlashcards(moduleName = selectedModule) {
    setLoading(true);
    try {
      const data = await getFlashcards(moduleName);
      setFlashcards(data.flashcards || []);
      setIndex(0);
      setFlipped(false);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  }

  const nextCard = () => {
    if (flashcards.length === 0) return;
    setIndex((prev) => (prev + 1) % flashcards.length);
    setFlipped(false);
  };

  const previousCard = () => {
    if (flashcards.length === 0) return;
    setIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  };

  if (loading) {
    return (
      <div className="flashcards-page">
        <h2>Loading Flashcards...</h2>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flashcards-page">
        <h2>No flashcards available.</h2>
        <p>Please upload a PDF first.</p>
      </div>
    );
  }

  return (
    <div className="flashcards-page">
      <h1>🎴 AI Flashcards</h1>

      <label style={{ display: "block", marginBottom: "12px" }}>
        <span style={{ display: "block", marginBottom: "6px" }}>Generate flashcards from:</span>
        <select
          value={selectedModule}
          onChange={(event) => {
            const moduleName = event.target.value;
            setSelectedModule(moduleName);
            loadFlashcards(moduleName);
          }}
          style={{ padding: "8px 10px", borderRadius: "8px" }}
        >
          <option value="all">All modules</option>
          {modules.map((module) => (
            <option key={module.filename} value={module.filename}>
              {module.filename}
            </option>
          ))}
        </select>
      </label>

      <div
        className="flashcard"
        onClick={() => setFlipped(!flipped)}
      >
        <h2>
          {flipped
            ? flashcards[index].answer
            : flashcards[index].question}
        </h2>
      </div>

      <p>Click the flashcard to flip it.</p>

      <div className="controls">
        <button onClick={previousCard}>⬅ Previous</button>

        <span>
          Card {index + 1} of {flashcards.length}
        </span>

        <button onClick={nextCard}>Next ➡</button>
      </div>
    </div>
  );
}

export default Flashcards;