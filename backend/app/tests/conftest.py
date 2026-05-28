import pytest
import os
from datetime import date
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.core.security import create_access_token, hash_password
from app.models.user import User
from app.models.employee import Employee, Role, AccessLevel, EmploymentType
from app.models.patient import Patient, Sex
from app.models.attendance import Attendance
from app.models.catalog import Procedure, Medication

@pytest.fixture(autouse=True)
def mock_redis(monkeypatch):
    """Mock redis methods to prevent external calls during tests."""
    monkeypatch.setattr("app.core.redis.get_cache", lambda k: None)
    monkeypatch.setattr("app.core.redis.set_cache", lambda k, v, t=3600: None)
    monkeypatch.setattr("app.core.redis.invalidate_cache", lambda p: None)

# Use Postgres test_db for tests
DEFAULT_TEST_DB_URL = "postgresql://admin:password_cool@db:5432/test_db"
SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL", DEFAULT_TEST_DB_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

@pytest.fixture
def db():
    session = TestingSessionLocal()
    yield session
    session.rollback()
    for table in reversed(Base.metadata.sorted_tables):
        session.execute(table.delete())
    session.commit()
    session.close()

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

@pytest.fixture
def admin_user(db):
    role = Role(name="Admin Role", access_level=AccessLevel.admin)
    db.add(role)
    db.flush()
    employee = Employee(
        full_name="Admin User", cpf="00000000000", birth_date=date(1990, 1, 1),
        hire_date=date(2020, 1, 1), employment_type=EmploymentType.FULL_TIME, role_id=role.id
    )
    db.add(employee)
    db.flush()
    user = User(email="admin@test.com", hashed_password=hash_password("password123"), employee_id=employee.id)
    db.add(user)
    db.commit()
    return user

@pytest.fixture
def doctor_user(db):
    role = Role(name="Doctor Role", access_level=AccessLevel.doctor)
    db.add(role)
    db.flush()
    employee = Employee(
        full_name="Doctor User", cpf="11111111111", birth_date=date(1985, 1, 1),
        hire_date=date(2020, 1, 1), employment_type=EmploymentType.FULL_TIME, role_id=role.id
    )
    db.add(employee)
    db.flush()
    user = User(email="doctor@test.com", hashed_password=hash_password("password123"), employee_id=employee.id)
    db.add(user)
    db.commit()
    return user

@pytest.fixture
def attendant_user(db):
    role = Role(name="Attendant Role", access_level=AccessLevel.attendant)
    db.add(role)
    db.flush()
    employee = Employee(
        full_name="Attendant User", cpf="44444444444", birth_date=date(1990, 1, 1),
        hire_date=date(2020, 1, 1), employment_type=EmploymentType.FULL_TIME, role_id=role.id
    )
    db.add(employee)
    db.flush()
    user = User(email="attendant@test.com", hashed_password=hash_password("password123"), employee_id=employee.id)
    db.add(user)
    db.commit()
    return user

@pytest.fixture
def pharma_user(db):
    role = Role(name="Pharmacist Role", access_level=AccessLevel.pharmaceutical)
    db.add(role)
    db.flush()
    employee = Employee(
        full_name="Pharma User", cpf="22222222222", birth_date=date(1980, 1, 1),
        hire_date=date(2020, 1, 1), employment_type=EmploymentType.FULL_TIME, role_id=role.id
    )
    db.add(employee)
    db.flush()
    user = User(email="pharma@test.com", hashed_password=hash_password("password123"), employee_id=employee.id)
    db.add(user)
    db.commit()
    return user

@pytest.fixture
def patient(db):
    patient = Patient(
        full_name="Test Patient", cpf="00011122233", birth_date=date(1990, 1, 1), sex=Sex.MALE
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

@pytest.fixture
def attendance(db, patient):
    attendance = Attendance(patient_id=patient.id, gravity="green")
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance

@pytest.fixture
def procedure(db, admin_user):
    procedure = Procedure(name="Blood Test", code="BT-01", category="exam")
    procedure.dispatch_roles = [admin_user.employee.role]
    procedure.execute_roles = [admin_user.employee.role]
    db.add(procedure)
    db.commit()
    db.refresh(procedure)
    return procedure

@pytest.fixture
def medication(db):
    med = Medication(
        trade_name="Paracetamol",
        active_ingredient="Paracetamol",
        dosage="500mg",
        unit="Tablet"
    )
    db.add(med)
    db.commit()
    db.refresh(med)
    return med

@pytest.fixture
def auth_headers():
    def _get_headers(user_email: str):
        access_token = create_access_token(data={"sub": user_email})
        return {"Authorization": f"Bearer {access_token}"}
    return _get_headers
