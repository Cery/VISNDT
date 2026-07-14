////////////////////////////////////////////////////////////
//
// VISNDT Platform
//
// Prisma Schema
//
// Version:
// 2.0 Final
//
// Generated From:
//
// 402_PostgreSQL_Table_Specification
// 403_PostgreSQL_DDL
// 404_Prisma_Schema_Specification
//
////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
//
// Generator
//
////////////////////////////////////////////////////////////


generator client {

  provider = "prisma-client-js"

}



////////////////////////////////////////////////////////////
//
// Datasource
//
////////////////////////////////////////////////////////////


datasource db {

  provider = "postgresql"

  url      = env("DATABASE_URL")

}



////////////////////////////////////////////////////////////
//
// Common Notes
//
// PostgreSQL:
// UUID v7
//
// Prisma:
// String @db.Uuid
//
// All timestamps:
// UTC
//
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
//
// Product Domain
//
////////////////////////////////////////////////////////////


model ProductCategory {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  code              String   @unique

  nameZh            String   @map("name_zh")

  nameEn            String?  @map("name_en")

  description       String?

  displayOrder      Int      @default(0) @map("display_order")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  createdBy         String?  @db.Uuid @map("created_by")

  updatedAt         DateTime @updatedAt @map("updated_at")

  updatedBy         String?  @db.Uuid @map("updated_by")

  deletedAt         DateTime? @map("deleted_at")

  deletedBy         String?   @db.Uuid @map("deleted_by")

  subCategories     ProductSubCategory[]

  @@index([status])

  @@map("product_category")
}



model ProductSubCategory {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  categoryId        String   @db.Uuid @map("category_id")

  code              String   @unique

  nameZh            String   @map("name_zh")

  nameEn            String?  @map("name_en")

  description       String?

  displayOrder      Int      @default(0) @map("display_order")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  category          ProductCategory @relation(fields:[categoryId], references:[id])

  families          ProductFamily[]

  @@index([categoryId])

  @@index([status])

  @@map("product_sub_category")
}



model ProductFamily {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  subCategoryId     String   @db.Uuid @map("sub_category_id")

  code              String   @unique

  name              String

  description       String?

  parameterTemplateId String? @db.Uuid @map("parameter_template_id")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  subCategory       ProductSubCategory @relation(fields:[subCategoryId], references:[id])

  series            ProductSeries[]

  @@index([subCategoryId])

  @@map("product_family")
}



model ProductSeries {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  familyId          String   @db.Uuid @map("family_id")

  code              String   @unique

  name              String

  description       String?

  releaseYear       Int?     @map("release_year")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  family            ProductFamily @relation(fields:[familyId], references:[id])

  products          StandardProduct[]

  @@index([familyId])

  @@map("product_series")
}



model StandardProduct {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  seriesId          String   @db.Uuid @map("series_id")

  productCode       String   @unique @map("product_code")

  sku               String?

  model             String

  nameZh            String   @map("name_zh")

  nameEn            String?  @map("name_en")

  shortName         String?  @map("short_name")

  description       String?

  lifecycle         String?

  published         Boolean  @default(false)

  status            String   @default("DRAFT")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  createdBy         String?  @db.Uuid @map("created_by")

  updatedAt         DateTime @updatedAt @map("updated_at")

  updatedBy         String?  @db.Uuid @map("updated_by")

  deletedAt         DateTime? @map("deleted_at")

  deletedBy         String?   @db.Uuid @map("deleted_by")

  series            ProductSeries @relation(fields:[seriesId], references:[id])

  parameterValues   ProductParameterValue[]

  capabilities      ProductCapability[]

  features          ProductFeature[]

  offers            Offer[]

  productKnowledgeMappings ProductKnowledgeMapping[]

  demandRecommendations   DemandRecommendation[]

  rfqItems          RfqItem[]

  @@index([seriesId])

  @@index([status])

  @@index([productCode])

  @@map("standard_product")
}

////////////////////////////////////////////////////////////
//
// Parameter Domain
//
////////////////////////////////////////////////////////////

model ParameterGroup {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  code              String   @unique

  nameZh            String   @map("name_zh")

  nameEn            String?  @map("name_en")

  description       String?

  displayOrder      Int      @default(0) @map("display_order")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  definitions       ParameterDefinition[]

  @@index([status])

  @@map("parameter_group")

}



