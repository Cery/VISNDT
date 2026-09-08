\pset pager off
\set ON_ERROR_STOP on
\set QUIET off
BEGIN;

-- 1. demand_parameter (children of delete demands + test param defs)
DELETE FROM demand_parameter
WHERE demand_id IN (SELECT id FROM demand WHERE organization_id IN
  ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5'))
   OR parameter_definition_id IN (SELECT id FROM parameter_definition WHERE name IN ('E2E测试参数','TC715-1787693599528 枚举参数'));

-- 2. buyer_evaluation (children of delete users)
DELETE FROM buyer_evaluation WHERE user_id IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'));

-- 3. rfq_response
DELETE FROM rfq_response WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

-- 4. offer (must precede supplier_product)
DELETE FROM offer WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

-- 5. rfq
DELETE FROM rfq WHERE target_organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')
   OR created_by IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'));

-- 6. user_invitation (RESTRICT org+created_by; count=0, defensive)
DELETE FROM user_invitation WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')
   OR created_by IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'));

-- 6b. workflow_event (RESTRICT operator + test-business entity timeline)
DELETE FROM workflow_event
WHERE operator_id IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'))
   OR entity_id IN (
      SELECT id FROM demand WHERE organization_id IN
       ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')
      UNION ALL SELECT id FROM rfq WHERE target_organization_id IN
       ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')
      UNION ALL SELECT id FROM offer WHERE organization_id IN
       ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5'));

-- 7. demand_match (before demand)
DELETE FROM demand_match WHERE demand_id IN (SELECT id FROM demand WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5'));

-- 7. supplier_product (cascades media/parameter values)
DELETE FROM supplier_product WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

-- 8. inquiry
DELETE FROM inquiry WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

-- 9. demand
DELETE FROM demand WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

-- 10. notification (test-source)
DELETE FROM notification WHERE user_id IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'));

-- 11. organization_member
DELETE FROM organization_member WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')
   OR user_id IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'));

-- 11b. file_asset (uploaded_by RESTRICT -> test users, so must precede user delete)
DELETE FROM file_asset WHERE organization_id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

-- 11c. audit_log (RESTRICT operator -> test users; user-authorized 2026-09-07)
--      These 2789 audit rows are audit entries created by the deleted test/demo users,
--      recording test/demo activity only; production audit remains retained.
DELETE FROM audit_log WHERE operator_id IN (SELECT id FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local'));

-- 12. user
DELETE FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local');

-- 13. parameter_definition (registered test params, 0 references confirmed)
DELETE FROM parameter_definition WHERE name IN ('E2E测试参数','TC715-1787693599528 枚举参数');

-- 14. organization
DELETE FROM organization WHERE id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');

COMMIT;
SELECT 'PURGE_COMMITTED' AS status;