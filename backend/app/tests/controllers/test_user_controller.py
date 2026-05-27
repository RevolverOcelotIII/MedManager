import pytest

def describe_user_controller():
    def describe_list_users():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            return client.get("/users/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

        def test_should_return_list(response):
            assert isinstance(response.json(), list)

    def describe_get_user():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            return client.get(f"/users/{admin_user.id}", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

        def test_should_return_correct_email(response, admin_user):
            assert response.json()["email"] == admin_user.email

    def describe_when_accessing_other_user_as_non_admin():
        @pytest.fixture
        def response(client, doctor_user, admin_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            return client.get(f"/users/{admin_user.id}", headers=headers)

        def test_should_return_status_403(response):
            assert response.status_code == 403

    def describe_when_accessing_own_profile():
        @pytest.fixture
        def response(client, doctor_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            return client.get(f"/users/{doctor_user.id}", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200
