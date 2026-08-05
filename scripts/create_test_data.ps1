# VISNDT Test Data Creation Script
# Creates all test data via API calls with session persistence

$baseUrl = "http://localhost:4000/api/v1"
$ErrorActionPreference = "Continue"

# Helper function for API calls
function Invoke-Api {
    param(
        [string]$Method,
        [string]$Path,
        $Body,
        [string]$ContentType = "application/json"
    )
    $uri = "$baseUrl$Path"
    $params = @{
        Uri = $uri
        Method = $Method
        ContentType = $ContentType
        WebSession = $session
        ErrorAction = "Stop"
    }
    if ($Body) {
        $params.Body = $Body
    }
    try {
        $result = Invoke-RestMethod @params
        return $result
    } catch {
        $response = $_.Exception.Response
        if ($response) {
            $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "API ERROR [$Method $Path]: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Response: $responseBody" -ForegroundColor Red
        } else {
            Write-Host "API ERROR [$Method $Path]: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $null
    }
}

# ============================================
# STEP 1: Login
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Login" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginBody = @{email="admin@visndt.com";password="admin123456"} | ConvertTo-Json
$loginResult = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -SessionVariable session
Write-Host "Login: $($loginResult.success) - $($loginResult.data.user.name)" -ForegroundColor Green

# ============================================
# STEP 2: Create Supplier Organizations
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Create Supplier Organizations" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$org1Body = @{
    name = "上海精仪检测技术有限公司"
    type = "MANUFACTURER"
    description = "上海精仪检测技术有限公司 - 专业无损检测设备制造商"
    address = "上海市浦东新区张江高科技园区"
    contactPhone = "021-5888-6666"
    contactEmail = "info@jingyi.com"
} | ConvertTo-Json

$org1 = Invoke-Api -Method Post -Path "/organizations" -Body $org1Body
if ($org1 -and $org1.success) {
    $org1Id = $org1.data.id
    Write-Host "Created Org 1: $($org1.data.name) (ID: $org1Id)" -ForegroundColor Green
} else {
    Write-Host "Failed to create Org 1" -ForegroundColor Red
}

$org2Body = @{
    name = "广州华工仪器设备有限公司"
    type = "MANUFACTURER"
    description = "广州华工仪器设备有限公司 - 华南理工大学下属仪器设备企业"
    address = "广州市天河区五山路381号"
    contactPhone = "020-8711-8888"
    contactEmail = "info@huagong.com"
} | ConvertTo-Json

$org2 = Invoke-Api -Method Post -Path "/organizations" -Body $org2Body
if ($org2 -and $org2.success) {
    $org2Id = $org2.data.id
    Write-Host "Created Org 2: $($org2.data.name) (ID: $org2Id)" -ForegroundColor Green
} else {
    Write-Host "Failed to create Org 2" -ForegroundColor Red
}

# ============================================
# STEP 3: Create Supplier Users (Salesmen)
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Create Supplier Users" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# User 1: wangfang@jingyi.com
$user1Body = @{
    email = "wangfang@jingyi.com"
    name = "王芳"
    password = "Test123456"
    role = "SALESMAN"
    organizationId = $org1Id
} | ConvertTo-Json
$user1 = Invoke-Api -Method Post -Path "/users" -Body $user1Body
if ($user1 -and $user1.success) { Write-Host "Created User: 王芳 ($($user1.data.email))" -ForegroundColor Green }
else { Write-Host "Failed: 王芳" -ForegroundColor Red }

# User 2: chenwei@jingyi.com
$user2Body = @{
    email = "chenwei@jingyi.com"
    name = "陈伟"
    password = "Test123456"
    role = "SALESMAN"
    organizationId = $org1Id
} | ConvertTo-Json
$user2 = Invoke-Api -Method Post -Path "/users" -Body $user2Body
if ($user2 -and $user2.success) { Write-Host "Created User: 陈伟 ($($user2.data.email))" -ForegroundColor Green }
else { Write-Host "Failed: 陈伟" -ForegroundColor Red }

# User 3: liuyang@huagong.com
$user3Body = @{
    email = "liuyang@huagong.com"
    name = "刘洋"
    password = "Test123456"
    role = "SALESMAN"
    organizationId = $org2Id
} | ConvertTo-Json
$user3 = Invoke-Api -Method Post -Path "/users" -Body $user3Body
if ($user3 -and $user3.success) { Write-Host "Created User: 刘洋 ($($user3.data.email))" -ForegroundColor Green }
else { Write-Host "Failed: 刘洋" -ForegroundColor Red }

