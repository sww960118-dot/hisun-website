# Build and create a zip whose root is index.html + assets (for Netlify drag-and-drop).
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

npm run build

$zip = Join-Path $env:TEMP "hisun-netlify-upload.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }

$dist = Join-Path $PSScriptRoot "dist"
$items = @(Get-ChildItem -LiteralPath $dist -Force)
if ($items.Count -eq 0) { throw "dist is empty after build." }

$assetJs = Get-ChildItem -Path (Join-Path $dist "assets") -Filter "*.js" -File -ErrorAction SilentlyContinue
if (-not $assetJs) {
  throw "dist/assets has no .js bundle — build output is incomplete. Do not deploy this folder."
}

Compress-Archive -Path ($items | ForEach-Object { $_.FullName }) -DestinationPath $zip -Force

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipRead = [System.IO.Compression.ZipFile]::OpenRead($zip)
try {
  $names = @($zipRead.Entries | ForEach-Object { $_.FullName.Replace("\", "/") })
  if ("index.html" -notin $names) { throw "Zip missing index.html at root." }
  $hasBundle = $zipRead.Entries | Where-Object {
    $n = $_.FullName.Replace("\", "/")
    $n -match '^assets/.+\.js$'
  }
  if (-not $hasBundle) {
    throw "Zip missing assets/*.js — partial uploads cause a blank page on Netlify."
  }
} finally {
  $zipRead.Dispose()
}

Write-Host ""
Write-Host "Netlify: Site configuration -> Drag and drop this zip (root must contain index.html + assets/):"
Write-Host $zip
Write-Host ""
Start-Process explorer.exe -ArgumentList "/select,`"$zip`""
