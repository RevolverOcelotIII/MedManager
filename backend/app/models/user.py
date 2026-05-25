from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import TimestampMixin

class User(Base, TimestampMixin):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True, nullable=False)

    employee = relationship("Employee")
