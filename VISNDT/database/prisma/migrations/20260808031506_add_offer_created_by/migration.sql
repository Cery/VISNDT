-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_member" DROP CONSTRAINT "organization_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parameter_option" DROP CONSTRAINT "parameter_option_parameter_definition_id_fkey";

-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_parameter_definition" DROP CONSTRAINT "product_parameter_definition_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_parameter_value" DROP CONSTRAINT "product_parameter_value_product_id_fkey";

-- AlterTable
ALTER TABLE "audit_log" ALTER COLUMN "ip_address" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "offer" ADD COLUMN     "created_by" UUID;

-- AddForeignKey
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parameter_option" ADD CONSTRAINT "parameter_option_parameter_definition_id_fkey" FOREIGN KEY ("parameter_definition_id") REFERENCES "parameter_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_parameter_value" ADD CONSTRAINT "product_parameter_value_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_parameter_definition" ADD CONSTRAINT "product_parameter_definition_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
