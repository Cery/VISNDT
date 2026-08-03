-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'PROCESSING', 'REPLIED', 'CLOSED');

-- CreateTable
CREATE TABLE "inquiry" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "organization_id" UUID,
    "created_by_id" UUID,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inquiry_organization_id_idx" ON "inquiry"("organization_id");

-- CreateIndex
CREATE INDEX "inquiry_product_id_idx" ON "inquiry"("product_id");

-- CreateIndex
CREATE INDEX "inquiry_created_by_id_idx" ON "inquiry"("created_by_id");

-- CreateIndex
CREATE INDEX "inquiry_status_idx" ON "inquiry"("status");

-- CreateIndex
CREATE INDEX "inquiry_created_at_idx" ON "inquiry"("created_at");

-- AddForeignKey
ALTER TABLE "inquiry" ADD CONSTRAINT "inquiry_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry" ADD CONSTRAINT "inquiry_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry" ADD CONSTRAINT "inquiry_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;