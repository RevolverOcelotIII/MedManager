import enum
from sqlalchemy import Column, Integer, String, Date, Enum, Text, BigInteger
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

class Sex(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class BloodType(str, enum.Enum):
    A_P = "A+"
    A_N = "A-"
    B_P = "B+"
    B_N = "B-"
    AB_P = "AB+"
    AB_N = "AB-"
    O_P = "O+"
    O_N = "O-"

class Patient(Base, TimestampMixin):
    __tablename__ = "patients"
    
    id = Column(BigInteger, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    social_name = Column(String(255), nullable=True)
    cpf = Column(String(14), unique=True, index=True, nullable=False)
    rg = Column(String(20), nullable=True)
    birth_date = Column(Date, nullable=False)
    sex = Column(Enum(Sex, values_callable=lambda obj: [e.value for e in obj]), nullable=True)
    marital_status = Column(String(50), nullable=True)
    nationality = Column(String(100), nullable=True)
    mother_name = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    blood_type = Column(Enum(BloodType, values_callable=lambda obj: [e.value for e in obj]), nullable=True)
    allergies = Column(Text, nullable=True)

    attendances = relationship("Attendance", back_populates="patient")
