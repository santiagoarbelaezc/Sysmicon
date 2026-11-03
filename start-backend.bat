@echo off
title Sysmicon Backend API Server
echo ============================================================
echo   Iniciando Backend Sysmicon en http://localhost:8000
echo ============================================================
set "PHP_EXE=C:\Users\USUARIO\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"

cd /d "%~dp0backend"

if exist "%PHP_EXE%" (
    "%PHP_EXE%" -S localhost:8000 index.php
) else (
    php -S localhost:8000 index.php
)
pause
