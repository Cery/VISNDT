-- 明视组织 UUID 修复：非法 variant 位 'd' → 合法 v4（与修复后 demoId 一致）
BEGIN;

-- Step 1: 复制明视组织为合法 v4 id
INSERT INTO organization (id, name, organization_type, status, created_at, updated_at)
SELECT '926d5a96-e1be-455c-8d58-8f4a79b6735d', name, organization_type, status, created_at, updated_at
FROM organization WHERE id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';

-- Step 2: 级联更新子表引用
UPDATE "user" SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE organization_member SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE offer SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE demand SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE inquiry SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE rfq SET target_organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE target_organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE rfq_response SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE user_invitation SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';
UPDATE conversion_event SET organization_id = '926d5a96-e1be-455c-8d58-8f4a79b6735d' WHERE organization_id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';

-- Step 3: 删除旧组织
DELETE FROM organization WHERE id = '926d5a96-e1be-455c-dd58-8f4a79b6735d';

COMMIT;