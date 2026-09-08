BEGIN;
UPDATE product
SET description = regexp_replace(
    description,
    '^\[M34\.6 CONTROLLED TEST DATA\]\[PUBLIC SOURCE DATA\]\s*',
    ''
  )
WHERE description ILIKE '%M34.6 CONTROLLED TEST DATA%'
  AND description ILIKE '%PUBLIC SOURCE DATA%';
SELECT id, name, description FROM product WHERE id IN ('ebb1c034-4280-480b-89ce-29753660e126','98fe9224-12b1-4b2e-ba5d-f17f23f7e9e2','a5a26d69-320f-4c95-a480-3d15f2faea2a','38a711ff-9352-40ea-978b-90ecd566b826');
COMMIT;