# [DRAFT] Needs QA + Engineer review before use in CI.
# Feature: 資料驗證
# Test cases: TC-DATAVAL-001 ~ TC-DATAVAL-003 (API validation for ID number)

# [ENG TASK] Confirm API endpoint for ID number validation (e.g. POST /api/validate/id-number)
# [ENG TASK] Confirm request/response schema
# Do NOT use real personal ID numbers in production

import pytest
import requests

BASE_URL = "http://localhost:3000"  # [ENG TASK] Replace with actual test env URL
VALIDATE_ENDPOINT = f"{BASE_URL}/api/validate/id-number"


@pytest.fixture
def valid_headers():
    return {"Content-Type": "application/json"}


class TestIdNumberValidation:
    """TC-DATAVAL-001 ~ TC-DATAVAL-003: 身分證字號第二碼驗證"""

    def test_TC_DATAVAL_001_second_digit_1_male_passes(self, valid_headers):
        """TC-DATAVAL-001 第二碼為 1（男性）時驗證通過"""
        # [ENG TASK] Confirm request body key name (id_number? id? national_id?)
        response = requests.post(
            VALIDATE_ENDPOINT,
            json={"id_number": "A123456789"},
            headers=valid_headers,
        )
        assert response.status_code == 200
        data = response.json()
        # [ENG TASK] Confirm response key for validation result (valid? success? result?)
        assert data.get("valid") is True

    def test_TC_DATAVAL_002_second_digit_2_female_passes(self, valid_headers):
        """TC-DATAVAL-002 第二碼為 2（女性）時驗證通過"""
        response = requests.post(
            VALIDATE_ENDPOINT,
            json={"id_number": "A223456789"},
            headers=valid_headers,
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("valid") is True

    @pytest.mark.parametrize("id_number", [
        "A323456789",  # second digit = 3
        "A023456789",  # second digit = 0
        "A923456789",  # second digit = 9
    ])
    def test_TC_DATAVAL_003_invalid_second_digit_fails(self, id_number, valid_headers):
        """TC-DATAVAL-003 第二碼非 1 或 2 時驗證失敗"""
        response = requests.post(
            VALIDATE_ENDPOINT,
            json={"id_number": id_number},
            headers=valid_headers,
        )
        # Accept 400 (validation error) or 200 with valid=False
        if response.status_code == 200:
            data = response.json()
            assert data.get("valid") is False
        else:
            assert response.status_code == 400
