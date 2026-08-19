\echo === CATEGORIES ===
SELECT id, name, slug, parent_id FROM product_category ORDER BY name;

\echo === PARAMETER_GROUPS ===
SELECT id, name, code FROM parameter_group ORDER BY code;

\echo === PARAMETER_DEFINITIONS ===
SELECT id, name, parameter_code, data_type, value_unit, parameter_group_id FROM parameter_definition ORDER BY parameter_code;

\echo === USERS ===
SELECT id, email, name, organization_id FROM "user" ORDER BY email;

\echo === ORGANIZATIONS ===
SELECT id, name, organization_type FROM organization ORDER BY name;

\echo === KNOWLEDGE_DOMAINS ===
SELECT id, name, slug FROM knowledge_domain ORDER BY slug;

\echo === KNOWLEDGE_CATEGORIES ===
SELECT id, domain_id, name, slug FROM knowledge_category ORDER BY slug;

\echo === DEMANDS ===
SELECT id, title, created_by, status, category_id FROM demand ORDER BY created_at DESC;

\echo === CONTENTS ===
SELECT id, type, title, status, author_id FROM content ORDER BY title;