# AIVOA Complaint Management System

AI-powered complaint management for pharma manufacturers. Chat-driven interface logs complaints via natural language → AI extracts details → real-time risk assessment → save to database.

## Features

### Core
- **AI Chat Interface**: Describe complaints in free text, AI fills form automatically
- **Smart Edits**: Follow-up messages update only changed fields, preserving existing data
- **Document Upload**: Extract from PDF, DOCX, EML, or TXT files
- **Database Persistence**: Save complaints to PostgreSQL
- **Responsive UI**: Two-column layout (form + chat) with dark mode

### AI-Powered Analysis
- **Risk Assessment**: Real-time severity/priority assessment with suggested actions (LLaMA 3.3-70B)
- **Root Cause Recommendation**: Analyzes complaint details and suggests likely root causes with step-by-step investigation guide (LLaMA 3.3-70B)
- **Complaint Completeness Checker**: Validates critical vs. recommended fields; warns before save if critical fields missing
- **Auto Summary**: Generates concise 2-3 sentence executive summary of each complaint for quick review

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
3. **Review completeness**: Form shows warnings for missing critical fields (⚠️) and optional fields (💡)
4. **Read summary**: Auto-generated executive summary appears below the form
5. **View risk assessment**: Real-time severity, priority, and suggested next action
6. **Check root cause**: Recommended root cause + step-by-step investigation guide
7. **Edit**: Send follow-up message → AI updates only changed fields, all panels refresh
8. **Upload documents**: Click 📎 button, select PDF/DOCX/EML/TXT → same extraction & analysis pipeline
9. **Save**: Click "Save Complaint" (enabled only when all critical fields filled) → stores to database with ID
10. **Reset**: Click "Reset Form" to clear and start new complaint

## Key Architecture

### LangGraph Pipeline (Backend)
**Single message flow**: Extract → Risk Assessment → Root Cause → Summary
1. **Extraction Node**: Takes `{current_form, user_message}` → returns only-changed fields (handles both new complaints and edits)
2. **Risk Assessment Node**: Merges form + extracted fields → reasons over full complaint → severity + priority + action
3. **Root Cause Node**: Analyzes complete complaint → suggests root cause + investigation steps
4. **Summary Node**: Generates concise executive summary (2-3 sentences)
5. **Completeness Check**: Validates critical fields (customer_name, product_name, complaint_type, description) before allowing save

### Frontend State Management
- **Redux Toolkit**: Separate slices for form, risk assessment, root cause, summary, and completeness
- **Stateless Backend**: Frontend sends current form state with every message; backend merges and returns deltas
- **Document Upload**: `/parse-document` endpoint extracts text from files → reuses same extraction pipeline

### File Structure
- Backend is stateless (no session memory) — all state lives in Redux on frontend
- Each message triggers full pipeline → all 4 analysis panels update in parallel
- Save operation sends complete form state to database

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
  │   ├── main.py              # FastAPI app + CORS
  │   ├── routes.py            # Endpoints
  │   ├── graph.py             # LangGraph pipeline
  │   ├── extraction.py        # Extraction node
  │   ├── risk_assessment.py   # Risk assessment node
  │   ├── root_cause.py        # Root cause recommendation node
  │   ├── summary.py           # Auto-summary generation node
  │   ├── completeness.py      # Field completeness validation
  │   ├── models.py            # Complaint table
  │   ├── schemas.py           # Pydantic models
  │   └── document_parser.py   # File parsing
  └── requirements.txt

frontend/
  ├── src/
  │   ├── app/store.js                # Redux store
  │   ├── features/complaint/
  │   │   ├── ComplaintForm.jsx       # Main form
  │   │   ├── RiskAssessmentPanel.jsx # Risk assessment display
  │   │   ├── RootCausePanel.jsx      # Root cause analysis display
  │   │   ├── SummaryPanel.jsx        # Complaint summary display
  │   │   ├── complaintFormSlice.js   # Form Redux state
  │   │   ├── riskAssessmentSlice.js  # Risk Redux state
  │   │   ├── rootCauseSlice.js       # Root cause Redux state
  │   │   ├── summarySlice.js         # Summary Redux state
  │   │   └── completenessSlice.js    # Completeness validation Redux state
  │   └── features/chat/
  │       ├── ChatPanel.jsx           # Chat + document upload
  │       └── extractApi.js           # Backend API calls
  └── package.json
```

---

