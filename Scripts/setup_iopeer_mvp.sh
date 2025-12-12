#!/usr/bin/env bash
set -e

echo "🔧 Iniciando setup del MVP de iopeer..."

# -------------------------------------------------------
# 1. Crear estructura del proyecto
# -------------------------------------------------------
echo "📁 Creando estructura básica..."
mkdir -p iopeer
mkdir -p iopeer/agents
mkdir -p iopeer/core
mkdir -p dist
mkdir -p output

# -------------------------------------------------------
# 2. Crear pyproject.toml
# -------------------------------------------------------
echo "📝 Generando pyproject.toml..."
cat << 'EOF' > pyproject.toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "iopeer"
version = "0.1.0"
description = "iopeer - Minimal SaaS generator using Planner → Coder → Tester → Fixer"
readme = "README.md"
requires-python = ">=3.10"
dependencies = ["click"]

[project.scripts]
iopeer = "iopeer.cli:cli"
EOF

# -------------------------------------------------------
# 3. Crear CLI
# -------------------------------------------------------
echo "⚡ Creando CLI iopeer..."
cat << 'EOF' > iopeer/cli.py
import click
import subprocess
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "output"
DIST = ROOT / "dist"

@click.group()
def cli():
    """IOPEER - Minimal SaaS Generator CLI"""
    pass

@cli.command()
@click.argument("spec_path", required=False, default="spec.md")
@click.option("--zip", "zip_output", is_flag=True, help="Comprimir 'output/' en .zip")
def generate(spec_path, zip_output):
    """Planner → Coder → Tester → Fixer → ZIP"""
    spec_path = ROOT / spec_path
    if not spec_path.exists():
        click.echo(f"❌ No existe el SPEC: {spec_path}")
        raise SystemExit(1)

    click.echo("🧩 Ejecutando pipeline con test_agent.py...")
    result = subprocess.run(["python", "test_agent.py"], cwd=ROOT)

    if result.returncode != 0:
        click.echo("❌ Pipeline falló.")
        raise SystemExit(1)

    if zip_output:
        DIST.mkdir(exist_ok=True)
        zip_path = DIST / "generated.zip"
        if zip_path.exists():
            zip_path.unlink()
        shutil.make_archive(str(zip_path.with_suffix("")), "zip", OUTPUT)
        click.echo(f"📦 ZIP generado: {zip_path}")

@cli.command()
def clean():
    """Borra output/ y dist/."""
    for folder in ["output", "dist"]:
        p = ROOT / folder
        if p.exists():
            shutil.rmtree(p)
            click.echo(f"🧹 Eliminado: {p}")
EOF

# -------------------------------------------------------
# 4. Crear SPEC base
# -------------------------------------------------------
echo "📄 Creando SPEC base..."
cat << 'EOF' > spec.md
Crear API REST de tareas con FastAPI:

Entidad Task:
- id: int (auto)
- title: str (requerido)
- description: str (opcional)
- done: bool (default false)

Endpoints:
- POST /tasks
- GET /tasks
- GET /tasks/{id}
- PUT /tasks/{id}
- DELETE /tasks/{id}

Base de datos: SQLite con SQLAlchemy
Tests: pytest
EOF

# -------------------------------------------------------
# 5. Script Day 2: Multi-entidad (solo plantilla)
# -------------------------------------------------------
echo "🧱 Creando script para multi-entidad (plantilla)..."
cat << 'EOF' > iopeer/agents/multi_entity_template.md
Para soportar múltiples entidades, agregar al SPEC:

Entidades:

Task:
- id: int
- title: str
- done: bool

Project:
- id: int
- name: str

Relaciones:
- Project tiene muchas Task

El planner debe generar múltiples routers:
routers/tasks.py
routers/projects.py
EOF

# -------------------------------------------------------
# 6. Script Day 3: Autenticación (JWT) plantilla
# -------------------------------------------------------
echo "🔐 Creando script de autenticación (plantilla)..."
cat << 'EOF' > iopeer/agents/auth_template.md
Para activar autenticación en SPEC:

Auth: true

El planner debe generar:
- users.py (modelo)
- auth.py (router)
- login
- register
- JWT middleware

FastAPI + PyJWT + hashing (passlib).
EOF

# -------------------------------------------------------
# 7. Crear README inicial
# -------------------------------------------------------
echo "📘 Creando README..."
cat << 'EOF' > README.md
# iopeer - Minimal SaaS Generator MVP

Este es el MVP técnico más simple y funcional posible:

iopeer generate spec.md --zip


Esto ejecuta:
- Planner
- Coder
- Tester
- Fixer
- Exporta ZIP

Roadmap incluido en plantillas:
- Multi-entidad
- Autenticación
EOF

# -------------------------------------------------------
# 8. Instalar paquete localmente
# -------------------------------------------------------
echo "📦 Instalando iopeer en modo editable..."
pip install -e .

echo "✨ Setup completado."
echo "👉 Podés correr: iopeer generate spec.md --zip"