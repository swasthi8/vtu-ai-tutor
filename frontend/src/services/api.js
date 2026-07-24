const API_URL = "http://127.0.0.1:8000";

function getSessionId() {
  try {
    return localStorage.getItem("session_id");
  } catch (e) {
    return null;
  }
}

function saveSessionId(id) {
  try {
    localStorage.setItem("session_id", id);
  } catch (e) {
    // ignore
  }
}

function getHeaders(extra = {}) {
  const headers = { ...extra };
  const sid = getSessionId();
  if (sid) headers["X-Session-ID"] = sid;
  return headers;
}

// ===============================
// Upload PDF
// ===============================
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload PDF");
  }
  // Save session id returned by server (if any)
  const sid = response.headers.get("X-Session-ID");
  if (sid) saveSessionId(sid);

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
      ...getHeaders(),
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
  const response = await fetch(`${API_URL}/summary`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  return await response.json();
}

// ===============================
// 2 Marks
// ===============================
export async function getTwoMarks() {
  const response = await fetch(`${API_URL}/generate-2marks`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to generate 2-mark questions");
  }

  return await response.json();
}

// ===============================
// 5 Marks
// ===============================
export async function getFiveMarks() {
  const response = await fetch(`${API_URL}/generate-5marks`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to generate 5-mark questions");
  }

  return await response.json();
}

// ===============================
// 10 Marks
// ===============================
export async function getTenMarks() {
  const response = await fetch(`${API_URL}/generate-10marks`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to generate 10-mark questions");
  }

  return await response.json();
}

// ===============================
// Quiz
// ===============================
export async function getQuiz(module = null) {
  const url = new URL(`${API_URL}/quiz`);
  if (module && module !== "all") {
    url.searchParams.set("module", module);
  }

  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to generate quiz");
  }

  const data = await response.json();
  if (data && data.error) {
    throw new Error(data.error);
  }

  return data;
}

// ===============================
// Flashcards
// ===============================
export async function getFlashcards(module = null) {
  const url = new URL(`${API_URL}/flashcards`);
  if (module && module !== "all") {
    url.searchParams.set("module", module);
  }

  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to generate flashcards");
  }

  return await response.json();
}

// ===============================
// Notes
// ===============================
export async function getNotesList() {
  const response = await fetch(`${API_URL}/notes`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return await response.json();
}

export async function getNoteDetail(filename) {
  const response = await fetch(`${API_URL}/notes/${encodeURIComponent(filename)}`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch note details");
  }

  return await response.json();
}

// ===============================
// Backend Info
// ===============================
export async function getInfo() {
  const response = await fetch(`${API_URL}/info`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Failed to fetch backend information");
  }

  return await response.json();
}

// ===============================
// Health Check
// ===============================
export async function getHealth() {
  const response = await fetch(`${API_URL}/health`, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error("Backend is not responding");
  }

  return await response.json();
}