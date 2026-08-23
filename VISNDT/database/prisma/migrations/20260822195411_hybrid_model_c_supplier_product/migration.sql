-- CreateEnum
CREATE TYPE "SupplierProductStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'PUBLISHED', 'REJECTED');

-- AlterEnum
ALTER TYPE "FileEntityType" ADD VALUE 'SUPPLIER_PRODUCT';

-- AlterTable
ALTER TABLE "offer" ADD COLUMN     "supplier_product_id" UUID;

-- CreateTable
CREATE TABLE "supplier_product" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "platform_product_id" UUID NOT NULL,
    "brand" TEXT NOT NULL,
    "series" TEXT,
    "modelNumber" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "technical_description" TEXT,
    "application_info" TEXT,
    "status" "SupplierProductStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by" UUID,
    "reviewed_note" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_product_media" (
    "id" UUID NOT NULL,
    "supplier_product_id" UUID NOT NULL,
    "file_asset_id" UUID,
    "media_type" "FileType" NOT NULL,
    "document_type" TEXT,
    "title" TEXT,
    "alt_text" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_product_parameter_value" (
    "id" UUID NOT NULL,
    "supplier_product_id" UUID NOT NULL,
    "parameter_definition_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "value_number" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_product_parameter_value_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplier_product_slug_key" ON "supplier_product"("slug");

-- CreateIndex
CREATE INDEX "supplier_product_organization_id_idx" ON "supplier_product"("organization_id");

-- CreateIndex
CREATE INDEX "supplier_product_platform_product_id_idx" ON "supplier_product"("platform_product_id");

-- CreateIndex
CREATE INDEX "supplier_product_modelNumber_idx" ON "supplier_product"("modelNumber");

-- CreateIndex
CREATE INDEX "supplier_product_status_idx" ON "supplier_product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_product_organization_id_platform_product_id_modelN_key" ON "supplier_product"("organization_id", "platform_product_id", "modelNumber");

-- CreateIndex
CREATE INDEX "supplier_product_media_supplier_product_id_idx" ON "supplier_product_media"("supplier_product_id");

-- CreateIndex
CREATE INDEX "supplier_product_media_file_asset_id_idx" ON "supplier_product_media"("file_asset_id");

-- CreateIndex
CREATE INDEX "supplier_product_parameter_value_parameter_definition_id_idx" ON "supplier_product_parameter_value"("parameter_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_product_parameter_value_supplier_product_id_parame_key" ON "supplier_product_parameter_value"("supplier_product_id", "parameter_definition_id");

-- CreateIndex
CREATE INDEX "offer_supplier_product_id_idx" ON "offer"("supplier_product_id");

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_supplier_product_id_fkey" FOREIGN KEY ("supplier_product_id") REFERENCES "supplier_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_platform_product_id_fkey" FOREIGN KEY ("platform_product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product" ADD CONSTRAINT "supplier_product_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product_media" ADD CONSTRAINT "supplier_product_media_supplier_product_id_fkey" FOREIGN KEY ("supplier_product_id") REFERENCES "supplier_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product_media" ADD CONSTRAINT "supplier_product_media_file_asset_id_fkey" FOREIGN KEY ("file_asset_id") REFERENCES "file_asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product_parameter_value" ADD CONSTRAINT "supplier_product_parameter_value_supplier_product_id_fkey" FOREIGN KEY ("supplier_product_id") REFERENCES "supplier_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_product_parameter_value" ADD CONSTRAINT "supplier_product_parameter_value_parameter_definition_id_fkey" FOREIGN KEY ("parameter_definition_id") REFERENCES "parameter_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
