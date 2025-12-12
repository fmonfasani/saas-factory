#!/bin/bash

set -e

BASE_DIR="/f/Software Developer/Porfolio/Saas Factory/Scripts/agent-test"

echo "📁 Creando estructura base en: $BASE_DIR"

mkdir -p "$BASE_DIR"
cd "$BASE_DIR"

# ============================
# Crear carpetas del proyecto
# ============================
mkdir -p output
mkdir -p tests

# ============================
# Crear spec.md ejemplo
# ============================
cat > spec.md << 'EOF'
# CRUD de Tasks

Requisitos:

- FastAPI backend
- Endpoints:
  - POST /tasks
  - GET /tasks
  - GET /tasks/{id}
  - PUT /tasks/{id}
  - DELETE /tasks/{id}

Validaciones:
- DELETE debe devolver 204 sin body
- Usar in-memory DB con autoincrement
EOF

echo "📝 spec.md creado"

# ============================
# Crear tests CRUD
# ============================
cat > tests/test_crud.py << 'EOF'
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
EOF

echo "🧪 Tests creados"

# ============================
# Crear test básico
# ============================
cat > tests/test_basic.py << 'EOF'
import importlib

def test_import():
    module = importlib.import_module("output.main")
    assert hasattr(module, "app")
EOF

echo "🧪 test_basic creado"

# ============================
# Crear requirements.txt
# ============================
cat > requirements.txt << 'EOF'
openai>=1.40.0
fastapi
pytest
pydantic
uvicorn
EOF

echo "📦 requirements.txt creado"

# ============================
# Crear archivo principal del pipeline
# ============================
cat > test_agent.py << 'EOF'
# (ACÁ VA EL PIPELINE B COMPLETO QUE TE ENTREGO EN EL SIGUIENTE MENSAJE)
EOF

echo "🧠 test_agent.py creado (placeholder)"

echo ""
echo "====================================="
echo "✅ Setup completo!"
echo "Ahora ejecutá:"
echo ""
echo "    cd \"$BASE_DIR\""
echo "    pip install -r requirements.txt"
echo "    python test_agent.py"
echo "====================================="
