REM BACKEND
cd backend
start "BACKEND" cmd /k compile_backend.bat
cd ..

REM MOBILE
start "MOBILE" cmd /k compile_mobile.bat

echo.
echo Le projet est lance.
pause
