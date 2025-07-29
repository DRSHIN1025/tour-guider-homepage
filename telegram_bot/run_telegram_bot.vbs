Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
strBatchFile = strPath & "\run_telegram_bot.bat"

' 배치 파일을 숨겨진 창으로 실행
WshShell.Run strBatchFile, 0, False 