@echo off
echo ========================================
echo   SAAS FACTORY API TEST SUITE
echo ========================================
echo.
echo Ejecutando tests...
echo.

cd /d "%~dp0"
node test-suite.js

echo.
echo ========================================
echo   TEST COMPLETE
echo ========================================
pause
