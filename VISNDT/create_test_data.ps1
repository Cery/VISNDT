$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:4000/api/v1"

# ============================================================
# Step 1: Initialize session and login
# ============================================================
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 1: Login as admin" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Get CSRF token
$csrfResponse = Invoke-RestMethod -Uri "$baseUrl/auth/csrf" -Method Get -WebSession $session -ContentType "application/json"
$csrfToken = $csrfResponse.data.csrfToken
Write-Host "CSRF Token: $csrfToken" -ForegroundColor Green

# Login
$loginBody = @{email="admin@visndt.com";password="admin123456"} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -WebSession $session -Body $loginBody -ContentType "application/json" -Headers @{"X-CSRF-Token"=$csrfToken}
Write-Host "Login: $($loginResponse.success) - $($loginResponse.message)" -ForegroundColor Green

# Helper function to get fresh CSRF token
function Get-CsrfToken {
    $r = Invoke-RestMethod -Uri "$baseUrl/auth/csrf" -Method Get -WebSession $session -ContentType "application/json"
    return $r.data.csrfToken
}

# Helper function for API calls
function Invoke-API {
    param([string]$Method, [string]$Path, $Body)
    $csrf = Get-CsrfToken
    $headers = @{"X-CSRF-Token"=$csrf; "Content-Type"="application/json"}
    $params = @{
        Uri = "$baseUrl$Path"
        Method = $Method
        WebSession = $session
        Headers = $headers
        ContentType = "application/json"
    }
    if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
    try {
        $result = Invoke-RestMethod @params
        return $result
    } catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
        return $null
    }
}

# ============================================================
# Step 2: Create organizations
# ============================================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 2: Create supplier organizations" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$org1 = Invoke-API -Method Post -Path "/organizations" -Body @{
    name = "上海精仪检测技术有限公司"
    type = "MANUFACTURER"
    description = "上海精仪检测技术有限公司 - 专业工业检测设备供应商"
    status = "ACTIVE"
}
if ($org1) {
    Write-Host "Organization 1 created: $($org1.data.name) (ID: $($org1.data.id))" -ForegroundColor Green
    $org1Id = $org1.data.id
} else {
    Write-Host "Failed to create org1, trying alternative fields..." -ForegroundColor Yellow
    $org1Alt = Invoke-API -Method Post -Path "/organizations" -Body @{
        name = "上海精仪检测技术有限公司"
        type = "MANUFACTURER"
    }
    if ($org1Alt) { Write-Host "Org1 created (alt): $($org1Alt | ConvertTo-Json -Depth 5)" -ForegroundColor Green; $org1Id = $org1Alt.data.id }
    else { $org1Id = $null }
}

$org2 = Invoke-API -Method Post -Path "/organizations" -Body @{
    name = "广州华工检测设备有限公司"
    type = "MANUFACTURER"
    description = "广州华工检测设备有限公司 - 华南地区领先检测设备制造商"
    status = "ACTIVE"
}
if ($org2) {
    Write-Host "Organization 2 created: $($org2.data.name) (ID: $($org2.data.id))" -ForegroundColor Green
    $org2Id = $org2.data.id
} else {
    Write-Host "Failed to create org2, trying alternative..." -ForegroundColor Yellow
    $org2Alt = Invoke-API -Method Post -Path "/organizations" -Body @{
        name = "广州华工检测设备有限公司"
        type = "MANUFACTURER"
    }
    if ($org2Alt) { Write-Host "Org2 created (alt): $($org2Alt | ConvertTo-Json -Depth 5)" -ForegroundColor Green; $org2Id = $org2Alt.data.id }
    else { $org2Id = $null }
}

Write-Host "Org1 ID: $org1Id" -ForegroundColor Green
Write-Host "Org2 ID: $org2Id" -ForegroundColor Green

