import pytest
from app.services.medications import MedicationService
from app.schemas.medications import MedicationCreate, MedicationUpdate
from app.models.catalog import Medication
from fastapi import HTTPException

def describe_medication_service():
    def describe_create():
        @pytest.fixture
        def created_medication(db):
            med_data = MedicationCreate(
                trade_name="Advil",
                active_ingredient="Ibuprofen",
                dosage="200mg",
                unit="Tablet"
            )
            return MedicationService.create(db, med_data)

        def test_should_create_medication_with_correct_trade_name(created_medication):
            assert created_medication.trade_name == "Advil"

        def test_should_persist_in_database(db, created_medication):
            assert db.query(Medication).filter(Medication.id == created_medication.id).first() is not None

    def describe_when_duplicate_exists():
        @pytest.fixture
        def existing_medication(db):
            med_data = MedicationCreate(
                trade_name="Tylenol",
                active_ingredient="Paracetamol",
                dosage="500mg",
                unit="Tablet"
            )
            return MedicationService.create(db, med_data)

        def test_should_raise_http_400_on_duplicate(db, existing_medication):
            with pytest.raises(HTTPException) as exc:
                duplicate_data = MedicationCreate(
                    trade_name="Tylenol",
                    active_ingredient="Paracetamol",
                    dosage="500mg",
                    unit="Tablet"
                )
                MedicationService.create(db, duplicate_data)
            assert exc.value.status_code == 400

    def describe_update():
        @pytest.fixture
        def med_to_update(db):
            med_data = MedicationCreate(
                trade_name="Old Name",
                active_ingredient="Ingredient",
                dosage="10mg",
                unit="Capsule"
            )
            return MedicationService.create(db, med_data)

        @pytest.fixture
        def updated_med(db, med_to_update):
            update_data = MedicationUpdate(trade_name="New Name")
            return MedicationService.update(db, med_to_update.id, update_data)

        def test_should_update_the_trade_name(updated_med):
            assert updated_med.trade_name == "New Name"

    def describe_delete():
        @pytest.fixture
        def med_to_delete(db):
            med_data = MedicationCreate(
                trade_name="Temp",
                active_ingredient="Temp",
                dosage="0",
                unit="N/A"
            )
            med = MedicationService.create(db, med_data)
            MedicationService.delete(db, med.id)
            return med

        def test_should_remove_from_database(db, med_to_delete):
            assert db.query(Medication).filter(Medication.id == med_to_delete.id).first() is None
