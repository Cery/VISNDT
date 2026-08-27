#requires -Version 5.1
<#
.SYNOPSIS
  VISNDT 一键启动脚本：启动 Docker 基础设施（PostgreSQL + MinIO）以及本地开发服务（API / Web / Admin）。

.DESCRIPTION
  - 路径无关：脚本会自动向上查找代码根目录（包含 apps 与 docker\docker-compose.yml 的目录），
    因此可以放在仓库内任意位置运行。
  - 也可通过 -CodeRoot 参数或 VISNDT_ROOT 环境变量显式指定代码根目录。
  - Docker 使用开发基础设施编排文件 docker\docker-compose.yml（仅 postgres + minio）。
  - API / Web / Admin 各自在独立的新窗口启动，便于分别查看日志和 Ctrl+C 停止。

.PARAMETER CodeRoot
  显式指定 VISNDT 代码根目录（包含 apps、database、docker\docker-compose.yml）。

.PARAMETER SkipDocker
  跳过 Docker 基础设施启动（当基础设施已在运行时使用）。

.PARAMETER DockerOnly
  仅启动 Docker 基础设施，不启动本地开发服务。

.EXAMPLE
  .\start-visndt.ps1
.EXAMPLE
  .\start-visndt.ps1 -SkipDocker
.EXAMPLE
  .\start-visndt.ps1 -CodeRoot "F:\Desktop\VISNDT\VISNDT"
#>
[CmdletBinding()]
param(
  [string]$CodeRoot,
  [switch]$SkipDocker,
  [switch]$DockerOnly
)

$ErrorActionPreference = 'Stop'

function Write-Step {
  param([string]$Msg)
  Write-Host "`n==> $Msg" -ForegroundColor Cyan
}

# 查找代码根目录：优先 -CodeRoot 参数，其次 VISNDT_ROOT 环境变量，
# 否则从脚本所在位置向上逐级查找包含 apps 与 docker\docker-compose.yml 的目录。
function Find-CodeRoot {
  param([string]$StartDir, [string]$Override)

  if ($Override -and (Test-Path $Override)) {
    return (Resolve-Path $Override).Path
  }
  if ($env:VISNDT_ROOT -and (Test-Path $env:VISNDT_ROOT)) {
    return (Resolve-Path $env:VISNDT_ROOT).Path
  }

  $dir = $StartDir
  while ($dir) {
    foreach ($candidate in @($dir, (Join-Path $dir 'VISNDT'))) {
      $compose = Join-Path $candidate 'docker\docker-compose.yml'
      $apps    = Join-Path $candidate 'apps'
      if ((Test-Path $compose) -and (Test-Path $apps)) {
        return (Resolve-Path $candidate).Path
      }
    }
    $parent = Split-Path $dir -Parent
    if ($parent -eq $dir) { break }
    $dir = $parent
  }
  return $null
}

function Test-PortInUse {
  param([int]$Port)
  return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

# 在独立新窗口启动一个开发服务（使用 -EncodedCommand 规避引号转义问题）
function Start-ServiceWindow {
  param([string]$Title, [string]$Dir, [string]$Command)

  $shell = Join-Path $PSHOME 'pwsh.exe'
  if (-not (Test-Path $shell)) { $shell = Join-Path $PSHOME 'powershell.exe' }

  $inner   = "Set-Location -LiteralPath '$Dir'; $Command"
  $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($inner))

  Start-Process -FilePath $shell -ArgumentList '-NoExit', '-EncodedCommand', $encoded -WorkingDirectory $Dir | Out-Null
  Write-Host "  [已启动] $Title" -ForegroundColor Green
}

# ---------- 1. 定位代码根目录 ----------
$root = Find-CodeRoot -StartDir $PSScriptRoot -Override $CodeRoot
if (-not $root) {
  Write-Host '未找到 VISNDT 代码根目录（应包含 apps 与 docker\docker-compose.yml）。' -ForegroundColor Red
  Write-Host '解决方式：1) 将本脚本放在仓库内任意位置；2) 使用 -CodeRoot <路径>；3) 设置环境变量 VISNDT_ROOT。' -ForegroundColor Red
  exit 1
}
Write-Host "VISNDT 代码根目录: $root" -ForegroundColor Yellow

