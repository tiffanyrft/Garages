@echo off
echo --- DEMARRAGE BACKEND ---

cd /d "%~dp0"

if not exist node_modules (
    echo Installation des dependances backend...
    npm install
)

npm start

pause
