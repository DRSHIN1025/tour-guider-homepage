# 텔레그램 자동 메시지 봇 - 자동 실행 스크립트
# 이 스크립트는 시스템 시작 시 자동으로 실행됩니다.

# 스크립트가 있는 디렉토리로 이동
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 로그 파일 설정
$logFile = Join-Path $scriptPath "logs\startup_$(Get-Date -Format 'yyyyMMdd').log"
$logDir = Split-Path $logFile -Parent

# 로그 디렉토리가 없으면 생성
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# 로그 함수
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Add-Content -Path $logFile -Value $logMessage
    Write-Host $logMessage
}

# 시작 로그
Write-Log "=== 텔레그램 봇 자동 실행 시작 ==="
Write-Log "작업 디렉토리: $scriptPath"

# Python이 설치되어 있는지 확인
try {
    $pythonVersion = python --version 2>&1
    Write-Log "Python 확인: $pythonVersion"
} catch {
    Write-Log "오류: Python이 설치되어 있지 않습니다."
    exit 1
}

# 30초 대기 (시스템 완전 부팅 대기)
Write-Log "시스템 부팅 완료 대기 중... (30초)"
Start-Sleep -Seconds 30

# 텔레그램 봇 실행
Write-Log "텔레그램 봇 실행 시작..."
try {
    $result = python userbot_sender_improved.py 2>&1
    Write-Log "봇 실행 완료: $result"
} catch {
    Write-Log "오류: 봇 실행 중 문제 발생 - $($_.Exception.Message)"
}

Write-Log "=== 텔레그램 봇 자동 실행 종료 ===" 