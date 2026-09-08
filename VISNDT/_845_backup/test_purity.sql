\pset pager off
\t
\echo '=== Remaining orgs ==='
SELECT count(*) FROM organization WHERE status='ACTIVE';
\echo '=== Remaining users ==='
SELECT count(*) FROM "user" WHERE status='ACTIVE' AND email<>'system@visndt.com';
\echo '=== SupplierProduct preserved orgs ==='
SELECT count(*) FROM supplier_product sp JOIN organization o ON o.id=sp.organization_id
WHERE o.id IN ('697c99b2-1447-491a-a68a-566f51ca9181','be7e5cd7-b86e-4e75-9eb2-8d28ec41af42');
\echo '=== Demand preserved orgs ==='
SELECT count(*) FROM demand d JOIN organization o ON o.id=d.organization_id
WHERE o.id IN ('697c99b2-1447-491a-a68a-566f51ca9181','be7e5cd7-b86e-4e75-9eb2-8d28ec41af42');
\echo '=== Test markers in demand ==='
SELECT count(*) FROM demand WHERE title ILIKE '%test%' OR title ILIKE '%demo%' OR title ILIKE '%e2e%' OR title ILIKE '%mock%' OR title ILIKE '%fixture%' OR title ILIKE '%控制%' OR description ILIKE '%test%';
\echo '=== Test markers in supplier_product ==='
SELECT count(*) FROM supplier_product WHERE name ILIKE '%test%' OR name ILIKE '%demo%' OR name ILIKE '%e2e%' OR brand ILIKE '%test%';
\echo '=== Test markers in product ==='
SELECT count(*) FROM product WHERE name ILIKE '%test%' OR name ILIKE '%demo%' OR name ILIKE '%e2e%';
\echo '=== Test markers in content ==='
SELECT count(*) FROM content WHERE title ILIKE '%test%' OR title ILIKE '%demo%' OR title ILIKE '%e2e%';
\echo '=== Remaining audit_log ==='
SELECT count(*) FROM audit_log;