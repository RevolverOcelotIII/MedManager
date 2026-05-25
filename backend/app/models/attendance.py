import enum
from sqlalchemy import Column, String, Text, ForeignKey, Enum, DateTime, BigInteger
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

class AttendanceStatus(str, enum.Enum):
    WAITING_TRIAGE = "Waiting Triage"
    WAITING_CONSULTATION = "Waiting Consultation"
    WAITING_MEDICATION = "Waiting Medication"
    MEDICAL_RETURN = "Medical Return"
    FINISHED = "Finished"
    CANCELLED = "Cancelled"

class Attendance(Base, TimestampMixin):
    __tablename__ = "attendances"
    
    id = Column(BigInteger, primary_key=True, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False)
    
    status = Column(
        Enum(AttendanceStatus, values_callable=lambda obj: [e.value for e in obj]), 
        nullable=False, 
        server_default="Waiting Triage"
    )
    
    triage_notes = Column(Text, nullable=True)
    vitals_bp = Column(String(20), nullable=True)
    vitals_temp = Column(String(10), nullable=True)
    doctor_notes = Column(Text, nullable=True)
    
    finished_at = Column(DateTime, nullable=True)

    patient = relationship("Patient", back_populates="attendances")
    prescriptions = relationship("Prescription", back_populates="attendance")