# ============================================================
# Step 3: Create supplier users
# ============================================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 3: Create supplier users" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Try different user creation payloads
function Create-User {
    param($email, $name, $orgId, $password="Test123456")
    
    # Try standard payload
    $userBody = @{
        email = $email
        name = $name
        password = $password
        organizationId = $orgId
        role = "ADMIN"
    }
    $result = Invoke-API -Method Post -Path "/users" -Body $userBody
    if ($result -and $result.success) { return $result }
    
    # Try without role
    $userBody2 = @{
        email = $email
        name = $name
        password = $password
        organizationId = $orgId
    }
    $result = Invoke-API -Method Post -Path "/users" -Body $userBody2
    if ($result -and $result.success) { return $result }
    
    # Try with organizationMember role
    $userBody3 = @{
        email = $email
        name = $name
        password = $password
        organizationId = $orgId
        role = "organizationMember"
    }
    $result = Invoke-API -Method Post -Path "/users" -Body $userBody3
    if ($result -and $result.success) { return $result }
    
    return $null
}

$user1 = Create-User -email "chenwei@jingyi.com" -name "陈伟" -orgId $org1Id
if ($user1) { Write-Host "User 1: chenwei@jingyi.com (陈伟) - Created (ID: $($user1.data.id))" -ForegroundColor Green; $user1Id = $user1.data.id }
else { Write-Host "User 1: chenwei@jingyi.com - FAILED" -ForegroundColor Red; $user1Id = $null }

$user2 = Create-User -email "liuna@jingyi.com" -name "刘娜" -orgId $org1Id
if ($user2) { Write-Host "User 2: liuna@jingyi.com (刘娜) - Created (ID: $($user2.data.id))" -ForegroundColor Green; $user2Id = $user2.data.id }
else { Write-Host "User 2: liuna@jingyi.com - FAILED" -ForegroundColor Red; $user2Id = $null }

$user3 = Create-User -email "huangqiang@huagong.com" -name "黄强" -orgId $org2Id
if ($user3) { Write-Host "User 3: huangqiang@huagong.com (黄强) - Created (ID: $($user3.data.id))" -ForegroundColor Green; $user3Id = $user3.data.id }
else { Write-Host "User 3: huangqiang@huagong.com - FAILED" -ForegroundColor Red; $user3Id = $null }

$user4 = Create-User -email "zhoumin@huagong.com" -name "周敏" -orgId $org2Id
if ($user4) { Write-Host "User 4: zhoumin@huagong.com (周敏) - Created (ID: $($user4.data.id))" -ForegroundColor Green; $user4Id = $user4.data.id }
else { Write-Host "User 4: zhoumin@huagong.com - FAILED" -ForegroundColor Red; $user4Id = $null }

# ============================================================
# Step 4: Get existing products and create offers
# ============================================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 4: Get existing products & create offers" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$productsResponse = Invoke-API -Method Get -Path "/products"
if ($productsResponse -and $productsResponse.success) {
    $products = $productsResponse.data
    Write-Host "Found $($products.Count) products:"
    $productMap = @{}
    foreach ($p in $products) {
        Write-Host "  - $($p.name) (ID: $($p.id))" -ForegroundColor Yellow
        $productMap[$p.name] = $p.id
    }
} else {
    Write-Host "Failed to get products. Trying /products/list..." -ForegroundColor Yellow
    $productsResponse = Invoke-API -Method Get -Path "/products/list"
    if ($productsResponse) {
        $products = $productsResponse.data
        $productMap = @{}
        foreach ($p in $products) {
            Write-Host "  - $($p.name) (ID: $($p.id))" -ForegroundColor Yellow
            $productMap[$p.name] = $p.id
        }
    }
}

# Create offers
Write-Host ""
Write-Host "Creating offers..." -ForegroundColor Cyan

function Create-Offer {
    param($orgId, $productId, $title, $description)
    $body = @{
        organizationId = $orgId
        productId = $productId
        title = $title
        description = $description
        status = "ACTIVE"
    }
    $result = Invoke-API -Method Post -Path "/offers" -Body $body
    if ($result -and $result.success) { return $result }
    # Try with DRAFT status
    $body.status = "DRAFT"
    $result = Invoke-API -Method Post -Path "/offers" -Body $body
    return $result
}

