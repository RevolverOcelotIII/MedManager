from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    cpf = Column(String(14), unique=True, index=True, nullable=False)
    birth_date = Column(Date, nullable=False)
    medical_record_number = Column(String(50), unique=True, nullable=False)
