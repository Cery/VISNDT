\pset pager off
\pset format aligned
\echo '=== ALL ORGANIZATIONS ==='
SELECT id, name, organization_type, status FROM organization ORDER BY created_at;

\echo '=== ALL USERS ==='
SELECT u.id, u.email, u.organization_id, u.status, o.name AS org_name
FROM "user" u LEFT JOIN organization o ON o.id = u.organization_id
ORDER BY u.created_at;