@echo off
chcp 65001 >nul
echo ========================================
echo   WhatsApp Web Server
echo ========================================
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
set "WHATSAPP_DIR=%SCRIPT_DIR%whatsapp-server"

echo Checking if whatsapp-server directory exists...
if not exist "%WHATSAPP_DIR%" (
    echo.
    echo [ERROR] whatsapp-server directory not found!
    echo Expected path: %WHATSAPP_DIR%
    echo.
    pause
    exit /b 1
)

echo Directory found: %WHATSAPP_DIR%
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Node.js is not installed!
    echo.
    echo Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found!
node --version
echo.

cd /d "%WHATSAPP_DIR%"

echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo.
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo.
)

echo.
echo ========================================
echo   Starting WhatsApp Web Server...
echo ========================================
echo.
echo NOTE: QR Code will appear in a few seconds
echo 1. Open WhatsApp on your phone
echo 2. Go to: Settings -^> Linked Devices
echo 3. Tap: Link a Device
echo 4. Scan the QR Code that appears below
echo.
echo Press Ctrl+C to stop
echo.

call npm start

pause
