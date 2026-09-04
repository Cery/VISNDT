SELECT p.id AS product_id, p.name AS product_name,
       sp.id AS sp_id, sp."modelNumber", sp.status AS sp_status,
       o.id AS org_id, o.name AS org_name, o.organization_type
FROM product p
JOIN supplier_product sp ON sp.platform_product_id = p.id
JOIN organization o ON o.id = sp.organization_id
ORDER BY p.id, o.name;