# User 4: huangli@huagong.com
$user4Body = @{
    email = "huangli@huagong.com"
    name = "黄丽"
    password = "Test123456"
    role = "SALESMAN"
    organizationId = $org2Id
} | ConvertTo-Json
$user4 = Invoke-Api -Method Post -Path "/users" -Body $user4Body
if ($user4 -and $user4.success) { Write-Host "Created User: 黄丽 ($($user4.data.email))" -ForegroundColor Green }
else { Write-Host "Failed: 黄丽" -ForegroundColor Red }

# ============================================
# STEP 4: Get existing categories for reference
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Get Existing Categories" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$cats = Invoke-Api -Method Get -Path "/product-categories"
$existingCats = @{}
if ($cats -and $cats.success) {
    foreach ($cat in $cats.data) {
        $existingCats[$cat.name] = $cat.id
        Write-Host "  Existing: $($cat.name) (ID: $($cat.id))" -ForegroundColor Gray
    }
}
$endoscopeId = $existingCats["工业内窥镜"]
Write-Host "Industrial Endoscope ID: $endoscopeId" -ForegroundColor Yellow

# ============================================
# STEP 5: Create 3 New Product Categories
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 5: Create Product Categories" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Category 1: 磁粉检测设备
$cat1Body = @{
    name = "磁粉检测设备"
    description = "磁粉检测设备及相关配件"
    parentId = $null
} | ConvertTo-Json
$cat1 = Invoke-Api -Method Post -Path "/product-categories" -Body $cat1Body
if ($cat1 -and $cat1.success) { $cat1Id = $cat1.data.id; Write-Host "Created Category: 磁粉检测设备 (ID: $cat1Id)" -ForegroundColor Green }
else { Write-Host "Failed: 磁粉检测设备" -ForegroundColor Red }

# Category 2: 渗透检测设备
$cat2Body = @{
    name = "渗透检测设备"
    description = "渗透检测设备及相关耗材"
    parentId = $null
} | ConvertTo-Json
$cat2 = Invoke-Api -Method Post -Path "/product-categories" -Body $cat2Body
if ($cat2 -and $cat2.success) { $cat2Id = $cat2.data.id; Write-Host "Created Category: 渗透检测设备 (ID: $cat2Id)" -ForegroundColor Green }
else { Write-Host "Failed: 渗透检测设备" -ForegroundColor Red }

# Category 3: 工业内窥镜配件
$cat3Body = @{
    name = "工业内窥镜配件"
    description = "工业内窥镜相关配件和附件"
    parentId = $endoscopeId
} | ConvertTo-Json
$cat3 = Invoke-Api -Method Post -Path "/product-categories" -Body $cat3Body
if ($cat3 -and $cat3.success) { $cat3Id = $cat3.data.id; Write-Host "Created Category: 工业内窥镜配件 (ID: $cat3Id, parent: $endoscopeId)" -ForegroundColor Green }
else { Write-Host "Failed: 工业内窥镜配件" -ForegroundColor Red }

# ============================================
# STEP 6: Create Parameter Groups
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 6: Create Parameter Groups" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$pg1Body = @{
    name = "电气参数"
    description = "Electrical Parameters - 电源、功率、电压等电气相关参数"
} | ConvertTo-Json
$pg1 = Invoke-Api -Method Post -Path "/parameter-groups" -Body $pg1Body
if ($pg1 -and $pg1.success) { $pg1Id = $pg1.data.id; Write-Host "Created Group: 电气参数 (ID: $pg1Id)" -ForegroundColor Green }
else { Write-Host "Failed: 电气参数" -ForegroundColor Red }

$pg2Body = @{
    name = "环境参数"
    description = "Environmental Parameters - 温度、湿度、防护等级等环境相关参数"
} | ConvertTo-Json
$pg2 = Invoke-Api -Method Post -Path "/parameter-groups" -Body $pg2Body
if ($pg2 -and $pg2.success) { $pg2Id = $pg2.data.id; Write-Host "Created Group: 环境参数 (ID: $pg2Id)" -ForegroundColor Green }
else { Write-Host "Failed: 环境参数" -ForegroundColor Red }

