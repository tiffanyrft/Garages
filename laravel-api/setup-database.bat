@echo off
echo Configuration de la base de données Garage...
echo.

echo 1. Installation des dépendances...
composer install

echo.
echo 2. Configuration de l'environnement...
copy .env.example .env
php artisan key:generate

echo.
echo 3. Exécution des migrations...
php artisan migrate

echo.
echo 4. Peuplement des données de test...
php artisan db:seed

echo.
echo 5. Configuration terminée !
echo.
echo Utilisateur de test: test@test.com / password
echo.
echo Pour démarrer l'API, exécutez: start-api.bat

pause
