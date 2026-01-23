@echo off
echo Starting Experiment Platform Development Environment...
echo.

:: Start Backend in a new window
echo Starting Backend (.NET API)...
start "Backend - GameServer.Api" cmd /k "cd /d %~dp0backend && dotnet run --project src/GameServer.Api"

:: Give backend a moment to initialize before starting frontend
timeout /t 3 /nobreak > nul

:: Start Frontend in a new window
echo Starting Frontend (React)...
start "Frontend - React App" cmd /k "cd /d %~dp0frontend && npm install && npm start"

echo.
echo Both applications are starting in separate windows.
echo - Backend: https://localhost:5001 (or configured port)
echo - Frontend: http://localhost:3000
echo.
echo Close this window or press any key to exit this launcher.
pause > nul