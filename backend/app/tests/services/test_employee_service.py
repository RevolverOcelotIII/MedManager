import pytest
from app.services.employees import EmployeeService
from app.schemas.employees import EmployeeCreate, EmployeeUpdate
from app.models.employee import Employee, AccessLevel
from fastapi import HTTPException
from datetime import date

def describe_employee_service():
    def describe_create():
        @pytest.fixture
        def created_employee(db, admin_user):
            emp_data = EmployeeCreate(
                full_name="New Employee",
                cpf="55555555555",
                birth_date=date(1990, 1, 1),
                hire_date=date(2020, 1, 1),
                employment_type="Full-time",
                role_id=admin_user.employee.role_id
            )
            return EmployeeService.create(db, emp_data)

        def test_should_create_employee_with_correct_name(created_employee):
            assert created_employee.full_name == "New Employee"

        def test_should_persist_in_database(db, created_employee):
            assert db.query(Employee).filter(Employee.id == created_employee.id).first() is not None

    def describe_when_cpf_already_exists():
        @pytest.fixture
        def existing_employee(db, admin_user):
            return admin_user.employee

        def test_should_raise_http_400_on_duplicate_cpf(db, existing_employee):
            with pytest.raises(HTTPException) as exc:
                duplicate_data = EmployeeCreate(
                    full_name="Duplicate CPF",
                    cpf=existing_employee.cpf,
                    birth_date=date(1990, 1, 1),
                    hire_date=date(2020, 1, 1),
                    employment_type="Full-time",
                    role_id=existing_employee.role_id
                )
                EmployeeService.create(db, duplicate_data)
            assert exc.value.status_code == 400

    def describe_serialization():
        def test_should_return_full_response_for_admin(db, admin_user):
            result = EmployeeService.apply_production_grade_serialization(admin_user.employee, is_admin=True)
            assert hasattr(result, "salary")

        def test_should_return_restricted_response_for_non_admin(db, doctor_user):
            result = EmployeeService.apply_production_grade_serialization(doctor_user.employee, is_admin=False)
            assert not hasattr(result, "salary")
