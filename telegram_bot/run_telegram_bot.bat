@echo off
title Telegram Auto Message Bot

REM 배치 파일이 있는 디렉토리로 이동
cd /d "%~dp0"

echo ========================================
echo   Telegram Auto Message Bot (Startup)
echo ========================================
echo.

REM 파이썬을 PATH에서 찾아서 실행 (전체 경로 대신 간단하게)
python userbot_sender.py

echo.
echo ========================================
echo Execution completed. Press any key to close.
echo ========================================
pause > nul
exit 