model ParameterDefinition {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  groupId           String   @db.Uuid @map("group_id")

  parameterCode     String   @unique @map("parameter_code")

  chineseName       String   @map("chinese_name")

  englishName       String?  @map("english_name")

  description       String?

  valueType         String   @map("value_type")

  valueUnit         String?  @map("value_unit")

  defaultValue      String?  @map("default_value")

  validationRule    Json?    @map("validation_rule")

  required          Boolean  @default(false)

  searchable        Boolean  @default(true)

  comparable        Boolean  @default(true)

  filterable        Boolean  @default(true)

  sortable          Boolean  @default(false)

  aiEnabled         Boolean  @default(true) @map("ai_enabled")

  displayOrder      Int      @default(0) @map("display_order")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  group             ParameterGroup @relation(fields:[groupId], references:[id])

  templateItems     ParameterTemplateItem[]

  productValues     ProductParameterValue[]

  @@index([groupId])

  @@index([parameterCode])

  @@index([status])

  @@map("parameter_definition")

}



model ParameterTemplate {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  templateCode      String   @unique @map("template_code")

  templateName      String   @map("template_name")

  categoryId        String?  @db.Uuid @map("category_id")

  familyId          String?  @db.Uuid @map("family_id")

  description       String?

  version           Int      @default(1)

  status            String   @default("ACTIVE")

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  items             ParameterTemplateItem[]

  @@index([templateCode])

  @@index([status])

  @@map("parameter_template")

}



model ParameterTemplateItem {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  templateId        String   @db.Uuid @map("template_id")

  parameterId       String   @db.Uuid @map("parameter_id")

  displayOrder      Int      @default(0) @map("display_order")

  required          Boolean  @default(false)

  editable          Boolean  @default(true)

  visible           Boolean  @default(true)

  inherited         Boolean  @default(true)

  defaultValue      String?  @map("default_value")

  status            String   @default("ACTIVE")

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  template          ParameterTemplate @relation(fields:[templateId], references:[id])

  parameter         ParameterDefinition @relation(fields:[parameterId], references:[id])

  @@unique([templateId, parameterId])

  @@index([parameterId])

  @@map("parameter_template_item")

}



model ProductParameterValue {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  productId         String   @db.Uuid @map("product_id")

  parameterId       String   @db.Uuid @map("parameter_id")

  valueText         String?  @map("value_text")

  valueNumber       Decimal? @db.Decimal(20,6) @map("value_number")

  valueBoolean      Boolean? @map("value_boolean")

  valueJson         Json?    @map("value_json")

  displayText       String?  @map("display_text")

  source            String?

  revision          Int      @default(1)

  status            String   @default("ACTIVE")

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  product           StandardProduct @relation(fields:[productId], references:[id])

  parameter         ParameterDefinition @relation(fields:[parameterId], references:[id])

  @@unique([productId, parameterId, revision])

  @@index([productId])

  @@index([parameterId])

  @@map("product_parameter_value")

}

////////////////////////////////////////////////////////////
//
// Capability Domain
//
////////////////////////////////////////////////////////////


model CapabilityDefinition {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  capabilityCode    String   @unique @map("capability_code")

  nameZh            String   @map("name_zh")

  nameEn            String?  @map("name_en")

  category          String?

  description       String?

  keywords          Json?

  searchWeight      Int      @default(0) @map("search_weight")

  aiWeight          Int      @default(0) @map("ai_weight")

  displayOrder      Int      @default(0) @map("display_order")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  products          ProductCapability[]

  @@index([category])

  @@index([status])

  @@map("capability_definition")

}



model ProductCapability {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  productId         String   @db.Uuid @map("product_id")

  capabilityId      String   @db.Uuid @map("capability_id")

  value             String?

  enabled           Boolean  @default(true)

  source            String?

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  product           StandardProduct @relation(fields:[productId], references:[id])

  capability        CapabilityDefinition @relation(fields:[capabilityId], references:[id])

  @@unique([productId, capabilityId])

  @@index([capabilityId])

  @@map("product_capability")

}



////////////////////////////////////////////////////////////
//
// Feature Domain
//
////////////////////////////////////////////////////////////



model FeatureDefinition {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  featureCode       String   @unique @map("feature_code")

  nameZh            String   @map("name_zh")

  nameEn            String?  @map("name_en")

  category          String?

  description       String?

  keyword           String?

  softwareFeature   Boolean  @default(false) @map("software_feature")

  hardwareFeature   Boolean  @default(false) @map("hardware_feature")

  displayOrder      Int      @default(0) @map("display_order")

  status            String   @default("ACTIVE")

  version           Int      @default(1)

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  deletedAt         DateTime? @map("deleted_at")

  products          ProductFeature[]

  @@index([category])

  @@index([status])

  @@map("feature_definition")

}



