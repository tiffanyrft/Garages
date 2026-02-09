@echo off
echo Démarrage de l'API Garage...
echo.
echo Configuration:
echo - IP: 192.168.88.24
echo - Port: 8000
echo - Base: garage (PostgreSQL)
echo.

php artisan serve --host=0.0.0.0 --port=8000

pause
