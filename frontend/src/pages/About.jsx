function About() {
  return (
    <div className="container">
      <h1>About VTU AI Tutor</h1>

      <p>
        VTU AI Tutor is an AI-powered learning platform built for VTU students.
      </p>

      <h2>Features</h2>
      <ul>
        <li>📄 Upload PDF Notes</li>
        <li>💬 AI Chat with Notes</li>
        <li>📝 Chapter Summary</li>
        <li>📚 2-Mark Questions</li>
        <li>📖 5-Mark Questions</li>
        <li>📘 10-Mark Questions</li>
        <li>❓ MCQ Quiz</li>
        <li>🧠 Flashcards</li>
      </ul>

      <h2>Technology Used</h2>
      <ul>
        <li>React + Vite</li>
        <li>FastAPI</li>
        <li>Groq Llama 3.3 70B</li>
        <li>FAISS Vector Database</li>
        <li>Sentence Transformers</li>
      </ul>
    </div>
  );
}

export default About;