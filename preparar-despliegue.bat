@echo off
chcp 65001 > nul
echo ============================================================
echo   SYSMICON — Preparador de Paquetes para Producción
echo ============================================================
echo.

set ROOT_DIR=%~dp0
set OUTPUT_DIR=%ROOT_DIR%despliegue_produccion
set FRONTEND_DIR=%ROOT_DIR%frontend
set BACKEND_DIR=%ROOT_DIR%backend

echo [1/4] Limpiando carpeta de salida previa...
if exist "%OUTPUT_DIR%" rmdir /s /q "%OUTPUT_DIR%"
mkdir "%OUTPUT_DIR%\public_html"
mkdir "%OUTPUT_DIR%\backend_php"

echo [2/4] Compilando Frontend Angular (producción)...
cd /d "%FRONTEND_DIR%"
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] La compilación de Angular falló. Revisa los errores arriba.
    pause
    exit /b %errorlevel%
)

echo [3/4] Copiando archivos de Frontend a public_html...
xcopy /E /I /Y "%FRONTEND_DIR%\dist\frontend\browser\*" "%OUTPUT_DIR%\public_html\"

echo [4/4] Copiando archivos de Backend a backend_php...
xcopy /E /I /Y "%BACKEND_DIR%\config" "%OUTPUT_DIR%\backend_php\config"
xcopy /E /I /Y "%BACKEND_DIR%\controllers" "%OUTPUT_DIR%\backend_php\controllers"
xcopy /E /I /Y "%BACKEND_DIR%\database" "%OUTPUT_DIR%\backend_php\database"
xcopy /E /I /Y "%BACKEND_DIR%\helpers" "%OUTPUT_DIR%\backend_php\helpers"
xcopy /E /I /Y "%BACKEND_DIR%\middleware" "%OUTPUT_DIR%\backend_php\middleware"
if exist "%BACKEND_DIR%\vendor" (
    xcopy /E /I /Y "%BACKEND_DIR%\vendor" "%OUTPUT_DIR%\backend_php\vendor"
)
if exist "%BACKEND_DIR%\uploads" (
    xcopy /E /I /Y "%BACKEND_DIR%\uploads" "%OUTPUT_DIR%\backend_php\uploads"
)
copy /Y "%BACKEND_DIR%\index.php" "%OUTPUT_DIR%\backend_php\index.php"
copy /Y "%BACKEND_DIR%\.htaccess" "%OUTPUT_DIR%\backend_php\.htaccess"
copy /Y "%BACKEND_DIR%\composer.json" "%OUTPUT_DIR%\backend_php\composer.json"
copy /Y "%BACKEND_DIR%\composer.lock" "%OUTPUT_DIR%\backend_php\composer.lock"
if exist "%BACKEND_DIR%\.env" (
    copy /Y "%BACKEND_DIR%\.env" "%OUTPUT_DIR%\backend_php\.env"
) else (
    copy /Y "%BACKEND_DIR%\.env.example" "%OUTPUT_DIR%\backend_php\.env"
)

echo.
echo ============================================================
echo   ¡PROCESO COMPLETADO EXITOSAMENTE!
echo ============================================================
echo Encontrarás tus carpetas listas en:
echo   %OUTPUT_DIR%\public_html
echo   %OUTPUT_DIR%\backend_php
echo.
echo Sube el contenido de cada una a tu Administrador de Archivos.
echo ============================================================
pause

