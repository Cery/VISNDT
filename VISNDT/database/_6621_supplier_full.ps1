# 662.1 Supplier journey FULL validation — writes to _6621_supplier_out.txt
$ErrorActionPreference = 'Stop'
$api = 'http://localhost:4000/api/v1'
$cookie = 'f:\Desktop\VISNDT\VISNDT\database\_supplier_cookies.txt'
$dir = 'f:\Desktop\VISNDT\VISNDT\database'
$out = "$dir\_6621_supplier_out.txt"
$log = New-Object System.Collections.Generic.List[string]

[System.IO.File]::WriteAllText("$dir\_login.json", '{"email":"demo.supplier.01@visndt.local","password":"demo123456"}', [System.Text.Encoding]::ASCII)

$csrfResp = curl.exe -s -c $cookie "$api/auth/csrf"
$csrf = ($csrfResp | ConvertFrom-Json).data.csrfToken

$loginResp = curl.exe -s -b $cookie -c $cookie -H "Content-Type: application/json" --data-binary "@$dir\_login.json" "$api/auth/login"
$loginJson = $loginResp | ConvertFrom-Json
$log.Add("Supplier login user: $($loginJson.data.user.email) org: $($loginJson.data.user.organizationId)")
$log.Add("")

# 1. Runtime Products (all)
$runtime = curl.exe -s -b $cookie "$api/workspace/supplier/runtime/products" | ConvertFrom-Json
$log.Add("=== 1. Supplier Runtime Products ($($runtime.data.data.Count) total) ===")
foreach ($sp in $runtime.data.data) {
  $log.Add(("  - " + $sp.modelNumber + " | status=" + $sp.status + " | brand=" + $sp.brand + " | series=" + $sp.series + " | product=" + $sp.platformProduct.name + " | offers(total/active)=" + $sp.commercialSummary.total + "/" + $sp.commercialSummary.activeCount))
}
$log.Add("")

# 2. Offers list for supplier
$offers = curl.exe -s -b $cookie "$api/offers?pageSize=50" | ConvertFrom-Json
$log.Add("=== 2. Supplier Offers ===")
if ($offers.data.items) {
  foreach ($o in $offers.data.items) {
    $spn = $o.supplierProduct.modelNumber
    $log.Add(("  - " + $spn + " | offer=" + $o.title + " | status=" + $o.status + " | price=" + $o.priceFrom + "-" + $o.priceTo + " " + $o.currency))
  }
  $log.Add("Total: $($offers.data.items.Count)")
} else {
  $log.Add(($offers | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(600, ($offers | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

# 3. Buyer interest (inquiries to this supplier)
$inquiries = curl.exe -s -b $cookie "$api/inquiries/mine?pageSize=50" | ConvertFrom-Json
$log.Add("=== 3. Buyer Interest (Inquiries /mine) ===")
if ($inquiries.data.items) {
  foreach ($inq in $inquiries.data.items) {
    $spid = if ($inq.supplierProductId) { "SP=$($inq.supplierProductId)" } else { "SP=none" }
    $prodName = if ($inq.product) { $inq.product.name } else { "?" }
    $log.Add(("  - from " + $inq.name + " | product=" + $prodName + " | " + $spid + " | created=" + $inq.createdAt))
  }
  $log.Add("Total: $($inquiries.data.items.Count)")
} else {
  $log.Add(($inquiries | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(600, ($inquiries | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

# 3b. Inquiry context for the PUBLISHED SP that received the 662.1 inquiry (VX-6000-PRO)
$spid = 'a9f9aca5-b387-4b0f-83a4-ff2a5b1ec896'
$ctx = curl.exe -s -b $cookie "$api/workspace/supplier/runtime/products/$spid/inquiry-context" | ConvertFrom-Json
$log.Add("=== 3b. Inquiry Context for VX-6000-PRO ===")
if ($ctx.data) {
  $log.Add(($ctx.data | ConvertTo-Json -Compress -Depth 6).Substring(0, [Math]::Min(800, ($ctx.data | ConvertTo-Json -Compress -Depth 6).Length)))
} else {
  $log.Add(($ctx | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(600, ($ctx | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

# 4. RFQ / Responses for supplier
$rfqs = curl.exe -s -b $cookie "$api/rfqs?pageSize=50" | ConvertFrom-Json
$log.Add("=== 4. Supplier RFQs ===")
if ($rfqs.data.items) {
  foreach ($rfq in $rfqs.data.items) {
    $log.Add(("  - " + $rfq.title + " | status=" + $rfq.status + " | deadline=" + $rfq.deadlineAt))
  }
  $log.Add("Total: $($rfqs.data.items.Count)")
} else {
  $log.Add(($rfqs | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(600, ($rfqs | ConvertTo-Json -Compress -Depth 5).Length)))
}

[System.IO.File]::WriteAllText($out, ($log -join "`r`n"), [System.Text.Encoding]::UTF8)
Write-Output "Written to $out"
