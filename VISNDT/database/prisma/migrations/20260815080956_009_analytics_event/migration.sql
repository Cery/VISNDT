-- CreateEnum
CREATE TYPE "ConversionEventType" AS ENUM ('PAGE_VIEW', 'PRODUCT_VIEW', 'CONTENT_VIEW', 'SEARCH', 'PRODUCT_FILTER', 'CTA_CLICK', 'INQUIRY_START', 'INQUIRY_SUBMIT');

-- CreateTable
CREATE TABLE "conversion_event" (
    "id" UUID NOT NULL,
    "event" "ConversionEventType" NOT NULL,
    "user_id" UUID,
    "organization_id" UUID,
    "session_id" TEXT,
    "entity_type" TEXT,
    "entity_id" UUID,
    "source" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversion_event_event_idx" ON "conversion_event"("event");

-- CreateIndex
CREATE INDEX "conversion_event_user_id_idx" ON "conversion_event"("user_id");

-- CreateIndex
CREATE INDEX "conversion_event_organization_id_idx" ON "conversion_event"("organization_id");

-- CreateIndex
CREATE INDEX "conversion_event_session_id_idx" ON "conversion_event"("session_id");

-- CreateIndex
CREATE INDEX "conversion_event_entity_type_entity_id_idx" ON "conversion_event"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "conversion_event_created_at_idx" ON "conversion_event"("created_at");

-- CreateIndex
CREATE INDEX "conversion_event_event_created_at_idx" ON "conversion_event"("event", "created_at");