# ============================================
# STEP 7: Create Parameter Definitions
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 7: Create Parameter Definitions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$pd1Body = @{
    name = "电源电压"
    key = "power_voltage"
    type = "STRING"
    groupId = $pg1Id
    description = "设备工作电源电压"
} | ConvertTo-Json
$pd1 = Invoke-Api -Method Post -Path "/parameter-definitions" -Body $pd1Body
if ($pd1 -and $pd1.success) { $pd1Id = $pd1.data.id; Write-Host "Created Param: 电源电压 (power_voltage, ID: $pd1Id)" -ForegroundColor Green }
else { Write-Host "Failed: 电源电压" -ForegroundColor Red }

$pd2Body = @{
    name = "功率"
    key = "power_wattage"
    type = "NUMBER"
    unit = "W"
    groupId = $pg1Id
    description = "设备额定功率"
} | ConvertTo-Json
$pd2 = Invoke-Api -Method Post -Path "/parameter-definitions" -Body $pd2Body
if ($pd2 -and $pd2.success) { $pd2Id = $pd2.data.id; Write-Host "Created Param: 功率 (power_wattage, ID: $pd2Id)" -ForegroundColor Green }
else { Write-Host "Failed: 功率" -ForegroundColor Red }

$pd3Body = @{
    name = "工作湿度"
    key = "operating_humidity"
    type = "STRING"
    groupId = $pg2Id
    description = "设备工作环境湿度范围"
} | ConvertTo-Json
$pd3 = Invoke-Api -Method Post -Path "/parameter-definitions" -Body $pd3Body
if ($pd3 -and $pd3.success) { $pd3Id = $pd3.data.id; Write-Host "Created Param: 工作湿度 (operating_humidity, ID: $pd3Id)" -ForegroundColor Green }
else { Write-Host "Failed: 工作湿度" -ForegroundColor Red }

$pd4Body = @{
    name = "存储温度"
    key = "storage_temp"
    type = "STRING"
    groupId = $pg2Id
    description = "设备存储温度范围"
} | ConvertTo-Json
$pd4 = Invoke-Api -Method Post -Path "/parameter-definitions" -Body $pd4Body
if ($pd4 -and $pd4.success) { $pd4Id = $pd4.data.id; Write-Host "Created Param: 存储温度 (storage_temp, ID: $pd4Id)" -ForegroundColor Green }
else { Write-Host "Failed: 存储温度" -ForegroundColor Red }

# ============================================
# STEP 8: Find existing category IDs for products
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 8: Find Target Categories for Products" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Re-fetch categories to get updated list
$cats2 = Invoke-Api -Method Get -Path "/product-categories"
$catMap = @{}
if ($cats2 -and $cats2.success) {
    foreach ($cat in $cats2.data) {
        $catMap[$cat.name] = $cat.id
    }
}
Write-Host "Category Map:"
$catMap.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key) -> $($_.Value)" -ForegroundColor Gray }

$videoEndoscopeId = $catMap["视频内窥镜"]
$ultrasonicId = $catMap["超声检测设备"]
$eddyCurrentId = $catMap["涡流检测设备"]
$radiographyId = $catMap["射线检测设备"]
$visualInspectionId = $catMap["视觉检测设备"]

# ============================================
# STEP 9: Create 5 Products
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 9: Create Products" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Product A: 高清视频内窥镜 VX-8000
$prodABody = @{
    name = "高清视频内窥镜 VX-8000"
    description = "VX-8000型高清视频内窥镜，采用高分辨率CMOS图像传感器，支持1080P高清视频录制，适用于航空发动机、工业管道等复杂内腔检测"
    categoryId = $videoEndoscopeId
    status = "ACTIVE"
    model = "VX-8000"
    brand = "VisNDT"
    specifications = "探头直径: 6mm; 工作长度: 3m; 分辨率: 1920x1080; 显示屏: 7寸LCD"
    price = 158000.00
} | ConvertTo-Json
$prodA = Invoke-Api -Method Post -Path "/products" -Body $prodABody
if ($prodA -and $prodA.success) { $prodAId = $prodA.data.id; Write-Host "Created Product A: VX-8000 (ID: $prodAId)" -ForegroundColor Green }
else { Write-Host "Failed: VX-8000" -ForegroundColor Red }

