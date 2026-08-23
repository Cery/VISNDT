-- 662.1 Level 3: 受控发布 锐视 VX-6000-MAX 以模拟多供应商同能力竞争
-- 明视 VX-6000-PRO (PUBLISHED) + 锐视 VX-6000-MAX (PUBLISHED) 共同挂靠 VX-6000 能力
-- 之后必须执行 _6621_level3_revert.sql 还原

BEGIN;

-- 1. 锐视 VX-6000-MAX -> PUBLISHED（受控测试记录，描述带 【662.1 Scale】 标识）
UPDATE "supplier_product"
SET "status" = 'PUBLISHED', "published_at" = now()
WHERE "id" = '0c0b273d-f346-416c-a8ec-d0ed134dfba6';

-- 2. 为 锐视 VX-6000-MAX 创建 ACTIVE 受控报价（与明视 VX-6000-PRO 68000 形成价格对比）
INSERT INTO "offer" ("id", "organization_id", "product_id", "supplier_product_id", "title", "description", "price", "currency", "status", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'eeb1bfc1-0774-a9f7-2aa2-8a2b96ec0e3d',
  '933ed0db-08e7-4ede-a2c2-ebb1e8521cd1',
  '0c0b273d-f346-416c-a8ec-d0ed134dfba6',
  '【662.1 Scale】锐视 VX-6000-MAX 报价',
  '662.1 Level 3 多供应商竞争受控测试报价（可删除）',
  62000.00,
  'CNY',
  'ACTIVE',
  now(),
  now()
);

-- 3. 验证状态
SELECT "brand", "modelNumber", "status" FROM "supplier_product"
WHERE "id" = '0c0b273d-f346-416c-a8ec-d0ed134dfba6';

SELECT "title", "status", "price" FROM "offer"
WHERE "supplier_product_id" = '0c0b273d-f346-416c-a8ec-d0ed134dfba6';

COMMIT;
