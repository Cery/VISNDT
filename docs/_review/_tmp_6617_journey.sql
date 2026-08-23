\pset format aligned
SELECT p.id, p.name, p.slug, p.status, pc.name AS category, (SELECT count(*) FROM offer o WHERE o.product_id=p.id) AS offers
FROM product p LEFT JOIN product_category pc ON pc.id = p.category_id
ORDER BY p.name;
SELECT id, name FROM product_category ORDER BY name;
SELECT o.id, o.status, o.price_from, o.price_to, o.currency, p.name AS product, org.name AS org
FROM offer o JOIN product p ON p.id=o.product_id JOIN organization org ON org.id=o.organization_id
ORDER BY o.status, org.name;
SELECT d.id, d.title, d.status, org.name AS org FROM demand d JOIN organization org ON org.id=d.organization_id ORDER BY d.title;
