import pytest

def describe_employee_controller():
    def describe_list_employees():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            return client.get("/employees/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

        def test_should_return_list(response):
            assert isinstance(response.json(), list)

    def describe_get_employee():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            return client.get(f"/employees/{admin_user.employee_id}", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

    def describe_when_accessing_sensitive_fields_as_doctor():
        @pytest.fixture
        def response(client, doctor_user, admin_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            return client.get(f"/employees/{admin_user.employee_id}", headers=headers)

        def test_should_not_return_salary(response):
            assert "salary" not in response.json()

        def test_should_not_return_hire_date(response):
            assert "hire_date" not in response.json()
