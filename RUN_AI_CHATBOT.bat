@echo off
cd /d "%~dp0"
python -m pip install -r requirements-ai.txt
python -m uvicorn ai_server:app --host 127.0.0.1 --port 8000
pause
