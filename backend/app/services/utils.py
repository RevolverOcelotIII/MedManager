from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Any, Optional, Type

def get_object_or_404(db_session: Session, model: Type[Any], object_id: int, error_message: Optional[str] = None) -> Any:
    obj = db_session.query(model).filter(model.id == object_id).first()
    if not obj:
        if not error_message:
            error_message = f"{model.__name__} not found"
        raise HTTPException(status_code=404, detail=error_message)
    return obj

def validate_unique(
    db_session: Session, 
    model: Type[Any], 
    filter_criteria: dict, 
    exclude_id: Optional[int] = None, 
    error_message: Optional[str] = None
):
    query = db_session.query(model).filter_by(**filter_criteria)
    if exclude_id:
        query = query.filter(model.id != exclude_id)
    
    existing = query.first()
    if existing:
        if not error_message:
            error_message = f"{model.__name__} with these details already registered"
        raise HTTPException(status_code=400, detail=error_message)
