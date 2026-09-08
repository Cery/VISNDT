-- 850 H04 targeted backup: product.description rows carrying test/internal markers
-- Copy exact affected rows BEFORE controlled update. Save as CSV via \copy below.
\o /tmp/850_h04_pre_product_backup.csv
\copy (SELECT id, name, model, status, description FROM product WHERE description ILIKE '%M34.6%' OR description ILIKE '%CONTROLLED TEST DATA%' OR description ILIKE '%PUBLIC SOURCE DATA%') TO STDOUT WITH CSV HEADER
\o