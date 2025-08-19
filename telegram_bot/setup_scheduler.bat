@echo off
title Telegram Bot Scheduler Setup
chcp 65001 >nul

echo ========================================
echo   Telegram Bot Scheduler Setup
echo ========================================
echo.

REM 현재 디렉토리 경로 가져오기
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

echo 📁 스크립트 경로: %SCRIPT_DIR%
echo.

REM 작업 스케줄러에 등록할 작업 이름
set "TASK_NAME=TelegramAutoMessageBot"

echo 🔧 작업 스케줄러에 텔레그램 봇을 등록합니다...
echo.

REM 기존 작업이 있다면 삭제
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1

REM 새 작업 생성 (시스템 시작 시 실행)
schtasks /create /tn "%TASK_NAME%" /tr "\"%SCRIPT_DIR%\run_telegram_bot_improved.bat\"" /sc onstart /ru "SYSTEM" /f

if errorlevel 1 (
    echo ❌ 작업 스케줄러 등록에 실패했습니다.
    echo 관리자 권한으로 실행해보세요.
    pause
    exit /b 1
)

echo ✅ 작업 스케줄러 등록 완료!
echo.
echo 📋 등록된 작업 정보:
echo    - 작업 이름: %TASK_NAME%
echo    - 실행 파일: run_telegram_bot_improved.bat
echo    - 실행 조건: 시스템 시작 시
echo.
echo 🔍 작업 확인 방법:
echo    schtasks /query /tn "%TASK_NAME%"
echo.
echo 🗑️  작업 삭제 방법:
echo    schtasks /delete /tn "%TASK_NAME%" /f
echo.

pause 