import pytest

def describe_procedures_controller():
    def describe_list_procedures():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            return client.get("/procedures/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

    def describe_create_procedure():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            data = {"name": "Lab Test", "code": "LAB-01", "category": "exam"}
            return client.post("/procedures/", json=data, headers=headers)

        def test_should_return_status_201(response):
            assert response.status_code == 201

    def describe_when_not_admin():
        @pytest.fixture
        def response(client, doctor_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            data = {"name": "Should Fail", "code": "FAIL-01", "category": "other"}
            return client.post("/procedures/", json=data, headers=headers)

        def test_should_return_status_403(response):
            assert response.status_code == 403
