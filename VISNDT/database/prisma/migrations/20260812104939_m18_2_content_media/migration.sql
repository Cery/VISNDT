-- AlterEnum
ALTER TYPE "FileEntityType" ADD VALUE 'CONTENT';

-- CreateEnum
CREATE TYPE "ContentMediaType" AS ENUM ('IMAGE', 'ATTACHMENT');

-- CreateTable
CREATE TABLE "content_media" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "file_asset_id" UUID,
    "type" "ContentMediaType" NOT NULL DEFAULT 'IMAGE',
    "caption" TEXT,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_media_content_id_idx" ON "content_media"("content_id");

-- CreateIndex
CREATE INDEX "content_media_file_asset_id_idx" ON "content_media"("file_asset_id");

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_file_asset_id_fkey" FOREIGN KEY ("file_asset_id") REFERENCES "file_asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;