$offerCount = 0
if ($productMap.ContainsKey("VX-6000") -and $org1Id) {
    $offer1 = Create-Offer -orgId $org1Id -productId $productMap["VX-6000"] -title "上海精仪 VX-6000 视频内窥镜报价" -description "上海精仪检测技术有限公司提供的VX-6000高清视频内窥镜产品报价"
    if ($offer1) { Write-Host "Offer 1: VX-6000 -> 上海精仪 - Created (ID: $($offer1.data.id))" -ForegroundColor Green; $offerCount++ }
    else { Write-Host "Offer 1: VX-6000 -> 上海精仪 - FAILED" -ForegroundColor Red }
}

if ($productMap.ContainsKey("FB-3000") -and $org1Id) {
    $offer2 = Create-Offer -orgId $org1Id -productId $productMap["FB-3000"] -title "上海精仪 FB-3000 光纤内窥镜报价" -description "上海精仪检测技术有限公司提供的FB-3000光纤内窥镜产品报价"
    if ($offer2) { Write-Host "Offer 2: FB-3000 -> 上海精仪 - Created (ID: $($offer2.data.id))" -ForegroundColor Green; $offerCount++ }
    else { Write-Host "Offer 2: FB-3000 -> 上海精仪 - FAILED" -ForegroundColor Red }
}

if ($productMap.ContainsKey("US-800") -and $org2Id) {
    $offer3 = Create-Offer -orgId $org2Id -productId $productMap["US-800"] -title "广州华工 US-800 超声波检测仪报价" -description "广州华工检测设备有限公司提供的US-800超声波检测仪产品报价"
    if ($offer3) { Write-Host "Offer 3: US-800 -> 广州华工 - Created (ID: $($offer3.data.id))" -ForegroundColor Green; $offerCount++ }
    else { Write-Host "Offer 3: US-800 -> 广州华工 - FAILED" -ForegroundColor Red }
}

if ($productMap.ContainsKey("AOI-5000") -and $org2Id) {
    $offer4 = Create-Offer -orgId $org2Id -productId $productMap["AOI-5000"] -title "广州华工 AOI-5000 视觉检测设备报价" -description "广州华工检测设备有限公司提供的AOI-5000视觉检测设备产品报价"
    if ($offer4) { Write-Host "Offer 4: AOI-5000 -> 广州华工 - Created (ID: $($offer4.data.id))" -ForegroundColor Green; $offerCount++ }
    else { Write-Host "Offer 4: AOI-5000 -> 广州华工 - FAILED" -ForegroundColor Red }
}

# Try fuzzy matching for product names
if ($offerCount -lt 4) {
    Write-Host "Attempting fuzzy product name matching..." -ForegroundColor Yellow
    foreach ($p in $products) {
        $name = $p.name
        if ($name -like "*VX*" -or $name -like "*6000*" -or $name -like "*video*" -or $name -like "*borescope*") {
            if ($org1Id) {
                $offerA = Create-Offer -orgId $org1Id -productId $p.id -title "上海精仪 $name 报价" -description "上海精仪提供的$name 产品报价"
                if ($offerA) { Write-Host "Offer: $name -> 上海精仪 - Created (ID: $($offerA.data.id))" -ForegroundColor Green; $offerCount++ }
            }
        }
        if ($name -like "*FB*" -or $name -like "*3000*" -or $name -like "*fiber*" -or $name -like "*fiber*") {
            if ($org1Id) {
                $offerB = Create-Offer -orgId $org1Id -productId $p.id -title "上海精仪 $name 报价" -description "上海精仪提供的$name 产品报价"
                if ($offerB) { Write-Host "Offer: $name -> 上海精仪 - Created (ID: $($offerB.data.id))" -ForegroundColor Green; $offerCount++ }
            }
        }
        if ($name -like "*US*" -or $name -like "*800*" -or $name -like "*ultrasonic*") {
            if ($org2Id) {
                $offerC = Create-Offer -orgId $org2Id -productId $p.id -title "广州华工 $name 报价" -description "广州华工提供的$name 产品报价"
                if ($offerC) { Write-Host "Offer: $name -> 广州华工 - Created (ID: $($offerC.data.id))" -ForegroundColor Green; $offerCount++ }
            }
        }
        if ($name -like "*AOI*" -or $name -like "*5000*" -or $name -like "*vision*") {
            if ($org2Id) {
                $offerD = Create-Offer -orgId $org2Id -productId $p.id -title "广州华工 $name 报价" -description "广州华工提供的$name 产品报价"
                if ($offerD) { Write-Host "Offer: $name -> 广州华工 - Created (ID: $($offerD.data.id))" -ForegroundColor Green; $offerCount++ }
            }
        }
    }
}

