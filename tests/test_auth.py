from fastapi.testclient import TestClient
from clx_mpdet.service import app


def test_health_open():
    c = TestClient(app)
    r = c.get("/health")
    assert r.status_code == 200


def test_auth_required():
    c = TestClient(app)
    r = c.get("/api/bootstrap/files")
    assert r.status_code in (401, 403)