model ProductFeature {

  id                String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  productId         String   @db.Uuid @map("product_id")

  featureId         String   @db.Uuid @map("feature_id")

  enabled           Boolean  @default(true)

  licenseRequired   Boolean  @default(false) @map("license_required")

  versionRequired   String?  @map("version_required")

  firmwareRequired  String?  @map("firmware_required")

  createdAt         DateTime @default(now()) @map("created_at")

  updatedAt         DateTime @updatedAt @map("updated_at")

  product           StandardProduct @relation(fields:[productId], references:[id])

  feature           FeatureDefinition @relation(fields:[featureId], references:[id])

  @@unique([productId, featureId])

  @@index([featureId])

  @@map("product_feature")

}

////////////////////////////////////////////////////////////
//
// Organization Domain
//
////////////////////////////////////////////////////////////


model Organization {

  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid

  organizationCode      String   @unique @map("organization_code")

  name                  String

  shortName             String?  @map("short_name")

  organizationType      String   @map("organization_type")

  description           String?

  website               String?

  country               String?

  province              String?

  city                  String?

  verificationStatus    String   @default("PENDING") @map("verification_status")

  status                String   @default("ACTIVE")

  version               Int      @default(1)

  createdAt             DateTime @default(now()) @map("created_at")

  createdBy             String?  @db.Uuid @map("created_by")

  updatedAt             DateTime @updatedAt @map("updated_at")

  updatedBy             String?  @db.Uuid @map("updated_by")

  deletedAt             DateTime? @map("deleted_at")

  deletedBy             String?   @db.Uuid @map("deleted_by")


  contacts              OrganizationContact[]

  addresses             OrganizationAddress[]

  attachments           OrganizationAttachment[]

  offers                Offer[]


  @@index([organizationType])

  @@index([status])

  @@map("organization")

}



model OrganizationContact {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  organizationId        String   @db.Uuid @map("organization_id")


  name                  String


  position              String?


  phone                 String?


  mobile                String?


  email                 String?


  wechat                String?


  isPrimary             Boolean  @default(false) @map("is_primary")


  status                String   @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  deletedAt             DateTime? @map("deleted_at")


  organization          Organization @relation(
                            fields:[organizationId],
                            references:[id]
                          )


  @@index([organizationId])


  @@map("organization_contact")

}




model OrganizationAddress {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  organizationId        String   @db.Uuid @map("organization_id")


  country               String?


  province              String?


  city                  String?


  district              String?


  address               String?


  postalCode            String? @map("postal_code")


  addressType           String? @map("address_type")


  isDefault             Boolean @default(false) @map("is_default")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  deletedAt             DateTime? @map("deleted_at")


  organization          Organization @relation(
                            fields:[organizationId],
                            references:[id]
                          )


  @@index([organizationId])


  @@map("organization_address")

}




model OrganizationAttachment {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  organizationId        String   @db.Uuid @map("organization_id")


  fileId                String   @db.Uuid @map("file_id")


  attachmentType        String   @map("attachment_type")


  description           String?


  status                String   @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  organization          Organization @relation(
                            fields:[organizationId],
                            references:[id]
                          )


  @@index([organizationId])


  @@index([fileId])


  @@map("organization_attachment")

}




////////////////////////////////////////////////////////////
//
// Offer Domain
//
////////////////////////////////////////////////////////////



model Offer {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  organizationId        String   @db.Uuid @map("organization_id")


  productId             String   @db.Uuid @map("product_id")


  offerCode             String   @unique @map("offer_code")


  salesRegion           String?  @map("sales_region")


  moq                   String?


  leadTime              String?  @map("lead_time")


  supportOEM            Boolean  @default(false) @map("support_oem")


  supportODM            Boolean  @default(false) @map("support_odm")


  customization         Boolean  @default(false)


  featured              Boolean  @default(false)


  status                String   @default("ACTIVE")


  version               Int      @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  deletedAt             DateTime? @map("deleted_at")


  organization          Organization @relation(
                            fields:[organizationId],
                            references:[id]
                          )


  product               StandardProduct @relation(
                            fields:[productId],
                            references:[id]
                          )


  prices                OfferPrice[]


  inventories           OfferInventory[]


  services              OfferService[]


  attachments           OfferAttachment[]


  quotations             RfqQuotation[]


  @@index([organizationId])


  @@index([productId])


  @@index([status])


  @@map("offer")

}




