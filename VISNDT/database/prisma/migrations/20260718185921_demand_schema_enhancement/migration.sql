-- AlterEnum
ALTER TYPE "DemandStatus" ADD VALUE 'PUBLISHED';

-- AlterTable
ALTER TABLE "demand" ADD COLUMN     "close_reason" TEXT,
ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_name" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "contact_visible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expected_delivery_date" TIMESTAMP(3),
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "quantity_unit" TEXT;

-- CreateIndex
CREATE INDEX "demand_published_at_idx" ON "demand"("published_at");
