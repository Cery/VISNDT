$files = Get-ChildItem -Path 'F:\Desktop\VISNDT\VISNDT\apps\web\src' -Recurse -Include *.ts,*.tsx
Write-Output '=== queryKey categories ==='
$files | Select-String -Pattern "queryKey[: ]+[[]('|\"")categories" | ForEach-Object { '{0}:{1}: {2}' -f $_.Path, $_.LineNumber, $_.Line.Trim() }
Write-Output '=== featured-products ==='
$files | Select-String -Pattern "featured-products" | Where-Object { $_.Line -match 'queryKey' } | ForEach-Object { '{0}:{1}: {2}' -f $_.Path, $_.LineNumber, $_.Line.Trim() }