model OfferPrice {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  offerId               String   @db.Uuid @map("offer_id")


  priceType             String   @map("price_type")


  amount                Decimal  @db.Decimal(20,2)


  currency              String


  effectiveFrom         DateTime @map("effective_from")


  effectiveTo           DateTime? @map("effective_to")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  offer                 Offer @relation(
                            fields:[offerId],
                            references:[id]
                          )


  @@index([offerId])


  @@map("offer_price")

}




model OfferInventory {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  offerId               String   @db.Uuid @map("offer_id")


  warehouse             String?


  availableQuantity     Int      @default(0) @map("available_quantity")


  safetyQuantity        Int      @default(0) @map("safety_quantity")


  updatedAt             DateTime @updatedAt @map("updated_at")


  offer                 Offer @relation(
                            fields:[offerId],
                            references:[id]
                          )


  @@index([offerId])


  @@map("offer_inventory")

}




model OfferService {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  offerId               String   @db.Uuid @map("offer_id")


  warrantyPeriod        String? @map("warranty_period")


  repairCycle           String? @map("repair_cycle")


  remoteSupport         Boolean @default(false) @map("remote_support")


  onsiteService         Boolean @default(false) @map("onsite_service")


  training              Boolean @default(false)


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  offer                 Offer @relation(
                            fields:[offerId],
                            references:[id]
                          )


  @@index([offerId])


  @@map("offer_service")

}




model OfferAttachment {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  offerId               String   @db.Uuid @map("offer_id")


  fileId                String   @db.Uuid @map("file_id")


  attachmentType        String @map("attachment_type")


  createdAt             DateTime @default(now()) @map("created_at")


  offer                 Offer @relation(
                            fields:[offerId],
                            references:[id]
                          )


  @@index([offerId])


  @@index([fileId])


  @@map("offer_attachment")

}

////////////////////////////////////////////////////////////
//
// Knowledge Domain
//
////////////////////////////////////////////////////////////


model Knowledge {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  knowledgeCode         String   @unique @map("knowledge_code")


  title                 String


  knowledgeType         String   @map("knowledge_type")


  summary               String?


  content               String?


  language              String?


  aiEnabled             Boolean  @default(true) @map("ai_enabled")


  searchEnabled         Boolean  @default(true) @map("search_enabled")


  status                String   @default("DRAFT")


  version               Int      @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  createdBy             String?  @db.Uuid @map("created_by")


  updatedAt             DateTime @updatedAt @map("updated_at")


  updatedBy             String?  @db.Uuid @map("updated_by")


  deletedAt             DateTime? @map("deleted_at")



  attachments           KnowledgeAttachment[]


  productMappings       ProductKnowledgeMapping[]



  @@index([knowledgeType])


  @@index([status])


  @@map("knowledge")

}





model KnowledgeAttachment {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  knowledgeId           String   @db.Uuid @map("knowledge_id")


  fileId                String   @db.Uuid @map("file_id")


  attachmentType        String @map("attachment_type")


  createdAt             DateTime @default(now()) @map("created_at")


  knowledge             Knowledge @relation(
                            fields:[knowledgeId],
                            references:[id]
                          )


  @@index([knowledgeId])


  @@index([fileId])


  @@map("knowledge_attachment")

}





model ProductKnowledgeMapping {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  productId             String   @db.Uuid @map("product_id")


  knowledgeId           String   @db.Uuid @map("knowledge_id")


  relevanceScore        Decimal? @db.Decimal(5,2) @map("relevance_score")


  relationType          String? @map("relation_type")


  createdAt             DateTime @default(now()) @map("created_at")


  product               StandardProduct @relation(
                            fields:[productId],
                            references:[id]
                          )


  knowledge             Knowledge @relation(
                            fields:[knowledgeId],
                            references:[id]
                          )


  @@unique([productId, knowledgeId])


  @@index([knowledgeId])


  @@map("product_knowledge_mapping")

}





////////////////////////////////////////////////////////////
//
// Demand Domain
//
////////////////////////////////////////////////////////////



