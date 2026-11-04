import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_lead_rejects_invalid_payload():
    response = client.post("/api/v1/leads", json={"name": "x", "email": "bad"})
    assert response.status_code == 422
