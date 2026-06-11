import os

import pytest
import requests


@pytest.mark.skip(reason="Example test only. Replace with real API tests.")
def test_api_health_endpoint():
    response = requests.get(f"{os.environ['API_BASE_URL']}/health", timeout=10)

    assert response.status_code == 200
