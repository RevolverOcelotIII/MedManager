from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.catalog import ProcedureCategory

class ProcedureBase(BaseModel):
    name: str
    code: Optional[str] = None
    category: ProcedureCategory = ProcedureCategory.other
    description: Optional[str] = None

class ProcedureCreate(ProcedureBase):
    pass

class ProcedureUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    category: Optional[ProcedureCategory] = None
    description: Optional[str] = None

class ProcedureResponse(ProcedureBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
