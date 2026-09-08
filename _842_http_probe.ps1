$BASE = "http://localhost:3000"
$token = @('password','passwordHash','refreshToken','accessToken','secret','privateContact','internalNote')
$pages = @(
  "/",
  "/products",
  "/products/zb-k60",
  "/categories",
  "/categories/electronic-video-endoscope",
  "/knowledge-base",
  "/knowledge",
  "/solutions",
  "/search",
  "/search?q=%E5%B7%A5%E4%B8%9A%E5%86%85%E7%AA%A5%E9%95%9C",
  "/supplier-models",
  "/articles",
  "/about"
)

function ProbePage($path) {
  $res = @{}
  try {
    $r = Invoke-WebRequest -Uri ($BASE + $path) -UseBasicParsing -TimeoutSec 30 -MaximumRedirection 0 -ErrorAction Stop
    $res.status = $r.StatusCode
    $html = $r.Content
  } catch {
    $err = $_.Exception.Response
    if ($err -and [int]$err.StatusCode -ge 300 -and [int]$err.StatusCode -lt 400) {
      $res.status = [int]$err.StatusCode
      $res.location = $err.Headers.Location
      return $res
    }
    if ($_.Exception.StatusCode) { $res.status = [int]$_.Exception.StatusCode }
    else { $res.status = "ERR" }
    $html = $_.ErrorDetails.Message
    if (-not $html) { $html = "" }
  }
  $m = [regex]::Matches($html, '<h1[^>]*>([\s\S]*?)</h1>')
  $res.h1Count = $m.Count
  $t = @()
  foreach ($x in $m) {
    $txt = ($x.Groups[1].Value -replace '<[^>]+>','' -replace '\s+',' ').Trim()
    if ($txt.Length -gt 0) { $t += $txt }
  }
  $res.h1text = $t
  $mt = [regex]::Match($html, '<title[^>]*>([\s\S]*?)</title>')
  $res.title = if ($mt.Success) { ($mt.Groups[1].Value.Trim()) } else { "" }
  $mc = [regex]::Match($html, 'rel="canonical"[^>]*>')
  if ($mc.Success) {
    $mh = [regex]::Match($mc.Value, 'href="([^"]*)"')
    $res.canonical = if ($mh.Success) { $mh.Groups[1].Value } else { $mc.Value }
  } else { $res.canonical = "NONE" }
  $mr = [regex]::Match($html, '(<meta[^>]*name="robots"[^>]*>)')
  $res.robotsMeta = if ($mr.Success) { $mr.Groups[1].Value } else { "NONE(default)" }
  $res.jsonld = ([regex]::Matches($html, 'application/ld\+json')).Count
  $lead = @()
  foreach ($s in $token) { if ($html -match [regex]::Escape($s)) { $lead += $s } }
  $res.sensitiveHit = $lead
  return $res
}

foreach ($p in $pages) {
  $r = ProbePage $p
  Write-Output ("{0}`n  status={1} loc={2}`n  h1={3} {4}`n  title={5}`n  canonical={6}`n  robots={7}`n  jsonld={8}`n  sens={9}" -f $p, $r.status, $r.location, $r.h1Count, ($r.h1text -join ' | '), $r.title, $r.canonical, $r.robotsMeta, $r.jsonld, ($r.sensitiveHit -join ','))
}

echo "=== ROBOTS.TXT ==="
try { echo (Invoke-WebRequest -Uri "$BASE/robots.txt" -UseBasicParsing -TimeoutSec 20).Content } catch { echo "robots ERR $($_.Exception.Message)" }

echo "=== SITEMAP ==="
try {
  $sm = (Invoke-WebRequest -Uri "$BASE/sitemap.xml" -UseBasicParsing -TimeoutSec 30).Content
  echo ("urlCount=" + ([regex]::Matches($sm,'<url>')).Count)
  $urls = [regex]::Matches($sm,'<loc>([\s\S]*?)</loc>')
  $sample = ($urls | Select-Object -First 25 | ForEach-Object { $_.Groups[1].Value })
  echo "first25:"; $sample | ForEach-Object { echo "    " + $_ }
  $sec = $token | Where-Object { $sm -match [regex]::Escape($_) }
  echo "sensitiveInSitemap=$sec"
} catch { echo "sitemap ERR: $($_.Exception.Message)" }