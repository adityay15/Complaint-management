# Project Context

## What this is
AIVOA Round 1 Full Stack Developer Assessment — AI-powered Customer
Complaint Management System for a pharma (API/FDF) manufacturer.
DEADLINE: tomorrow afternoon. Working, explainable submission > perfect code.

## Mandatory stack
- Frontend: React + Redux Toolkit
- Backend: Python FastAPI
- AI orchestration: LangGraph
- LLMs via Groq: gemma2-9b-it (extraction), llama-3.3-70b-versatile (reasoning)
- DB: PostgreSQL
- Font: Google Inter

## How the app must actually behave (from the demo video — read carefully)
- The left "Log Customer Complaint" form is NEVER typed into directly by
  the user. It is only ever filled or changed by the AI assistant.
- The right panel is a CHAT-style co-pilot, not just a file dropzone. It
  handles three things through ONE conversational interface:
  1. Log complaint — free text prompt describing a complaint → AI extracts
     fields → fills the empty form.
  2. Edit complaint — a follow-up message correcting/adding info (e.g.
     "sorry, batch number is X, quantity is Y") → AI updates ONLY those
     fields and preserves everything else already in the form.
  3. Document extraction — upload a PDF/email → same extraction as #1,
     and still editable afterward via more chat messages like #2.
- Alongside the form, there's an "AI co-pilot risk assessment" section
  (severity, suggested next action, etc.) that updates based on reasoning
  over the whole current complaint, every time the form changes.

## Key architecture decision (understand this before coding)
Because edits must preserve existing fields, the extraction step cannot
just be "extract everything from this text" every time — it needs to know
what's ALREADY in the form. So one LangGraph node takes two inputs:
  (current_form_state, new_user_message) -> returns only the fields that
  should change.
This single node handles BOTH "log new complaint" (form starts empty) and
"edit" (form has data) — no separate intent classifier needed.
The backend stays stateless: Redux on the frontend holds current form
state and sends it with every message; the backend merges and returns.
A second node (risk assessment) runs after, reasoning over the full
updated complaint to produce severity + suggested next action.

## How I want to work with you
I'm a beginner, being interviewed on this code afterward, with a hard
deadline tomorrow. So:
- Before a genuinely new concept (LangGraph state, Redux thunks, Pydantic
  models, dependency injection) appears for the first time, explain it in
  2-4 plain-English sentences before showing code. Don't re-explain a
  concept once I've already seen it.
- Build one focused piece at a time (roughly one file or one endpoint),
  not a giant multi-file dump.
- After each piece, give a SHORT summary: what it does, why it's built
  this way. Skip long line-by-line walkthroughs unless I ask for one.
- Get the mandatory demo flow (log -> edit -> document extraction, with
  risk assessment updating) working end-to-end FIRST. Polish, extra bonus
  features, and refactoring come only after that works and only if time
  allows.
- If something is genuinely optional/nice-to-have, tell me it's optional
  and let me decide whether we do it now, given the deadline.
- I run every command myself and report back the output/errors — don't
  assume something worked without me confirming.

## Ground rules
- Follow the build order below. One step at a time, confirm before next.
- Small, explainable diffs. No large unexplained rewrites.
- Ask before adding a new library or pattern not already agreed on.

## Build order (time-boxed given the deadline)
1. Backend skeleton (FastAPI hello world) + Postgres connection + one
   Complaint model/table.
2. The core AI endpoint: takes {current_form_state, message} -> returns
   updated fields (LangGraph node #1, using gemma2-9b-it). Test with
   curl/Swagger UI before touching frontend.
3. Risk assessment node #2 (llama-3.3-70b-versatile), chained after #1.
4. Frontend: static form (matching reference UI) + Redux store holding
   form state. No AI yet, just structure.
5. Frontend: chat panel wired to the backend endpoint from step 2/3 -
   this is the mandatory demo flow, get it working now.
6. Document upload path (reuses the same backend endpoint - just a
   different way of producing the "message" text, via PDF/email parsing).
7. Only if time remains: bonus features, styling polish, tests.

## Assignment brief
[paste the full original assignment text here]

## Demo video transcript (what the AI must actually do)
[paste the transcript you gave me here]