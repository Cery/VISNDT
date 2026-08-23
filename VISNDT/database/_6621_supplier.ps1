# 662.1 Supplier journey validation — read-only on current data
$ErrorActionPreference = 'Stop'
$api = 'http://localhost:4000/api/v1'
$cookie = 'f:\Desktop\VISNDT\VISNDT\database\_supplier_cookies.txt'
$dir = 'f:\Desktop\VISNDT\VISNDT\database'

[System.IO.File]::WriteAllText("$dir\_login.json", '{"email":"demo.supplier.01@visndt.local","password":"demo123456"}', [System.Text.Encoding]::ASCII)

$csrfResp = curl.exe -s -c $cookie "$api/auth/csrf"
$csrf = ($csrfResp | ConvertFrom-Json).data.csrfToken

$loginResp = curl.exe -s -b $cookie -c $cookie -H "Content-Type: application/json" --data-binary "@$dir\_login.json" "$api/auth/login"
$loginJson = $loginResp | ConvertFrom-Json
Write-Output "Supplier login user: $($loginJson.data.user.email) org: $($loginJson.data.user.organizationId)"

# Supplier overview
$overview = curl.exe -s -b $cookie "$api/workspace/supplier/overview" | ConvertFrom-Json
Write-Output "Supplier overview: $(($overview.data | ConvertTo-Json -Compress -Depth 4).Substring(0, [Math]::Min(400, ($overview.data | ConvertTo-Json -Compress -Depth 4).Length)))"

# Supplier runtime products (明视's SPs)
$runtime = curl.exe -s -b $cookie "$api/workspace/supplier/runtime/products" | ConvertFrom-Json
Write-Output "=== Supplier Runtime Products ==="
if ($runtime.data.items) {
  foreach ($sp in $runtime.data.items) {
    Write-Output ("  - " + $sp.modelNumber + " | status=" + $sp.status + " | brand=" + $sp.brand + " | series=" + $sp.series)
  }
  Write-Output "Total: $($runtime.data.items.Count)"
} else {
  Write-Output (($runtime | ConvertTo-Json -Compress -Depth 5).Substring(0, [Math]::Min(800, ($runtime | ConvertTo-Json -Compress -Depth 5).Length)))
}
