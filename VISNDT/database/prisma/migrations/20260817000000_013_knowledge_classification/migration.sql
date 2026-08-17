-- Migration 013: Knowledge Base Classification
-- Create KnowledgeDomain and KnowledgeCategory tables

CREATE TABLE "knowledge_domain" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_domain_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "knowledge_domain_slug_key" ON "knowledge_domain"("slug");

ALTER TABLE "knowledge_domain" ADD CONSTRAINT "knowledge_domain_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "knowledge_domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "knowledge_category" (
    "id" UUID NOT NULL,
    "domain_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "knowledge_category_domain_id_slug_key" ON "knowledge_category"("domain_id", "slug");

CREATE INDEX "knowledge_category_domain_id_idx" ON "knowledge_category"("domain_id");

ALTER TABLE "knowledge_category" ADD CONSTRAINT "knowledge_category_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "knowledge_domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;