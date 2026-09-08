\pset pager off
\t
\echo '=== Final business data counts ==='
SELECT (SELECT count(*) FROM organization) AS org,
       (SELECT count(*) FROM "user" WHERE email<>'system@visndt.com') AS usr,
       (SELECT count(*) FROM product) AS product,
       (SELECT count(*) FROM supplier_product) AS sp,
       (SELECT count(*) FROM demand) AS demand,
       (SELECT count(*) FROM demand_match) AS dm,
       (SELECT count(*) FROM rfq) AS rfq,
       (SELECT count(*) FROM rfq_response) AS rr,
       (SELECT count(*) FROM offer) AS offer,
       (SELECT count(*) FROM inquiry) AS inquiry,
       (SELECT count(*) FROM content) AS content,
       (SELECT count(*) FROM notification) AS notif,
       (SELECT count(*) FROM file_asset) AS file_asset,
       (SELECT count(*) FROM workflow_event) AS we,
       (SELECT count(*) FROM audit_log) AS audit;

\echo '=== Global orphan scan (rows referencing deleted users) ==='
SELECT count(*) FROM organization_member WHERE user_id NOT IN (SELECT id FROM "user");
\echo '=== Orphan: notification ==='
SELECT count(*) FROM notification WHERE user_id NOT IN (SELECT id FROM "user");
\echo '=== Orphan: buyer_evaluation ==='
SELECT count(*) FROM buyer_evaluation WHERE user_id NOT IN (SELECT id FROM "user");
\echo '=== Orphan: refresh_token ==='
SELECT count(*) FROM refresh_token WHERE user_id NOT IN (SELECT id FROM "user");
\echo '=== Orphan: workflow_event ==='
SELECT count(*) FROM workflow_event WHERE operator_id NOT IN (SELECT id FROM "user");
\echo '=== Orphan: audit_log ==='
SELECT count(*) FROM audit_log WHERE operator_id NOT IN (SELECT id FROM "user");
\echo '=== Orphan: supplier_product/reward for orgs ==='
SELECT count(*) FROM supplier_product WHERE organization_id NOT IN (SELECT id FROM organization);
\echo '=== Orphan: demand ==='
SELECT count(*) FROM demand WHERE organization_id NOT IN (SELECT id FROM organization);
\echo '=== Orphan: content_author ==='
SELECT count(*) FROM content WHERE author_id IS NOT NULL AND author_id NOT IN (SELECT id FROM "user");