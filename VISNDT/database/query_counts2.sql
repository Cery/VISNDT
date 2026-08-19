SELECT 'parameter_option' AS entity, count(*) AS cnt FROM parameter_option
UNION ALL SELECT 'product_category_knowledge_mapping', count(*) FROM product_category_knowledge_mapping
UNION ALL SELECT 'demand_parameter', count(*) FROM demand_parameter
UNION ALL SELECT 'demand_match', count(*) FROM demand_match
UNION ALL SELECT 'workflow_event', count(*) FROM workflow_event
UNION ALL SELECT 'notification', count(*) FROM notification
UNION ALL SELECT 'organization_member', count(*) FROM organization_member
UNION ALL SELECT 'file_asset', count(*) FROM file_asset
UNION ALL SELECT 'knowledge_domain', count(*) FROM knowledge_domain
UNION ALL SELECT 'content', count(*) FROM content