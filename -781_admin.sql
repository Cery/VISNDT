SELECT u.email, om.role, o.name AS org_name, o.organization_type
FROM "organization_member" om
JOIN "user" u ON u.id = om.user_id
JOIN "organization" o ON o.id = om.organization_id
WHERE u.email LIKE '%admin%' OR u.email LIKE '%demo%'
ORDER BY u.email;