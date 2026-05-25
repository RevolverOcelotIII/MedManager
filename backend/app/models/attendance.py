import enum
from sqlalchemy import Column, ForeignKey, Enum, DateTime, BigInteger
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

class GravityLevel(str, enum.Enum):
    red = "red"
    orange = "orange"
    yellow = "yellow"
    green = "green"
    blue = "blue"

class Attendance(Base, TimestampMixin):
    __tablename__ = "attendances"
    
    id = Column(BigInteger, primary_key=True, index=True)
    patient_id = Column(BigInteger, ForeignKey("patients.id"), nullable=False)
    
    gravity = Column(
        Enum(GravityLevel, values_callable=lambda obj: [e.value for e in obj], native_enum=False), 
        nullable=False, 
        server_default="green"
    )
    
    finished_at = Column(DateTime, nullable=True)

    patient = relationship("Patient", back_populates="attendances")
    prescriptions = relationship("Prescription", back_populates="attendance")
    procedures = relationship("AttendanceProcedure", back_populates="attendance")
