import os
import json
from dotenv import load_dotenv
from groq import Groq

from services.rag_service import search_notes

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = "llama-3.3-70b-versatile"


# ==========================================================
# Common Groq Function
# ==========================================================

def ask_llm(prompt: str):
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert VTU AI Tutor. "
                        "Answer ONLY using the uploaded notes. "
                        "Never use outside knowledge."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            max_tokens=1800
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error: {str(e)}"


# ==========================================================
# AI Chat
# ==========================================================

def get_ai_response(question, notes=None):

    context = search_notes(question, k=8)

    if not context:
        return "Please upload a PDF first."

    prompt = f"""
You are a VTU AI Tutor.

Answer ONLY from the uploaded notes.

Rules:

- Do NOT use outside knowledge.
- If the answer is not available, reply:
'I couldn't find this in the uploaded notes.'

Uploaded Notes:

{context}

Question:

{question}
"""

    return ask_llm(prompt)


# ==========================================================
# Summary
# ==========================================================

def generate_summary():

    context = search_notes("summary important topics", k=8)

    if not context:
        return "Please upload a PDF first."

    prompt = f"""
Create an exam-oriented summary ONLY from the uploaded notes.

Requirements:

- Easy English
- Bullet points
- Important concepts
- Suitable for VTU exam preparation
- Do NOT include information outside the uploaded notes

Uploaded Notes:

{context}
"""

    return ask_llm(prompt)


# ==========================================================
# 2 Marks
# ==========================================================

def generate_two_marks():

    context = search_notes("important 2 mark questions", k=8)

    if not context:
        return "Please upload a PDF first."

    prompt = f"""
Generate exactly 10 VTU 2-Mark Questions ONLY from the uploaded notes.

Rules:

- Questions only
- No answers
- Number the questions
- Do NOT use outside knowledge

Uploaded Notes:

{context}
"""

    return ask_llm(prompt)


# ==========================================================
# 5 Marks
# ==========================================================

def generate_five_marks():

    context = search_notes("important 5 mark questions", k=8)

    if not context:
        return "Please upload a PDF first."

    prompt = f"""
Generate exactly 10 VTU 5-Mark Questions ONLY from the uploaded notes.

Rules:

- Questions only
- No answers
- Do NOT use outside knowledge

Uploaded Notes:

{context}
"""

    return ask_llm(prompt)


# ==========================================================
# 10 Marks
# ==========================================================

def generate_ten_marks():

    context = search_notes("important 10 mark questions", k=8)

    if not context:
        return "Please upload a PDF first."

    prompt = f"""
Generate exactly 10 VTU 10-Mark Questions ONLY from the uploaded notes.

Rules:

- Questions only
- No answers
- Do NOT use outside knowledge

Uploaded Notes:

{context}
"""

    return ask_llm(prompt)
# ==========================================================
# Quiz Generator
# ==========================================================

def generate_mcq_quiz(context_text: str | None = None):

    context = context_text if context_text else search_notes("important concepts", k=8)

    if not context:
        return {"error": "Please upload a PDF first."}

    prompt = f"""
You are a VTU AI Tutor.

Generate exactly 5 multiple-choice questions ONLY from the uploaded notes.

Rules:
- Use ONLY information from the uploaded notes.
- Never use outside knowledge.
- Never generate DBMS, SQL, OS, DAA, CN, etc. unless they are actually present in the uploaded notes.
- Each question must have exactly 4 options.
- One option must be correct.
- Return ONLY valid JSON.
- Do NOT add explanations or markdown.

JSON Format:

[
  {{
    "question": "Question from uploaded notes",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": "Correct Option"
  }}
]

Uploaded Notes:

{context}
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            max_tokens=2000
        )

        text = response.choices[0].message.content.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "", 1)

        if text.startswith("```"):
            text = text.replace("```", "", 1)

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        start = text.find("[")
        end = text.rfind("]") + 1

        if start != -1 and end != 0:
            text = text[start:end]

        return json.loads(text)

    except Exception as e:
        print(e)
        return {"error": str(e)}


# ==========================================================
# Flashcards
# ==========================================================

def generate_flashcards(context_text: str | None = None):

    context = context_text if context_text else search_notes("important concepts", k=8)

    if not context:
        return [
            {
                "question": "No PDF Uploaded",
                "answer": "Please upload a PDF first."
            }
        ]

    prompt = f"""
You are a VTU AI Tutor.

Generate exactly 10 flashcards ONLY from the uploaded notes.

Rules:
- Use ONLY the uploaded notes.
- Never use outside knowledge.
- Never generate topics that are not present in the uploaded notes.
- Keep answers short (1–3 lines).
- Return ONLY valid JSON.
- No markdown.
- No explanations.

JSON Format:

[
  {{
    "question": "Question from uploaded notes",
    "answer": "Answer from uploaded notes"
  }}
]

Uploaded Notes:

{context}
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "Return only valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            max_tokens=2000
        )

        text = response.choices[0].message.content.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "", 1)

        if text.startswith("```"):
            text = text.replace("```", "", 1)

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        start = text.find("[")
        end = text.rfind("]") + 1

        if start != -1 and end != 0:
            text = text[start:end]

        return json.loads(text)

    except Exception as e:
        print(e)

        return [
            {
                "question": "Error",
                "answer": "Unable to generate flashcards."
            }
        ]