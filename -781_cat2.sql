SELECT p.name AS product, c.name AS cat_name
FROM product p LEFT JOIN product_category c ON c.id = p.category_id
ORDER BY p.name;