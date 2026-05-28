from pydantic import BaseModel
from datetime import datetime
from app.models.employee import AccessLevel

class RoleBase(BaseModel):
    name: str
    access_level: AccessLevel = AccessLevel.attendant

class RoleCreate(RoleBase):
    pass

class RoleUpdate(RoleBase):
    name: str | None = None
    access_level: AccessLevel | None = None

class RoleResponse(RoleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
