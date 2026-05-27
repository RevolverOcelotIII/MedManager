import pytest
from app.services.attendance_procedures import AttendanceProcedureService
from app.schemas.attendance_procedures import AttendanceProcedureCreate, AttendanceProcedureUpdate
from app.models.attendance_procedure import AttendanceProcedure, AttendanceProcedureStatus

def describe_attendance_procedure_service():
    def describe_create():
        @pytest.fixture
        def created_ap(db, admin_user, attendance, procedure):
            ap_data = AttendanceProcedureCreate(
                attendance_id=attendance.id,
                procedure_id=procedure.id,
                status=AttendanceProcedureStatus.pending
            )
            return AttendanceProcedureService.create(db, ap_data, admin_user)

        def test_should_set_the_ordered_by_id(created_ap, admin_user):
            assert created_ap.ordered_by_id == admin_user.employee_id

        def test_should_persist_in_database(db, created_ap):
            assert db.query(AttendanceProcedure).filter(AttendanceProcedure.id == created_ap.id).first() is not None

    def describe_update_authorization():
        @pytest.fixture
        def ap_setup(db, admin_user, attendance, procedure):
            ap_data = AttendanceProcedureCreate(
                attendance_id=attendance.id,
                procedure_id=procedure.id,
                status=AttendanceProcedureStatus.pending
            )
            return AttendanceProcedureService.create(db, ap_data, admin_user)

        def test_should_allow_admin_to_update_everything(db, admin_user, ap_setup):
            update_data = AttendanceProcedureUpdate(description="New Clinical Notes", status=AttendanceProcedureStatus.done)
            updated = AttendanceProcedureService.update(db, ap_setup.id, update_data, admin_user)
            assert updated.description == "New Clinical Notes"

        def test_should_restrict_other_attendants_to_status_only(db, attendant_user, ap_setup):
            update_data = AttendanceProcedureUpdate(description="Hack", status=AttendanceProcedureStatus.in_progress)
            updated = AttendanceProcedureService.update(db, ap_setup.id, update_data, attendant_user)
            assert updated.description is None
            assert updated.status == AttendanceProcedureStatus.in_progress