model Demand {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  demandCode            String   @unique @map("demand_code")


  title                 String


  description           String?


  industry              String?


  scenario              String?


  inspectionObject      String? @map("inspection_object")


  budgetRange           String? @map("budget_range")


  procurementPlan       String? @map("procurement_plan")


  quantity              Int?


  deliveryRequirement   String? @map("delivery_requirement")


  aiStatus              String? @map("ai_status")


  workflowStatus        String? @map("workflow_status")


  status                String @default("DRAFT")


  version               Int @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  createdBy             String? @db.Uuid @map("created_by")


  updatedAt             DateTime @updatedAt @map("updated_at")


  deletedAt             DateTime? @map("deleted_at")



  items                 DemandItem[]


  attachments           DemandAttachment[]


  recommendations       DemandRecommendation[]



  @@index([status])


  @@index([industry])


  @@map("demand")

}




model DemandItem {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  demandId              String   @db.Uuid @map("demand_id")


  itemName              String @map("item_name")


  objectType            String? @map("object_type")


  description           String?


  parameters            Json?


  createdAt             DateTime @default(now()) @map("created_at")


  demand                Demand @relation(
                            fields:[demandId],
                            references:[id]
                          )


  @@index([demandId])


  @@map("demand_item")

}





model DemandAttachment {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  demandId              String   @db.Uuid @map("demand_id")


  fileId                String   @db.Uuid @map("file_id")


  attachmentType        String @map("attachment_type")


  createdAt             DateTime @default(now()) @map("created_at")


  demand                Demand @relation(
                            fields:[demandId],
                            references:[id]
                          )


  @@index([demandId])


  @@index([fileId])


  @@map("demand_attachment")

}





model DemandRecommendation {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  demandId              String   @db.Uuid @map("demand_id")


  productId             String?  @db.Uuid @map("product_id")


  offerId               String?  @db.Uuid @map("offer_id")


  score                 Decimal? @db.Decimal(5,2)


  confidence            Decimal? @db.Decimal(5,2)


  reason                String?


  modelVersion          String? @map("model_version")


  recommendedAt         DateTime @default(now()) @map("recommended_at")



  demand                Demand @relation(
                            fields:[demandId],
                            references:[id]
                          )


  product               StandardProduct? @relation(
                            fields:[productId],
                            references:[id]
                          )


  offer                 Offer? @relation(
                            fields:[offerId],
                            references:[id]
                          )


  @@index([demandId])


  @@index([productId])


  @@index([offerId])


  @@map("demand_recommendation")

}

////////////////////////////////////////////////////////////
//
// RFQ Domain
//
////////////////////////////////////////////////////////////


model Rfq {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  rfqCode               String   @unique @map("rfq_code")


  demandId              String?  @db.Uuid @map("demand_id")


  title                 String


  sourceType            String? @map("source_type")


  description           String?


  status                String @default("DRAFT")


  workflowStatus        String? @map("workflow_status")


  version               Int @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  createdBy             String? @db.Uuid @map("created_by")


  updatedAt             DateTime @updatedAt @map("updated_at")


  updatedBy             String? @db.Uuid @map("updated_by")


  deletedAt             DateTime? @map("deleted_at")



  items                 RfqItem[]


  attachments           RfqAttachment[]


  quotations            RfqQuotation[]


  demand                Demand? @relation(
                            fields:[demandId],
                            references:[id]
                          )



  @@index([demandId])


  @@index([status])


  @@map("rfq")

}





model RfqItem {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  rfqId                 String   @db.Uuid @map("rfq_id")


  productId             String   @db.Uuid @map("product_id")


  quantity              Int @default(1)


  requirementNote       String? @map("requirement_note")


  deliveryRequirement   String? @map("delivery_requirement")


  createdAt             DateTime @default(now()) @map("created_at")



  rfq                   Rfq @relation(
                            fields:[rfqId],
                            references:[id]
                          )


  product               StandardProduct @relation(
                            fields:[productId],
                            references:[id]
                          )



  @@index([rfqId])


  @@index([productId])


  @@map("rfq_item")

}





model RfqAttachment {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  rfqId                 String   @db.Uuid @map("rfq_id")


  fileId                String   @db.Uuid @map("file_id")


  attachmentType        String @map("attachment_type")


  createdAt             DateTime @default(now()) @map("created_at")



  rfq                   Rfq @relation(
                            fields:[rfqId],
                            references:[id]
                          )



  @@index([rfqId])


  @@index([fileId])


  @@map("rfq_attachment")

}





