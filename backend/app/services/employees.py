from sqlalchemy.orm import Session
from app.models.employee import Employee, Role, AccessLevel
from app.models.user import User
from app.schemas.employees import EmployeeCreate, EmployeeUpdate, EmployeeResponse, RestrictedEmployeeResponse
from app.services.utils import get_object_or_404, validate_unique
from typing import Optional, List, Any

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
    def get_serialized_employee(employee: Employee, is_admin: bool):
        if is_admin:
            return EmployeeResponse.model_validate(employee)
        return RestrictedEmployeeResponse.model_validate(employee)

    @staticmethod
    def get_all(db_session: Session, current_user: User) -> List[Any]:
        user_access = current_user.employee.role.access_level
        is_admin = user_access == AccessLevel.admin

        query = db_session.query(Employee).join(Role)
        
        results = []
        if is_admin:
            results = query.all()
        elif user_access == AccessLevel.attendant:
            results = query.filter(Role.access_level.in_([AccessLevel.doctor, AccessLevel.nurse])).all()
        elif user_access in [AccessLevel.doctor, AccessLevel.nurse, AccessLevel.pharmaceutical]:
            results = query.filter(Employee.id == current_user.employee_id).all()

        return [EmployeeService.get_serialized_employee(e, is_admin) for e in results]

    @staticmethod
    def get_by_id(db_session: Session, employee_id: int, current_user: User) -> Any:
        user_access = current_user.employee.role.access_level
        is_admin = user_access == AccessLevel.admin
        
        employee = get_object_or_404(db_session, Employee, employee_id)

        if not is_admin:
            if user_access == AccessLevel.attendant:
                if employee.role.access_level not in [AccessLevel.doctor, AccessLevel.nurse]:
                    from fastapi import HTTPException
                    raise HTTPException(status_code=403, detail="Attendants can only view medical staff details.")
            elif employee_id != current_user.employee_id:
                from fastapi import HTTPException
                raise HTTPException(status_code=403, detail="You can only view your own employee data.")

        return EmployeeService.get_serialized_employee(employee, is_admin)

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
        employee = get_object_or_404(db_session, Employee, employee_id)
        
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
        employee = get_object_or_404(db_session, Employee, employee_id)
        db_session.delete(employee)
        db_session.commit()
