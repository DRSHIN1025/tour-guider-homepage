Set WshShell = CreateObject("WScript.Shell")

' 현재 스크립트가 있는 디렉토리로 이동 (상대 경로 사용)
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Python 스크립트를 직접 실행
WshShell.Run "python userbot_sender.py", 0, False 