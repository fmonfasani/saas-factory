import json
import subprocess
import sys
from pathlib import Path
from openai import OpenAI

# Fuerza UTF-8 en Windows (emojis y unicode)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

client = OpenAI()

OUTPUT_DIR = Path("output")
MAX_FIX_ATTEMPTS = 3


# ============================================================
# PARSER UNIVERSAL (JSON o FILE: filename)
# ============================================================

def parse_files(raw: str) -> dict:
    """
    Soporta dos formatos:
    1. JSON válido: {"main.py": "...", ...}
    2. Formato tipo 'FILE: main.py' + bloques de código.
    """

    # --- FIX: remover bloques ```json ... ``` o ``` ... ```
    if raw.startswith("```"):
        raw = raw.strip().lstrip("`").rstrip("`")
        if raw.startswith("json"):
            raw = raw[4:].strip()

    raw = raw.strip()

    # ---- Intentar JSON ----
    try:
        return json.loads(raw)
    except Exception:
        pass

    # ---- Intentar formato FILE: ----
    files = {}
    current_file = None
    buffer = []

    for line in raw.splitlines():
        if line.startswith("FILE:"):
            if current_file:
                files[current_file] = "\n".join(buffer)
                buffer = []
            current_file = line.replace("FILE:", "").strip()
        else:
            if current_file:
                buffer.append(line)

    if current_file and buffer:
        files[current_file] = "\n".join(buffer)

    if not files:
        raise ValueError("No se pudo parsear nada como JSON ni como bloques FILE:")

    return files



# ============================================================
# UTILIDADES
# ============================================================

def save_output(model_output: str):
    """Parsea el output del modelo y guarda los archivos en output/"""
    try:
        files = parse_files(model_output)
    except Exception as e:
        print("❌ ERROR parseando output del modelo:")
        print(model_output)
        raise e

    # limpiar output/
    if OUTPUT_DIR.exists():
        for p in OUTPUT_DIR.rglob("*"):
            if p.is_file():
                p.unlink()
    else:
        OUTPUT_DIR.mkdir()

    # guardar archivos
    for filepath, content in files.items():
        fullpath = OUTPUT_DIR / filepath
        fullpath.parent.mkdir(parents=True, exist_ok=True)
        fullpath.write_text(content, encoding="utf-8")


def load_current_files_dict():
    """Devuelve dict path→code para enviar al FIXER"""
    files = {}
    for path in OUTPUT_DIR.rglob("*.py"):
        rel = path.relative_to(OUTPUT_DIR).as_posix()
        files[rel] = path.read_text(encoding="utf-8")
    return files


# ============================================================
# TESTER
# ============================================================

def run_tester():
    cmd = [sys.executable, "-m", "pytest", "-q", "tests"]
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        shell=False,
    )

    passed = result.returncode == 0
    logs = result.stdout + result.stderr
    return passed, logs


# ============================================================
# PLANNER
# ============================================================

BLUEPRINT_PROMPT = """
You are the PLANNER agent.

Your task is to analyze the SPECIFICATION and decide which Python files are required
to implement the requested FastAPI backend.

OUTPUT RULES:
- Output ONLY a JSON object.
- DO NOT include Python code.
- Each entry must describe a file path and its purpose.
- The Coder agent will later generate the full code.
- Do NOT add explanations.

FORMAT:
{
  "files": [
    {"path": "main.py", "description": "FastAPI entrypoint"},
    {"path": "routers/__init__.py", "description": "router init"},
    {"path": "routers/tasks.py", "description": "CRUD endpoints"}
  ]
}

SPECIFICATION:
[[SPEC]]

Return ONLY JSON.
"""

def run_planner(spec: str):
    prompt = BLUEPRINT_PROMPT.replace("[[SPEC]]", spec)

    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return resp.choices[0].message.content


# ============================================================
# CODER
# ============================================================

CODER_PROMPT = """
You are the CODER agent.

You receive a BLUEPRINT describing which files to generate.

RULES:
- Output ONLY a JSON object mapping file paths → full Python code.
- No markdown, no explanations, no comments outside code.
- JSON must be valid.
- ALL files from blueprint must be generated.
- Imports MUST be relative (`from .routers import tasks`).
- POST must use status_code=200.
- DELETE must use status_code=204 and return None.
- Code must pass pytest tests.

BLUEPRINT:
[[BLUEPRINT]]

Return ONLY JSON.
"""

def run_coder(blueprint_json: str):
    prompt = CODER_PROMPT.replace("[[BLUEPRINT]]", blueprint_json)

    resp = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
    )

    return resp.choices[0].message.content


# ============================================================
# FIXER
# ============================================================

FIXER_PROMPT = """
You are the FIXER agent.

You receive:
- SPEC
- BLUEPRINT
- CURRENT FILES (JSON path→code)
- PYTEST LOGS

Your job:
- Apply minimal corrections so tests pass.
- Fix imports, models, endpoints, status codes, etc.
- All imports MUST be relative.
- POST MUST return status_code=200.
- DELETE MUST return status_code=204 and return None.

Return ONLY JSON of ALL FILES.
NO markdown.
NO explanations.

SPEC:
[[SPEC]]

BLUEPRINT:
[[BLUEPRINT]]

FILES:
[[FILES]]

TEST LOGS:
[[LOGS]]
"""

def run_fixer(spec: str, blueprint: str, files: dict, logs: str):
    prompt = (
        FIXER_PROMPT
        .replace("[[SPEC]]", spec)
        .replace("[[BLUEPRINT]]", blueprint)
        .replace("[[FILES]]", json.dumps(files))
        .replace("[[LOGS]]", logs)
    )

    resp = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
    )

    return resp.choices[0].message.content


# ============================================================
# MAIN PIPELINE
# ============================================================

def main():
    spec = Path("spec.md").read_text(encoding="utf-8")

    print("🧩 Generando BLUEPRINT...")
    blueprint_json = run_planner(spec)

    print("\n🧑‍💻 Generando código inicial...")
    code_json = run_coder(blueprint_json)
    save_output(code_json)

    for attempt in range(MAX_FIX_ATTEMPTS + 1):
        print(f"\n==================== TEST RUN {attempt} ====================")
        ok, logs = run_tester()
        print(logs)

        if ok:
            print("\n🎉 TODOS LOS TESTS OK — PIPELINE COMPLETADO")
            return

        if attempt == MAX_FIX_ATTEMPTS:
            print("\n❌ No se pudo corregir después del máximo de intentos.")
            return

        print("\n🛠 Ejecutando FIXER...")
        current_files = load_current_files_dict()
        fixed_json = run_fixer(spec, blueprint_json, current_files, logs)
        save_output(fixed_json)


if __name__ == "__main__":
    main()
