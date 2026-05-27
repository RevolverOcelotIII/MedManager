import pytest
from datetime import date

def describe_patient_controller():
    def describe_list_patients():
        @pytest.fixture
        def response(client, attendant_user, auth_headers):
            headers = auth_headers(attendant_user.email)
            return client.get("/patients/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

    def describe_create_patient():
        @pytest.fixture
        def response(client, attendant_user, auth_headers):
            headers = auth_headers(attendant_user.email)
            data = {
                "full_name": "New Patient",
                "cpf": "55566677788",
                "birth_date": "1990-01-01",
                "sex": "MALE"
            }
            return client.post("/patients/", json=data, headers=headers)

        def test_should_return_status_201(response):
            assert response.status_code == 201

    def describe_when_not_authorized_to_create():
        @pytest.fixture
        def response(client, pharma_user, auth_headers):
            headers = auth_headers(pharma_user.email)
            data = {"full_name": "Should Fail", "cpf": "0", "birth_date": "1990-01-01", "sex": "OTHER"}
            return client.post("/patients/", json=data, headers=headers)

        def test_should_return_status_403(response):
            assert response.status_code == 403
