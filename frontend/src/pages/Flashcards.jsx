import { useEffect, useState } from "react";
import { getFlashcards } from "../services/api";
import "./Flashcards.css";

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    async function loadFlashcards() {
      try {
        const data = await getFlashcards();
        setFlashcards(data.flashcards || []);
      } catch (error) {
        console.error("Error loading flashcards:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFlashcards();
  }, []);

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