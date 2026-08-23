\echo '=== Runtime Data Baseline (post-scale 662.1) ==='
SELECT 'product' AS entity, count(*) AS cnt FROM "product"
UNION ALL SELECT 'supplier_product', count(*) FROM "supplier_product"
UNION ALL SELECT 'supplier_product_media', count(*) FROM "supplier_product_media"
UNION ALL SELECT 'supplier_product_parameter_value', count(*) FROM "supplier_product_parameter_value"
UNION ALL SELECT 'offer', count(*) FROM "offer"
UNION ALL SELECT 'inquiry', count(*) FROM "inquiry"
UNION ALL SELECT 'rfq', count(*) FROM "rfq"
UNION ALL SELECT 'rfq_response', count(*) FROM "rfq_response"
UNION ALL SELECT 'organization', count(*) FROM "organization";

\echo '=== SupplierProduct by status ==='
SELECT "status", count(*) FROM "supplier_product" GROUP BY "status" ORDER BY "status";

\echo '=== SupplierProduct-bound Offer ==='
SELECT count(*) AS offer_with_sp FROM "offer" WHERE "supplier_product_id" IS NOT NULL;

\echo '=== Supplier Organizations count ==='
SELECT count(*) AS total_org FROM "organization";
