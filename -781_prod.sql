SELECT p.id, p.name, p.slug, c.name AS category_name
FROM product p
LEFT JOIN product_category c ON c.id = p.category_id
ORDER BY p.name;