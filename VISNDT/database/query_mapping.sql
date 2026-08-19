SELECT
  m.product_category_id,
  pc.name AS product_category_name,
  m.knowledge_category_id,
  kc.name AS knowledge_category_name,
  m.sort_order,
  m.is_active
FROM product_category_knowledge_mapping m
JOIN product_category pc ON pc.id = m.product_category_id
JOIN knowledge_category kc ON kc.id = m.knowledge_category_id
ORDER BY pc.name, m.sort_order;