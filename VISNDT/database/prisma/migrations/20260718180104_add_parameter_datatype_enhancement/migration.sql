/*
  Warnings:

  - The `data_type` column on the `parameter_definition` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParameterDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'ENUM');

-- AlterTable
ALTER TABLE "parameter_definition" DROP COLUMN "data_type",
ADD COLUMN     "data_type" "ParameterDataType" NOT NULL DEFAULT 'STRING';

-- AlterTable
ALTER TABLE "product_parameter_value" ADD COLUMN     "value_number" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "product_parameter_value_parameter_definition_id_value_numbe_idx" ON "product_parameter_value"("parameter_definition_id", "value_number");