model RfqQuotation {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  rfqId                 String   @db.Uuid @map("rfq_id")


  offerId               String   @db.Uuid @map("offer_id")


  quotedPrice           Decimal? @db.Decimal(20,2) @map("quoted_price")


  currency              String?


  deliveryTime          String? @map("delivery_time")


  remark                String?


  version               Int @default(1)


  createdAt             DateTime @default(now()) @map("created_at")



  rfq                   Rfq @relation(
                            fields:[rfqId],
                            references:[id]
                          )


  offer                 Offer @relation(
                            fields:[offerId],
                            references:[id]
                          )



  @@index([rfqId])


  @@index([offerId])


  @@map("rfq_quotation")

}





////////////////////////////////////////////////////////////
//
// Workflow Domain
//
////////////////////////////////////////////////////////////



model WorkflowDefinition {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  workflowCode          String   @unique @map("workflow_code")


  name                  String


  businessType          String @map("business_type")


  description           String?


  version               Int @default(1)


  status                String @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  instances             WorkflowInstance[]



  @@index([businessType])


  @@map("workflow_definition")

}





model WorkflowInstance {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  workflowDefinitionId  String @db.Uuid @map("workflow_definition_id")


  businessType          String @map("business_type")


  businessId            String @db.Uuid @map("business_id")


  currentState          String @map("current_state")


  status                String @default("RUNNING")


  startedAt             DateTime @default(now()) @map("started_at")


  completedAt           DateTime? @map("completed_at")



  definition            WorkflowDefinition @relation(
                            fields:[workflowDefinitionId],
                            references:[id]
                          )


  tasks                 WorkflowTask[]


  histories             WorkflowHistory[]



  @@index([businessType,businessId])


  @@index([status])


  @@map("workflow_instance")

}





model WorkflowTask {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  workflowInstanceId    String @db.Uuid @map("workflow_instance_id")


  assigneeId            String? @db.Uuid @map("assignee_id")


  taskName              String @map("task_name")


  taskStatus            String @default("PENDING") @map("task_status")


  priority              String?


  dueDate               DateTime? @map("due_date")


  comment               String?



  instance              WorkflowInstance @relation(
                            fields:[workflowInstanceId],
                            references:[id]
                          )



  @@index([workflowInstanceId])


  @@index([assigneeId])


  @@map("workflow_task")

}





model WorkflowHistory {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  workflowInstanceId    String @db.Uuid @map("workflow_instance_id")


  action                String


  fromState             String? @map("from_state")


  toState               String? @map("to_state")


  operatorId            String? @db.Uuid @map("operator_id")


  remark                String?


  createdAt             DateTime @default(now()) @map("created_at")



  instance              WorkflowInstance @relation(
                            fields:[workflowInstanceId],
                            references:[id]
                          )



  @@index([workflowInstanceId])


  @@map("workflow_history")

}

////////////////////////////////////////////////////////////
//
// Dictionary Domain
//
////////////////////////////////////////////////////////////


model Dictionary {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  dictionaryCode        String   @unique @map("dictionary_code")


  name                  String


  description           String?


  category              String?


  status                String   @default("ACTIVE")


  version               Int      @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")


  deletedAt             DateTime? @map("deleted_at")


  items                 DictionaryItem[]



  @@index([category])


  @@index([status])


  @@map("dictionary")

}





model DictionaryItem {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  dictionaryId          String   @db.Uuid @map("dictionary_id")


  itemCode              String   @map("item_code")


  value                 String


  labelZh               String? @map("label_zh")


  labelEn               String? @map("label_en")


  sortOrder             Int @default(0) @map("sort_order")


  metadata              Json?


  status                String @default("ACTIVE")



  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  dictionary            Dictionary @relation(
                            fields:[dictionaryId],
                            references:[id]
                          )



  @@unique([dictionaryId,itemCode])


  @@index([dictionaryId])


  @@map("dictionary_item")

}





////////////////////////////////////////////////////////////
//
// File Domain
//
////////////////////////////////////////////////////////////



model FileObject {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  fileCode              String   @unique @map("file_code")


  fileName              String   @map("file_name")


  fileType              String   @map("file_type")


  mimeType              String?  @map("mime_type")


  size                  BigInt?


  checksum              String?


  storageProvider       String? @map("storage_provider")


  storageKey            String? @map("storage_key")


  accessScope           String @default("PRIVATE") @map("access_scope")


  status                String @default("ACTIVE")


  version               Int @default(1)



  createdAt             DateTime @default(now()) @map("created_at")


  createdBy             String? @db.Uuid @map("created_by")


  updatedAt             DateTime @updatedAt @map("updated_at")



  versions              FileVersion[]


  permissions           FilePermission[]


  tags                  FileTag[]



  @@index([fileType])


  @@index([status])


  @@map("file_object")

}





