-- DropIndex
DROP INDEX "rfq_demand_id_key";

-- AlterTable
ALTER TABLE "rfq" ADD COLUMN     "source_match_id" UUID,
ADD COLUMN     "target_organization_id" UUID;

-- AlterTable
ALTER TABLE "rfq_response" ADD COLUMN     "decision_note" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "reviewed_by" UUID;

-- CreateIndex
CREATE INDEX "rfq_demand_id_idx" ON "rfq"("demand_id");

-- CreateIndex
CREATE INDEX "rfq_target_organization_id_status_idx" ON "rfq"("target_organization_id", "status");

-- CreateIndex
CREATE INDEX "rfq_response_reviewed_by_idx" ON "rfq_response"("reviewed_by");

-- CreateIndex
CREATE INDEX "rfq_response_rfq_id_status_idx" ON "rfq_response"("rfq_id", "status");

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_source_match_id_fkey" FOREIGN KEY ("source_match_id") REFERENCES "demand_match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_target_organization_id_fkey" FOREIGN KEY ("target_organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_response" ADD CONSTRAINT "rfq_response_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
