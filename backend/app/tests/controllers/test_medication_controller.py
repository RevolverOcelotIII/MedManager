import pytest

def describe_medications_controller():
    def describe_list_medications():
        @pytest.fixture
        def response(client, admin_user, auth_headers):
            headers = auth_headers(admin_user.email)
            return client.get("/medications/", headers=headers)

        def test_should_return_status_200(response):
            assert response.status_code == 200

    def describe_create_medication():
        @pytest.fixture
        def response(client, pharma_user, auth_headers):
            headers = auth_headers(pharma_user.email)
            data = {
                "trade_name": "Prozac",
                "active_ingredient": "Fluoxetine",
                "dosage": "20mg",
                "unit": "Capsule"
            }
            return client.post("/medications/", json=data, headers=headers)

        def test_should_return_status_201(response):
            assert response.status_code == 201

    def describe_when_not_pharma():
        @pytest.fixture
        def response(client, doctor_user, auth_headers):
            headers = auth_headers(doctor_user.email)
            data = {"trade_name": "Should Fail", "active_ingredient": "X", "dosage": "0", "unit": "Y"}
            return client.post("/medications/", json=data, headers=headers)

        def test_should_return_status_403(response):
            assert response.status_code == 403
