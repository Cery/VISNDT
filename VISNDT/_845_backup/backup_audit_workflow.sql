\t
\echo '=== audit_log rows operator by test users ==='
COPY (SELECT al.* FROM audit_log al WHERE operator_id IN (
  SELECT id FROM "user" WHERE email IN
  ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com',
   'demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local')))
TO '/tmp/bk_audit_test_users.csv' WITH CSV HEADER;

\echo '=== workflow_event operator by test users ==='
COPY (SELECT we.* FROM workflow_event we WHERE operator_id IN (
  SELECT id FROM "user" WHERE email IN
  ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com',
   'demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local')))
TO '/tmp/bk_workflow_test_users.csv' WITH CSV HEADER;