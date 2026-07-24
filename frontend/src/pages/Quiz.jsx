import { useEffect, useState } from "react";
import { getNotesList, getQuiz } from "../services/api";
import "./Quiz.css";

function Quiz() {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("all");

  useEffect(() => {
    async function initQuiz() {
      try {
        const notesData = await getNotesList();
        setModules(notesData.notes || []);
      } catch (error) {
        console.error(error);
        setModules([]);
      }

      await loadQuiz("all");
    }

    initQuiz();
  }, []);

  async function loadQuiz(moduleName = selectedModule) {
    setLoading(true);
    try {
      const data = await getQuiz(moduleName);

      if (Array.isArray(data)) {
        setQuiz(data);
      } else if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        setQuiz([]);
      }
    } catch (error) {
      console.error(error);
      setQuiz([]);
    } finally {
      setLoading(false);
    }
  }

  const nextQuestion = () => {
    if (!selected) return;

    if (selected === quiz[current].answer) {
      setScore((prev) => prev + 1);
    }

    setSelected("");

    if (current + 1 >= quiz.length) {
      setFinished(true);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <h2>Loading Quiz...</h2>
      </div>
    );
  }

  if (quiz.length === 0) {
    return (
      <div className="quiz-page">
        <h2>No Quiz Available</h2>
        <p>Please upload a PDF first.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="quiz-page">
        <h1>🎉 Quiz Completed!</h1>

        <h2>
          Score: {score} / {quiz.length}
        </h2>

        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <h1>📝 AI Quiz</h1>

      <label style={{ display: "block", marginBottom: "12px" }}>
        <span style={{ display: "block", marginBottom: "6px" }}>Generate quiz from:</span>
        <select
          value={selectedModule}
          onChange={(event) => {
            const moduleName = event.target.value;
            setSelectedModule(moduleName);
            loadQuiz(moduleName);
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

      <h2>
        Question {current + 1} of {quiz.length}
      </h2>

      <h3>{quiz[current].question}</h3>

      {quiz[current].options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
            />
            {option}
          </label>
        </div>
      ))}

      <button onClick={nextQuestion}>Next</button>
    </div>
  );
}

export default Quiz;