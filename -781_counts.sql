SELECT 'product' AS tbl, count(*) FROM product UNION ALL
SELECT 'supplier_product',  count(*) FROM supplier_product UNION ALL
SELECT 'organization',      count(*) FROM organization UNION ALL
SELECT 'organization_member', count(*) FROM organization_member UNION ALL
SELECT 'product_category',  count(*) FROM product_category UNION ALL
SELECT 'user',              count(*) FROM "user" UNION ALL
SELECT 'user_invitation',   count(*) FROM user_invitation UNION ALL
SELECT 'parameter_definition', count(*) FROM parameter_definition UNION ALL
SELECT 'content',           count(*) FROM content;