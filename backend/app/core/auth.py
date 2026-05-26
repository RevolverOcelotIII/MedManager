from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.security import SECRET_KEY, ALGORITHM
from app.models.user import User
from app.models.employee import Employee, AccessLevel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db_session: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db_session.query(User).options(
        joinedload(User.employee).joinedload(Employee.role)
    ).filter(User.email == email).first()
    
    if user is None:
        raise credentials_exception
    return user

def require_access_level(allowed_levels: list[AccessLevel]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.employee.role.access_level not in allowed_levels:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You do not have permission to perform this action."
            )
        return current_user
    return role_checker

# Common Scope Dependencies
require_admin = require_access_level([AccessLevel.admin])
require_med_scope = require_access_level([AccessLevel.admin, AccessLevel.doctor, AccessLevel.nurse])
require_log_scope = require_access_level([AccessLevel.admin, AccessLevel.attendant])
require_pharma_scope = require_access_level([AccessLevel.admin, AccessLevel.pharmaceutical])
