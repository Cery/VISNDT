-- 662.1 Level 3 还原：删除受控报价 + 还原 VX-6000-MAX 为 DRAFT
BEGIN;
DELETE FROM "offer" WHERE "supplier_product_id" = '0c0b273d-f346-416c-a8ec-d0ed134dfba6'
  AND "title" LIKE '%【662.1 Scale】%';
UPDATE "supplier_product"
SET "status" = 'DRAFT', "published_at" = NULL
WHERE "id" = '0c0b273d-f346-416c-a8ec-d0ed134dfba6';
-- 验证
SELECT "brand", "modelNumber", "status" FROM "supplier_product"
WHERE "id" = '0c0b273d-f346-416c-a8ec-d0ed134dfba6';
SELECT count(*) AS scale_offers FROM "offer" WHERE "title" LIKE '%【662.1 Scale】%';
SELECT "status", count(*) FROM "supplier_product" GROUP BY "status" ORDER BY "status";
COMMIT;
