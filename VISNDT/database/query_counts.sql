SELECT 'product_category' AS entity, count(*) AS cnt FROM product_category
UNION ALL SELECT 'parameter_definition', count(*) FROM parameter_definition
UNION ALL SELECT 'parameter_group', count(*) FROM parameter_group
UNION ALL SELECT '"user"', count(*) FROM "user"
UNION ALL SELECT 'organization', count(*) FROM organization
UNION ALL SELECT 'product', count(*) FROM product
UNION ALL SELECT 'product_parameter_value', count(*) FROM product_parameter_value
UNION ALL SELECT 'product_media', count(*) FROM product_media
UNION ALL SELECT 'offer', count(*) FROM offer
UNION ALL SELECT 'demand', count(*) FROM demand
UNION ALL SELECT 'inquiry', count(*) FROM inquiry
UNION ALL SELECT 'rfq', count(*) FROM rfq
UNION ALL SELECT 'rfq_response', count(*) FROM rfq_response
UNION ALL SELECT 'knowledge_category', count(*) FROM knowledge_category
UNION ALL SELECT 'knowledge_entry', count(*) FROM knowledge_entry
UNION ALL SELECT 'content', count(*) FROM content