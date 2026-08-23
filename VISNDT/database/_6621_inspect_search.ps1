# Inspect the raw search response structure
$raw = Get-Content -Raw 'f:\Desktop\VISNDT\VISNDT\database\_6621_search_now.json'
$j = $raw | ConvertFrom-Json
Write-Output ('success: ' + $j.success)
Write-Output ('data type: ' + $j.data.GetType().Name)
if ($j.data) {
  Write-Output ('data keys: ' + (($j.data.PSObject.Properties.Name) -join ', '))
  if ($j.data.supplierProducts) {
    Write-Output ('supplierProducts.total: ' + $j.data.supplierProducts.total)
    Write-Output ('supplierProducts.items.Count: ' + $j.data.supplierProducts.items.Count)
    foreach ($sp in $j.data.supplierProducts.items) {
      Write-Output ('  - ' + $sp.supplierProduct.brand + ' | ' + $sp.supplierProduct.series + ' | ' + $sp.supplierProduct.modelNumber + ' | ' + $sp.supplierProduct.status)
    }
  } else {
    Write-Output 'data.supplierProducts is null'
    # try alternate shapes
    if ($j.data.products) { Write-Output ('has products.total=' + $j.data.products.total) }
  }
} else {
  Write-Output 'data null'
}
