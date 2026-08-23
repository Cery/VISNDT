\echo '=== Offer bound to SupplierProduct ==='
SELECT count(*) AS offer_with_sp FROM "offer" WHERE "supplier_product_id" IS NOT NULL;
\echo '=== Offer bound per status ==='
SELECT "status", count(*) FROM "offer" WHERE "supplier_product_id" IS NOT NULL GROUP BY "status";
\echo '=== Supplier Organizations (with SupplierProduct) ==='
SELECT count(DISTINCT "organization_id") AS supplier_org_with_sp FROM "supplier_product";
\echo '=== SupplierProduct per Organization (id + name) ==='
SELECT sp."organization_id" AS org_id, o."name" AS org_name, count(*) AS cnt
  FROM "supplier_product" sp JOIN "organization" o ON o."id" = sp."organization_id"
  GROUP BY sp."organization_id", o."name" ORDER BY cnt DESC;
\echo '=== SupplierProduct per Product (id + name + status) ==='
SELECT sp."platform_product_id" AS product_id, p."name" AS product_name,
       count(*) AS total, count(*) FILTER (WHERE sp."status"='PUBLISHED') AS published
  FROM "supplier_product" sp JOIN "product" p ON p."id" = sp."platform_product_id"
  GROUP BY sp."platform_product_id", p."name" ORDER BY total DESC;
\echo '=== Series grouping check (brand+series unique counts) ==='
SELECT "brand", "series", count(DISTINCT "modelNumber") AS models
  FROM "supplier_product" GROUP BY "brand", "series" ORDER BY "brand", "series";
\echo '=== Offer id/status/product/sp/organization ==='
SELECT o."id", o."status", o."product_id", o."supplier_product_id", o."organization_id"
  FROM "offer" o ORDER BY o."supplier_product_id" NULLS LAST;
