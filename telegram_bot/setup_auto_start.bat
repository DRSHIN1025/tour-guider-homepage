@echo off
title Telegram Bot Auto Start Setup
chcp 65001 >nul

echo ========================================
echo   Telegram Bot Auto Start Setup
echo ========================================
echo.

REM 현재 디렉토리 경로 가져오기
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

echo 📁 스크립트 경로: %SCRIPT_DIR%
echo.

REM 시작 프로그램 폴더 경로
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo 🔧 시작 프로그램에 텔레그램 봇을 등록합니다...
echo.

REM PowerShell 스크립트 바로가기 생성
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\create_shortcut.vbs"
echo sLinkFile = "%STARTUP_FOLDER%\TelegramBotAutoStart.lnk" >> "%TEMP%\create_shortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\create_shortcut.vbs"
echo oLink.TargetPath = "powershell.exe" >> "%TEMP%\create_shortcut.vbs"
echo oLink.Arguments = "-ExecutionPolicy Bypass -File ""%SCRIPT_DIR%\auto_start.ps1""" >> "%TEMP%\create_shortcut.vbs"
echo oLink.WorkingDirectory = "%SCRIPT_DIR%" >> "%TEMP%\create_shortcut.vbs"
echo oLink.Description = "Telegram Bot Auto Start" >> "%TEMP%\create_shortcut.vbs"
echo oLink.WindowStyle = 7 >> "%TEMP%\create_shortcut.vbs"
echo oLink.Save >> "%TEMP%\create_shortcut.vbs"

REM VBS 스크립트 실행
cscript //nologo "%TEMP%\create_shortcut.vbs"

REM 임시 파일 삭제
del "%TEMP%\create_shortcut.vbs"

if exist "%STARTUP_FOLDER%\TelegramBotAutoStart.lnk" (
    echo ✅ 자동 실행 설정 완료!
    echo.
    echo 📋 등록된 정보:
    echo    - 바로가기: TelegramBotAutoStart.lnk
    echo    - 실행 파일: auto_start.ps1
    echo    - 위치: %STARTUP_FOLDER%
    echo.
    echo 🔍 확인 방법:
    echo    시작 프로그램 폴더에서 "TelegramBotAutoStart" 바로가기 확인
    echo.
    echo 🗑️  제거 방법:
    echo    시작 프로그램 폴더에서 "TelegramBotAutoStart.lnk" 삭제
) else (
    echo ❌ 자동 실행 설정에 실패했습니다.
    echo 관리자 권한으로 실행해보세요.
)

echo.
pause 