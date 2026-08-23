\echo '=== Scale records (identifiable by slug prefix) ==='
SELECT "brand", "series", "modelNumber", "status", "slug"
FROM "supplier_product"
WHERE "slug" LIKE 'scale-%' OR "slug" LIKE 'scale%'
ORDER BY "brand";

\echo '=== Scale Offer count (title marker) ==='
SELECT count(*) AS scale_offers FROM "offer" WHERE "title" LIKE '%【662.1 Scale】%';