model FileVersion {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  fileId                String   @db.Uuid @map("file_id")


  versionNumber         Int @map("version_number")


  storageKey            String @map("storage_key")


  checksum              String?


  fileSize              BigInt? @map("file_size")


  mimeType              String? @map("mime_type")


  isCurrent             Boolean @default(false) @map("is_current")



  createdAt             DateTime @default(now()) @map("created_at")



  file                  FileObject @relation(
                            fields:[fileId],
                            references:[id]
                          )



  @@unique([fileId,versionNumber])


  @@index([fileId])


  @@map("file_version")

}





model FilePermission {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  fileId                String   @db.Uuid @map("file_id")


  permissionType        String @map("permission_type")


  targetId              String? @db.Uuid @map("target_id")


  roleCode              String? @map("role_code")


  createdAt             DateTime @default(now()) @map("created_at")



  file                  FileObject @relation(
                            fields:[fileId],
                            references:[id]
                          )



  @@index([fileId])


  @@map("file_permission")

}





model FileTag {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  fileId                String   @db.Uuid @map("file_id")


  tag                   String


  createdAt             DateTime @default(now()) @map("created_at")



  file                  FileObject @relation(
                            fields:[fileId],
                            references:[id]
                          )



  @@index([fileId])


  @@index([tag])


  @@map("file_tag")

}

////////////////////////////////////////////////////////////
//
// AI Domain
//
////////////////////////////////////////////////////////////



model Embedding {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  businessType          String @map("business_type")


  businessId            String @db.Uuid @map("business_id")


  provider              String?


  modelName             String? @map("model_name")


  dimension             Int?


  status                String @default("ACTIVE")


  version               Int @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  chunks                VectorChunk[]



  @@index([businessType,businessId])


  @@index([status])


  @@map("embedding")

}





model VectorChunk {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  embeddingId           String @db.Uuid @map("embedding_id")


  businessType          String @map("business_type")


  businessId            String @db.Uuid @map("business_id")


  chunkIndex            Int @map("chunk_index")


  content               String


  tokenCount            Int? @map("token_count")


  vectorData            Json? @map("vector_data")


  metadata              Json?


  createdAt             DateTime @default(now()) @map("created_at")



  embedding             Embedding @relation(
                            fields:[embeddingId],
                            references:[id]
                          )



  @@unique([embeddingId,chunkIndex])


  @@index([businessType,businessId])


  @@index([embeddingId])


  @@map("vector_chunk")

}





model SearchIndex {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  businessType          String @map("business_type")


  businessId            String @db.Uuid @map("business_id")


  title                 String?


  keywords              Json?


  searchableContent     String? @map("searchable_content")


  rankingWeight         Int @default(0) @map("ranking_weight")


  status                String @default("ACTIVE")


  updatedAt             DateTime @updatedAt @map("updated_at")



  @@unique([businessType,businessId])


  @@index([businessType])


  @@index([status])


  @@map("search_index")

}





model KnowledgeGraph {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  entityType            String @map("entity_type")


  entityId              String @db.Uuid @map("entity_id")


  relationType          String? @map("relation_type")


  targetEntityType      String? @map("target_entity_type")


  targetEntityId        String? @db.Uuid @map("target_entity_id")


  weight                Decimal? @db.Decimal(10,4)


  metadata              Json?


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  @@index([entityType,entityId])


  @@index([targetEntityType,targetEntityId])


  @@map("knowledge_graph")

}

////////////////////////////////////////////////////////////
//
// User & Permission Domain
//
////////////////////////////////////////////////////////////



model User {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  username              String   @unique


  email                 String?  @unique


  phone                 String?  @unique


  passwordHash          String? @map("password_hash")


  organizationId        String? @db.Uuid @map("organization_id")


  userType              String? @map("user_type")


  status                String @default("ACTIVE")


  lastLoginAt           DateTime? @map("last_login_at")


  version               Int @default(1)


  createdAt             DateTime @default(now()) @map("created_at")


  createdBy             String? @db.Uuid @map("created_by")


  updatedAt             DateTime @updatedAt @map("updated_at")


  updatedBy             String? @db.Uuid @map("updated_by")


  deletedAt             DateTime? @map("deleted_at")



  profile               UserProfile?


  roles                 UserRole[]


  organization          Organization? @relation(
                            fields:[organizationId],
                            references:[id]
                          )



  @@index([organizationId])


  @@index([status])


  @@map("user")

}





