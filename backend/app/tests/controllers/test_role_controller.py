import pytest
from app.models.employee import Role, AccessLevel

def describe_roles_controller():
    def describe_list_roles():
        @pytest.fixture
        def response(client, admin_user, auth_headers, db):
            db.add(Role(name="Nurse", access_level=AccessLevel.nurse))
            db.commit()
            headers = auth_headers(admin_user.email)
            return client.get("/roles/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

        def test_should_return_list_of_roles(response):
            assert isinstance(response.json(), list)

    def describe_create_role():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            data = {"name": "Paramedic", "access_level": "nurse"}
            return client.post("/roles/", json=data, headers=headers)

        def test_should_return_status_201(response):
            assert response.status_code == 201

        def test_should_return_created_role_name(response):
            assert response.json()["name"] == "Paramedic"

    def describe_when_not_admin():
        @pytest.fixture
        def response(client, doctor_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            data = {"name": "Should Fail", "access_level": "attendant"}
            return client.post("/roles/", json=data, headers=headers)

        def test_should_return_status_403(response):
            assert response.status_code == 403
