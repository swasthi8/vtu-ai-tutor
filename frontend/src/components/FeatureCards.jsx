import { Link } from "react-router-dom";

function FeatureCards() {
  return (
    <section className="features">

      <Link to="/upload" className="card-link">
        <div className="card">
          <h3>📄 Upload PDF</h3>
          <p>Upload VTU notes for AI analysis.</p>
        </div>
      </Link>

      <Link to="/chat" className="card-link">
        <div className="card">
          <h3>🤖 AI Chat</h3>
          <p>Ask questions from your uploaded notes.</p>
        </div>
      </Link>

      <Link to="/quiz" className="card-link">
        <div className="card">
          <h3>📝 Quiz Generator</h3>
          <p>Create 2-mark and 8-mark questions instantly.</p>
        </div>
      </Link>

      <Link to="/flashcards" className="card-link">
        <div className="card">
          <h3>📚 Flashcards</h3>
          <p>Revise quickly with AI-generated flashcards.</p>
        </div>
      </Link>

    </section>
  );
}

export default FeatureCards;