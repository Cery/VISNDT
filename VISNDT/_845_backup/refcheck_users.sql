\pset pager off
\t
WITH du(uid) AS (
  SELECT id FROM "user" WHERE email IN
  ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com',
   'demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local')
),
doo(oid) AS (
  SELECT id FROM organization WHERE id IN
  ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464',
   '926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551',
   'eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5')
)
SELECT 'workflow_event.operator_id' AS ref, count(*) FROM workflow_event WHERE operator_id IN (SELECT uid FROM du)
UNION ALL SELECT 'audit_log.operator_id', count(*) FROM audit_log WHERE operator_id IN (SELECT uid FROM du)
UNION ALL SELECT 'workflow_event.entity=delDemand', count(*)
  FROM workflow_event WHERE entity_type::text='DEMAND' AND entity_id IN (SELECT id FROM demand WHERE organization_id IN (SELECT oid FROM doo))
UNION ALL SELECT 'workflow_event.entity=delRFQ', count(*)
  FROM workflow_event WHERE entity_type::text='RFQ' AND entity_id IN (
    SELECT id FROM rfq WHERE target_organization_id IN (SELECT oid FROM doo) OR created_by IN (SELECT uid FROM du))
UNION ALL SELECT 'workflow_event.entity=delOffer', count(*)
  FROM workflow_event WHERE entity_type::text='OFFER' AND entity_id IN (SELECT id FROM offer WHERE organization_id IN (SELECT oid FROM doo))
UNION ALL SELECT 'workflow_event.entity=delSupplierProduct', count(*)
  FROM workflow_event WHERE entity_type::text='SUPPLIER_PRODUCT' AND entity_id IN (SELECT id FROM supplier_product WHERE organization_id IN (SELECT oid FROM doo))
UNION ALL SELECT 'workflow_event.entity=delInquiry', count(*)
  FROM workflow_event WHERE entity_type::text='INQUIRY' AND entity_id IN (SELECT id FROM inquiry WHERE organization_id IN (SELECT oid FROM doo));