# ============================================================
# Step 5: Add product parameter values
# ============================================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 5: Add product parameter values" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# First, get parameter definitions
$paramDefsResponse = Invoke-API -Method Get -Path "/parameter-definitions"
$paramDefMap = @{}
if ($paramDefsResponse -and $paramDefsResponse.success) {
    Write-Host "Parameter definitions found:" -ForegroundColor Green
    foreach ($pd in $paramDefsResponse.data) {
        Write-Host "  - $($pd.name) (ID: $($pd.id), type: $($pd.type))" -ForegroundColor Yellow
        $paramDefMap[$pd.name] = $pd.id
    }
} else {
    Write-Host "Failed to get parameter definitions. Trying alternatives..." -ForegroundColor Yellow
    $altEndpoints = @("/parameter-definitions/list", "/parameters", "/params")
    foreach ($ep in $altEndpoints) {
        $r = Invoke-API -Method Get -Path $ep
        if ($r -and $r.success) {
            Write-Host "Found via $ep" -ForegroundColor Green
            foreach ($pd in $r.data) {
                Write-Host "  - $($pd.name) (ID: $($pd.id))" -ForegroundColor Yellow
                $paramDefMap[$pd.name] = $pd.id
            }
            break
        }
    }
}

# Function to add parameter values to a product
function Add-ParamValues {
    param($productId, $values)
    $body = @{
        values = $values
    }
    $result = Invoke-API -Method Post -Path "/products/$productId/parameter-values" -Body $body
    if ($result -and $result.success) {
        Write-Host "  Parameter values added for product $productId" -ForegroundColor Green
        return $true
    }
    # Try alternative endpoints
    $altEndpoints = @(
        "/products/$productId/params",
        "/products/$productId/parameters",
        "/product-parameter-values"
    )
    foreach ($ep in $altEndpoints) {
        $result = Invoke-API -Method Post -Path $ep -Body $body
        if ($result -and $result.success) {
            Write-Host "  Parameter values added via $ep" -ForegroundColor Green
            return $true
        }
    }
    # Try single value at a time
    foreach ($v in $values) {
        $singleBody = @{
            parameterDefinitionId = $v.parameterDefinitionId
            value = $v.value
        }
        $result = Invoke-API -Method Post -Path "/products/$productId/parameter-values" -Body $singleBody
        if ($result -and $result.success) {
            Write-Host "  Single param value added: $($v.parameterDefinitionId)=$($v.value)" -ForegroundColor Green
        }
    }
    return $false
}

