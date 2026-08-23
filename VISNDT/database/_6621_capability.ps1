# 662.1 Level 3 — VX-6000 capability detail multi-supplier comparison (corrected parsing)
$ErrorActionPreference = 'Stop'
$api = 'http://localhost:4000/api/v1'
$cookie = 'f:\Desktop\VISNDT\VISNDT\database\_buyer_cookies.txt'
$dir = 'f:\Desktop\VISNDT\VISNDT\database'
$out = "$dir\_6621_capability_out.txt"
$log = New-Object System.Collections.Generic.List[string]

$productId = '933ed0db-08e7-4ede-a2c2-ebb1e8521cd1'
$resp = curl.exe -s -b $cookie "$api/capabilities/$productId" | ConvertFrom-Json
$log.Add("=== Capability Detail: VX-6000 (Level 3 multi-supplier) ===")
if ($resp.data) {
  $d = $resp.data
  $pp = $d.platformProduct
  $log.Add("platformProduct: $($pp.name) | status=$($pp.status)")
  if ($d.supplierProducts) {
    $log.Add("supplierProducts count: $($d.supplierProducts.Count)")
    foreach ($entry in $d.supplierProducts) {
      $sp = $entry.supplierProduct
      $org = if ($sp.organization) { $sp.organization.name } else { "?" }
      $cs = $sp.commercialSummary
      $offerTitles = ($entry.offers | ForEach-Object { "$($_.title)($($_.price) $($_.currency))" }) -join "; "
      $log.Add(("  - [SP] " + $sp.brand + " | " + $sp.series + " | " + $sp.modelNumber + " | status=" + $sp.status))
      $log.Add(("      org=" + $org + " | media=" + $sp.media.Count + " | offerSummary=" + $cs.offerCount + "/" + $cs.activeOfferCount + " | price=" + $cs.priceFrom + "-" + $cs.priceTo + " " + $cs.currency))
      $log.Add(("      offers: " + $offerTitles))
    }
  }
} else {
  $log.Add(($resp | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(1000, ($resp | ConvertTo-Json -Compress -Depth 5).Length)))
}

[System.IO.File]::WriteAllText($out, ($log -join "`r`n"), [System.Text.Encoding]::UTF8)
Write-Output "Written to $out"
