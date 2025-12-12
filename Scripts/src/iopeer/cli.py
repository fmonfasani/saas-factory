import click
import zipfile
import datetime
import shutil
import sys
from pathlib import Path
from iopeer.pipeline import run_pipeline

BASE_DIR = Path(__file__).resolve().parent.parent.parent
AGENT_TEST_DIR = BASE_DIR / "agent-test"
OUTPUT_DIR = AGENT_TEST_DIR / "output"

@click.group()
def cli():
    pass


# ============================================================
# UTILIDAD: Copiar tests de forma segura
# ============================================================

def copy_tests_safely():
    src = AGENT_TEST_DIR / "tests"
    dest = OUTPUT_DIR / "tests"

    # limpiar tests previos
    if dest.exists():
        shutil.rmtree(dest)

    dest.mkdir(parents=True, exist_ok=True)

    # copiar SOLO archivos
    for f in src.rglob("*"):
        if f.is_file():  # evita __pycache__
            rel = f.relative_to(src)
            target = dest / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(f.read_text(encoding="utf-8"), encoding="utf-8")

    click.echo(f"🧪 Tests copiados → {dest}")


# ============================================================
# UTILIDAD: Generar ZIP limpio
# ============================================================

def build_zip():
    zip_path = BASE_DIR / "dist/generated.zip"
    zip_path.parent.mkdir(exist_ok=True)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        root = OUTPUT_DIR
        for file in root.rglob("*"):
            if file.is_file():
                rel = file.relative_to(root)
                z.write(file, arcname=rel)

        # README incluido
        readme = f"""
# Proyecto generado por IOPEER

Fecha: {datetime.datetime.now()}

Backend generado automáticamente:
- FastAPI
- SQLAlchemy
- Tests incluidos
- Pipeline PLANNER → CODER → TESTER → FIXER
"""
        z.writestr("README.md", readme)

    click.echo(f"📦 ZIP generado: {zip_path}")


# ============================================================
# COMANDO: generate
# ============================================================

@cli.command()
@click.argument("spec")
@click.option("--zip", "zip_output", is_flag=True)
def generate(spec, zip_output):
    spec_path = Path(spec).resolve()
    if not spec_path.exists():
        click.echo(f"❌ SPEC no encontrado: {spec_path}")
        return

    # copiar tests antes del pipeline
    copy_tests_safely()

    ok, out, err = run_pipeline(spec_path)

    if not ok:
        click.echo("❌ Pipeline falló.")
        return

    if zip_output:
        build_zip()

    click.echo("🎉 Pipeline completado.")


if __name__ == "__main__":
    cli()
