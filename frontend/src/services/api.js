const API_URL = "http://127.0.0.1:8000";

// ===============================
// Upload PDF
// ===============================
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload PDF");
  }

  return await response.json();
}

// ===============================
// AI Chat
// ===============================
export async function askQuestion(question) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to get AI response");
  }

  return await response.json();
}

// ===============================
// Summary
// ===============================
export async function getSummary() {
  const response = await fetch(`${API_URL}/summary`);

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  return await response.json();
}

// ===============================
// 2 Marks
// ===============================
export async function getTwoMarks() {
  const response = await fetch(`${API_URL}/generate-2marks`);

  if (!response.ok) {
    throw new Error("Failed to generate 2-mark questions");
  }

  return await response.json();
}

// ===============================
// 5 Marks
// ===============================
export async function getFiveMarks() {
  const response = await fetch(`${API_URL}/generate-5marks`);

  if (!response.ok) {
    throw new Error("Failed to generate 5-mark questions");
  }

  return await response.json();
}

// ===============================
// 10 Marks
// ===============================
export async function getTenMarks() {
  const response = await fetch(`${API_URL}/generate-10marks`);

  if (!response.ok) {
    throw new Error("Failed to generate 10-mark questions");
  }

  return await response.json();
}

// ===============================
// Quiz
// ===============================
export async function getQuiz() {
  const response = await fetch(`${API_URL}/quiz`);

  if (!response.ok) {
    throw new Error("Failed to generate quiz");
  }

  return await response.json();
}

// ===============================
// Flashcards
// ===============================
export async function getFlashcards() {
  const response = await fetch(`${API_URL}/flashcards`);

  if (!response.ok) {
    throw new Error("Failed to generate flashcards");
  }

  return await response.json();
}

// ===============================
// Backend Info
// ===============================
export async function getInfo() {
  const response = await fetch(`${API_URL}/info`);

  if (!response.ok) {
    throw new Error("Failed to fetch backend information");
  }

  return await response.json();
}

// ===============================
// Health Check
// ===============================
export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend is not responding");
  }

  return await response.json();
}