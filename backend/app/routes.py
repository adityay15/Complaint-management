from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.document_parser import extract_text_from_upload
from app.models import Complaint
from app.schemas import (
    ComplaintState,
    ComplaintDelta,
    ComplaintOut,
    ComplaintSaveRequest,
    DocumentParseResponse,
)
from app.graph import complaint_workflow
from app.completeness import check_completeness

router = APIRouter()


@router.post("/extract", response_model=ComplaintDelta)
def extract_complaint(payload: ComplaintState):
    result = complaint_workflow.invoke(
        {
            "current_form": payload.current_form,
            "user_message": payload.user_message,
        }
    )
    merged_form = {**payload.current_form, **result["extracted_fields"]}
    completeness = check_completeness(merged_form)

    return ComplaintDelta(
        extracted_fields=result["extracted_fields"],
        risk_assessment=result["risk_assessment"],
        root_cause_recommendation=result["root_cause_recommendation"],
        completeness=completeness,
        summary=result["summary"],
    )


@router.post("/parse-document", response_model=DocumentParseResponse)
async def parse_document(file: UploadFile = File(...)):
    content = await file.read()
    extracted_text = extract_text_from_upload(file.filename, content)
    return DocumentParseResponse(extracted_text=extracted_text)


@router.post("/complaints", response_model=ComplaintOut)
def save_complaint(payload: ComplaintSaveRequest, db: Session = Depends(get_db)):
    complaint = Complaint(**payload.model_dump())
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint
