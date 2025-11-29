# auto_git_push.py
# FINAL FIXED VERSION – uses the REAL repo root (C:\Sites\site-repo)

import os
import subprocess
from datetime import datetime
from pathlib import Path

# ----------------------------------------------------
# PATHS
# ----------------------------------------------------
REPO = Path(r"C:\Sites\site-repo")  # <-- FIXED
LOG_FILE = REPO / "auto_git_push.log"

GIT = r"C:\Program Files\Git\cmd\git.exe"


def log(msg: str):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}\n")


def run_git(args):
    cmd = [GIT] + args
    log(f"RUN: {' '.join(cmd)}")

    result = subprocess.run(
        cmd,
        cwd=REPO,  # <-- FIXED: Now Git runs inside C:\Sites\site-repo
        capture_output=True,
        text=True,
        shell=False
    )

    if result.stdout:
        log("STDOUT:\n" + result.stdout)
    if result.stderr:
        log("STDERR:\n" + result.stderr)

    return result.returncode


def main():
    log("=== auto_git_push.py started ===")

    run_git(["add", "-A"])
    run_git(["commit", "-m", "Auto pipeline update"])
    run_git(["pull", "--rebase"])   # <-- NEW: auto-fix divergence
    rc = run_git(["push"])

    if rc != 0:
        log("git push FAILED.")
    else:
        log("git push succeeded.")

    log("=== auto_git_push.py finished ===")


if __name__ == "__main__":
    main()
