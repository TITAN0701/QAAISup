import os

import pytest
import requests


@pytest.mark.skipif(
    not os.getenv("API_BASE_URL"),
    reason="API_BASE_URL is not configured. Replace this example with a real test.",
)
def test_api_health_endpoint():
    response = requests.get(f"{os.environ['API_BASE_URL']}/health", timeout=10)

    assert response.status_code == 200
