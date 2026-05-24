from pydantic import BaseModel
from typing import Optional

class MedicationBase(BaseModel):
    trade_name: str
    active_ingredient: str
    dosage: str
    current_stock: int = 0
    unit: str

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    trade_name: Optional[str] = None
    active_ingredient: Optional[str] = None
    dosage: Optional[str] = None
    current_stock: Optional[int] = None
    unit: Optional[str] = None

class MedicationResponse(MedicationBase):
    id: int
    class Config:
        from_attributes = True
