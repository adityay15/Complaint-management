from langgraph.graph import StateGraph
from typing_extensions import TypedDict

from app.extraction import extract_complaint_fields
from app.risk_assessment import assess_risk


class ComplaintGraphState(TypedDict):
    current_form: dict
    user_message: str
    extracted_fields: dict
    risk_assessment: dict


graph = StateGraph(ComplaintGraphState)

graph.add_node("extract", extract_complaint_fields)
graph.add_node("assess_risk", assess_risk)
graph.set_entry_point("extract")
graph.add_edge("extract", "assess_risk")
graph.set_finish_point("assess_risk")

complaint_workflow = graph.compile()
