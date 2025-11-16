@echo off
chcp 65001 > nul
echo ====================================
echo   Employee Screening Form - Setup
echo ====================================
echo.

echo [1/4] Setting up Backend...
echo.
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your API keys.
) else (
    echo .env file already exists.
)

cd ..

echo.
echo [2/4] Setting up Frontend...
echo.
cd frontend

echo Installing Node.js dependencies...
call npm install

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your API keys.
) else (
    echo .env file already exists.
)

cd ..

echo.
echo [3/4] Creating directories...
if not exist backend\logs mkdir backend\logs
if not exist backend\uploads mkdir backend\uploads
if not exist backend\pdfs mkdir backend\pdfs

echo.
echo [4/4] Setup Complete!
echo.
echo ====================================
echo   Next Steps:
echo ====================================
echo.
echo 1. Edit backend\.env with your API keys:
echo    - WHATSAPP_ACCESS_TOKEN
echo    - GOOGLE_MAPS_API_KEY
echo    - etc.
echo.
echo 2. Edit frontend\.env with your API keys:
echo    - VITE_GOOGLE_MAPS_API_KEY
echo.
echo 3. Run start_backend.bat to start the backend
echo 4. Run start_frontend.bat to start the frontend
echo 5. Run create_demo_form.py to create a demo form
echo.
echo ====================================

pause
