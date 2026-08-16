-- ===========================================
-- Migration 010: AI Data Preparation
-- ===========================================
-- Add vector embedding support for Content and Product
-- Add SEO fields for Product
-- Add ContentChunk table for RAG/Semantic Search

-- 1. Product: Add slug, seoTitle, embedding
ALTER TABLE "product"
ADD COLUMN "slug" TEXT,
ADD COLUMN "seo_title" TEXT,
ADD COLUMN "embedding" vector(1536);

-- 2. Product: Add unique constraint on slug
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- 3. Content: Add embedding
ALTER TABLE "content"
ADD COLUMN "embedding" vector(1536);

-- 4. ContentChunk: New table
CREATE TABLE "content_chunk" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_id" UUID NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" vector(1536),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_chunk_pkey" PRIMARY KEY ("id")
);

-- 5. ContentChunk: Foreign key to Content
ALTER TABLE "content_chunk"
ADD CONSTRAINT "content_chunk_content_id_fkey"
FOREIGN KEY ("content_id") REFERENCES "content"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. ContentChunk: Index on content_id
CREATE INDEX "content_chunk_content_id_idx" ON "content_chunk"("content_id");