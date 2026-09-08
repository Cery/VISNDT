\set ON_ERROR_STOP on
WITH dulp(tid) AS (SELECT id FROM parameter_definition WHERE name IN ('E2E测试参数','TC715-1787693599528 枚举参数')),
delorg(oid) AS (SELECT id FROM organization WHERE id IN ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')),
delusr(uid) AS (SELECT id FROM "user" WHERE email IN ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local')),
deldemand(did) AS (SELECT id FROM demand WHERE organization_id IN (SELECT oid FROM delorg))
SELECT
 (SELECT count(*) FROM product_parameter_definition WHERE parameter_definition_id IN (SELECT tid FROM dulp)) AS ppd_testparam,
 (SELECT count(*) FROM product_parameter_value WHERE parameter_definition_id IN (SELECT tid FROM dulp)) AS ppv_testparam,
 (SELECT count(*) FROM supplier_product_parameter_value WHERE parameter_definition_id IN (SELECT tid FROM dulp)) AS sppv_testparam,
 (SELECT count(*) FROM demand_parameter WHERE parameter_definition_id IN (SELECT tid FROM dulp)) AS dp_testparam,
 (SELECT count(*) FROM demand_parameter WHERE demand_id IN (SELECT did FROM deldemand)) AS dp_arrangement,
 (SELECT count(*) FROM file_asset WHERE organization_id IN (SELECT oid FROM delorg)) AS file_asset,
 (SELECT count(*) FROM notification WHERE user_id IN (SELECT uid FROM delusr)) AS notification,
 (SELECT count(*) FROM user_invitation WHERE organization_id IN (SELECT oid FROM delorg)) AS invitation,
 (SELECT count(*) FROM conversion_event WHERE organization_id IN (SELECT oid FROM delorg) OR user_id IN (SELECT uid FROM delusr)) AS conv_event,
 (SELECT count(*) FROM offer WHERE organization_id IN (SELECT oid FROM delorg)) AS test_offer,
 (SELECT count(*) FROM rfq WHERE target_organization_id IN (SELECT oid FROM delorg) OR created_by IN (SELECT uid FROM delusr)) AS test_rfq,
 (SELECT count(*) FROM rfq_response WHERE organization_id IN (SELECT oid FROM delorg)) AS test_rfqresp;