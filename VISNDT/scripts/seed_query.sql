-- 589 Test Data: ProductCategoryKnowledgeMapping Seed
-- First, query existing ProductCategories
SELECT id, name, slug FROM product_category ORDER BY name;

-- Query existing KnowledgeCategories
SELECT kc.id, kc.name, kc.slug, kd.name as domain_name
FROM knowledge_category kc
JOIN knowledge_domain kd ON kc.domain_id = kd.id
ORDER BY kc.name;