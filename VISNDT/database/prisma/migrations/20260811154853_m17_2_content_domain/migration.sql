-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('ARTICLE', 'KNOWLEDGE', 'SOLUTION', 'INSIGHT');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- AlterEnum
ALTER TYPE "WorkflowEntityType" ADD VALUE 'CONTENT';

-- CreateTable
CREATE TABLE "content" (
    "id" UUID NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "cover_image_id" UUID,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "author_id" UUID NOT NULL,
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "seo_title" TEXT,
    "seo_description" TEXT,
    "seo_keywords" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_slug_key" ON "content"("slug");

-- CreateIndex
CREATE INDEX "content_type_status_idx" ON "content"("type", "status");

-- CreateIndex
CREATE INDEX "content_author_id_idx" ON "content"("author_id");

-- CreateIndex
CREATE INDEX "content_status_idx" ON "content"("status");

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "file_asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
