@echo off
echo ====================================
echo   Git Setup and Push to GitHub
echo ====================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from:
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Initialize Git if not already
if not exist ".git" (
    echo [STEP 1] Initializing Git repository...
    git init
    echo [OK] Git initialized
    echo.
) else (
    echo [OK] Git repository already exists
    echo.
)

REM Add all files
echo [STEP 2] Adding files to Git...
git add .
if %ERRORLEVEL% EQU 0 (
    echo [OK] Files added
) else (
    echo [ERROR] Failed to add files
)
echo.

REM Create commit
echo [STEP 3] Creating commit...
git commit -m "Initial commit - Employee Screening System ready for deployment"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Commit created
) else (
    echo [INFO] Nothing to commit or already committed
)
echo.

echo ====================================
echo   Next Steps:
echo ====================================
echo.
echo 1. Create a GitHub repository:
echo    https://github.com/new
echo.
echo 2. Name it: employee-screening-system
echo.
echo 3. Copy the repository URL
echo.
echo 4. Run these commands (replace YOUR_USERNAME):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/employee-screening-system.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ====================================
echo.
pause