# Map parameter names to values for VX-6000
$vx6000ProductId = $null
if ($productMap.ContainsKey("VX-6000")) { $vx6000ProductId = $productMap["VX-6000"] }
if ($vx6000ProductId) {
    Write-Host "Adding parameter values for VX-6000..." -ForegroundColor Cyan
    $vxValues = @()
    if ($paramDefMap.ContainsKey("probe_diameter")) { $vxValues += @{parameterDefinitionId=$paramDefMap["probe_diameter"]; value="6.0mm"} }
    if ($paramDefMap.ContainsKey("working_length")) { $vxValues += @{parameterDefinitionId=$paramDefMap["working_length"]; value="3000mm"} }
    if ($paramDefMap.ContainsKey("resolution")) { $vxValues += @{parameterDefinitionId=$paramDefMap["resolution"]; value="1920x1080"} }
    if ($paramDefMap.ContainsKey("fov")) { $vxValues += @{parameterDefinitionId=$paramDefMap["fov"]; value="120°"} }
    if ($paramDefMap.ContainsKey("light_source")) { $vxValues += @{parameterDefinitionId=$paramDefMap["light_source"]; value="LED白光"} }
    if ($paramDefMap.ContainsKey("ip_rating")) { $vxValues += @{parameterDefinitionId=$paramDefMap["ip_rating"]; value="IP67"} }
    if ($paramDefMap.ContainsKey("operating_temp")) { $vxValues += @{parameterDefinitionId=$paramDefMap["operating_temp"]; value="-20°C~60°C"} }
    if ($paramDefMap.ContainsKey("brand")) { $vxValues += @{parameterDefinitionId=$paramDefMap["brand"]; value="精仪"} }
    if ($vxValues.Count -gt 0) {
        Add-ParamValues -productId $vx6000ProductId -values $vxValues
    } else {
        Write-Host "  No parameter definition IDs found in map. Trying to discover..." -ForegroundColor Yellow
        # Try to get parameter definitions for this product
        $prodParams = Invoke-API -Method Get -Path "/products/$vx6000ProductId/parameters"
        Write-Host "  Product params: $($prodParams | ConvertTo-Json -Depth 3)"
    }
}

# Add parameter values for US-800
$us800ProductId = $null
if ($productMap.ContainsKey("US-800")) { $us800ProductId = $productMap["US-800"] }
if ($us800ProductId) {
    Write-Host "Adding parameter values for US-800..." -ForegroundColor Cyan
    $usValues = @()
    if ($paramDefMap.ContainsKey("probe_diameter")) { $usValues += @{parameterDefinitionId=$paramDefMap["probe_diameter"]; value="10mm"} }
    if ($paramDefMap.ContainsKey("resolution")) { $usValues += @{parameterDefinitionId=$paramDefMap["resolution"]; value="0.1mm"} }
    if ($paramDefMap.ContainsKey("operating_temp")) { $usValues += @{parameterDefinitionId=$paramDefMap["operating_temp"]; value="-10°C~50°C"} }
    if ($paramDefMap.ContainsKey("ip_rating")) { $usValues += @{parameterDefinitionId=$paramDefMap["ip_rating"]; value="IP65"} }
    if ($paramDefMap.ContainsKey("brand")) { $usValues += @{parameterDefinitionId=$paramDefMap["brand"]; value="华工"} }
    if ($usValues.Count -gt 0) {
        Add-ParamValues -productId $us800ProductId -values $usValues
    }
}

# ============================================================
# Step 6: Create buyer user and demand
# ============================================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 6: Create buyer user and demand" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Create buyer user
$buyerBody = @{
    email = "buyer001@test.com"
    name = "测试采购员"
    password = "Test123456"
    role = "BUYER"
}
$buyer = Invoke-API -Method Post -Path "/users" -Body $buyerBody
if ($buyer -and $buyer.success) {
    Write-Host "Buyer created: buyer001@test.com (ID: $($buyer.data.id))" -ForegroundColor Green
    $buyerId = $buyer.data.id
} else {
    # Try without role
    $buyerBody2 = @{
        email = "buyer001@test.com"
        name = "测试采购员"
        password = "Test123456"
    }
    $buyer = Invoke-API -Method Post -Path "/users" -Body $buyerBody2
    if ($buyer) { Write-Host "Buyer created (alt): $($buyer | ConvertTo-Json -Depth 3)" -ForegroundColor Green; $buyerId = $buyer.data.id }
    else { Write-Host "Buyer creation FAILED" -ForegroundColor Red; $buyerId = $null }
}

