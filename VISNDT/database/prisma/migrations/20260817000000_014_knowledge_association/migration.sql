-- Migration 014: Knowledge Association Layer
-- KnowledgeEntry + KnowledgeContentRef + KnowledgeRelation

-- CreateEnum
CREATE TYPE "KnowledgeEntryStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "KnowledgeReferenceType" AS ENUM ('SOURCE', 'RELATED', 'SUPPLEMENT');
CREATE TYPE "KnowledgeRelationType" AS ENUM ('RELATED', 'CHILD', 'PARENT', 'PREREQUISITE', 'FOLLOWUP');

-- CreateTable: knowledge_entry
CREATE TABLE "knowledge_entry" (
    "id"             UUID NOT NULL,
    "domain_id"      UUID NOT NULL,
    "category_id"    UUID NOT NULL,
    "title"          TEXT NOT NULL,
    "slug"           TEXT NOT NULL,
    "summary"        TEXT,
    "structured_body" JSONB NOT NULL,
    "status"         "KnowledgeEntryStatus" NOT NULL DEFAULT 'DRAFT',
    "author_id"      UUID NOT NULL,
    "published_at"   TIMESTAMP(3),
    "seo_title"      TEXT,
    "seo_description" TEXT,
    "seo_keywords"   TEXT,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_entry_slug_key" ON "knowledge_entry"("slug");
CREATE INDEX "knowledge_entry_domain_id_idx" ON "knowledge_entry"("domain_id");
CREATE INDEX "knowledge_entry_category_id_idx" ON "knowledge_entry"("category_id");
CREATE INDEX "knowledge_entry_author_id_idx" ON "knowledge_entry"("author_id");
CREATE INDEX "knowledge_entry_status_idx" ON "knowledge_entry"("status");

-- AddForeignKey
ALTER TABLE "knowledge_entry" ADD CONSTRAINT "knowledge_entry_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "knowledge_domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "knowledge_entry" ADD CONSTRAINT "knowledge_entry_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "knowledge_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "knowledge_entry" ADD CONSTRAINT "knowledge_entry_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: knowledge_content_ref
CREATE TABLE "knowledge_content_ref" (
    "id"             UUID NOT NULL,
    "knowledge_id"   UUID NOT NULL,
    "content_id"     UUID NOT NULL,
    "reference_type" "KnowledgeReferenceType" NOT NULL DEFAULT 'SOURCE',
    "sort_order"     INTEGER NOT NULL DEFAULT 0,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_content_ref_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_content_ref_knowledge_id_content_id_key" ON "knowledge_content_ref"("knowledge_id", "content_id");
CREATE INDEX "knowledge_content_ref_knowledge_id_idx" ON "knowledge_content_ref"("knowledge_id");
CREATE INDEX "knowledge_content_ref_content_id_idx" ON "knowledge_content_ref"("content_id");

-- AddForeignKey
ALTER TABLE "knowledge_content_ref" ADD CONSTRAINT "knowledge_content_ref_knowledge_id_fkey" FOREIGN KEY ("knowledge_id") REFERENCES "knowledge_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_content_ref" ADD CONSTRAINT "knowledge_content_ref_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: knowledge_relation
CREATE TABLE "knowledge_relation" (
    "id"            UUID NOT NULL,
    "source_id"     UUID NOT NULL,
    "target_id"     UUID NOT NULL,
    "relation_type" "KnowledgeRelationType" NOT NULL,
    "description"   TEXT,
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_relation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_relation_source_id_target_id_relation_type_key" ON "knowledge_relation"("source_id", "target_id", "relation_type");
CREATE INDEX "knowledge_relation_source_id_idx" ON "knowledge_relation"("source_id");
CREATE INDEX "knowledge_relation_target_id_idx" ON "knowledge_relation"("target_id");

-- AddForeignKey
ALTER TABLE "knowledge_relation" ADD CONSTRAINT "knowledge_relation_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "knowledge_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_relation" ADD CONSTRAINT "knowledge_relation_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "knowledge_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;