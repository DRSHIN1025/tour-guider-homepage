@echo off
title Telegram Auto Message Bot

REM 배치 파일이 있는 디렉토리로 이동하여 작업 경로 문제를 해결합니다.
cd /d "%~dp0"

REM 파이썬 실행 파일의 전체 경로
set PYTHON_EXE="C:\Users\drshi\AppData\Local\Programs\Python\Python313\python.exe"

REM 파이썬 스크립트 파일 이름
set SCRIPT_FILE="userbot_sender.py"

echo ========================================
echo   Telegram Auto Message Bot (Startup)
echo ========================================
echo.

REM 스크립트 실행
%PYTHON_EXE% %SCRIPT_FILE%

echo.
echo ========================================
echo Execution completed. Press any key to close.
echo ========================================
pause > nul
exit 