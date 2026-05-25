import enum
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Numeric, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin
from app.models.patient import Sex

class EmploymentType(str, enum.Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACTOR = "Contractor"
    TEMPORARY = "Temporary"

class Role(Base, TimestampMixin):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

class Employee(Base, TimestampMixin):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    social_name = Column(String(255), nullable=True)
    cpf = Column(String(14), unique=True, index=True, nullable=False)
    rg = Column(String(20), nullable=True)
    birth_date = Column(Date, nullable=False)
    sex = Column(Enum(Sex, values_callable=lambda obj: [e.value for e in obj]), nullable=True)
    marital_status = Column(String(50), nullable=True)
    nationality = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    
    # Employment info
    hire_date = Column(Date, nullable=False)
    termination_date = Column(Date, nullable=True)
    employment_type = Column(Enum(EmploymentType, values_callable=lambda obj: [e.value for e in obj]), nullable=False, server_default="Full-time")
    salary = Column(Numeric(10, 2), nullable=True)
    active = Column(Boolean, default=True, server_default="true")
    
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    role = relationship("Role")
