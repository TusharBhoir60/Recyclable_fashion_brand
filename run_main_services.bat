@echo off
setlocal

set "ROOT=%~dp0"
set "VENV_ACTIVATE=%ROOT%..\.venv\Scripts\activate.bat"
set "PYTHON_EXE=%ROOT%..\.venv\Scripts\python.exe"

echo Starting RecyclaBag main services...
echo.

start "RecyclaBag Backend" cmd /k "cd /d ""%ROOT%backend"" && npm run dev"
start "RecyclaBag Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"
start "RecyclaBag ML API" cmd /k "cd /d ""%ROOT%recyclebag_ml"" && if exist ""%PYTHON_EXE%"" (""%PYTHON_EXE%"" -m uvicorn serve.main:app --host 0.0.0.0 --port 8000 --reload) else (echo [WARN] Python executable not found at %PYTHON_EXE%)"

echo Launched:
echo 1) Backend API on http://localhost:5000
echo 2) Frontend Next.js on http://localhost:3000
echo 3) ML API on http://localhost:8000
echo.
echo You can close this launcher window.

endlocal