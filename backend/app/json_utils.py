import json
import re


def parse_json_response(text: str) -> dict:
    """Parse a JSON object out of an LLM response, tolerating ```json fences
    or stray text around the object (common even with "return ONLY JSON" prompts)."""
    text = text.strip()

    fenced = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    else:
        start, end = text.find("{"), text.rfind("}")
        if start != -1 and end != -1:
            text = text[start : end + 1]

    return json.loads(text)
