import json

from langchain_groq import ChatGroq

from app.config import settings
from app.json_utils import parse_json_response

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.groq_api_key,
    temperature=0,
)

FIELD_ORDER = [
    "complaint_source",
    "customer_name",
    "product_name",
    "product_strength_grade",
    "batch_lot_number",
    "manufacturing_date",
    "expiry_date",
    "quantity_affected",
    "complaint_type",
    "complaint_date",
    "detailed_complaint_description",
]


def generate_summary(state: dict) -> dict:
    current_form = state.get("current_form", {})
    extracted_fields = state.get("extracted_fields", {})
    merged = {**current_form, **extracted_fields}

    complaint_summary = "\n".join(
        [f"- {field}: {merged.get(field, '(empty)')}" for field in FIELD_ORDER]
    )

    prompt = f"""You are a quality assurance document specialist. Generate a concise executive summary of this pharmaceutical complaint.

Complaint details:
{complaint_summary}

Write a brief, professional summary (2-3 sentences max) that captures:
1. What product/batch is affected
2. What the issue is
3. How many units affected (if known)

Return ONLY a valid JSON object with one key:
- "summary": the 2-3 sentence summary text

Keep it factual and professional, suitable for a QA report.

ONLY return the JSON, no other text."""

    response = llm.invoke(prompt)
    response_text = response.content.strip()

    try:
        summary = parse_json_response(response_text)
    except json.JSONDecodeError:
        print(f"DEBUG: Failed to parse summary: {response_text}")
        summary = {
            "summary": "Summary generation failed. Please review the complaint details manually."
        }

    return {"summary": summary}