# Product B: 便携式超声探伤仪 US-200
$prodBBody = @{
    name = "便携式超声探伤仪 US-200"
    description = "US-200型便携式超声探伤仪，采用先进的数字信号处理技术，支持A/B/C扫描模式，适用于金属材料内部缺陷检测"
    categoryId = $ultrasonicId
    status = "ACTIVE"
    model = "US-200"
    brand = "VisNDT"
    specifications = "频率范围: 0.5-20MHz; 增益范围: 0-110dB; 采样率: 200MHz; 显示屏: 8.4寸TFT"
    price = 98000.00
} | ConvertTo-Json
$prodB = Invoke-Api -Method Post -Path "/products" -Body $prodBBody
if ($prodB -and $prodB.success) { $prodBId = $prodB.data.id; Write-Host "Created Product B: US-200 (ID: $prodBId)" -ForegroundColor Green }
else { Write-Host "Failed: US-200" -ForegroundColor Red }

# Product C: 涡流检测仪 EC-300
$prodCBody = @{
    name = "涡流检测仪 EC-300"
    description = "EC-300型涡流检测仪，采用多频涡流检测技术，支持表面和近表面缺陷检测，适用于航空航天、汽车制造等行业"
    categoryId = $eddyCurrentId
    status = "ACTIVE"
    model = "EC-300"
    brand = "VisNDT"
    specifications = "频率范围: 10Hz-10MHz; 通道数: 4; 灵敏度: 0.1mm深裂纹; 接口: USB 3.0/WiFi"
    price = 125000.00
} | ConvertTo-Json
$prodC = Invoke-Api -Method Post -Path "/products" -Body $prodCBody
if ($prodC -and $prodC.success) { $prodCId = $prodC.data.id; Write-Host "Created Product C: EC-300 (ID: $prodCId)" -ForegroundColor Green }
else { Write-Host "Failed: EC-300" -ForegroundColor Red }

# Product D: 工业X射线机 RT-400
$prodDBody = @{
    name = "工业X射线机 RT-400"
    description = "RT-400型工业X射线机，采用高频恒压技术，穿透能力强，适用于厚壁焊缝、铸件等工业无损检测"
    categoryId = $radiographyId
    status = "ACTIVE"
    model = "RT-400"
    brand = "VisNDT"
    specifications = "管电压: 40-400kV; 焦点尺寸: 1.0/3.5mm; 穿透能力: 85mm(Fe); 冷却方式: 水冷"
    price = 280000.00
} | ConvertTo-Json
$prodD = Invoke-Api -Method Post -Path "/products" -Body $prodDBody
if ($prodD -and $prodD.success) { $prodDId = $prodD.data.id; Write-Host "Created Product D: RT-400 (ID: $prodDId)" -ForegroundColor Green }
else { Write-Host "Failed: RT-400" -ForegroundColor Red }

# Product E: 自动光学检测系统 AOI-7000
$prodEBody = @{
    name = "自动光学检测系统 AOI-7000"
    description = "AOI-7000型自动光学检测系统，采用AI深度学习算法，支持PCB焊点、元器件外观自动检测，检测速度可达2000点/小时"
    categoryId = $visualInspectionId
    status = "ACTIVE"
    model = "AOI-7000"
    brand = "VisNDT"
    specifications = "分辨率: 500万像素; 检测速度: 2000点/小时; 照明: 多角度LED; 软件: AI深度学习"
    price = 350000.00
} | ConvertTo-Json
$prodE = Invoke-Api -Method Post -Path "/products" -Body $prodEBody
if ($prodE -and $prodE.success) { $prodEId = $prodE.data.id; Write-Host "Created Product E: AOI-7000 (ID: $prodEId)" -ForegroundColor Green }
else { Write-Host "Failed: AOI-7000" -ForegroundColor Red }

