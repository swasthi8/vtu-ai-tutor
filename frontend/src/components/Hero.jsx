import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <h1>VTU AI Tutor</h1>

      <h2>Learn Smarter with Artificial Intelligence</h2>

      <p>
        Upload VTU notes, chat with AI,
        generate quizzes and flashcards in seconds.
      </p>

      <div className="buttons">

        <Link to="/upload">
          <button>Upload Notes</button>
        </Link>

        <Link to="/chat">
          <button className="secondary">
            Start Learning
          </button>
        </Link>

      </div>

    </section>
  );
}

export default Hero;