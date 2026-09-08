\pset pager off
\t
\echo '=== PROTECTED - admin ==='
SELECT count(*) FROM "user" WHERE email='admin@visndt.com' AND status='ACTIVE';
\echo '=== PROTECTED - orgs 微视/知象 ==='
SELECT count(*) FROM organization WHERE id IN ('697c99b2-1447-491a-a68a-566f51ca9181','be7e5cd7-b86e-4e75-9eb2-8d28ec41af42') AND status='ACTIVE';
\echo '=== DELETED - orgs ==='
SELECT count(*) FROM organization WHERE id IN
 ('5538dbde-8a84-41e9-a74a-49c9fbc218b2','60e379fa-cb34-4af8-bcac-9b67be521464','926d5a96-e1be-455c-8d58-8f4a79b6735d','8b0e7521-b98b-42ab-8005-4f32f0063551','eeb1bfc1-0774-49f7-8aa2-8a2b96ec0e3d','3159cda3-2057-4da9-8572-68b00c082cb5');
\echo '=== DELETED - users ==='
SELECT count(*) FROM "user" WHERE email IN
 ('vsndt@sz-wise.cn','demo.admin@visndt.local','buyer@visndt.com','demo.supplier.01@visndt.local','demo.buyer.01@visndt.local','demo.supplier.02@visndt.local');
\t
\echo '=== ORPHAN SCAN: conversion_event (no FK) referencing deleted orgs/users ==='
SELECT count(*) FROM conversion_event WHERE
 user_id NOT IN (SELECT id FROM "user") OR
 (organization_id IS NOT NULL AND organization_id NOT IN (SELECT id FROM organization));