# ============================================
# STEP 10: Create Parameter Values for Products
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 10: Create Parameter Values" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Product A (VX-8000) - 4 values
$pv1Body = @{ productId = $prodAId; definitionId = $pd1Id; value = "AC 220V/50Hz" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv1Body | Out-Null
$pv2Body = @{ productId = $prodAId; definitionId = $pd2Id; value = "25" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv2Body | Out-Null
$pv3Body = @{ productId = $prodAId; definitionId = $pd3Id; value = "10%-90%RH (无凝结)" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv3Body | Out-Null
$pv4Body = @{ productId = $prodAId; definitionId = $pd4Id; value = "-20°C ~ +60°C" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv4Body | Out-Null
Write-Host "  VX-8000: 4 parameter values created" -ForegroundColor Green

# Product B (US-200) - 4 values
$pv5Body = @{ productId = $prodBId; definitionId = $pd1Id; value = "DC 12V/5A (锂电池)" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv5Body | Out-Null
$pv6Body = @{ productId = $prodBId; definitionId = $pd2Id; value = "15" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv6Body | Out-Null
$pv7Body = @{ productId = $prodBId; definitionId = $pd3Id; value = "5%-95%RH (无凝结)" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv7Body | Out-Null
$pv8Body = @{ productId = $prodBId; definitionId = $pd4Id; value = "-10°C ~ +50°C" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv8Body | Out-Null
Write-Host "  US-200: 4 parameter values created" -ForegroundColor Green

# Product C (EC-300) - 4 values
$pv9Body = @{ productId = $prodCId; definitionId = $pd1Id; value = "AC 110-240V/50-60Hz" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv9Body | Out-Null
$pv10Body = @{ productId = $prodCId; definitionId = $pd2Id; value = "30" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv10Body | Out-Null
$pv11Body = @{ productId = $prodCId; definitionId = $pd3Id; value = "20%-80%RH" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv11Body | Out-Null
$pv12Body = @{ productId = $prodCId; definitionId = $pd4Id; value = "-20°C ~ +70°C" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv12Body | Out-Null
Write-Host "  EC-300: 4 parameter values created" -ForegroundColor Green

# Product D (RT-400) - 3 values
$pv13Body = @{ productId = $prodDId; definitionId = $pd1Id; value = "AC 380V/50Hz 三相" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv13Body | Out-Null
$pv14Body = @{ productId = $prodDId; definitionId = $pd2Id; value = "4000" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv14Body | Out-Null
$pv15Body = @{ productId = $prodDId; definitionId = $pd3Id; value = "10%-85%RH (无凝结)" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv15Body | Out-Null
Write-Host "  RT-400: 3 parameter values created" -ForegroundColor Green

# Product E (AOI-7000) - 3 values
$pv16Body = @{ productId = $prodEId; definitionId = $pd1Id; value = "AC 220V/50Hz" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv16Body | Out-Null
$pv17Body = @{ productId = $prodEId; definitionId = $pd2Id; value = "500" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv17Body | Out-Null
$pv18Body = @{ productId = $prodEId; definitionId = $pd3Id; value = "30%-70%RH (无凝结)" } | ConvertTo-Json
Invoke-Api -Method Post -Path "/parameter-values" -Body $pv18Body | Out-Null
Write-Host "  AOI-7000: 3 parameter values created" -ForegroundColor Green

# ============================================
# STEP 11: Create Offers
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 11: Create Offers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# First, find existing organizations to get 深圳精测 ID
$orgs = Invoke-Api -Method Get -Path "/organizations"
$orgMap = @{}
if ($orgs -and $orgs.success) {
    foreach ($org in $orgs.data) {
        $orgMap[$org.name] = $org.id
    }
}
Write-Host "Organization IDs:"
$orgMap.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key) -> $($_.Value)" -ForegroundColor Gray }

# Check existing org name for 深圳精测
$szOrgId = $null
foreach ($key in $orgMap.Keys) {
    if ($key -like "*深圳*" -or $key -like "*精测*") {
        $szOrgId = $orgMap[$key]
        Write-Host "Found 深圳精测: $key -> $szOrgId" -ForegroundColor Yellow
    }
}

# Offer 1: 上海精仪 -> VX-8000
$offer1Body = @{
    title = "VX-8000高清工业内窥镜供应商报价"
    description = "上海精仪检测技术有限公司提供VX-8000高清工业内窥镜，含全套配件，质保2年，免费培训"
    productId = $prodAId
    supplierOrgId = $org1Id
    status = "ACTIVE"
    price = 148000.00
    currency = "CNY"
    minOrderQuantity = 1
    deliveryTime = "15个工作日"
    validUntil = "2026-12-31"
} | ConvertTo-Json
$offer1 = Invoke-Api -Method Post -Path "/offers" -Body $offer1Body
if ($offer1 -and $offer1.success) { $offer1Id = $offer1.data.id; Write-Host "Created Offer 1: VX-8000报价 (ID: $offer1Id)" -ForegroundColor Green }
else { Write-Host "Failed: Offer 1" -ForegroundColor Red }

# Offer 2: 上海精仪 -> US-200
$offer2Body = @{
    title = "US-200便携式超声探伤仪报价"
    description = "上海精仪检测技术有限公司提供US-200便携式超声探伤仪，含标准探头套装，质保3年"
    productId = $prodBId
    supplierOrgId = $org1Id
    status = "ACTIVE"
    price = 92000.00
    currency = "CNY"
    minOrderQuantity = 1
    deliveryTime = "10个工作日"
    validUntil = "2026-12-31"
} | ConvertTo-Json
$offer2 = Invoke-Api -Method Post -Path "/offers" -Body $offer2Body
if ($offer2 -and $offer2.success) { $offer2Id = $offer2.data.id; Write-Host "Created Offer 2: US-200报价 (ID: $offer2Id)" -ForegroundColor Green }
else { Write-Host "Failed: Offer 2" -ForegroundColor Red }

# Offer 3: 广州华工 -> EC-300
$offer3Body = @{
    title = "EC-300涡流检测仪专业供应"
    description = "广州华工仪器设备有限公司提供EC-300涡流检测仪，高校技术支持，性能可靠"
    productId = $prodCId
    supplierOrgId = $org2Id
    status = "ACTIVE"
    price = 118000.00
    currency = "CNY"
    minOrderQuantity = 1
    deliveryTime = "20个工作日"
    validUntil = "2026-12-31"
} | ConvertTo-Json
$offer3 = Invoke-Api -Method Post -Path "/offers" -Body $offer3Body
if ($offer3 -and $offer3.success) { $offer3Id = $offer3.data.id; Write-Host "Created Offer 3: EC-300报价 (ID: $offer3Id)" -ForegroundColor Green }
else { Write-Host "Failed: Offer 3" -ForegroundColor Red }

# Offer 4: 广州华工 -> RT-400
$offer4Body = @{
    title = "RT-400工业X射线机供应方案"
    description = "广州华工仪器设备有限公司提供RT-400工业X射线机，含防护设备和安装调试服务"
    productId = $prodDId
    supplierOrgId = $org2Id
    status = "ACTIVE"
    price = 265000.00
    currency = "CNY"
    minOrderQuantity = 1
    deliveryTime = "30个工作日"
    validUntil = "2026-12-31"
} | ConvertTo-Json
$offer4 = Invoke-Api -Method Post -Path "/offers" -Body $offer4Body
if ($offer4 -and $offer4.success) { $offer4Id = $offer4.data.id; Write-Host "Created Offer 4: RT-400报价 (ID: $offer4Id)" -ForegroundColor Green }
else { Write-Host "Failed: Offer 4" -ForegroundColor Red }

# Offer 5: 深圳精测 -> AOI-7000 (use szOrgId or fallback to org1)
$offer5OrgId = if ($szOrgId) { $szOrgId } else { $org1Id }
$offer5Body = @{
    title = "AOI-7000自动光学检测系统"
    description = "提供AOI-7000自动光学检测系统，AI智能检测，高效精准，适用于电子制造行业"
    productId = $prodEId
    supplierOrgId = $offer5OrgId
    status = "ACTIVE"
    price = 335000.00
    currency = "CNY"
    minOrderQuantity = 1
    deliveryTime = "25个工作日"
    validUntil = "2026-12-31"
} | ConvertTo-Json
$offer5 = Invoke-Api -Method Post -Path "/offers" -Body $offer5Body
if ($offer5 -and $offer5.success) { $offer5Id = $offer5.data.id; Write-Host "Created Offer 5: AOI-7000报价 (ID: $offer5Id)" -ForegroundColor Green }
else { Write-Host "Failed: Offer 5" -ForegroundColor Red }

# ============================================
# STEP 12: Find test buyer user
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 12: Find Test Buyer User" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$users = Invoke-Api -Method Get -Path "/users"
$buyerId = $null
if ($users -and $users.success) {
    foreach ($u in $users.data) {
        if ($u.email -eq "testbuyer@visndt.com") {
            $buyerId = $u.id
            Write-Host "Found buyer: $($u.name) ($($u.email)) - ID: $buyerId" -ForegroundColor Green
        }
    }
}
if (-not $buyerId) {
    Write-Host "testbuyer@visndt.com not found, using admin user" -ForegroundColor Yellow
    $buyerId = $loginResult.data.user.id
}

# ============================================
# STEP 13: Create Demands
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 13: Create Demands" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$demand1Body = @{
    title = "需要采购高清视频内窥镜"
    description = "我司需要采购一台高清视频内窥镜，用于航空发动机内部检测，要求探头直径不超过6mm，支持1080P视频录制，工作长度3m以上"
    categoryId = $videoEndoscopeId
    createdBy = $buyerId
    status = "OPEN"
    quantity = 1
    budget = 160000.00
    deadline = "2026-09-30"
} | ConvertTo-Json
$demand1 = Invoke-Api -Method Post -Path "/demands" -Body $demand1Body
if ($demand1 -and $demand1.success) { $demand1Id = $demand1.data.id; Write-Host "Created Demand 1: 视频内窥镜需求 (ID: $demand1Id)" -ForegroundColor Green }
else { Write-Host "Failed: Demand 1" -ForegroundColor Red }

$demand2Body = @{
    title = "采购便携式超声检测设备"
    description = "我司需采购便携式超声探伤设备，用于钢结构焊缝检测，要求便携、电池供电，频率范围0.5-20MHz"
    categoryId = $ultrasonicId
    createdBy = $buyerId
    status = "OPEN"
    quantity = 2
    budget = 200000.00
    deadline = "2026-10-15"
} | ConvertTo-Json
$demand2 = Invoke-Api -Method Post -Path "/demands" -Body $demand2Body
if ($demand2 -and $demand2.success) { $demand2Id = $demand2.data.id; Write-Host "Created Demand 2: 超声检测需求 (ID: $demand2Id)" -ForegroundColor Green }
else { Write-Host "Failed: Demand 2" -ForegroundColor Red }

# ============================================
# STEP 14: Create RFQs
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 14: Create RFQs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$rfq1Body = @{
    title = "RFQ-2026-001: 高清视频内窥镜采购询价"
    description = "根据采购需求，现向各供应商询价高清视频内窥镜，请提供详细报价和技术方案"
    demandId = $demand1Id
    createdBy = $buyerId
    status = "OPEN"
} | ConvertTo-Json
$rfq1 = Invoke-Api -Method Post -Path "/rfqs" -Body $rfq1Body
if ($rfq1 -and $rfq1.success) { $rfq1Id = $rfq1.data.id; Write-Host "Created RFQ 1: RFQ-2026-001 (ID: $rfq1Id)" -ForegroundColor Green }
else { Write-Host "Failed: RFQ 1" -ForegroundColor Red }

$rfq2Body = @{
    title = "RFQ-2026-002: 便携式超声探伤仪采购询价"
    description = "根据采购需求，现向各供应商询价便携式超声探伤设备，请提供详细报价和技术方案"
    demandId = $demand2Id
    createdBy = $buyerId
    status = "OPEN"
} | ConvertTo-Json
$rfq2 = Invoke-Api -Method Post -Path "/rfqs" -Body $rfq2Body
if ($rfq2 -and $rfq2.success) { $rfq2Id = $rfq2.data.id; Write-Host "Created RFQ 2: RFQ-2026-002 (ID: $rfq2Id)" -ForegroundColor Green }
else { Write-Host "Failed: RFQ 2" -ForegroundColor Red }

# ============================================
# STEP 15: Create Inquiries
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 15: Create Inquiries" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$inquiry1Body = @{
    title = "VX-8000高清视频内窥镜询价"
    description = "请提供VX-8000高清视频内窥镜的详细报价、交货期和售后服务方案"
    productId = $prodAId
    createdBy = $buyerId
    status = "OPEN"
    quantity = 1
} | ConvertTo-Json
$inquiry1 = Invoke-Api -Method Post -Path "/inquiries" -Body $inquiry1Body
if ($inquiry1 -and $inquiry1.success) { $inquiry1Id = $inquiry1.data.id; Write-Host "Created Inquiry 1: VX-8000询价 (ID: $inquiry1Id)" -ForegroundColor Green }
else { Write-Host "Failed: Inquiry 1" -ForegroundColor Red }

$inquiry2Body = @{
    title = "US-200便携式超声探伤仪询价"
    description = "请提供US-200便携式超声探伤仪的详细报价、交货期和售后服务方案"
    productId = $prodBId
    createdBy = $buyerId
    status = "OPEN"
    quantity = 2
} | ConvertTo-Json
$inquiry2 = Invoke-Api -Method Post -Path "/inquiries" -Body $inquiry2Body
if ($inquiry2 -and $inquiry2.success) { $inquiry2Id = $inquiry2.data.id; Write-Host "Created Inquiry 2: US-200询价 (ID: $inquiry2Id)" -ForegroundColor Green }
else { Write-Host "Failed: Inquiry 2" -ForegroundColor Red }

# ============================================
# STEP 16: Summary Output
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CREATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$summary = @"
{
    "organizations": {
        "org1": { "name": "上海精仪检测技术有限公司", "id": "$org1Id" },
        "org2": { "name": "广州华工仪器设备有限公司", "id": "$org2Id" }
    },
    "users": {
        "user1": { "email": "wangfang@jingyi.com", "name": "王芳", "orgId": "$org1Id" },
        "user2": { "email": "chenwei@jingyi.com", "name": "陈伟", "orgId": "$org1Id" },
        "user3": { "email": "liuyang@huagong.com", "name": "刘洋", "orgId": "$org2Id" },
        "user4": { "email": "huangli@huagong.com", "name": "黄丽", "orgId": "$org2Id" }
    },
    "categories": {
        "cat1": { "name": "磁粉检测设备", "id": "$cat1Id" },
        "cat2": { "name": "渗透检测设备", "id": "$cat2Id" },
        "cat3": { "name": "工业内窥镜配件", "id": "$cat3Id", "parentId": "$endoscopeId" }
    },
    "parameterGroups": {
        "pg1": { "name": "电气参数", "id": "$pg1Id" },
        "pg2": { "name": "环境参数", "id": "$pg2Id" }
    },
    "parameterDefinitions": {
        "pd1": { "name": "电源电压", "key": "power_voltage", "id": "$pd1Id", "groupId": "$pg1Id" },
        "pd2": { "name": "功率", "key": "power_wattage", "id": "$pd2Id", "groupId": "$pg1Id" },
        "pd3": { "name": "工作湿度", "key": "operating_humidity", "id": "$pd3Id", "groupId": "$pg2Id" },
        "pd4": { "name": "存储温度", "key": "storage_temp", "id": "$pd4Id", "groupId": "$pg2Id" }
    },
    "products": {
        "prodA": { "name": "高清视频内窥镜 VX-8000", "id": "$prodAId", "categoryId": "$videoEndoscopeId" },
        "prodB": { "name": "便携式超声探伤仪 US-200", "id": "$prodBId", "categoryId": "$ultrasonicId" },
        "prodC": { "name": "涡流检测仪 EC-300", "id": "$prodCId", "categoryId": "$eddyCurrentId" },
        "prodD": { "name": "工业X射线机 RT-400", "id": "$prodDId", "categoryId": "$radiographyId" },
        "prodE": { "name": "自动光学检测系统 AOI-7000", "id": "$prodEId", "categoryId": "$visualInspectionId" }
    },
    "offers": {
        "offer1": { "title": "VX-8000高清工业内窥镜供应商报价", "id": "$offer1Id", "supplierOrgId": "$org1Id" },
        "offer2": { "title": "US-200便携式超声探伤仪报价", "id": "$offer2Id", "supplierOrgId": "$org1Id" },
        "offer3": { "title": "EC-300涡流检测仪专业供应", "id": "$offer3Id", "supplierOrgId": "$org2Id" },
        "offer4": { "title": "RT-400工业X射线机供应方案", "id": "$offer4Id", "supplierOrgId": "$org2Id" },
        "offer5": { "title": "AOI-7000自动光学检测系统", "id": "$offer5Id", "supplierOrgId": "$offer5OrgId" }
    },
    "demands": {
        "demand1": { "title": "需要采购高清视频内窥镜", "id": "$demand1Id", "createdBy": "$buyerId" },
        "demand2": { "title": "采购便携式超声检测设备", "id": "$demand2Id", "createdBy": "$buyerId" }
    },
    "rfqs": {
        "rfq1": { "title": "RFQ-2026-001", "id": "$rfq1Id", "demandId": "$demand1Id" },
        "rfq2": { "title": "RFQ-2026-002", "id": "$rfq2Id", "demandId": "$demand2Id" }
    },
    "inquiries": {
        "inquiry1": { "title": "VX-8000高清视频内窥镜询价", "id": "$inquiry1Id", "productId": "$prodAId" },
        "inquiry2": { "title": "US-200便携式超声探伤仪询价", "id": "$inquiry2Id", "productId": "$prodBId" }
    }
}
"@

# Save summary to file for report generation
$summary | Out-File -FilePath "f:\Desktop\VISNDT\scripts\test_data_summary.json" -Encoding UTF8
Write-Host "Summary saved to scripts/test_data_summary.json" -ForegroundColor Green
Write-Host "`nAll test data creation completed!" -ForegroundColor Green
Write-Host $summary