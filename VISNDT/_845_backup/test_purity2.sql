\pset pager off
\echo '=== Test markers in supplier_product (model/brand) ==='
SELECT count(*) FROM supplier_product WHERE
 model ILIKE '%test%' OR model ILIKE '%demo%' OR model ILIKE '%e2e%'
 OR brand ILIKE '%test%' OR brand ILIKE '%demo%';
\echo '=== All remaining supplier_product detail ==='
SELECT sp.id, sp.model, sp.organization_id, sp.status, o.name AS org
FROM supplier_product sp JOIN organization o ON o.id=sp.organization_id
ORDER BY o.name;
\echo '=== Remaining demand total ==='
SELECT count(*) FROM demand;
\echo '=== Remaining rfq/offer/inquiry ==='
SELECT (SELECT count(*) FROM rfq) AS rfq,
       (SELECT count(*) FROM offer) AS offer,
       (SELECT count(*) FROM inquiry) AS inquiry,
       (SELECT count(*) FROM demand_match) AS dm,
       (SELECT count(*) FROM rfq_response) AS rr;