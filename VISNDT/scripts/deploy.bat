@echo off
REM ===========================================
REM VISNDT Production Deployment Script
REM ===========================================
REM Usage: scripts\deploy.bat [env]
REM   env: production (default)
REM ===========================================

setlocal enabledelayedexpansion

set ENV=%1
if "%ENV%"=="" set ENV=production

echo ===========================================
echo  VISNDT Deployment Script
echo  Environment: %ENV%
echo ===========================================
echo.

REM --- Step 1: Install dependencies ---
echo [1/5] Installing dependencies...
call pnpm install --frozen-lockfile
if %ERRORLEVEL% neq 0 (
    echo ERROR: pnpm install failed
    exit /b 1
)
echo   Done.
echo.

REM --- Step 2: Generate Prisma Client ---
echo [2/5] Generating Prisma Client...
call pnpm db:generate
if %ERRORLEVEL% neq 0 (
    echo ERROR: Prisma generate failed
    exit /b 1
)
echo   Done.
echo.

REM --- Step 3: Run database migrations ---
echo [3/5] Running database migrations...
call pnpm --filter @visndt/database exec prisma migrate deploy
if %ERRORLEVEL% neq 0 (
    echo ERROR: Prisma migrate failed
    exit /b 1
)
echo   Done.
echo.

REM --- Step 4: Build Backend ---
echo [4/5] Building Backend...
call pnpm --filter @visndt/api build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend build failed
    exit /b 1
)
echo   Done.
echo.

REM --- Step 5: Build Frontend ---
echo [5/5] Building Frontend...
call pnpm --filter @visndt/admin build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Frontend build failed
    exit /b 1
)
echo   Done.
echo.

echo ===========================================
echo  Deployment build completed successfully!
echo.
echo  Next steps:
echo    Backend:  node apps\api\dist\main
echo    Frontend: Serve apps\admin\dist\ via Nginx
echo ===========================================

endlocal