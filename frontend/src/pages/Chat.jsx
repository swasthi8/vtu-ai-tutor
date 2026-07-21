import { useState } from "react";
import "./Chat.css";
import {
  askQuestion,
  getSummary,
  getTwoMarks,
  getFiveMarks,
  getTenMarks,
} from "../services/api";

function Chat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! Upload your VTU notes first, then ask me questions.",
    },
  ]);

  // Send Chat
  const handleSend = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
      },
    ]);

    try {
      const res = await askQuestion(message);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "❌ Unable to connect to backend.",
        },
      ]);
    }

    setMessage("");
  };

  // Summary
  const handleSummary = async () => {
    const res = await getSummary();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "📄 SUMMARY\n\n" + res.summary,
      },
    ]);
  };

  // 2 Marks
  const handleTwoMarks = async () => {
    const res = await getTwoMarks();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "📝 2 MARK QUESTIONS\n\n" + res.questions,
      },
    ]);
  };

  // 5 Marks
  const handleFiveMarks = async () => {
    const res = await getFiveMarks();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "📘 5 MARK QUESTIONS\n\n" + res.questions,
      },
    ]);
  };

  // 10 Marks
  const handleTenMarks = async () => {
    const res = await getTenMarks();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "📕 10 MARK QUESTIONS\n\n" + res.questions,
      },
    ]);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>🤖 VTU AI Tutor</h1>
        <p>Ask questions from your uploaded VTU notes.</p>
      </div>

      {/* Study Tools */}
      <div className="study-tools">
        <button onClick={handleSummary}>📄 Summary</button>

        <button onClick={handleTwoMarks}>📝 2 Marks</button>

        <button onClick={handleFiveMarks}>📘 5 Marks</button>

        <button onClick={handleTenMarks}>📕 10 Marks</button>
      </div>

      {/* Chat Messages */}
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask a question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;