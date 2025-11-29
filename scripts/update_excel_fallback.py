# -*- coding: utf-8 -*-
# -------------------------------------------------------------------
# update_excel_fallback.py  (FINAL — SAFE SHIFT + NO OVERLAP)
# -------------------------------------------------------------------

import os
import json
import time
from pathlib import Path
from datetime import datetime, timedelta

import requests
import pythoncom
import pywintypes
import win32com.client as win32

# -------------------------------------------------------------------
# PATHS
# -------------------------------------------------------------------

ROOT = Path(r"C:\Sites\site-repo")
SCRIPTS_ROOT = ROOT / "scripts"
LOG_FILE = SCRIPTS_ROOT / "logs" / "update_excel_fallback.log"
SECRETS_FILE = ROOT / "secrets" / "downtack_config.json"

WORKBOOK = Path(
    r"C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025"
    r"\Raw Scrape - 10-26-2025\NC-No Program - 10-1-2025.xlsm"
)

EXTRACT_SCRIPTS = [
    r"C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\extract_draw_history.py",
    r"C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\extract_game2_data.py",
    r"C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\Raw Scrape - 10-26-2025\extract_predictions_excel_live.py",
]

START_ROW = 5  # A5:E5 is the top of data

# -------------------------------------------------------------------
# LOGGING
# -------------------------------------------------------------------

def log(msg: str):
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("[%m/%d/%Y %I:%M:%S %p]")
    line = f"{ts} {msg}"
    try:
        print(line)
    except:
        pass
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except:
        pass

# -------------------------------------------------------------------
# API / NORMALIZATION
# -------------------------------------------------------------------

def load_endpoint() -> str:
    with open(SECRETS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)["endpoint"].strip()

def fetch_payload(url: str):
    log(f"Fetching Downtack data → {url}")
    r = requests.get(url, timeout=25)
    r.raise_for_status()
    return r.json()

def normalize(payload):
    rows = []
    for game in (payload if isinstance(payload, list) else [payload]):
        for play in game.get("plays") or []:
            playname = (play.get("name") or "").lower()
            me = "Mid" if "day" in playname or "mid" in playname else "Eve"
            for d in play.get("draws") or []:
                date = d.get("date")
                nums = d.get("numbers") or []
                if not date or len(nums) < 3:
                    continue
                nums_sorted = sorted(nums, key=lambda x: x.get("order", 0))
                rows.append(dict(
                    date=date,
                    p1=str(nums_sorted[0]["value"]),
                    p2=str(nums_sorted[1]["value"]),
                    p3=str(nums_sorted[2]["value"]),
                    me=me
                ))
    log(f"Normalized {len(rows)} Downtack rows.")
    return rows

# -------------------------------------------------------------------
# EXCEL HELPERS
# -------------------------------------------------------------------

def excel_date_to_str(v):
    if v is None:
        return ""
    if isinstance(v, datetime):
        return v.strftime("%m/%d/%Y")
    if isinstance(v, (int, float)):
        base = datetime(1899, 12, 30)
        return (base + timedelta(days=v)).strftime("%m/%d/%Y")
    return str(v).strip()

def safe_set(ws, r, c, val):
    for _ in range(20):
        try:
            ws.Cells(r, c).Value = val
            return
        except pywintypes.com_error:
            time.sleep(0.2)
    raise

def force_kill_excel():
    os.system("taskkill /IM EXCEL.EXE /F >nul 2>&1")

def open_wb():
    pythoncom.CoInitialize()
    excel = win32.DispatchEx("Excel.Application")
    excel.Visible = False
    excel.DisplayAlerts = False
    wb = excel.Workbooks.Open(str(WORKBOOK))
    ws = wb.Worksheets("Data")
    return excel, wb, ws

