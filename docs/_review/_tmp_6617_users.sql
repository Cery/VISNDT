\pset format aligned
SELECT email, name, status, organization_id FROM "user" ORDER BY email;
SELECT om.id, om.organization_id, om.user_id, om.role, u.email AS user_email, o.name AS org_name
FROM organization_member om
JOIN "user" u ON u.id = om.user_id
JOIN organization o ON o.id = om.organization_id
ORDER BY o.name;
