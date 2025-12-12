from fastapi.testclient import TestClient
import importlib

module = importlib.import_module("output.main")
app = module.app
client = TestClient(app)

def test_create_task():
    resp = client.post("/tasks", json={"title": "A", "done": False})
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == 1
    assert data["title"] == "A"

def test_list_tasks():
    resp = client.get("/tasks")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1

def test_get_task():
    resp = client.get("/tasks/1")
    assert resp.status_code == 200

def test_update_task():
    resp = client.put("/tasks/1", json={"title": "AA", "done": True})
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "AA"

def test_delete_task():
    resp = client.delete("/tasks/1")
    assert resp.status_code == 204
