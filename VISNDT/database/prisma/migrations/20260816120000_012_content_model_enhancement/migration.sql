-- Migration 012: Content Model Enhancement
-- Adds estimated_read_time field and (status, published_at) index for efficient public content queries.

ALTER TABLE "content" ADD COLUMN "estimated_read_time" INTEGER;

CREATE INDEX "content_status_published_at_idx" ON "content" ("status", "published_at");