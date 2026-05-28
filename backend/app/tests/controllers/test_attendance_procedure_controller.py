import pytest

def describe_attendance_procedure_controller():
    def describe_list_by_attendance():
        @pytest.fixture
        def response(client, admin_user, auth_headers, attendance):
            headers = auth_headers(admin_user.email)
            return client.get(f"/attendance-procedures/attendance/{attendance.id}", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

    def describe_create():
        @pytest.fixture
        def response(client, admin_user, auth_headers, attendance, procedure):
            headers = auth_headers(admin_user.email)
            data = {
                "attendance_id": attendance.id,
                "procedure_id": procedure.id,
                "status": "pending"
            }
            return client.post("/attendance-procedures/", json=data, headers=headers)

        def test_should_return_status_201(response):
            assert response.status_code == 201
