import enum
from sqlalchemy import Column, Integer, String, Text, Enum, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

procedure_responsible_roles = Table(
    "procedure_responsible_roles",
    Base.metadata,
    Column("procedure_id", Integer, ForeignKey("procedures.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id"), primary_key=True),
)

class Medication(Base, TimestampMixin):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    trade_name = Column(String(255), nullable=False)
    active_ingredient = Column(String(255), nullable=False)
    dosage = Column(String(50), nullable=False)
    current_stock = Column(Integer, default=0)
    unit = Column(String(20), nullable=False)

class ProcedureCategory(str, enum.Enum):
    screening = "screening"
    exam = "exam"
    surgery = "surgery"
    consultation = "consultation"
    nursing = "nursing"
    therapy = "therapy"
    other = "other"

class Procedure(Base, TimestampMixin):
    __tablename__ = "procedures"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True, index=True)
    category = Column(
        Enum(ProcedureCategory, values_callable=lambda obj: [e.value for e in obj], native_enum=False),
        nullable=False,
        server_default="other"
    )
    description = Column(Text, nullable=True)

    responsible_roles = relationship("Role", secondary=procedure_responsible_roles)
