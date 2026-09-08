$BASE = "http://localhost:3000"
$paths = @("/login","/register","/workspace","/dashboard","/suppliers","/business","/articles","/tags","/insights")
foreach($u in $paths){
  try {
    $r = Invoke-WebRequest -Uri ($BASE + $u) -UseBasicParsing -TimeoutSec 25 -MaximumRedirection 5
    $final = $r.BaseResponse.ResponseUri.AbsolutePath
    echo ("{0} -> {1} final={2}" -f $u, $r.StatusCode, $final)
  } catch {
    echo ("{0} -> ERR {1}" -f $u, $_.Exception.Message)
  }
}
echo "=== ADMIN 3001 ==="
try { $a = Invoke-WebRequest -Uri "http://localhost:3001/" -UseBasicParsing -TimeoutSec 20; echo "admin / -> $($a.StatusCode)" } catch { echo "admin ERR $($_.Exception.Message)" }