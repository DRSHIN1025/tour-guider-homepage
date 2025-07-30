Set WshShell = CreateObject("WScript.Shell")

' 배치 파일의 절대 경로 지정
strBatchFile = "C:\Users\drshi\OneDrive\바탕 화면\홈페이지\tour-guider-homepage\telegram_bot\run_telegram_bot.bat"

' 배치 파일을 숨겨진 창으로 실행
WshShell.Run strBatchFile, 0, False 