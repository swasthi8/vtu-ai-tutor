import { useEffect, useState } from "react";
import { getQuiz } from "../services/api";
import "./Quiz.css";

function Quiz() {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    try {
      const data = await getQuiz();

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