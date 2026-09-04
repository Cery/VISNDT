SELECT 'wf.pairs', string_agg(DISTINCT entity_type || ':' || action, ',') FROM workflow_event;
SELECT 'wf.pairs_all', string_agg(entity_type || ':' || action, ' | ') FROM (SELECT DISTINCT entity_type, action FROM workflow_event) w;
SELECT 'notification.types_count', string_agg(type::text || '=' || c, ',') FROM (SELECT type, count(*) c FROM notification GROUP BY type) n;
SELECT 'demand.title', string_agg(DISTINCT demand_parameter IS NULL::bool::text, ',') FROM demand;
SELECT 'demand.with_org', string_agg((organization_id IS NOT NULL)::text, ',') FROM demand;
SELECT 'orgm.with_user', string_agg((user_id IS NOT NULL)::text, ',') FROM organization_member;