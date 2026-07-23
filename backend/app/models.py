from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(50), default="Pending Triage")

    # 1. Origin & customer details
    complaint_source = Column(String(255))
    customer_name = Column(String(255))

    # 2. Product & batch identification
    product_name = Column(String(255))
    product_strength_grade = Column(String(255))
    batch_lot_number = Column(String(255))
    manufacturing_date = Column(String(100))
    expiry_date = Column(String(100))
    quantity_affected = Column(String(100))

    # 3. Complaint details
    complaint_type = Column(String(255))
    complaint_date = Column(String(100))
    detailed_complaint_description = Column(Text)

    # 4. Initial assessment & priority (AI co-pilot risk assessment output)
    initial_severity = Column(String(50))
    priority = Column(String(50))

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
