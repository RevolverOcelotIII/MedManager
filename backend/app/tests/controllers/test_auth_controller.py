import pytest

def describe_auth_controller():
    def describe_login():
        @pytest.fixture
        def response(client, admin_user):
            data = {"username": admin_user.email, "password": "password123"}
            return client.post("/auth/login", data=data)

        def test_should_return_status_200(response):
            assert response.status_code == 200

        def test_should_return_access_token(response):
            assert "access_token" in response.json()

    def describe_when_password_incorrect():
        @pytest.fixture
        def response(client, admin_user):
            data = {"username": admin_user.email, "password": "wrongpassword"}
            return client.post("/auth/login", data=data)

        def test_should_return_status_401(response):
            assert response.status_code == 401

    def describe_get_me():
        @pytest.fixture
        def response(client, doctor_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            return client.get("/auth/me", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

        def test_should_return_correct_user(response, doctor_user):
            assert response.json()["email"] == doctor_user.email
