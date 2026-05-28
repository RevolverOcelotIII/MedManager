import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, BigInteger, Table, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

# Junction table for AttendanceProcedure and Medication
attendance_procedure_medications = Table(
    "attendance_procedure_medications",
    Base.metadata,
    Column("attendance_procedure_id", BigInteger, ForeignKey("attendance_procedures.id"), primary_key=True),
    Column("medication_id", Integer, ForeignKey("medications.id"), primary_key=True),
)

class AttendanceProcedureStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"
    canceled = "canceled"

class AttendanceProcedure(Base, TimestampMixin):
    __tablename__ = "attendance_procedures"
    
    id = Column(BigInteger, primary_key=True, index=True)
    attendance_id = Column(BigInteger, ForeignKey("attendances.id"), nullable=False)
    procedure_id = Column(Integer, ForeignKey("procedures.id"), nullable=False)
    
    status = Column(
        Enum(AttendanceProcedureStatus, values_callable=lambda obj: [e.value for e in obj], native_enum=False), 
        nullable=False, 
        server_default="pending"
    )
    description = Column(Text, nullable=True)
    
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    
    ordered_by_id = Column(BigInteger, ForeignKey("employees.id"), nullable=True)
    executed_by_id = Column(BigInteger, ForeignKey("employees.id"), nullable=True)
    
    attendance = relationship("Attendance", back_populates="procedures")
    procedure = relationship("Procedure")
    
    ordered_by = relationship("Employee", foreign_keys=[ordered_by_id])
    executed_by = relationship("Employee", foreign_keys=[executed_by_id])
    
    medications = relationship("Medication", secondary=attendance_procedure_medications)
