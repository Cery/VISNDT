# 662.1 Admin journey validation — Governance pool + full review flow on controlled test record (reverted after)
$ErrorActionPreference = 'Stop'
$api = 'http://localhost:4000/api/v1'
$cookie = 'f:\Desktop\VISNDT\VISNDT\database\_admin_cookies.txt'
$dir = 'f:\Desktop\VISNDT\VISNDT\database'
$out = "$dir\_6621_admin_out.txt"
$log = New-Object System.Collections.Generic.List[string]
$step = 0

[System.IO.File]::WriteAllText("$dir\_login.json", '{"email":"demo.admin@visndt.local","password":"demo123456"}', [System.Text.Encoding]::ASCII)

$csrfResp = curl.exe -s -c $cookie "$api/auth/csrf"
$csrf = ($csrfResp | ConvertFrom-Json).data.csrfToken

$loginResp = curl.exe -s -b $cookie -c $cookie -H "Content-Type: application/json" --data-binary "@$dir\_login.json" "$api/auth/login"
$loginJson = $loginResp | ConvertFrom-Json
$log.Add("Admin login user: $($loginJson.data.user.email) role: $($loginJson.data.user.role)")
$log.Add("")

# STEP 1: List governance pool (all statuses)
$step++
$pool = curl.exe -s -b $cookie "$api/admin/supplier-products?page=1&pageSize=20" | ConvertFrom-Json
$log.Add("=== STEP 1: Admin Governance Pool (all) — request #$step ===")
if ($pool.data.items) {
  $log.Add("Total in pool: $($pool.data.total) | items returned: $($pool.data.items.Count)")
  foreach ($sp in $pool.data.items) {
    $log.Add(("  - " + $sp.modelNumber + " | " + $sp.status + " | brand=" + $sp.brand + " | series=" + $sp.series + " | org=" + $sp.organization.name))
  }
} else {
  $log.Add(($pool | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(800, ($pool | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

# STEP 2: Filter by status SUBMITTED (pending review queue)
$step++
$submitted = curl.exe -s -b $cookie "$api/admin/supplier-products?status=SUBMITTED&page=1&pageSize=20" | ConvertFrom-Json
$log.Add("=== STEP 2: Filter SUBMITTED (review queue) — request #$step ===")
if ($submitted.data.items) {
  $log.Add("SUBMITTED count: $($submitted.data.total)")
  foreach ($sp in $submitted.data.items) {
    $log.Add(("  - " + $sp.modelNumber + " | " + $sp.status + " | org=" + $sp.organization.name))
  }
} else {
  $log.Add(($submitted | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(800, ($submitted | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

# STEP 3: Open detail of the SUBMITTED test record
$testId = '2b3ae93e-741c-4461-b1b8-03d334059f40'  # MIC-5000-BASE (SUBMITTED) — controlled test record
$step++
$detail = curl.exe -s -b $cookie "$api/admin/supplier-products/$testId" | ConvertFrom-Json
$log.Add("=== STEP 3: Open Detail (MIC-5000-BASE) — request #$step ===")
if ($detail.data) {
  $d = $detail.data
  $log.Add("  modelNumber=$($d.modelNumber) | brand=$($d.brand) | series=$($d.series) | status=$($d.status)")
  $log.Add("  platformProduct=$($d.platformProduct.name) | org=$($d.organization.name)")
  $media = if ($d.media) { $d.media.Count } else { 0 }
  $params = if ($d.parameters) { $d.parameters.Count } else { 0 }
  $offers = if ($d.offers) { $d.offers.Count } else { 0 }
  $log.Add("  media=$media | parameters=$params | offers=$offers")
} else {
  $log.Add(($detail | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(800, ($detail | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

# STEP 4: Begin review (SUBMITTED -> REVIEWING)
$step++
$rev = curl.exe -s -b $cookie -H "X-CSRF-Token: $csrf" -X POST "$api/admin/supplier-products/$testId/review" | ConvertFrom-Json
$log.Add("=== STEP 4: Begin Review (SUBMITTED->REVIEWING) — request #$step | msg=$($rev.message) ===")
$log.Add("")

# STEP 5: Approve (REVIEWING -> APPROVED)
$step++
$appr = curl.exe -s -b $cookie -H "X-CSRF-Token: $csrf" -X POST "$api/admin/supplier-products/$testId/approve" | ConvertFrom-Json
$log.Add("=== STEP 5: Approve (REVIEWING->APPROVED) — request #$step | msg=$($appr.message) ===")
$log.Add("")

# STEP 6: Publish (APPROVED -> PUBLISHED)
$step++
$pub = curl.exe -s -b $cookie -H "X-CSRF-Token: $csrf" -X POST "$api/admin/supplier-products/$testId/publish" | ConvertFrom-Json
$log.Add("=== STEP 6: Publish (APPROVED->PUBLISHED) — request #$step | msg=$($pub.message) ===")
$log.Add("")

# STEP 7: Verify published appears in search (published boundary check)
$step++
$search = curl.exe -s -b $cookie "$api/search?type=supplier-product&q=&brand=%E6%98%8E%E8%A7%86&page=1&pageSize=50" | ConvertFrom-Json
$log.Add("=== STEP 7: Verify in Unified Search (type=supplier-product, brand=明视) — request #$step ===")
if ($search.data.supplierProducts) {
  $found = $false
  foreach ($sp in $search.data.supplierProducts.items) {
    if ($sp.supplierProduct.id -eq $testId) { $found = $true }
  }
  $log.Add("  Published test record found in search: $found | supplierProducts total: $($search.data.supplierProducts.total)")
  foreach ($sp in $search.data.supplierProducts.items) {
    $log.Add(("    - " + $sp.supplierProduct.modelNumber + " | " + $sp.supplierProduct.status + " | offers=" + $sp.commercialSummary.offerCount))
  }
} else {
  $log.Add(($search | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(900, ($search | ConvertTo-Json -Compress -Depth 5).Length)))
}
$log.Add("")

$log.Add("=== REVIEW INTERACTION COST ===")
$log.Add("  API calls from governance list to PUBLISHED: $step")
$log.Add("  Flow: List -> Filter -> Detail -> Review -> Approve -> Publish -> Search-verify")
$log.Add("  Minimal human clicks (excluding login/navigation): ~6")

[System.IO.File]::WriteAllText($out, ($log -join "`r`n"), [System.Text.Encoding]::UTF8)
Write-Output "Written to $out"
