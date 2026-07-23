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


def assess_risk(state: dict) -> dict:
    current_form = state.get("current_form", {})
    extracted_fields = state.get("extracted_fields", {})
    merged = {**current_form, **extracted_fields}

    complaint_summary = "\n".join(
        [f"- {field}: {merged.get(field, '(empty)')}" for field in FIELD_ORDER]
    )

    prompt = f"""You are a quality assurance reviewer at a pharmaceutical (API/FDF) manufacturer, assessing an incoming customer complaint for risk.

Complaint details:
{complaint_summary}

Classify the complaint and return ONLY a valid JSON object with these three keys:
- "severity": one of "Critical", "Major", "Minor" (Critical = patient safety/health impact, contamination, adverse reaction, or mislabeling; Major = product quality defect affecting a batch but no confirmed health impact; Minor = cosmetic/packaging issue with no quality impact)
- "priority": one of "High", "Medium", "Low" (how urgently this needs action, considering severity and scale/quantity affected)
- "suggested_next_action": a short, specific next step for the QA team (e.g. "Escalate to QA for immediate batch investigation and possible recall assessment")

If complaint details are too sparse to judge confidently, make a reasonable conservative estimate rather than leaving fields blank.

ONLY return the JSON, no other text."""

    response = llm.invoke(prompt)
    response_text = response.content.strip()

    try:
        risk = parse_json_response(response_text)
    except json.JSONDecodeError:
        print(f"DEBUG: Failed to parse risk assessment: {response_text}")
        risk = {
            "severity": "Major",
            "priority": "Medium",
            "suggested_next_action": "Manual review required — automated risk assessment failed.",
        }

    return {"risk_assessment": risk}
