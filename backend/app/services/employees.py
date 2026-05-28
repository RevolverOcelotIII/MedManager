from sqlalchemy.orm import Session
from app.models.employee import Employee, Role, AccessLevel
from app.models.user import User
from app.models.catalog import procedure_execute_roles, procedure_dispatch_roles
from app.schemas.employees import EmployeeCreate, EmployeeUpdate, EmployeeResponse, RestrictedEmployeeResponse
from app.services.utils import get_object_or_404, validate_unique
from app.core.redis import get_cache, set_cache, invalidate_cache
from fastapi import HTTPException
from typing import Optional, List, Any
from datetime import datetime

CACHE_PREFIX = "cache:employees"

class EmployeeService:
    # --- Controller Entry Points ---

    @staticmethod
    def get_all(
        db_session: Session, 
        current_user: User, 
        can_execute_procedure_id: Optional[int] = None,
        can_dispatch_procedure_id: Optional[int] = None
    ) -> List[Any]:
        # Caching only base list for grids (no procedure filters)
        is_base_list = (can_execute_procedure_id is None) and (can_dispatch_procedure_id is None)
        access_level = current_user.employee.role.access_level
        cache_key = f"{CACHE_PREFIX}:access:{access_level.value}"
        
        if is_base_list:
            cached = get_cache(cache_key)
            if cached:
                return cached

        is_admin = access_level == AccessLevel.admin
        query = db_session.query(Employee).join(Role)
        
        if can_execute_procedure_id:
            query = EmployeeService.filter_by_professional_execution_qualifications(query, can_execute_procedure_id)
        
        if can_dispatch_procedure_id:
            query = EmployeeService.filter_by_professional_dispatch_qualifications(query, can_dispatch_procedure_id)
        
        # Apply visibility rules with context awareness
        is_clinical_context = (can_execute_procedure_id is not None) or (can_dispatch_procedure_id is not None)
        query = EmployeeService.apply_role_based_visibility_restrictions(query, current_user, is_clinical_context)

        results = query.all()
        serialized_results = [EmployeeService.apply_production_grade_serialization(e, is_admin) for e in results]
        
        # Convert Pydantic models to dicts for caching
        if is_base_list:
            # Note: apply_production_grade_serialization returns EmployeeResponse or RestrictedEmployeeResponse
            # We convert to dict mode="json"
            results_to_cache = [r.model_dump(mode="json") for r in serialized_results]
            set_cache(cache_key, results_to_cache)
            
        return serialized_results

    @staticmethod
    def get_by_id(db_session: Session, employee_id: int, current_user: User) -> Any:
        is_admin = current_user.employee.role.access_level == AccessLevel.admin
        
        query = db_session.query(Employee).filter(Employee.id == employee_id).join(Role)
        query = EmployeeService.apply_role_based_visibility_restrictions(query, current_user)
        
        employee = query.first()
        if not employee:
             raise HTTPException(status_code=403, detail="Employee not found or access denied.")

        return EmployeeService.apply_production_grade_serialization(employee, is_admin)

    @staticmethod
    def create(db_session: Session, employee_data: EmployeeCreate):
        EmployeeService.validate_cpf_is_unique(db_session, employee_data.cpf)
        EmployeeService.validate_role_is_registered(db_session, employee_data.role_id)
        
        new_employee = Employee(**employee_data.model_dump())
        db_session.add(new_employee)
        db_session.commit()
        db_session.refresh(new_employee)
        
        invalidate_cache(f"{CACHE_PREFIX}:*")
        return new_employee

    @staticmethod
    def update(db_session: Session, employee_id: int, employee_data: EmployeeUpdate):
        employee = get_object_or_404(db_session, Employee, employee_id)
        
        update_data = employee_data.model_dump(exclude_unset=True)
        
        if "cpf" in update_data:
            EmployeeService.validate_cpf_is_unique(db_session, update_data["cpf"], exclude_employee_id=employee_id)
        
        if "role_id" in update_data:
            EmployeeService.validate_role_is_registered(db_session, update_data["role_id"])
            
        for field_name, field_value in update_data.items():
            setattr(employee, field_name, field_value)
            
        db_session.commit()
        db_session.refresh(employee)
        
        invalidate_cache(f"{CACHE_PREFIX}:*")
        return employee

    @staticmethod
    def delete(db_session: Session, employee_id: int):
        employee = get_object_or_404(db_session, Employee, employee_id)
        db_session.delete(employee)
        db_session.commit()
        
        invalidate_cache(f"{CACHE_PREFIX}:*")

    # --- Business Logic & Query Filters ---

    @staticmethod
    def filter_by_professional_execution_qualifications(query, procedure_id: int):
        return query.join(procedure_execute_roles, Role.id == procedure_execute_roles.c.role_id)\
                    .filter(procedure_execute_roles.c.procedure_id == procedure_id)

    @staticmethod
    def filter_by_professional_dispatch_qualifications(query, procedure_id: int):
        return query.join(procedure_dispatch_roles, Role.id == procedure_dispatch_roles.c.role_id)\
                    .filter(procedure_dispatch_roles.c.procedure_id == procedure_id)

    @staticmethod
    def apply_role_based_visibility_restrictions(query, current_user: User, is_clinical_context: bool = False):
        user_access = current_user.employee.role.access_level
        
        if user_access == AccessLevel.admin:
            return query
        
        if user_access == AccessLevel.attendant:
            return query
            
        if user_access in [AccessLevel.doctor, AccessLevel.nurse]:
            return query.filter(Role.access_level.in_([AccessLevel.doctor, AccessLevel.nurse]))

        if user_access == AccessLevel.pharmaceutical:
             return query.filter(Role.access_level.in_([AccessLevel.doctor, AccessLevel.nurse, AccessLevel.pharmaceutical]))
            
        return query.filter(Employee.id == current_user.employee_id)

    # --- Validations ---

    @staticmethod
    def validate_cpf_is_unique(db_session: Session, cpf: str, exclude_employee_id: Optional[int] = None):
        validate_unique(
            db_session, 
            Employee, 
            {"cpf": cpf}, 
            exclude_id=exclude_employee_id, 
            error_message="CPF already registered for an employee"
        )

    @staticmethod
    def validate_role_is_registered(db_session: Session, role_id: int):
        get_object_or_404(db_session, Role, role_id, error_message="Role not found")

    # --- Data Transformation & Utility ---

    @staticmethod
    def apply_production_grade_serialization(employee: Employee, is_admin: bool):
        if is_admin:
            return EmployeeResponse.model_validate(employee)
        return RestrictedEmployeeResponse.model_validate(employee)
