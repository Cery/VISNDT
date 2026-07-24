-- VISNDT Admin Seed
-- Creates initial admin account: admin@vip.com / admin123456
-- Run: psql -U visndt -d visndt -f seed_admin.sql

DO $$
DECLARE
    org_id UUID := gen_random_uuid();
    user_id UUID := gen_random_uuid();
BEGIN
    -- 1. Create organization
    INSERT INTO "organization" (id, name, type, status, created_at, updated_at)
    VALUES (org_id, 'Admin Organization', 'ADMIN', 'ACTIVE', NOW(), NOW());

    -- 2. Create admin user
    INSERT INTO "user" (id, email, password_hash, name, status, organization_id, created_at, updated_at)
    VALUES (
        user_id,
        'admin@vip.com',
        '$2b$10$SukGw543Sru4oI4bOxxPke259CSzQM.JId7OXLVwKb0oRNzch7u2.',
        'Admin',
        'ACTIVE',
        org_id,
        NOW(),
        NOW()
    );

    -- 3. Create organization member (ADMIN role)
    INSERT INTO "organization_member" (id, organization_id, user_id, role, created_at, updated_at)
    VALUES (gen_random_uuid(), org_id, user_id, 'ADMIN', NOW(), NOW());

    RAISE NOTICE 'Admin account created: admin@vip.com / admin123456';
END $$;