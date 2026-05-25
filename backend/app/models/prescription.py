from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

class Prescription(Base, TimestampMixin):
    __tablename__ = "prescriptions"
    
    id = Column(BigInteger, primary_key=True, index=True)
    attendance_id = Column(BigInteger, ForeignKey("attendances.id"), nullable=False)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)

    is_executed = Column(Boolean, default=False, server_default="false")

    attendance = relationship("Attendance", back_populates="prescriptions")
    medication = relationship("Medication")
