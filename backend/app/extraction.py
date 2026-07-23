import json

from langchain_groq import ChatGroq

from app.config import settings
from app.json_utils import parse_json_response

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=settings.groq_api_key,
    temperature=0,
)


def extract_complaint_fields(state: dict) -> dict:
    current_form = state.get("current_form", {})
    user_message = state.get("user_message", "")

    form_fields = [
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
        "initial_severity",
        "priority",
    ]

    current_state_str = "\n".join(
        [f"- {field}: {current_form.get(field, '(empty)')}" for field in form_fields]
    )

    prompt = f"""Extract complaint fields from the user message. Return ONLY valid JSON with the fields that should be updated.

Current form:
{current_state_str}

User message:
{user_message}

Extract only fields whose value is stated or clearly implied in the user message, AND is new or different from the current form above. Do not repeat a field that is already correct in the current form. Do not guess or infer a field from context alone (e.g. complaint_source is the channel the customer used to report the complaint, such as phone call/email/in-person/letter — only include it if the message itself states that channel; never infer it just because this message is a chat message). If the message describes the problem itself, capture it in detailed_complaint_description.

Return ONLY a JSON object with the fields to add or change. Example:
{{"customer_name": "Jane Doe", "product_name": "Aspirin 100mg", "quantity_affected": "500 units", "detailed_complaint_description": "Tablets found broken inside sealed blister pack"}}
or, if nothing should change:
{{}}

ONLY return the JSON, no other text."""

    response = llm.invoke(prompt)
    response_text = response.content.strip()

    try:
        extracted = parse_json_response(response_text)
        extracted = {k: v for k, v in extracted.items() if v is not None}
    except json.JSONDecodeError:
        print(f"DEBUG: Failed to parse: {response_text}")
        extracted = {}

    return {"extracted_fields": extracted}
