param([int]$Dev=3000, [int]$UI=3100)
# 기존 설정 제거 후 포트 고정 stagewise.json 생성(있어도 덮어씀)
$cfg = @{ devPort = $Dev; uiPort = $UI } | ConvertTo-Json
Set-Content -Encoding UTF8 .\stagewise.json $cfg
while($true){
  try{
    npx stagewise@latest 2>&1 | Tee-Object -FilePath ".\.logs\stagewise.log"
  }catch{}
  Start-Sleep -Seconds 1
}
