-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DemandStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PROCESSING', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RFQStatus" AS ENUM ('DRAFT', 'OPEN', 'RESPONDING', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RFQResponseStatus" AS ENUM ('SUBMITTED', 'VIEWED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkflowEntityType" AS ENUM ('DEMAND', 'RFQ', 'RFQ_RESPONSE');

-- CreateEnum
CREATE TYPE "WorkflowAction" AS ENUM ('CREATED', 'SUBMITTED', 'OPENED', 'RESPONDED', 'ACCEPTED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'DEMAND_UPDATE', 'RFQ_UPDATE', 'RESPONSE_UPDATE');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ');

-- CreateEnum
CREATE TYPE "FileEntityType" AS ENUM ('PRODUCT', 'ORGANIZATION', 'DEMAND', 'RFQ', 'RFQ_RESPONSE');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'DOCUMENT', 'CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'LOGIN');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "organization_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "organization_type" TEXT NOT NULL,
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_member" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameter_group" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parameter_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameter_definition" (
    "id" UUID NOT NULL,
    "parameter_group_id" UUID,
    "name" TEXT NOT NULL,
    "parameter_code" TEXT NOT NULL,
    "data_type" TEXT NOT NULL,
    "value_unit" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parameter_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameter_option" (
    "id" UUID NOT NULL,
    "parameter_definition_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parameter_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_parameter_value" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "parameter_definition_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_parameter_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_parameter_definition" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "parameter_definition_id" UUID NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_parameter_definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demand" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "organization_id" UUID,
    "created_by" UUID NOT NULL,
    "status" "DemandStatus" NOT NULL DEFAULT 'DRAFT',
    "parameters_json" JSONB,
    "budget_range" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq" (
    "id" UUID NOT NULL,
    "demand_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "status" "RFQStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_response" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "offer_id" UUID,
    "message" TEXT,
    "status" "RFQResponseStatus" NOT NULL DEFAULT 'SUBMITTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfq_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_event" (
    "id" UUID NOT NULL,
    "entity_type" "WorkflowEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "WorkflowAction" NOT NULL,
    "operator_id" UUID NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reference_type" TEXT,
    "reference_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_asset" (
    "id" UUID NOT NULL,
    "entity_type" "FileEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "file_type" "FileType" NOT NULL,
    "file_name" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "operator_id" UUID NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_organization_id_idx" ON "user"("organization_id");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");

-- CreateIndex
CREATE INDEX "organization_status_idx" ON "organization"("status");

-- CreateIndex
CREATE INDEX "organization_member_user_id_idx" ON "organization_member"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_member_organization_id_user_id_key" ON "organization_member"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_slug_key" ON "product_category"("slug");

-- CreateIndex
CREATE INDEX "product_category_parent_id_idx" ON "product_category"("parent_id");

-- CreateIndex
CREATE INDEX "product_category_id_idx" ON "product"("category_id");

-- CreateIndex
CREATE INDEX "product_status_idx" ON "product"("status");

-- CreateIndex
CREATE UNIQUE INDEX "parameter_group_code_key" ON "parameter_group"("code");

-- CreateIndex
CREATE INDEX "parameter_group_code_idx" ON "parameter_group"("code");

-- CreateIndex
CREATE UNIQUE INDEX "parameter_definition_parameter_code_key" ON "parameter_definition"("parameter_code");

-- CreateIndex
CREATE INDEX "parameter_definition_parameter_group_id_idx" ON "parameter_definition"("parameter_group_id");

-- CreateIndex
CREATE INDEX "parameter_definition_parameter_code_idx" ON "parameter_definition"("parameter_code");

-- CreateIndex
CREATE INDEX "parameter_option_parameter_definition_id_idx" ON "parameter_option"("parameter_definition_id");

