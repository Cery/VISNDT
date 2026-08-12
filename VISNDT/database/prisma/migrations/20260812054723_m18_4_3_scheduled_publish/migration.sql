-- AlterTable
ALTER TABLE "content" ADD COLUMN     "scheduled_publish_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "content_status_scheduled_publish_at_idx" ON "content"("status", "scheduled_publish_at");
