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


def recommend_root_cause(state: dict) -> dict:
    current_form = state.get("current_form", {})
    extracted_fields = state.get("extracted_fields", {})
    merged = {**current_form, **extracted_fields}

    complaint_summary = "\n".join(
        [f"- {field}: {merged.get(field, '(empty)')}" for field in FIELD_ORDER]
    )

    prompt = f"""You are a quality assurance analyst at a pharmaceutical (API/FDF) manufacturer.
A customer complaint has been filed. Analyze it and recommend the most likely root cause.

Complaint details:
{complaint_summary}

Based on the complaint type, description, product info, and batch details, identify the root cause and recommend investigation steps.

Return ONLY a valid JSON object with these keys:
- "root_cause": a short description of the likely root cause (e.g., "Improper storage conditions leading to tablet discoloration" or "Manufacturing process deviation in tablet compression")
- "investigation_steps": a bulleted list (as a single string with newlines) of specific steps to investigate this root cause (e.g., "1. Review batch storage temperature logs\\n2. Inspect remaining units from batch for similar defects\\n3. Check manufacturing equipment calibration records")

If complaint details are too sparse to determine a root cause, make a reasonable educated guess based on the complaint type and description.

ONLY return the JSON, no other text."""

    response = llm.invoke(prompt)
    response_text = response.content.strip()

    try:
        root_cause = parse_json_response(response_text)
    except json.JSONDecodeError:
        print(f"DEBUG: Failed to parse root cause recommendation: {response_text}")
        root_cause = {
            "root_cause": "Manual review required — automated analysis failed.",
            "investigation_steps": "Contact QA team for expert review.",
        }

    return {"root_cause_recommendation": root_cause}
