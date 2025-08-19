# 텔레그램 자동 메시지 봇 실행 스크립트
# 스크립트가 있는 디렉토리로 이동
Set-Location $PSScriptRoot

# Python 스크립트 실행
python userbot_sender.py

# 실행 완료 후 잠시 대기
Start-Sleep -Seconds 5 