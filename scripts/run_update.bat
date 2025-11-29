@echo off
REM ----------------------------------------------------
REM run_update.bat - FULL PIPELINE RUNNER (SHIFT-ONLY)
REM ----------------------------------------------------
REM 1) Update Excel from Downtack + regenerate JSON
REM    (update_excel_fallback.py in pick3-site tree)
REM 2) COPY fresh JSON into site-repo\public
REM 3) Auto-commit and push to GitHub (triggers Vercel)
REM ----------------------------------------------------

REM Always run from scripts folder
cd /d C:\Sites\site-repo\scripts

echo [%DATE% %TIME%] Starting update_excel_fallback.py...
py -u "C:\Sites\site-repo\scripts\update_excel_fallback.py"
if errorlevel 1 (
    echo [%DATE% %TIME%] ERROR: update_excel_fallback.py failed. Aborting.
    goto :EOF
)

echo [%DATE% %TIME%] Copying JSON files into site-repo\public...

REM history.json
copy /Y ^
 "C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\nextjs-boilerplate\public\history.json" ^
 "C:\Sites\site-repo\public\history.json"
if errorlevel 1 (
    echo [%DATE% %TIME%] WARNING: Failed to copy history.json
)

REM game2_data.json
copy /Y ^
 "C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\nextjs-boilerplate\public\game2_data.json" ^
 "C:\Sites\site-repo\public\game2_data.json"
if errorlevel 1 (
    echo [%DATE% %TIME%] WARNING: Failed to copy game2_data.json
)

REM predictions.json
copy /Y ^
 "C:\Sites\pick3-site\Pick 3 Website Info - 10-10-2025\nextjs-boilerplate\public\predictions.json" ^
 "C:\Sites\site-repo\public\predictions.json"
if errorlevel 1 (
    echo [%DATE% %TIME%] WARNING: Failed to copy predictions.json
)

echo [%DATE% %TIME%] Starting auto_git_push.py...
py -u "C:\Sites\site-repo\scripts\auto_git_push.py"
if errorlevel 1 (
    echo [%DATE% %TIME%] ERROR: auto_git_push.py failed.
    goto :EOF
)

echo [%DATE% %TIME%] Pipeline completed successfully.
