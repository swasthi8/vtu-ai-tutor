# 🎓 VTU AI Tutor

An AI-powered study assistant designed for VTU (Visvesvaraya Technological University) students. This application helps students upload PDF notes, generate summaries, ask questions, and improve learning with AI.

---

## 🚀 Features

- 📄 Upload VTU PDF notes
- 🤖 AI-generated summaries
- 💬 Chat with uploaded documents
- ❓ Generate 2-mark and 8-mark questions
- 📝 AI-powered quizzes
- 📚 Simple concept explanations
- 🔍 Semantic search using FAISS
- ⚡ Fast and responsive user interface

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- CSS
- Axios

### Backend
- FastAPI
- Python
- Uvicorn

### AI & Database
- Groq API (LLM)
- FAISS Vector Store
- LangChain

---

## 📂 Project Structure

```
VTU-AI-Tutor/
│
├── backend/
│   ├── app.py
│   ├── services/
│   ├── uploads/
│   ├── vectorstore/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/swasthi8/vtu-ai-tutor.git
```

### 2. Navigate to the project

```bash
cd vtu-ai-tutor
```

---

## 🔹 Backend Setup

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file and add your API key:

```env
GROQ_API_KEY=your_api_key_here
```

Start the backend:

```bash
uvicorn app:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## 🔹 Frontend Setup

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 📷 Screenshots

Add screenshots of:

- Home Page
- Upload Page
- Chat Interface
- Quiz Page
- Summary Generation

---

## 📌 Future Enhancements

- 🎤 Voice Assistant
- 🌙 Dark Mode
- 📱 Mobile Responsive UI
- 🧠 Personalized Learning
- ☁️ Cloud Deployment
- 🔐 User Authentication

---

## 👩‍💻 Author

**Swasthi Jain**

Computer Science Engineering Student

GitHub: https://github.com/swasthi8

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
