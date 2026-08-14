-- Migration 008: Content Tagging & Taxonomy
-- M20.2.3 Content Tagging Taxonomy Development

-- CreateEnum
CREATE TYPE "ContentTagType" AS ENUM ('TOPIC', 'INDUSTRY', 'APPLICATION', 'TECHNOLOGY');

-- CreateTable
CREATE TABLE "content_tag" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ContentTagType" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_tag_relation" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_tag_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_tag_slug_key" ON "content_tag"("slug");

-- CreateIndex
CREATE INDEX "content_tag_relation_tag_id_idx" ON "content_tag_relation"("tag_id");

-- CreateIndex
CREATE INDEX "content_tag_relation_content_id_idx" ON "content_tag_relation"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_tag_relation_content_id_tag_id_key" ON "content_tag_relation"("content_id", "tag_id");

-- AddForeignKey
ALTER TABLE "content_tag_relation" ADD CONSTRAINT "content_tag_relation_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tag_relation" ADD CONSTRAINT "content_tag_relation_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "content_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;