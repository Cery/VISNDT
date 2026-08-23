# 662.1 Post-scale regression — search still returns only PUBLISHED (6 baseline, no SCALE DRAFT pollution)
$ErrorActionPreference = 'Stop'
$api = 'http://localhost:4000/api/v1'
$cookie = 'f:\Desktop\VISNDT\VISNDT\database\_buyer_cookies.txt'
$dir = 'f:\Desktop\VISNDT\VISNDT\database'
$out = "$dir\_6621_search_verify.txt"
$log = New-Object System.Collections.Generic.List[string]

$raw = curl.exe -s -b $cookie "$api/search?type=supplier-product&q=&page=1&pageSize=50"
$j = $raw | ConvertFrom-Json
$log.Add("=== Post-scale Regression: supplierProducts in Unified Search ===")
if ($j.data.supplierProducts) {
  $log.Add("total supplierProducts: $($j.data.supplierProducts.total)")
  foreach ($sp in $j.data.supplierProducts.items) {
    $log.Add(("  - " + $sp.supplierProduct.brand + " | " + $sp.supplierProduct.series + " | " + $sp.supplierProduct.modelNumber + " | " + $sp.supplierProduct.status + " | offers=" + $sp.commercialSummary.offerCount))
  }
  $log.Add("")
  $log.Add("SCALE DRAFT pollution check: " + (($j.data.supplierProducts.items | Where-Object { $_.supplierProduct.modelNumber -match 'SCALE|BASE|LITE|M\b|IP\b|ADV|MAX|C$' }).Count) + " suspicious entries")
} else {
  $log.Add("NO supplierProducts key")
}

[System.IO.File]::WriteAllText($out, ($log -join "`r`n"), [System.Text.Encoding]::UTF8)
Write-Output "Written to $out"