model UserProfile {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  userId                String   @unique @db.Uuid @map("user_id")


  displayName           String? @map("display_name")


  avatar                String?


  language              String?


  timezone              String?


  mobile                String?


  department            String?


  position              String?



  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  user                  User @relation(
                            fields:[userId],
                            references:[id]
                          )



  @@map("user_profile")

}





model Role {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  roleCode              String   @unique @map("role_code")


  name                  String


  description           String?


  scope                 String?


  status                String @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  users                 UserRole[]


  permissions           RolePermission[]



  @@index([status])


  @@map("role")

}





model Permission {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  permissionCode        String   @unique @map("permission_code")


  name                  String


  resource              String?


  action                String?


  description           String?


  status                String @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  roles                 RolePermission[]



  @@index([resource])


  @@index([status])


  @@map("permission")

}





model UserRole {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  userId                String   @db.Uuid @map("user_id")


  roleId                String   @db.Uuid @map("role_id")


  createdAt             DateTime @default(now()) @map("created_at")



  user                  User @relation(
                            fields:[userId],
                            references:[id]
                          )


  role                  Role @relation(
                            fields:[roleId],
                            references:[id]
                          )



  @@unique([userId,roleId])


  @@index([roleId])


  @@map("user_role")

}





model RolePermission {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  roleId                String   @db.Uuid @map("role_id")


  permissionId          String   @db.Uuid @map("permission_id")


  createdAt             DateTime @default(now()) @map("created_at")



  role                  Role @relation(
                            fields:[roleId],
                            references:[id]
                          )


  permission            Permission @relation(
                            fields:[permissionId],
                            references:[id]
                          )



  @@unique([roleId,permissionId])


  @@index([permissionId])


  @@map("role_permission")

}

////////////////////////////////////////////////////////////
//
// System Domain
//
////////////////////////////////////////////////////////////



model AuditLog {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  entityType            String @map("entity_type")


  entityId              String @db.Uuid @map("entity_id")


  action                String


  operatorId            String? @db.Uuid @map("operator_id")


  beforeData            Json? @map("before_data")


  afterData             Json? @map("after_data")


  ipAddress             String? @map("ip_address")


  userAgent             String? @map("user_agent")


  createdAt             DateTime @default(now()) @map("created_at")



  @@index([entityType,entityId])


  @@index([operatorId])


  @@map("audit_log")

}





model OperationLog {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  operationType         String @map("operation_type")


  module                String?


  description           String?


  operatorId            String? @db.Uuid @map("operator_id")


  requestId             String? @map("request_id")


  result                String?


  errorMessage          String? @map("error_message")


  createdAt             DateTime @default(now()) @map("created_at")



  @@index([module])


  @@index([operatorId])


  @@map("operation_log")

}





model Notification {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  userId                String? @db.Uuid @map("user_id")


  organizationId        String? @db.Uuid @map("organization_id")


  notificationType      String @map("notification_type")


  title                 String


  content               String?


  readStatus            String @default("UNREAD") @map("read_status")


  readAt                DateTime? @map("read_at")


  createdAt             DateTime @default(now()) @map("created_at")



  user                  User? @relation(
                            fields:[userId],
                            references:[id]
                          )


  organization          Organization? @relation(
                            fields:[organizationId],
                            references:[id]
                          )



  @@index([userId])


  @@index([organizationId])


  @@index([readStatus])


  @@map("notification")

}





model SystemSetting {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  settingKey            String @unique @map("setting_key")


  settingValue          Json @map("setting_value")


  description           String?


  status                String @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  @@index([status])


  @@map("system_setting")

}





model Sequence {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  sequenceCode          String @unique @map("sequence_code")


  prefix                String?


  currentValue          BigInt @map("current_value")


  step                  Int @default(1)


  formatRule            String? @map("format_rule")


  updatedAt             DateTime @updatedAt @map("updated_at")



  @@map("sequence")

}





model ScheduledJob {


  id                    String   @id @default(dbgenerated("generate_uuid_v7()")) @db.Uuid


  jobCode               String @unique @map("job_code")


  name                  String


  cronExpression        String @map("cron_expression")


  handler               String


  lastRunAt             DateTime? @map("last_run_at")


  nextRunAt             DateTime? @map("next_run_at")


  status                String @default("ACTIVE")


  createdAt             DateTime @default(now()) @map("created_at")


  updatedAt             DateTime @updatedAt @map("updated_at")



  @@index([status])


  @@map("scheduled_job")

}

