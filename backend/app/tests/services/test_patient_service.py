import pytest
from app.services.patients import PatientService
from app.schemas.patients import PatientCreate, PatientUpdate
from app.models.patient import Patient
from fastapi import HTTPException
from datetime import date

def describe_patient_service():
    def describe_create():
        @pytest.fixture
        def created_patient(db):
            patient_data = PatientCreate(
                full_name="John Doe",
                cpf="12345678901",
                birth_date=date(1980, 1, 1),
                sex="MALE"
            )
            return PatientService.create(db, patient_data)

        def test_should_create_patient_with_correct_name(created_patient):
            assert created_patient.full_name == "John Doe"

        def test_should_persist_in_database(db, created_patient):
            assert db.query(Patient).filter(Patient.id == created_patient.id).first() is not None

    def describe_when_cpf_already_exists():
        @pytest.fixture
        def existing_patient(db):
            patient_data = PatientCreate(
                full_name="Existing Patient",
                cpf="98765432100",
                birth_date=date(1990, 1, 1),
                sex="FEMALE"
            )
            return PatientService.create(db, patient_data)

        def test_should_raise_http_400_on_duplicate_cpf(db, existing_patient):
            with pytest.raises(HTTPException) as exc:
                duplicate_data = PatientCreate(
                    full_name="Duplicate CPF",
                    cpf=existing_patient.cpf,
                    birth_date=date(1990, 1, 1),
                    sex="FEMALE"
                )
                PatientService.create(db, duplicate_data)
            assert exc.value.status_code == 400

    def describe_delete():
        @pytest.fixture
        def patient_to_delete(db):
            patient_data = PatientCreate(
                full_name="Delete Me",
                cpf="00000000001",
                birth_date=date(2000, 1, 1),
                sex="OTHER"
            )
            patient = PatientService.create(db, patient_data)
            PatientService.delete(db, patient.id)
            return patient

        def test_should_remove_from_database(db, patient_to_delete):
            assert db.query(Patient).filter(Patient.id == patient_to_delete.id).first() is None
