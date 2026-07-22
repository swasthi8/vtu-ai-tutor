function About() {
  return (
    <div className="about-page">
      <div className="page-heading">
        <p className="eyebrow">About the platform</p>
        <h1>VTU AI Tutor turns notes into exam-ready practice.</h1>
        <p className="page-lead">
          A smart study companion for VTU students, combining PDF upload, AI-powered chat, quiz generation, and flashcard review in one polished workflow.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h2>Designed for focused study</h2>
          <p>
            Use VTU AI Tutor to extract key ideas from your notes, then turn them into structured practice and fast revision tools.
          </p>
          <ul>
            <li>📄 Upload VTU PDF notes with ease</li>
            <li>💬 Ask AI questions directly from your content</li>
            <li>📝 Generate summaries and exam-style questions</li>
            <li>🎴 Review concepts with interactive flashcards</li>
          </ul>
        </div>

        <div className="tech-panel">
          <h2>Technology stack</h2>
          <p>
            Built with a modern React frontend and a fast API backend, using vector search and AI models to deliver intelligent study support.
          </p>
          <ul>
            <li>React + Vite</li>
            <li>FastAPI backend</li>
            <li>FAISS vector database</li>
            <li>Llama 3.3 70B AI models</li>
            <li>PDF parsing and semantic search</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;