$ErrorActionPreference = "Stop"
$root = "f:\Desktop\VISNDT\docs"
$srcs = @("_review", "Content Management Guide")
$outPath = Join-Path $root "_context\report_index.md"
$rows = @()

function ExtractId([string]$fn) {
  if ($fn -match '^(\d+)') { return $matches[1] } else { return "" }
}
function ExtractTitle([string]$path, [string[]]$lines) {
  foreach ($l in $lines) {
    $s = $l.Trim()
    if ($s -ne "") {
      if ($s -like '#*') { return ($s -replace '^#+\s*', '') }
      break
    }
  }
  $base = [System.IO.Path]::GetFileNameWithoutExtension($path)
  return ($base -replace '^\d+_', '')
}
function ExtractDate([string[]]$lines) {
  foreach ($l in $lines) {
    if ($l -match '\d{4}[-/.]\d{1,2}[-/.]\d{1,2}') { return $matches[0] }
  }
  return ""
}

foreach ($src in $srcs) {
  $dir = Join-Path $root $src
  Get-ChildItem -Path $dir -Filter *.md | Sort-Object { $n = ExtractId $_.Name; if ($n -eq '') {[int64]::MaxValue} else {[int64]$n} }, Name | ForEach-Object {
    $fn = $_.Name
    $lines = @(Get-Content $_.FullName -TotalCount 20 -ErrorAction SilentlyContinue)
    $id = ExtractId $fn
    $rows += [pscustomobject]@{
      Src=$src; Id=$id; Fname=$fn;
      Title=(ExtractTitle $_.FullName $lines);
      Date=(ExtractDate $lines)
    }
  }
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# report_index.md - report index (machine skeleton)")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("> generated 2026-09-09. sources: docs/_review top-level + docs/Content Management Guide, total $($rows.Count).")
[void]$sb.AppendLine("> id/title/date auto-extracted from filename + first 20 lines; conclusion/status pending manual fill (marked 'PENDING').")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("| id | source | file | title | date | conclusion/status |")
[void]$sb.AppendLine("|---|---|---|---|---|---|")
foreach ($r in $rows) {
  $id = if ($r.Id) { $r.Id } else { "-" }
  $d  = if ($r.Date) { $r.Date } else { "-" }
  $t  = $r.Title -replace '\|','-'
  [void]$sb.AppendLine("| $id | $($r.Src) | $($r.Fname) | $t | $d | PENDING |")
}
Set-Content -Path $outPath -Value $sb.ToString() -Encoding UTF8
Write-Output "done rows=$($rows.Count)"