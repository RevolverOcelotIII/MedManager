from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProcedureBase(BaseModel):
    name: str
    tuss_code: Optional[str] = None
    description: Optional[str] = None
    sector: str
    cid: str

class ProcedureCreate(ProcedureBase):
    pass

class ProcedureUpdate(BaseModel):
    name: Optional[str] = None
    tuss_code: Optional[str] = None
    description: Optional[str] = None
    sector: Optional[str] = None
    cid: Optional[str] = None

class ProcedureResponse(ProcedureBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
