from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin
from datetime import datetime
import enum

class RecordType(str, enum.Enum):
    MEDICATION = "medication"
    PROCEDURE = "procedure"

class RecordStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MedicalRecord(Base, TimestampMixin):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)

    category = Column(Enum(RecordType), nullable=False)
    status = Column(Enum(RecordStatus), nullable=False, default=RecordStatus.PENDING)
    active = Column(Boolean, default=True, nullable=False)

    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=True)
    procedure_id = Column(Integer, ForeignKey("procedures.id"), nullable=True)
    
    observation = Column(Text, nullable=True)
    registration_date = Column(DateTime, default=datetime.utcnow, nullable=False)

    patient = relationship("Patient")
    professional = relationship("Employee")
    medication = relationship("Medication")
    procedure = relationship("Procedure")
