from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
import enum

class RecordType(str, enum.Enum):
    MEDICATION = "medication"
    PROCEDURE = "procedure"

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)

    category = Column(Enum(RecordType), nullable=False)

    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=True)
    procedure_id = Column(Integer, ForeignKey("procedures.id"), nullable=True)
    
    observation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient")
    professional = relationship("Employee")
    medication = relationship("Medication")
    procedure = relationship("Procedure")
