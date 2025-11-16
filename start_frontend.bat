@echo off
chcp 65001 > nul
echo ====================================
echo   Starting Frontend Development Server
echo ====================================
echo.

cd frontend

echo Starting Vite development server...
echo Server will run on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