def read_existing(ws):
    rows = []
    r = START_ROW
    while True:
        v = ws.Cells(r, 1).Value
        if v is None or str(v).strip() == "":
            break
        rows.append((
            excel_date_to_str(v),
            str(ws.Cells(r, 2).Value).strip(),
            str(ws.Cells(r, 3).Value).strip(),
            str(ws.Cells(r, 4).Value).strip(),
            str(ws.Cells(r, 5).Value).strip(),
        ))
        r += 1
    return rows

# -------------------------------------------------------------------
# SAFE SHIFT-DOWN (ONE ROW AT A TIME)
# -------------------------------------------------------------------

def shift_down(ws, existing_count, num_new):
    """
    Moves EXISTING rows down by num_new, bottom → up,
    one row at a time. ZERO overlap. ZERO range copies.
    """
    log(f"Shifting {existing_count} rows down by {num_new} safely...")

    for src in range(existing_count, 0, -1):   # bottom → up
        src_r = START_ROW + (src - 1)
        dest_r = src_r + num_new

        # Read each column first (safe)
        try:
            rowvals = [
                ws.Cells(src_r, 1).Value,
                ws.Cells(src_r, 2).Value,
                ws.Cells(src_r, 3).Value,
                ws.Cells(src_r, 4).Value,
                ws.Cells(src_r, 5).Value,
            ]
        except:
            rowvals = ["","","","",""]

        # Write to destination
        for col in range(1, 6):
            safe_set(ws, dest_r, col, rowvals[col-1])

    log("Shift complete.")

# -------------------------------------------------------------------
# TOP INSERT
# -------------------------------------------------------------------

def insert_top(ws, new_rows):
    """
    new_rows is a list of dict rows, newest first.
    Write them into A5:E5, A6:E6, etc.
    """
    log(f"Inserting {len(new_rows)} new row(s) at top...")

    r = START_ROW
    for nr in new_rows:
        safe_set(ws, r, 1, nr["date"])
        safe_set(ws, r, 2, nr["p1"])
        safe_set(ws, r, 3, nr["p2"])
        safe_set(ws, r, 4, nr["p3"])
        safe_set(ws, r, 5, nr["me"])
        r += 1

# -------------------------------------------------------------------
# MAIN UPDATE LOGIC
# -------------------------------------------------------------------

def update_excel(new_rows):
    force_kill_excel()
    excel = wb = ws = None
    try:
        excel, wb, ws = open_wb()
        log("Workbook + Data sheet opened successfully.")

        existing = read_existing(ws)
        existing_count = len(existing)
        log(f"Loaded {existing_count} existing rows.")

        # Remove new_rows that already exist (same date & Mid/Eve)
        existing_keys = {(r[0], r[4]) for r in existing}
        final_new = [
            r for r in new_rows
            if (r["date"], r["me"]) not in existing_keys
        ]

        if not final_new:
            log("No new rows to insert. Done.")
        else:
            # Shift
            shift_down(ws, existing_count, len(final_new))
            # Insert new rows
            insert_top(ws, final_new)

        log("Saving workbook...")
        wb.Save()
        wb.Close(True)
        excel.Quit()
        log("Excel COM cleaned up.")

    except Exception as e:
        log(f"FATAL ERROR: {e!r}")
        try:
            if wb: wb.Close(False)
        except: pass
        try:
            if excel: excel.Quit()
        except: pass
        raise

# -------------------------------------------------------------------
# EXTRACTORS
# -------------------------------------------------------------------

def run_extractors():
    for script in EXTRACT_SCRIPTS:
        log(f"Running extractor: {script}")
        os.system(f'py -u "{script}"')

# -------------------------------------------------------------------
# MAIN
# -------------------------------------------------------------------

def main():
    log("=== NC Pick 3 FAST SHIFT-DOWN update started ===")
    endpoint = load_endpoint()
    payload = fetch_payload(endpoint)
    rows = normalize(payload)

    if not rows:
        log("No rows from API.")
        return

    update_excel(rows)
    run_extractors()
    log("=== NC Pick 3 update finished ===")

# -------------------------------------------------------------------

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"FATAL ERROR: {e!r}")
        import traceback; log(traceback.format_exc())
