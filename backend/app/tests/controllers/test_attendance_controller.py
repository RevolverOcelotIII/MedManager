import pytest

def describe_attendance_controller():
    def describe_list_attendances():
        @pytest.fixture
        def response(client, attendant_user, auth_headers):
            headers = auth_headers(attendant_user.email)
            return client.get("/attendances/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

    def describe_create_attendance():
        @pytest.fixture
        def response(client, attendant_user, auth_headers, patient):
            headers = auth_headers(attendant_user.email)
            data = {"patient_id": patient.id, "gravity": "orange"}
            return client.post("/attendances/", json=data, headers=headers)

        def test_should_return_status_201(response):
            assert response.status_code == 201

    def describe_when_not_authorized_to_create():
        @pytest.fixture
        def response(client, pharma_user, auth_headers, patient):
            headers = auth_headers(pharma_user.email)
            data = {"patient_id": patient.id, "gravity": "blue"}
            return client.post("/attendances/", json=data, headers=headers)

        def test_should_return_status_403(response):
            assert response.status_code == 403
