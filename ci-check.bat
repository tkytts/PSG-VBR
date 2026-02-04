@echo off
rem ci-check.bat — mirrors .github/workflows/ci-cd.yml locally.
rem Run from the repo root before committing.  Exits non-zero on first failure.

set REPO_ROOT=%~dp0
set FRONTEND=%REPO_ROOT%frontend
set BACKEND=%REPO_ROOT%backend

rem ── colour helpers (works on Windows 10+ with VT processing) ──
if "%ANSICON%" == "" (
    for /f "tokens=3" %%a in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v CurrentVersion') do set WINVER=%%a
)
rem Use powershell to enable VT sequences once
powershell -NoProfile -NonInteractive -Command "if ([System.Console]::IsOutputRedirected -eq $false) { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 }" 2>nul

set RED=[31m
set GREEN=[32m
set YELLOW=[33m
set BLUE=[34m
set BOLD=[1m
set RESET=[0m

rem ── helper: print section header ──
:header
echo.
echo %BOLD%%BLUE%════════════════════════════════════════%RESET%
echo %BOLD%%BLUE%  %~1%RESET%
echo %BOLD%%BLUE%════════════════════════════════════════%RESET%
goto :eof

rem ── helper: report step result ──
:check
if %1 neq 0 (
    echo %RED%%BOLD%FAILED — %~2%RESET%
    echo %RED%Stopping. Fix the errors above and re-run ci-check.bat.%RESET%
    exit /b %1
)
echo %GREEN%PASSED — %~2%RESET%
goto :eof

rem ══════════════════════════════════════════════════════════════
rem  MAIN
rem ══════════════════════════════════════════════════════════════

echo %BOLD%ci-check.bat%RESET% — local mirror of GitHub CI
echo Working directory: %REPO_ROOT%

rem ── 1. Frontend: install ─────────────────────────────────────
call :header "Frontend — npm ci"
cd /d "%FRONTEND%"
npm ci
call :check %ERRORLEVEL% "npm ci"

rem ── 2. Frontend: lint ───────────────────────────────────────
call :header "Frontend — ESLint (--max-warnings=0)"
npx eslint src --max-warnings=0
call :check %ERRORLEVEL% "ESLint"

rem ── 3. Frontend: build ──────────────────────────────────────
call :header "Frontend — Build"
npm run build
call :check %ERRORLEVEL% "npm run build"

rem ── 4. Frontend: test + coverage ────────────────────────────
call :header "Frontend — Tests with coverage"
npm run test:coverage
call :check %ERRORLEVEL% "npm run test:coverage"

rem ── 5. Backend: restore ─────────────────────────────────────
call :header "Backend — dotnet restore"
cd /d "%BACKEND%"
dotnet restore GameServer.sln
call :check %ERRORLEVEL% "dotnet restore"

rem ── 6. Backend: build ───────────────────────────────────────
call :header "Backend — dotnet build (Release)"
dotnet build GameServer.sln --configuration Release --no-restore
call :check %ERRORLEVEL% "dotnet build"

rem ── 7. Backend: test + coverage ─────────────────────────────
call :header "Backend — Tests with coverage"
dotnet test GameServer.sln --configuration Release --no-build --verbosity normal --collect:"XPlat Code Coverage" --results-directory .\coverage
call :check %ERRORLEVEL% "dotnet test"

rem ── All done ─────────────────────────────────────────────────
echo.
echo %GREEN%%BOLD%════════════════════════════════════════%RESET%
echo %GREEN%%BOLD%  All checks passed. Safe to commit.   %RESET%
echo %GREEN%%BOLD%════════════════════════════════════════%RESET%
echo.
exit /b 0
