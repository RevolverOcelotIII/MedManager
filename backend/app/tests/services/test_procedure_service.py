import pytest
from app.services.procedures import ProcedureService
from app.schemas.procedures import ProcedureCreate, ProcedureUpdate
from app.models.catalog import Procedure
from fastapi import HTTPException

def describe_procedure_service():
    def describe_create():
        @pytest.fixture
        def created_procedure(db, admin_user):
            procedure_data = ProcedureCreate(
                name="Clinical Exam",
                code="CL-01",
                category="exam",
                dispatch_role_ids=[admin_user.employee.role_id],
                execute_role_ids=[admin_user.employee.role_id]
            )
            return ProcedureService.create(db, procedure_data)

        def test_should_create_procedure_with_correct_name(created_procedure):
            assert created_procedure.name == "Clinical Exam"

        def test_should_have_correct_dispatch_roles(created_procedure):
            assert len(created_procedure.dispatch_roles) == 1

        def test_should_persist_in_database(db, created_procedure):
            assert db.query(Procedure).filter(Procedure.id == created_procedure.id).first() is not None

    def describe_when_code_already_exists():
        @pytest.fixture
        def existing_procedure(db):
            procedure_data = ProcedureCreate(name="Original", code="DUP-01", category="other")
            return ProcedureService.create(db, procedure_data)

        def test_should_raise_http_400_on_duplicate_code(db, existing_procedure):
            with pytest.raises(HTTPException) as exc:
                duplicate_data = ProcedureCreate(name="Duplicate", code="DUP-01", category="other")
                ProcedureService.create(db, duplicate_data)
            assert exc.value.status_code == 400

    def describe_role_based_visibility():
        @pytest.fixture
        def procedures_setup(db, admin_user, doctor_user):
            # Procedure dispatchable by Admin
            p1 = Procedure(name="Admin Only", code="A01", category="other")
            p1.dispatch_roles = [admin_user.employee.role]
            
            # Procedure dispatchable by Doctor
            p2 = Procedure(name="Doctor Tool", code="D01", category="other")
            p2.dispatch_roles = [doctor_user.employee.role]
            
            db.add_all([p1, p2])
            db.commit()
            return [p1, p2]

        def test_should_return_all_for_admin(db, admin_user, procedures_setup):
            results = ProcedureService.get_all(db, admin_user)
            assert len(results) >= 2

        def test_should_only_return_allowed_for_doctor(db, doctor_user, procedures_setup):
            results = ProcedureService.get_all(db, doctor_user)
            assert all(doctor_user.employee.role in p.dispatch_roles for p in results)
