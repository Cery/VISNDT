# 662.1 Buyer journey validation helper — uses body files
$ErrorActionPreference = 'Stop'
$api = 'http://localhost:4000/api/v1'
$cookie = 'f:\Desktop\VISNDT\VISNDT\database\_buyer_cookies.txt'
$dir = 'f:\Desktop\VISNDT\VISNDT\database'

# Write login body (ASCII only)
[System.IO.File]::WriteAllText("$dir\_login.json", '{"email":"demo.buyer.01@visndt.local","password":"demo123456"}', [System.Text.Encoding]::ASCII)

# 1. CSRF
$csrfResp = curl.exe -s -c $cookie "$api/auth/csrf"
$csrf = ($csrfResp | ConvertFrom-Json).data.csrfToken
Write-Output "CSRF obtained: $($csrf.Substring(0,8))..."

# 2. Login as buyer
$loginResp = curl.exe -s -b $cookie -c $cookie -H "Content-Type: application/json" --data-binary "@$dir\_login.json" "$api/auth/login"
Write-Output "Login response: $($loginResp.Substring(0, [Math]::Min(150, $loginResp.Length)))"

# 3. Write inquiry body (ASCII only message)
$inqJson = '{"productId":"933ed0db-08e7-4ede-a2c2-ebb1e8521cd1","offerId":"93b84b49-d918-4698-8648-690fa8688cb7","organizationId":"926d5a96-e1be-455c-8d58-8f4a79b6735d","supplierProductId":"a9f9aca5-b387-4b0f-83a4-ff2a5b1ec896","name":"6621 Scale Buyer","email":"buyer.scale@visndt.local","phone":"13800006621","message":"6621 scale validation: VX-6000-PRO model context inquiry"}'
[System.IO.File]::WriteAllText("$dir\_inquiry.json", $inqJson, [System.Text.Encoding]::ASCII)

$inqResp = curl.exe -s -b $cookie -c $cookie -H "X-CSRF-Token: $csrf" -H "Content-Type: application/json" --data-binary "@$dir\_inquiry.json" "$api/inquiries"
Write-Output "Inquiry response: $($inqResp.Substring(0, [Math]::Min(600, $inqResp.Length)))"

# 4. Verify inquiry mine
$mineResp = curl.exe -s -b $cookie "$api/inquiries/mine"
Write-Output "Inquiry mine: $($mineResp.Substring(0, [Math]::Min(400, $mineResp.Length)))"
