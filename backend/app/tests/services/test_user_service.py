import pytest
from app.services.users import UserService
from app.schemas.users import UserCreate, UserUpdate
from app.models.user import User
from app.models.employee import Employee, Role, AccessLevel, EmploymentType
from fastapi import HTTPException
from datetime import date

@pytest.fixture
def unlinked_employee(db):
    role = Role(name="Nurse Role", access_level=AccessLevel.nurse)
    db.add(role)
    db.flush()
    employee = Employee(
        full_name="Nurse Joy",
        cpf="33333333333",
        birth_date=date(1995, 1, 1),
        hire_date=date(2021, 1, 1),
        employment_type=EmploymentType.FULL_TIME,
        role_id=role.id
    )
    db.add(employee)
    db.commit()
    return employee

def describe_user_service():
    def describe_create():
        @pytest.fixture
        def created_user(db, unlinked_employee):
            user_data = UserCreate(
                email="joy@test.com",
                password="password123",
                employee_id=unlinked_employee.id
            )
            return UserService.create(db, user_data)

        def test_should_create_user_with_correct_email(created_user):
            assert created_user.email == "joy@test.com"

        def test_should_hash_the_password(created_user):
            assert created_user.hashed_password != "password123"

        def test_should_persist_in_database(db, created_user):
            assert db.query(User).filter(User.id == created_user.id).first() is not None

    def describe_when_email_already_exists():
        @pytest.fixture
        def existing_user(db, admin_user):
            return admin_user

        def test_should_raise_http_400_on_duplicate_email(db, existing_user, unlinked_employee):
            with pytest.raises(HTTPException) as exc:
                duplicate_data = UserCreate(
                    email=existing_user.email,
                    password="pass",
                    employee_id=unlinked_employee.id
                )
                UserService.create(db, duplicate_data)
            assert exc.value.status_code == 400

    def describe_when_employee_already_linked():
        @pytest.fixture
        def linked_employee(db, admin_user):
            return admin_user.employee

        def test_should_raise_http_400_on_linked_employee(db, linked_employee):
            with pytest.raises(HTTPException) as exc:
                data = UserCreate(
                    email="new@test.com",
                    password="pass",
                    employee_id=linked_employee.id
                )
                UserService.create(db, data)
            assert exc.value.status_code == 400
