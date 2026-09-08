\pset pager off
\pset format aligned
\echo '=== remaining supplier_product detail (微视/知象) ==='
SELECT sp.id, sp."modelNumber", sp.brand, sp.series, sp.status, sp.published_at,
       sp.platform_product_id, o.name AS org
FROM supplier_product sp JOIN organization o ON o.id=sp.organization_id
ORDER BY o.name, sp."modelNumber";