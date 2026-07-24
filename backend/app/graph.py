from langgraph.graph import StateGraph
from typing_extensions import TypedDict

from app.extraction import extract_complaint_fields
from app.risk_assessment import assess_risk
from app.root_cause import recommend_root_cause
from app.summary import generate_summary


class ComplaintGraphState(TypedDict):
    current_form: dict
    user_message: str
    extracted_fields: dict
    risk_assessment: dict
    root_cause_recommendation: dict
    summary: dict


graph = StateGraph(ComplaintGraphState)

graph.add_node("extract", extract_complaint_fields)
graph.add_node("assess_risk", assess_risk)
graph.add_node("recommend_root_cause", recommend_root_cause)
graph.add_node("generate_summary", generate_summary)
graph.set_entry_point("extract")
graph.add_edge("extract", "assess_risk")
graph.add_edge("assess_risk", "recommend_root_cause")
graph.add_edge("recommend_root_cause", "generate_summary")
graph.set_finish_point("generate_summary")

complaint_workflow = graph.compile()
