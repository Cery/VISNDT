-- ===========================================
-- Migration: Batch 3 Schema Fixes
-- ===========================================
-- Fix 1: AuditLog.operatorId - make nullable + onDelete SetNull
-- Fix 2: DemandMatch.offerId - already nullable, no schema change needed (logic already updated)

-- 1. Drop existing foreign key constraint on AuditLog.operatorId
ALTER TABLE "audit_log" DROP CONSTRAINT IF EXISTS "audit_log_operator_id_fkey";

-- 2. Make operatorId nullable
ALTER TABLE "audit_log" ALTER COLUMN "operator_id" DROP NOT NULL;

-- 3. Re-create foreign key with onDelete: SetNull
ALTER TABLE "audit_log"
ADD CONSTRAINT "audit_log_operator_id_fkey"
FOREIGN KEY ("operator_id")
REFERENCES "user"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
