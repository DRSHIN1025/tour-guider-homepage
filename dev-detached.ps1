param([int]$Port=3000)
$env:NEXT_DISABLE_TURBOPACK="1"
while($true){
  try{
    npx next dev --port $Port --hostname 127.0.0.1 2>&1 `
      | Tee-Object -FilePath ".\.logs\next-dev.log"
  }catch{}
  Start-Sleep -Seconds 1
}
