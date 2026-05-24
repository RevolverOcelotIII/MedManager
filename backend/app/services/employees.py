from sqlalchemy.orm import Session
from app.models.employee import Employee, Role
from app.schemas.employees import EmployeeCreate, EmployeeUpdate
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional

class EmployeeService:
    @staticmethod
    def validate_cpf_unique(db_session: Session, cpf: str, exclude_employee_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Employee, 
            {"cpf": cpf}, 
            exclude_id=exclude_employee_id, 
            error_message="CPF already registered for an employee"
        )

    @staticmethod
    def validate_role_exists(db_session: Session, role_id: int):
        get_object_or_404(db_session, Role, role_id, error_message="Role not found")

    @staticmethod
    def get_all(db_session: Session):
        return db_session.query(Employee).all()

    @staticmethod
    def get_by_id(db_session: Session, employee_id: int):
        return get_object_or_404(db_session, Employee, employee_id)

    @staticmethod
    def create(db_session: Session, employee_data: EmployeeCreate):
        EmployeeService.validate_cpf_unique(db_session, employee_data.cpf)
        EmployeeService.validate_role_exists(db_session, employee_data.role_id)
        
        new_employee = Employee(**employee_data.model_dump())
        db_session.add(new_employee)
        db_session.commit()
        db_session.refresh(new_employee)
        return new_employee

    @staticmethod
    def update(db_session: Session, employee_id: int, employee_data: EmployeeUpdate):
        employee = EmployeeService.get_by_id(db_session, employee_id)
        
        update_data = employee_data.model_dump(exclude_unset=True)
        
        if "cpf" in update_data:
            EmployeeService.validate_cpf_unique(db_session, update_data["cpf"], exclude_employee_id=employee_id)
        
        if "role_id" in update_data:
            EmployeeService.validate_role_exists(db_session, update_data["role_id"])
            
        for field_name, field_value in update_data.items():
            setattr(employee, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(employee)
        return employee

    @staticmethod
    def delete(db_session: Session, employee_id: int):
        employee = EmployeeService.get_by_id(db_session, employee_id)
        db_session.delete(employee)
        db_session.commit()
