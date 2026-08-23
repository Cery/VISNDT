$j = Get-Content -Raw 'f:\Desktop\VISNDT\VISNDT\database\_6621_search_full.json' | ConvertFrom-Json
Write-Output ('data keys: ' + (($j.data.PSObject.Properties.Name) -join ', '))
if ($j.data.supplierProducts) {
  Write-Output ('supplierProducts total: ' + $j.data.supplierProducts.total)
  foreach ($sp in $j.data.supplierProducts.items) {
    Write-Output ('  - ' + $sp.supplierProduct.brand + ' | ' + $sp.supplierProduct.series + ' | ' + $sp.supplierProduct.modelNumber + ' | ' + $sp.supplierProduct.status + ' | offers=' + $sp.commercialSummary.offerCount)
  }
} else {
  Write-Output 'NO supplierProducts key in response'
}
if ($j.data.facets) {
  Write-Output ('facets: ' + ($j.data.facets | ConvertTo-Json -Compress -Depth 4))
} else {
  Write-Output 'NO facets key at data level'
}