# Create demand
$demandBody = @{
    title = "工业内窥镜采购需求"
    description = "需要采购一批工业视频内窥镜和光纤内窥镜设备，用于压力容器和管道内部检测"
    quantity = 5
    budget = 500000
    deadline = "2026-12-31"
    status = "OPEN"
    category = "工业内窥镜"
}
$demand = Invoke-API -Method Post -Path "/demands" -Body $demandBody
if ($demand -and $demand.success) {
    Write-Host "Demand created: 工业内窥镜采购需求 (ID: $($demand.data.id))" -ForegroundColor Green
    $demandId = $demand.data.id
} else {
    # Try simpler demand
    $demandBody2 = @{
        title = "工业内窥镜采购需求"
        description = "需要采购工业内窥镜设备"
    }
    $demand = Invoke-API -Method Post -Path "/demands" -Body $demandBody2
    if ($demand) { Write-Host "Demand created (alt): $($demand | ConvertTo-Json -Depth 3)" -ForegroundColor Green; $demandId = $demand.data.id }
    else { Write-Host "Demand creation FAILED" -ForegroundColor Red; $demandId = $null }
}

# ============================================================
# Step 7: Verify results
# ============================================================
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Step 7: Verify results" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "--- Organizations ---" -ForegroundColor Yellow
$orgs = Invoke-API -Method Get -Path "/organizations"
if ($orgs -and $orgs.success) {
    foreach ($o in $orgs.data) {
        Write-Host "  [$($o.type)] $($o.name) (ID: $($o.id))" -ForegroundColor White
    }
    Write-Host "Total organizations: $($orgs.data.Count)" -ForegroundColor Green
} else {
    Write-Host "Failed to list organizations" -ForegroundColor Red
}

Write-Host ""
Write-Host "--- Users ---" -ForegroundColor Yellow
$users = Invoke-API -Method Get -Path "/users"
if ($users -and $users.success) {
    foreach ($u in $users.data) {
        Write-Host "  $($u.email) - $($u.name) (ID: $($u.id), org: $($u.organizationId))" -ForegroundColor White
    }
    Write-Host "Total users: $($users.data.Count)" -ForegroundColor Green
} else {
    Write-Host "Failed to list users" -ForegroundColor Red
}

Write-Host ""
Write-Host "--- Products ---" -ForegroundColor Yellow
$products2 = Invoke-API -Method Get -Path "/products"
if ($products2 -and $products2.success) {
    foreach ($p in $products2.data) {
        Write-Host "  $($p.name) (ID: $($p.id))" -ForegroundColor White
    }
    Write-Host "Total products: $($products2.data.Count)" -ForegroundColor Green
}

Write-Host ""
Write-Host "--- Offers ---" -ForegroundColor Yellow
$offers = Invoke-API -Method Get -Path "/offers"
if ($offers -and $offers.success) {
    foreach ($o in $offers.data) {
        Write-Host "  $($o.title) (ID: $($o.id), status: $($o.status))" -ForegroundColor White
    }
    Write-Host "Total offers: $($offers.data.Count)" -ForegroundColor Green
} else {
    Write-Host "Failed to list offers" -ForegroundColor Red
}

Write-Host ""
Write-Host "--- Demands ---" -ForegroundColor Yellow
$demands = Invoke-API -Method Get -Path "/demands"
if ($demands -and $demands.success) {
    foreach ($d in $demands.data) {
        Write-Host "  $($d.title) (ID: $($d.id), status: $($d.status))" -ForegroundColor White
    }
    Write-Host "Total demands: $($demands.data.Count)" -ForegroundColor Green
} else {
    Write-Host "Failed to list demands" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "TEST DATA CREATION COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan