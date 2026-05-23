from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class Medication(Base):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    trade_name = Column(String(255), nullable=False)
    active_ingredient = Column(String(255), nullable=False)
    dosage = Column(String(50), nullable=False)
    current_stock = Column(Integer, default=0)
    unit = Column(String(20), nullable=False)

class Procedure(Base):
    __tablename__ = "procedures"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    tuss_code = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    sector = Column(String(100), nullable=False)
    cid = Column(String(10), nullable=False)
