@echo off
echo Starting Experiment Platform (Fast Mode)...
start "Backend - GameServer.Api" cmd /k "cd /d %~dp0backend && dotnet run --project src/GameServer.Api"
timeout /t 3 /nobreak > nul
start "Frontend - React App" cmd /k "cd /d %~dp0frontend && npm start"
echo Both apps starting... Press any key to close this launcher.
pause > nul