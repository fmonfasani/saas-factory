#!/usr/bin/env bash
set -e

echo "🔧 Corrigiendo estructura para Hatch..."

# Crear src si no existe
mkdir -p src

# Mover iopeer/ dentro de src/
if [ -d "iopeer" ]; then
    echo "📁 Moviendo iopeer/ → src/iopeer/"
    mv iopeer src/
fi

# Crear __init__.py si no existe
if [ ! -f "src/iopeer/__init__.py" ]; then
    echo "🧩 Creando __init__.py"
    touch src/iopeer/__init__.py
fi

# Patch pyproject.toml
echo "📝 Actualizando pyproject.toml..."
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

[tool.hatch.build.targets.wheel]
packages = ["src/iopeer"]
EOF

echo "📦 Instalando en modo editable..."
pip install -e .

echo "✨ Fix completo. Ahora podés correr: iopeer generate spec.md --zip"
    