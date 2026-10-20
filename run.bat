@echo off
title FINORA - Neon Fintech Experience
echo ========================================================
echo               FINORA - Starting Up...
echo ========================================================
set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
cd /d "%~dp0"
echo Starting development server...
start http://localhost:5173/
npm run dev
pause
