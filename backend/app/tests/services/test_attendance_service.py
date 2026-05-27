import pytest
from app.services.attendances import AttendanceService
from app.schemas.attendances import AttendanceCreate, AttendanceUpdate
from app.models.attendance import Attendance

def describe_attendance_service():
    def describe_create():
        @pytest.fixture
        def created_attendance(db, patient):
            attendance_data = AttendanceCreate(
                patient_id=patient.id,
                gravity="red"
            )
            return AttendanceService.create(db, attendance_data)

        def test_should_create_attendance_with_correct_patient(created_attendance, patient):
            assert created_attendance.patient_id == patient.id

        def test_should_persist_in_database(db, created_attendance):
            assert db.query(Attendance).filter(Attendance.id == created_attendance.id).first() is not None

    def describe_update():
        @pytest.fixture
        def attendance_to_update(db, patient):
            attendance_data = AttendanceCreate(patient_id=patient.id, gravity="green")
            return AttendanceService.create(db, attendance_data)

        @pytest.fixture
        def updated_attendance(db, attendance_to_update):
            update_data = AttendanceUpdate(gravity="yellow")
            return AttendanceService.update(db, attendance_to_update.id, update_data)

        def test_should_update_the_gravity(updated_attendance):
            assert updated_attendance.gravity == "yellow"
