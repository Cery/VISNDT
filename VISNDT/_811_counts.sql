SELECT c.id, c.name, c.slug,
  (SELECT count(*) FROM "product" p WHERE p."categoryId"=c.id) AS products,
  (SELECT count(*) FROM "product_category" ch WHERE ch."parentId"=c.id) AS children
FROM "product_category" c
ORDER BY products DESC, children DESC, c.name;