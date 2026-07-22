import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">VTU exam prep, powered by AI</p>
        <h1>Turn your notes into smarter study sessions.</h1>
        <p className="hero-text">
          Upload VTU PDFs, chat with AI, and generate summaries, quizzes, and flashcards from one modern study workflow.
        </p>

        <div className="hero-buttons">
          <Link to="/upload">
            <button className="button-primary">Upload Notes</button>
          </Link>
          <Link to="/chat">
            <button className="button-secondary">Ask AI</button>
          </Link>
        </div>
      </div>

      <div className="hero-highlights">
        <div className="highlight-card">
          <strong>Fast notes ingestion</strong>
          <p>Load your PDFs and build an AI-ready study base instantly.</p>
        </div>
        <div className="highlight-card">
          <strong>Exam-focused outputs</strong>
          <p>Generate 2/5/10 mark questions, summaries, and flashcards.</p>
        </div>
        <div className="highlight-card">
          <strong>One streamlined workflow</strong>
          <p>Upload, chat, quiz, and revise without leaving the app.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;