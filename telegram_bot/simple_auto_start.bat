@echo off
title Simple Auto Start Setup
chcp 65001 >nul

echo ========================================
echo   Simple Auto Start Setup
echo ========================================
echo.

REM 현재 디렉토리 경로 가져오기
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

echo 📁 스크립트 경로: %SCRIPT_DIR%
echo.

REM 시작 프로그램 폴더 경로
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo 🔧 간단한 자동 실행 설정을 진행합니다...
echo.

REM 기존 파일들 제거
if exist "%STARTUP_FOLDER%\run_telegram_bot.vbs" (
    del "%STARTUP_FOLDER%\run_telegram_bot.vbs"
    echo 🗑️  기존 VBS 파일 제거 완료
)

if exist "%STARTUP_FOLDER%\TelegramBotAutoStart.lnk" (
    del "%STARTUP_FOLDER%\TelegramBotAutoStart.lnk"
    echo 🗑️  기존 바로가기 제거 완료
)

REM 개선된 배치 파일을 시작 프로그램에 복사
copy "%SCRIPT_DIR%\run_telegram_bot_improved.bat" "%STARTUP_FOLDER%\TelegramBotStartup.bat"

if exist "%STARTUP_FOLDER%\TelegramBotStartup.bat" (
    echo ✅ 자동 실행 설정 완료!
    echo.
    echo 📋 등록된 정보:
    echo    - 파일: TelegramBotStartup.bat
    echo    - 위치: %STARTUP_FOLDER%
    echo    - 실행: 시스템 시작 시 자동 실행
    echo.
    echo 🔍 확인 방법:
    echo    시작 프로그램 폴더에서 "TelegramBotStartup.bat" 확인
    echo.
    echo 🗑️  제거 방법:
    echo    시작 프로그램 폴더에서 "TelegramBotStartup.bat" 삭제
    echo.
    echo 📝 참고: 이 방법은 가장 간단하고 안정적입니다.
) else (
    echo ❌ 자동 실행 설정에 실패했습니다.
    echo 관리자 권한으로 실행해보세요.
)

echo.
pause 