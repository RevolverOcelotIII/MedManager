import pytest
from app.services.roles import RoleService
from app.schemas.roles import RoleCreate, RoleUpdate
from app.models.employee import Role
from fastapi import HTTPException

def describe_role_service():
    def describe_create():
        @pytest.fixture
        def created_role(db):
            role_data = RoleCreate(name="Surgeon", access_level="doctor")
            return RoleService.create(db, role_data)

        def test_should_create_role_with_correct_name(created_role):
            assert created_role.name == "Surgeon"

        def test_should_create_role_with_correct_access_level(created_role):
            assert created_role.access_level == "doctor"

        def test_should_persist_in_database(db, created_role):
            assert db.query(Role).filter(Role.id == created_role.id).first() is not None

    def describe_when_name_already_exists():
        @pytest.fixture
        def existing_role(db):
            role_data = RoleCreate(name="Nurse", access_level="nurse")
            return RoleService.create(db, role_data)

        def test_should_raise_http_400_on_duplicate_name(db, existing_role):
            with pytest.raises(HTTPException) as exc:
                duplicate_data = RoleCreate(name="Nurse", access_level="nurse")
                RoleService.create(db, duplicate_data)
            assert exc.value.status_code == 400

    def describe_update():
        @pytest.fixture
        def role_to_update(db):
            role_data = RoleCreate(name="Admin Staff", access_level="admin")
            return RoleService.create(db, role_data)

        @pytest.fixture
        def updated_role(db, role_to_update):
            update_data = RoleUpdate(name="System Administrator")
            return RoleService.update(db, role_to_update.id, update_data)

        def test_should_update_the_name(updated_role):
            assert updated_role.name == "System Administrator"

        def test_should_keep_the_access_level(updated_role):
            assert updated_role.access_level == "admin"

    def describe_delete():
        @pytest.fixture
        def role_to_delete(db):
            role_data = RoleCreate(name="Temp Role", access_level="attendant")
            role = RoleService.create(db, role_data)
            RoleService.delete(db, role.id)
            return role

        def test_should_remove_from_database(db, role_to_delete):
            assert db.query(Role).filter(Role.id == role_to_delete.id).first() is None