$appsApi   = Join-Path $root 'apps\api'
$appsWeb   = Join-Path $root 'apps\web'
$appsAdmin = Join-Path $root 'apps\admin'
$compose   = Join-Path $root 'docker\docker-compose.yml'

# ---------- 2. 前置检查 ----------
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host '未找到 docker 命令，请先安装 Docker Desktop 并启动。' -ForegroundColor Red
  exit 1
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host '未找到 pnpm 命令，请先安装 pnpm（corepack enable pnpm 或 npm i -g pnpm）。' -ForegroundColor Red
  exit 1
}
foreach ($app in @(@('API', $appsApi), @('Web', $appsWeb), @('Admin', $appsAdmin))) {
  if (-not (Test-Path (Join-Path $app[1] 'node_modules'))) {
    Write-Host "$($app[0]) 缺少 node_modules，请先在代码根目录运行: pnpm install" -ForegroundColor Red
    exit 1
  }
}

# ---------- 3. 启动 Docker 基础设施 ----------
if (-not $SkipDocker) {
  Write-Step '启动 Docker 基础设施（PostgreSQL + MinIO）...'
  docker compose -f $compose up -d postgres minio
  if ($LASTEXITCODE -ne 0) {
    Write-Host "docker compose up 返回码 $LASTEXITCODE，请检查编排文件: $compose" -ForegroundColor Yellow
  }

  Write-Step '等待 PostgreSQL 就绪（最多 2 分钟）...'
  $deadline = (Get-Date).AddMinutes(2)
  $healthy  = $false
  while ((Get-Date) -lt $deadline) {
    $status = docker inspect --format '{{.State.Health.Status}}' visndt-postgres 2>$null
    if ($status -eq 'healthy') { $healthy = $true; break }
    Start-Sleep -Seconds 3
  }
  if ($healthy) {
    Write-Host '  PostgreSQL 已就绪。' -ForegroundColor Green
  } else {
    Write-Host 'PostgreSQL 健康检查超时，可能仍在启动，继续执行。' -ForegroundColor Yellow
  }
} else {
  Write-Host '跳过 Docker（SkipDocker）。' -ForegroundColor Yellow
}

if ($DockerOnly) {
  Write-Host "`nDocker 基础设施已启动，完成。"
  exit 0
}

# ---------- 4. 启动本地开发服务 ----------
Write-Step '启动本地开发服务（各自独立窗口）...'

if (Test-PortInUse 4000) { Write-Host '  [跳过] API 端口 4000 已被占用（可能已在运行）。' -ForegroundColor Yellow }
else { Start-ServiceWindow -Title 'VISNDT-API (4000)' -Dir $appsApi -Command 'pnpm dev' }

if (Test-PortInUse 3000) { Write-Host '  [跳过] Web 端口 3000 已被占用（可能已在运行）。' -ForegroundColor Yellow }
else { Start-ServiceWindow -Title 'VISNDT-WEB (3000)' -Dir $appsWeb -Command 'pnpm dev' }

if (Test-PortInUse 3001) { Write-Host '  [跳过] Admin 端口 3001 已被占用（可能已在运行）。' -ForegroundColor Yellow }
else { Start-ServiceWindow -Title 'VISNDT-ADMIN (3001)' -Dir $appsAdmin -Command 'pnpm dev' }

# ---------- 5. 汇总 ----------
Write-Step '全部启动完成，访问地址如下：'
Write-Host '  API   : http://localhost:4000/api/v1'
Write-Host '  Web   : http://localhost:3000'
Write-Host '  Admin : http://localhost:3001'
Write-Host '  MinIO : http://localhost:9001（minioadmin / minioadmin）'
Write-Host ''
Write-Host '提示：在每个服务窗口中按 Ctrl+C 即可停止对应服务。'
