SELECT u.email, om.role, o.name AS org_name, o.organization_type, om.organization_id AS org_id
FROM "organization_member" om
JOIN "user" u ON u.id = om.user_id
JOIN "organization" o ON o.id = om.organization_id
WHERE u.email IN ('demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','admin.vs.763@visndt.local','admin.zx.763@visndt.local')
ORDER BY u.email;