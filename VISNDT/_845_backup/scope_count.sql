WITH u AS (SELECT id FROM "user" WHERE email IN ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local')),
o AS (SELECT id FROM organization WHERE id IN ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5'))
SELECT 'org' t, count(*) FROM organization WHERE id IN (SELECT id FROM o)
UNION ALL SELECT 'user', count(*) FROM "user" WHERE id IN (SELECT id FROM u)
UNION ALL SELECT 'org_member', count(*) FROM organization_member WHERE organization_id IN (SELECT id FROM o) OR user_id IN (SELECT id FROM u)
UNION ALL SELECT 'supplier_product', count(*) FROM supplier_product WHERE organization_id IN (SELECT id FROM o)
UNION ALL SELECT 'demand', count(*) FROM demand WHERE organization_id IN (SELECT id FROM o)
UNION ALL SELECT 'demand_match', count(*) FROM demand_match WHERE demand_id IN (SELECT id FROM demand WHERE organization_id IN (SELECT id FROM o))
UNION ALL SELECT 'rfq', count(*) FROM rfq WHERE target_organization_id IN (SELECT id FROM o) OR created_by IN (SELECT id FROM u)
UNION ALL SELECT 'rfq_response', count(*) FROM rfq_response WHERE organization_id IN (SELECT id FROM o)
UNION ALL SELECT 'offer', count(*) FROM offer WHERE organization_id IN (SELECT id FROM o)
UNION ALL SELECT 'inquiry', count(*) FROM inquiry WHERE organization_id IN (SELECT id FROM o)
UNION ALL SELECT 'buyer_evaluation', count(*) FROM buyer_evaluation WHERE user_id IN (SELECT id FROM u)
UNION ALL SELECT 'conversion_event', count(*) FROM conversion_event WHERE organization_id IN (SELECT id FROM o) OR user_id IN (SELECT id FROM u);