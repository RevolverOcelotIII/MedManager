from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.catalog import ProcedureCategory
from app.schemas.employees import RoleResponse

class ProcedureBase(BaseModel):
    name: str
    code: Optional[str] = None
    category: ProcedureCategory = ProcedureCategory.other
    description: Optional[str] = None

class ProcedureCreate(ProcedureBase):
    responsible_role_ids: Optional[List[int]] = []

class ProcedureUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    category: Optional[ProcedureCategory] = None
    description: Optional[str] = None
    responsible_role_ids: Optional[List[int]] = None

class ProcedureResponse(ProcedureBase):
    id: int
    responsible_roles: List[RoleResponse] = []
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
