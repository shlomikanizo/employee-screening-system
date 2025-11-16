@echo off
chcp 65001 > nul
echo ====================================
echo   Starting Backend Server
echo ====================================
echo.

cd backend

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting FastAPI server...
echo Server will run on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python -m app.main

pause
