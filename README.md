# AIVOA Complaint Management System

AI-powered complaint management for pharma manufacturers. Chat-driven interface logs complaints via natural language → AI extracts details → real-time risk assessment → save to database.

## Features

- **AI Chat Interface**: Describe complaints in free text, AI fills form automatically
- **Smart Edits**: Follow-up messages update only changed fields, preserving existing data
- **Document Upload**: Extract from PDF, DOCX, EML, or TXT files
- **Risk Assessment**: Real-time severity/priority assessment (LLaMA 3.3-70B)
- **Database Persistence**: Save complaints to PostgreSQL
- **Responsive UI**: Two-column layout (form + chat) with dark mode

## Tech Stack

**Backend**: FastAPI + SQLAlchemy + PostgreSQL  
**Frontend**: React + Redux Toolkit + Vite  
**AI**: LangGraph + Groq API (llama-3.1-8b-instant for extraction, llama-3.3-70b-versatile for reasoning)

## Prerequisites

- Python 3.10+ & pip
- Node.js 18+ & npm  
- PostgreSQL 18 (running locally)
- Groq API key (free: https://console.groq.com)

## Setup & Run

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Create `backend/.env`:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/complaint_management
GROQ_API_KEY=your_groq_api_key
```

**Create database:**
```bash
psql -U postgres -c "CREATE DATABASE complaint_management;"
```

**Start backend (Terminal 1):**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```
→ Backend runs on `http://localhost:8000`  
→ Swagger UI: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
```

**Start frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
→ Frontend runs on `http://localhost:5173`

## How to Use

1. Open `http://localhost:5173` in browser
2. **Log complaint**: Type in chat panel → AI extracts and fills form
3. **Edit**: Send follow-up message → AI updates only changed fields
4. **Upload documents**: Click 📎 button, select PDF/DOCX/EML/TXT
5. **Review**: Risk panel updates automatically (severity/priority/action)
6. **Save**: Click "Save Complaint" → stores to database with ID
7. **Reset**: Click "Reset Form" to start new complaint

## Key Architecture

- **Single extraction node** takes `{current_form, user_message}` → returns only-changed fields (handles both new and edit flows)
- **Risk assessment node** merges form + extracted fields → reasons over full complaint
- **Frontend Redux** holds state; **backend is stateless** → sends state with each message
- **Separate `/parse-document`** for file upload → extracts text → reuses extraction pipeline

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/extract` | POST | Extract fields + risk assessment from user message |
| `/parse-document` | POST | Extract text from PDF/DOCX/EML/TXT |
| `/complaints` | POST | Save complaint to database |
| `/health` | GET | Health check |

## Troubleshooting

**Backend won't start**  
→ Check PostgreSQL running, database exists, `.env` has correct `DATABASE_URL` and `GROQ_API_KEY`

**Frontend can't connect to backend**  
→ Check backend running on port 8000, CORS enabled in `app/main.py`

**File upload fails**  
→ Only `.pdf`, `.docx`, `.eml`, `.txt` supported. Check `python-docx` and `pypdf` in requirements.txt

## Project Structure

```
backend/
  ├── app/
  │   ├── main.py           # FastAPI app + CORS
  │   ├── routes.py         # Endpoints
  │   ├── graph.py          # LangGraph pipeline
  │   ├── extraction.py     # Extraction node
  │   ├── risk_assessment.py # Risk assessment node
  │   ├── models.py         # Complaint table
  │   └── document_parser.py # File parsing
  └── requirements.txt

frontend/
  ├── src/
  │   ├── app/store.js           # Redux store
  │   ├── features/complaint/    # Form + risk components
  │   └── features/chat/         # Chat + file upload
  └── package.json
```

---

**Submission**: AIVOA Round 1 Full Stack Developer Assessment  
**Date**: 2026-07-24