-- CreateIndex
CREATE INDEX "product_parameter_value_parameter_definition_id_idx" ON "product_parameter_value"("parameter_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_parameter_value_product_id_parameter_definition_id_key" ON "product_parameter_value"("product_id", "parameter_definition_id");

-- CreateIndex
CREATE INDEX "product_parameter_definition_parameter_definition_id_idx" ON "product_parameter_definition"("parameter_definition_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_parameter_definition_product_id_parameter_definitio_key" ON "product_parameter_definition"("product_id", "parameter_definition_id");

-- CreateIndex
CREATE INDEX "offer_product_id_idx" ON "offer"("product_id");

-- CreateIndex
CREATE INDEX "offer_status_idx" ON "offer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "offer_organization_id_product_id_key" ON "offer"("organization_id", "product_id");

-- CreateIndex
CREATE INDEX "demand_organization_id_idx" ON "demand"("organization_id");

-- CreateIndex
CREATE INDEX "demand_created_by_idx" ON "demand"("created_by");

-- CreateIndex
CREATE INDEX "demand_status_idx" ON "demand"("status");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_demand_id_key" ON "rfq"("demand_id");

-- CreateIndex
CREATE INDEX "rfq_created_by_idx" ON "rfq"("created_by");

-- CreateIndex
CREATE INDEX "rfq_status_idx" ON "rfq"("status");

-- CreateIndex
CREATE INDEX "rfq_response_organization_id_idx" ON "rfq_response"("organization_id");

-- CreateIndex
CREATE INDEX "rfq_response_offer_id_idx" ON "rfq_response"("offer_id");

-- CreateIndex
CREATE INDEX "rfq_response_status_idx" ON "rfq_response"("status");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_response_rfq_id_organization_id_key" ON "rfq_response"("rfq_id", "organization_id");

-- CreateIndex
CREATE INDEX "workflow_event_entity_type_entity_id_idx" ON "workflow_event"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "workflow_event_operator_id_idx" ON "workflow_event"("operator_id");

-- CreateIndex
CREATE INDEX "workflow_event_action_idx" ON "workflow_event"("action");

-- CreateIndex
CREATE INDEX "workflow_event_created_at_idx" ON "workflow_event"("created_at");

-- CreateIndex
CREATE INDEX "notification_user_id_status_idx" ON "notification"("user_id", "status");

-- CreateIndex
CREATE INDEX "notification_type_idx" ON "notification"("type");

-- CreateIndex
CREATE INDEX "notification_created_at_idx" ON "notification"("created_at");

-- CreateIndex
CREATE INDEX "file_asset_entity_type_entity_id_idx" ON "file_asset"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "file_asset_uploaded_by_idx" ON "file_asset"("uploaded_by");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_operator_id_idx" ON "audit_log"("operator_id");

-- CreateIndex
CREATE INDEX "audit_log_action_idx" ON "audit_log"("action");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "product_category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "product_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parameter_definition" ADD CONSTRAINT "parameter_definition_parameter_group_id_fkey" FOREIGN KEY ("parameter_group_id") REFERENCES "parameter_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parameter_option" ADD CONSTRAINT "parameter_option_parameter_definition_id_fkey" FOREIGN KEY ("parameter_definition_id") REFERENCES "parameter_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_parameter_value" ADD CONSTRAINT "product_parameter_value_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_parameter_value" ADD CONSTRAINT "product_parameter_value_parameter_definition_id_fkey" FOREIGN KEY ("parameter_definition_id") REFERENCES "parameter_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_parameter_definition" ADD CONSTRAINT "product_parameter_definition_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_parameter_definition" ADD CONSTRAINT "product_parameter_definition_parameter_definition_id_fkey" FOREIGN KEY ("parameter_definition_id") REFERENCES "parameter_definition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand" ADD CONSTRAINT "demand_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand" ADD CONSTRAINT "demand_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_demand_id_fkey" FOREIGN KEY ("demand_id") REFERENCES "demand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq" ADD CONSTRAINT "rfq_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_response" ADD CONSTRAINT "rfq_response_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfq"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_response" ADD CONSTRAINT "rfq_response_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_response" ADD CONSTRAINT "rfq_response_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_event" ADD CONSTRAINT "workflow_event_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_asset" ADD CONSTRAINT "file_asset_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
