@echo off
echo --- DEMARRAGE MOBILE (EXPO) ---

cd /d "%~dp0"

if not exist node_modules (
    echo Installation des dependances mobile...
    npm install
)

npx expo start -c

pause
