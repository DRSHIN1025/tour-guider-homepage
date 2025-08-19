@echo off
title Telegram Auto Message Bot (24h Cooldown)
chcp 65001 >nul

REM 스크립트가 있는 원본 디렉토리로 이동 (절대 경로 사용)
cd /d "C:\Users\drshi\OneDrive\바탕 화면\홈페이지\tour-guider-homepage\telegram_bot"

echo ========================================
echo   Telegram Auto Message Bot (24h Cooldown)
echo ========================================
echo.

REM Python이 설치되어 있는지 확인
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python이 설치되어 있지 않거나 PATH에 없습니다.
    echo Python을 설치하고 PATH에 추가해주세요.
    pause
    exit /b 1
)

echo ✅ Python 확인 완료
echo 📁 작업 디렉토리: %CD%
echo.

REM 파이썬 스크립트 실행 (24시간 1분 쿨타임)
echo 🤖 텔레그램 봇을 시작합니다 (24시간 1분 쿨타임)...
python userbot_sender_improved.py

REM 실행 결과 확인
if errorlevel 1 (
    echo.
    echo ❌ 봇 실행 중 오류가 발생했습니다.
    echo 오류 코드: %errorlevel%
) else (
    echo.
    echo ✅ 봇 실행이 완료되었습니다.
)

echo.
echo ========================================
echo Execution completed. Press any key to close.
echo ========================================
pause > nul
exit











