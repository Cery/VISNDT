-- AlterTable
ALTER TABLE "product" ADD COLUMN     "created_by_id" UUID;

-- CreateIndex
CREATE INDEX "product_created_by_id_idx" ON "product"("created_by_id");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
