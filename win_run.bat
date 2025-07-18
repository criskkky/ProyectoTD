@REM REQUIERE BASE DE DATOS MYSQL CORRIENDO

@REM Verificar y copiar .env si no existen
if not exist "backend\src\config\.env" copy "backend\src\config\.env.example" "backend\src\config\.env"
if not exist "frontend\.env" copy "frontend\.env.example" "frontend\.env"

@REM Reemplazar 'mysql' por 'localhost' en los .env creados
if exist "backend\src\config\.env" (
    powershell -Command "(Get-Content 'backend\src\config\.env') -replace 'mysql', 'localhost' | Set-Content 'backend\src\config\.env'"
)

@REM Ejecutar backend en una nueva ventana
start cmd /k "cd backend && npm run dev"

@REM Ejecutar frontend en una nueva ventana
start cmd /k "cd frontend && npm run dev"