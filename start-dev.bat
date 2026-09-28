@echo off
setlocal
cd /d "%~dp0"

echo [1/2] Iniciando API en http://localhost:3000 ...
start "Belleza Tetris - API" cmd /k "cd /d ""%CD%\backend"" && node server.js"

echo [2/2] Iniciando frontend en http://localhost:5500 ...
start "Belleza Tetris - Frontend" cmd /k "cd /d ""%CD%\frontend"" && node static-server.js . 5500"

echo.
echo Listo. Abre http://localhost:5500 en el navegador.
echo Para detener, cierra las dos ventanas que se abren.