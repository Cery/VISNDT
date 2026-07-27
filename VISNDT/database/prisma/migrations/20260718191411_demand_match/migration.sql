-- CreateEnum
CREATE TYPE "DemandMatchStatus" AS ENUM ('PENDING', 'MATCHED', 'REVIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "demand_match" (
    "id" UUID NOT NULL,
    "demand_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "match_score" DOUBLE PRECISION NOT NULL,
    "match_status" "DemandMatchStatus" NOT NULL DEFAULT 'PENDING',
    "match_details" JSONB,
    "offer_id" UUID,
    "matched_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demand_match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "demand_match_product_id_idx" ON "demand_match"("product_id");

-- CreateIndex
CREATE INDEX "demand_match_match_status_idx" ON "demand_match"("match_status");

-- CreateIndex
CREATE INDEX "demand_match_match_score_idx" ON "demand_match"("match_score");

-- CreateIndex
CREATE UNIQUE INDEX "demand_match_demand_id_product_id_key" ON "demand_match"("demand_id", "product_id");

-- AddForeignKey
ALTER TABLE "demand_match" ADD CONSTRAINT "demand_match_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_match" ADD CONSTRAINT "demand_match_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_match" ADD CONSTRAINT "demand_match_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
