#!/bin/bash
set -e

echo "🔧 Finalizando Sprint 1 — Backend Generator..."
echo "=============================================="

# -------------------------------------------
# 1. Crear pipeline interno en iopeer
# -------------------------------------------
echo "📁 Creando src/iopeer/pipeline.py..."

cat << 'EOF' > src/iopeer/pipeline.py
import subprocess
from pathlib import Path
import datetime

BASE_DIR = Path(__file__).resolve().parent.parent.parent
AGENT_TEST_DIR = BASE_DIR / "agent-test"
TEST_AGENT_PATH = AGENT_TEST_DIR / "test_agent.py"

def log(msg):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}")

def run_pipeline(spec_path: Path):
    log("PIPELINE START")
    log(f"SPEC usado: {spec_path}")

    cmd = ["python", str(TEST_AGENT_PATH)]
    result = subprocess.run(cmd, capture_output=True, text=True)

    log("PIPELINE OUTPUT ↓")
    print(result.stdout)

    if result.stderr:
        log("PIPELINE ERRORS ↓")
        print(result.stderr)

    ok = result.returncode == 0

    if ok:
        log("PIPELINE END — SUCCESS")
    else:
        log("PIPELINE END — FAILED")

    return ok, result.stdout, result.stderr
EOF


# -------------------------------------------
# 2. Actualizar el CLI para usar pipeline.py
# -------------------------------------------
echo "📝 Actualizando CLI (src/iopeer/cli.py)..."

cat << 'EOF' > src/iopeer/cli.py
import click
from pathlib import Path
from iopeer.pipeline import run_pipeline
import zipfile
import datetime

@click.group()
def cli():
    pass

@cli.command()
@click.argument("spec")
@click.option("--zip", "zip_output", is_flag=True)
def generate(spec, zip_output):
    spec_path = Path(spec).resolve()
    if not spec_path.exists():
        click.echo(f"❌ SPEC no encontrado: {spec_path}")
        return

    ok, out, err = run_pipeline(spec_path)

    if not ok:
        click.echo("❌ Pipeline falló.")
        return

    if zip_output:
        zip_path = Path("dist/generated.zip")
        zip_path.parent.mkdir(exist_ok=True)

        with zipfile.ZipFile(zip_path, "w") as z:
            for path in Path("agent-test/output").rglob("*"):
                z.write(path, arcname=path.relative_to("agent-test/output"))

            # README auto-generado
            readme = f"""
# Proyecto generado por IOPEER

Fecha: {datetime.datetime.now()}

Backend generado automáticamente con:
- FastAPI
- Tests incluidos
- Esquema basado en SPEC: {spec_path.name}

## Cómo ejecutarlo
cd output
pip install -r requirements.txt
uvicorn main:app --reload
"""
            z.writestr("README.md", readme)

        click.echo(f"📦 ZIP generado: {zip_path}")

    click.echo("🎉 Pipeline completado.")

if __name__ == "__main__":
    cli()
EOF


# -------------------------------------------
# 3. Agregar template parser multi-entidad
# -------------------------------------------
echo "🧩 Agregando parser SPEC multi-entidad (src/iopeer/spec_parser.py)..."

cat << 'EOF' > src/iopeer/spec_parser.py
from pathlib import Path

def parse_spec(path: Path):
    """
    Parser ultra-simple de entidades:
    Detecta bloques como:

    Entidad User:
       name: str
       age: int
    """
    content = path.read_text().splitlines()
    entities = {}
    current = None

    for line in content:
        line = line.strip()

        if line.lower().startswith("entidad "):
            name = line.split(" ")[1].replace(":", "")
            entities[name] = {}
            current = name
            continue

        if ":" in line and current:
            field, type_ = [x.strip() for x in line.split(":", 1)]
            entities[current][field] = type_

    return entities
EOF


# -------------------------------------------
# 4. Reinstalar iopeer en modo editable
# -------------------------------------------
echo "📦 Reinstalando iopeer..."
pip install -e .

echo "=============================================="
echo "🎉 Sprint 1 completado al 100%"
echo "Podés ejecutar:"
echo "    iopeer generate spec.md --zip"
echo "=============================================="
