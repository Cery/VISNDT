-- CreateEnum
CREATE TYPE "EvaluationTargetType" AS ENUM ('PRODUCT', 'SUPPLIER_PRODUCT');

-- CreateEnum
CREATE TYPE "EvaluationState" AS ENUM ('INTERESTED', 'SHORTLISTED', 'COMPARING', 'CONTACTED');

-- CreateTable
CREATE TABLE "buyer_evaluation" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "target_type" "EvaluationTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "state" "EvaluationState" NOT NULL DEFAULT 'INTERESTED',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "buyer_evaluation_user_id_idx" ON "buyer_evaluation"("user_id");

-- CreateIndex
CREATE INDEX "buyer_evaluation_target_type_target_id_idx" ON "buyer_evaluation"("target_type", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_evaluation_user_id_target_type_target_id_key" ON "buyer_evaluation"("user_id", "target_type", "target_id");

-- AddForeignKey
ALTER TABLE "buyer_evaluation" ADD CONSTRAINT "buyer_evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;