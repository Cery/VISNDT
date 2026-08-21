-- Migration: add_file_asset_isolation_and_file_type_taxonomy
-- B.2 media schema minimal migration (FileAsset isolation + lifecycle + soft delete + taxonomy)

-- AlterEnum: FileType — add taxonomy values
ALTER TYPE "FileType" ADD VALUE 'SPEC_SHEET';
ALTER TYPE "FileType" ADD VALUE 'ILLUSTRATION';

-- CreateEnum: FileAssetStatus
CREATE TYPE "FileAssetStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- AlterTable: file_asset — add organization isolation / lifecycle status / soft delete
ALTER TABLE "file_asset"
  ADD COLUMN "organization_id" UUID,
  ADD COLUMN "status" "FileAssetStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "deleted_at" TIMESTAMP(3);

-- Indexes
CREATE INDEX "file_asset_organization_id_idx" ON "file_asset"("organization_id");
CREATE INDEX "file_asset_status_idx" ON "file_asset"("status");
CREATE INDEX "file_asset_deleted_at_idx" ON "file_asset"("deleted_at");

-- Foreign key: organization deletion sets media affiliation to NULL (no cascade delete of media)
ALTER TABLE "file_asset"
  ADD CONSTRAINT "file_asset_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill organization_id from uploader's organization
UPDATE "file_asset" fa
SET "organization_id" = u."organization_id"
FROM "user" u
WHERE fa."uploaded_by" = u."id"
  AND u."organization_id" IS NOT NULL
  AND fa."organization_id" IS NULL;