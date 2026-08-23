\echo '=== A. 当前 SP 全景（21 = 13 基线 + 8 SCALE）==='
SELECT sp."brand", sp."series", sp."modelNumber", sp."status",
       sp."platform_product_id"
FROM "supplier_product" sp
ORDER BY sp."brand", sp."series", sp."modelNumber";

\echo '=== B. Series 分组评估（Series as management dimension）==='
SELECT "brand", "series", count(*) AS models,
       count(*) FILTER (WHERE "status"='PUBLISHED') AS published
FROM "supplier_product"
GROUP BY "brand", "series"
ORDER BY "brand", "series";

\echo '=== C. 每 Supplier 型号数（Level 2: 明视 10+）==='
SELECT o."name", count(*) AS sp_count
FROM "supplier_product" sp
JOIN "organization" o ON o."id" = sp."organization_id"
GROUP BY o."name" ORDER BY sp_count DESC;

\echo '=== D. 每 Platform Product 下 SupplierProduct 数（多供应商/多型号能力）==='
SELECT p."name" AS capability, count(*) AS total_sp,
       count(DISTINCT sp."organization_id") AS suppliers,
       count(*) FILTER (WHERE sp."status"='PUBLISHED') AS published
FROM "supplier_product" sp
JOIN "product" p ON p."id" = sp."platform_product_id"
GROUP BY p."name" ORDER BY total_sp DESC;

\echo '=== E. Media 治理评估（SupplierProduct Media 数量与分布）==='
SELECT count(*) AS total_supplier_media FROM "supplier_product_media";
SELECT spm."supplier_product_id", sp."brand", sp."modelNumber", count(*) AS media_count
FROM "supplier_product_media" spm
JOIN "supplier_product" sp ON sp."id" = spm."supplier_product_id"
GROUP BY spm."supplier_product_id", sp."brand", sp."modelNumber"
ORDER BY media_count DESC;
SELECT count(*) AS product_media FROM "product_media";
SELECT count(*) AS content_media FROM "content_media";
SELECT count(*) AS org_media FROM "organization_media";

\echo '=== F. 审核队列规模（当前 + 投影）==='
SELECT "status", count(*) FROM "supplier_product" GROUP BY "status" ORDER BY "status";
\echo '--- 投影：若规模线性扩到 100（当前 21 -> x5）---'
SELECT 'pending_review(SUBMITTED+REVIEWING)' AS queue,
       2 + 1 AS current_pending,
       (2 + 1) * 5 AS projected_at_100;
