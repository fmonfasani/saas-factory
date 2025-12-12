#!/usr/bin/env bash
set -e

PROJECT_DIR="agent-test"

echo "Creando carpeta $PROJECT_DIR..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "Creando entorno de archivos..."

# 1) spec.md
cat > spec.md << 'EOF'
# FEATURE: CRUD de tareas en FastAPI

Requerimiento:
Crear un CRUD simple de tareas con FastAPI.

Endpoints:
- POST /tasks        → crear una tarea (title: str, done: bool)
- GET /tasks         → listar todas
- GET /tasks/{id}    → obtener una tarea
- PUT /tasks/{id}    → actualizar
- DELETE /tasks/{id} → borrar

Reglas:
- Usar FastAPI + pydantic
- Persistencia en memoria (lista en Python)
- Código ejecutable sin modificaciones manuales
- Debe correr con: uvicorn main:app --reload
EOF

# 2) output dir
mkdir -p output

# 3) tests/test_basic.py
mkdir -p tests
cat > tests/test_basic.py << 'EOF'
def test_import():
    import importlib
    module = importlib.import_module("output.main")
    assert hasattr(module, "app")
EOF

# 4) test_agent.py
cat > test_agent.py << 'EOF'
import anthropic
import time
import subprocess
import json
from pathlib import Path

SPEC_FILE = "spec.md"
OUTPUT_DIR = Path("output")

client = anthropic.Anthropic()  # requiere ANTHROPIC_API_KEY en el entorno


def load_spec():
    return Path(SPEC_FILE).read_text(encoding="utf-8")


def ask_claude(prompt: str) -> str:
    resp = client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=6000,
        temperature=0,
        messages=[{"role": "user", "content": prompt}],
    )
    # asumimos que el primer bloque es texto con el JSON
    return resp.content[0].text


def save_output(json_str: str):
    OUTPUT_DIR.mkdir(exist_ok=True)
    files = json.loads(json_str)

    for filename, content in files.items():
        filepath = OUTPUT_DIR / filename
        filepath.parent.mkdir(parents=True, exist_ok=True)
        filepath.write_text(content, encoding="utf-8")


def run_tests():
    try:
        result = subprocess.run(
            ["pytest", "-q", "tests"],
            capture_output=True,
            text=True,
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)


def main():
    spec = load_spec()

    prompt = f"""
Genera un proyecto FastAPI completo según este spec:

{spec}

Devuelve la respuesta como un JSON de este estilo:

{{
  "main.py": "<codigo>",
  "routers/tasks.py": "<codigo>"
}}

Reglas IMPORTANTES:
- NO escribas nada fuera del JSON.
- NO incluyas texto explicativo, solo el JSON puro.
"""

    start = time.time()
    code_json = ask_claude(prompt)
    generation_time = time.time() - start

    save_output(code_json)

    passed, logs = run_tests()

    print("=== RESULTADOS ===")
    print(f"Tiempo de generación:
