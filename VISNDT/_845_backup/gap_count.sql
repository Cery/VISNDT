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
SELECT 'audit_log.op' AS gap, count(*) FROM audit_log WHERE operator_id IN (SELECT uid FROM du)
UNION ALL SELECT 'workflow_event.op', count(*) FROM workflow_event WHERE operator_id IN (SELECT uid FROM du)
UNION ALL SELECT 'user_invitation.org', count(*) FROM user_invitation WHERE organization_id IN (SELECT oid FROM doo)
UNION ALL SELECT 'user_invitation.created_by', count(*) FROM user_invitation WHERE created_by IN (SELECT uid FROM du)
UNION ALL SELECT 'content.author_id', count(*) FROM content WHERE author_id IN (SELECT uid FROM du)
UNION ALL SELECT 'knowledge_entry.author_id', count(*) FROM knowledge_entry WHERE author_id IN (SELECT uid FROM du)
UNION ALL SELECT 'file_asset.uploaded_by', count(*) FROM file_asset WHERE uploaded_by IN (SELECT uid FROM du)
UNION ALL SELECT 'file_asset.org', count(*) FROM file_asset WHERE organization_id IN (SELECT oid FROM doo)
UNION ALL SELECT 'refresh_token.op', count(*) FROM refresh_token WHERE user_id IN (SELECT uid FROM du);