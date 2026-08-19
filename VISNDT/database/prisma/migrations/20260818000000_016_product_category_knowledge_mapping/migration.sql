-- CreateTable
CREATE TABLE "product_category_knowledge_mapping" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_category_id" UUID NOT NULL,
    "knowledge_category_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_category_knowledge_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_category_knowledge_mapping_product_category_id_knowle_key" ON "product_category_knowledge_mapping"("product_category_id", "knowledge_category_id");

-- CreateIndex
CREATE INDEX "product_category_knowledge_mapping_product_category_id_idx" ON "product_category_knowledge_mapping"("product_category_id");

-- CreateIndex
CREATE INDEX "product_category_knowledge_mapping_knowledge_category_id_idx" ON "product_category_knowledge_mapping"("knowledge_category_id");

-- AddForeignKey
ALTER TABLE "product_category_knowledge_mapping" ADD CONSTRAINT "product_category_knowledge_mapping_product_category_id_fkey" FOREIGN KEY ("product_category_id") REFERENCES "product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category_knowledge_mapping" ADD CONSTRAINT "product_category_knowledge_mapping_knowledge_category_id_fkey" FOREIGN KEY ("knowledge_category_id") REFERENCES "knowledge_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;