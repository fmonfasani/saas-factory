import subprocess
import sys
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

    # Ejecutar test_agent.py que maneja:
    # planner → coder → fixer → pytest
    cmd = [sys.executable, str(TEST_AGENT_PATH)]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        shell=False
    )

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
