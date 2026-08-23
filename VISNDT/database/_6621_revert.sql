UPDATE "supplier_product" SET "status"='SUBMITTED', "published_at"=NULL WHERE "id"='2b3ae93e-741c-4461-b1b8-03d334059f40';
SELECT "status", count(*) FROM "supplier_product" GROUP BY "status" ORDER BY "status";
SELECT count(*) AS published_count FROM "supplier_product" WHERE "status"='PUBLISHED';
