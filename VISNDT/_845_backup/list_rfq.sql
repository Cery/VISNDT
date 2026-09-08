SELECT r.id, r.status::text, (SELECT u.email FROM "user" u WHERE u.id=r.created_by) AS creator,
       (SELECT o.name FROM organization o WHERE o.id=r.target_organization_id) AS target_org,
       r.demand_id IS NOT NULL AS has_demand
FROM rfq r ORDER BY creator;