\pset pager off
\pset format aligned
\echo '=== supplier_product columns ==='
SELECT column_name FROM information_schema.columns WHERE table_name='supplier_product' ORDER BY ordinal_position;

\echo '=== remaining demand ==='
SELECT id, title, description, organization_id, created_by, status, published_at
FROM demand;

\echo '=== remaining rfq ==='
SELECT id, status, demand_id, target_organization_id, created_by FROM rfq;

\echo '=== remaining offer ==='
SELECT id, supplier_product_id, organization_id, created_by, status, price, currency FROM offer;

\echo '=== remaining inquiry ==='
SELECT id, product_id, organization_id, created_by_id, contact_name, message FROM inquiry;