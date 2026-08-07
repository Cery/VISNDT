-- Add ipAddress field to AuditLog
ALTER TABLE "audit_log" ADD COLUMN "ip_address" VARCHAR(45);