# DATABASE_SCHEMA_V1 — Architecture Freeze

> Generated: 2026-07-21 | Phase: M8.7 Architecture Freeze
> Status: FROZEN — No schema changes before M9

---

## 1. Overview

| Metric | Value |
|--------|-------|
| Database | PostgreSQL 16 |
| ORM | Prisma 5.22.0 |
| Models | 22 |
| Enums | 15 |
| Migrations | 4 (001-004) |
| Indexes | 40+ |

---

## 2. Migration History

| Migration | Models | Purpose |
|-----------|--------|---------|
| 001 | User, Organization, OrganizationMember, UserInvitation | Identity & Organization |
| 002 | ProductCategory, Product, ProductMedia, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition | Product Domain |
| 003 | Offer, Demand, DemandParameter, DemandMatch, RFQ, RFQResponse | Offer, Demand & RFQ |
| 004 | WorkflowEvent, Notification, FileAsset, AuditLog | Workflow, Notification, File & Audit |

---

## 3. Model Reference

### 3.1 User

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| email | String | Yes | — | Unique |
| passwordHash | String | Yes | — | `password_hash` |
| name | String? | No | null | — |
| status | UserStatus | Yes | ACTIVE | — |
| organizationId | UUID? | No | null | FK → Organization |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `organization` (Organization?), `memberships` (OrganizationMember[]), `demands` (Demand[]), `workflowEvents` (WorkflowEvent[]), `notifications` (Notification[]), `fileAssets` (FileAsset[]), `auditLogs` (AuditLog[]), `rfqs` (RFQ[]), `createdInvitations` (UserInvitation[])

**Indexes**: `organizationId`, `status`

### 3.2 Organization

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| name | String | Yes | — | — |
| type | String | Yes | — | `organization_type` |
| status | OrganizationStatus | Yes | ACTIVE | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `members` (OrganizationMember[]), `users` (User[]), `offers` (Offer[]), `demands` (Demand[]), `rfqResponses` (RFQResponse[]), `invitations` (UserInvitation[])

**Indexes**: `status`

### 3.3 OrganizationMember

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| organizationId | UUID | Yes | — | FK → Organization |
| userId | UUID | Yes | — | FK → User |
| role | String | Yes | MEMBER | ADMIN / MEMBER |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Unique**: `[organizationId, userId]`

**Indexes**: `userId`

### 3.4 UserInvitation

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| email | String | Yes | — | — |
| token | String | Yes | — | Unique |
| organizationId | UUID | Yes | — | FK → Organization |
| role | String | Yes | MEMBER | — |
| status | String | Yes | PENDING | PENDING/USED/EXPIRED |
| expiresAt | DateTime | Yes | — | 7 days |
| createdBy | UUID | Yes | — | FK → User |
| createdAt | DateTime | Yes | now() | — |
| usedAt | DateTime? | No | null | — |

**Indexes**: `email`, `organizationId`, `status`, `token`

### 3.5 ProductCategory

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| name | String | Yes | — | — |
| slug | String | Yes | — | Unique |
| parentId | UUID? | No | null | FK → self (tree) |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `parent` (ProductCategory?), `children` (ProductCategory[]), `products` (Product[]), `demands` (Demand[])

**Indexes**: `parentId`

### 3.6 Product

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| categoryId | UUID | Yes | — | FK → ProductCategory |
| name | String | Yes | — | — |
| model | String? | No | null | — |
| description | String? | No | null | — |
| status | String | Yes | DRAFT | DRAFT/ACTIVE/INACTIVE |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `category` (ProductCategory), `parameterAssociations` (ProductParameterDefinition[]), `parameterValues` (ProductParameterValue[]), `offers` (Offer[]), `media` (ProductMedia[]), `demandMatches` (DemandMatch[])

**Indexes**: `categoryId`, `status`, `name`, `model`

### 3.7 ProductMedia

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| productId | UUID | Yes | — | FK → Product |
| fileAssetId | UUID? | No | null | FK → FileAsset |
| mediaType | FileType | Yes | — | Enum |
| title | String? | No | null | — |
| description | String? | No | null | — |
| isPrimary | Boolean | Yes | false | — |
| displayOrder | Int | Yes | 0 | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Indexes**: `productId`, `fileAssetId`

### 3.8 ParameterGroup

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| name | String | Yes | — | — |
| code | String | Yes | — | Unique |
| description | String? | No | null | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `definitions` (ParameterDefinition[])

**Indexes**: `code`

### 3.9 ParameterDefinition

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| parameterGroupId | UUID? | No | null | FK → ParameterGroup |
| name | String | Yes | — | — |
| code | String | Yes | — | Unique (`parameter_code`) |
| dataType | ParameterDataType | Yes | STRING | STRING/NUMBER/BOOLEAN/ENUM |
| unit | String? | No | null | — |
| required | Boolean | Yes | false | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `group` (ParameterGroup?), `productAssociations` (ProductParameterDefinition[]), `options` (ParameterOption[]), `productValues` (ProductParameterValue[]), `demandParameters` (DemandParameter[])

**Indexes**: `parameterGroupId`, `code`

### 3.10 ParameterOption

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| parameterDefinitionId | UUID | Yes | — | FK → ParameterDefinition |
| value | String | Yes | — | — |
| label | String | Yes | — | — |
| sortOrder | Int | Yes | 0 | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Indexes**: `parameterDefinitionId`

### 3.11 ProductParameterValue

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| productId | UUID | Yes | — | FK → Product |
| parameterDefinitionId | UUID | Yes | — | FK → ParameterDefinition |
| value | String | Yes | — | — |
| valueNumber | Float? | No | null | Numeric range |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Unique**: `[productId, parameterDefinitionId]`

**Indexes**: `parameterDefinitionId`, `[parameterDefinitionId, value]`, `[parameterDefinitionId, valueNumber]`

### 3.12 ProductParameterDefinition

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| productId | UUID | Yes | — | FK → Product |
| parameterDefinitionId | UUID | Yes | — | FK → ParameterDefinition |
| displayOrder | Int | Yes | 0 | — |
| createdAt | DateTime | Yes | now() | — |

**Unique**: `[productId, parameterDefinitionId]`

**Indexes**: `parameterDefinitionId`

### 3.13 Offer

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| organizationId | UUID | Yes | — | FK → Organization |
| productId | UUID | Yes | — | FK → Product |
| title | String | Yes | — | — |
| description | String? | No | null | — |
| status | OfferStatus | Yes | DRAFT | DRAFT/ACTIVE/INACTIVE |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Unique**: `[organizationId, productId]`

**Indexes**: `productId`, `status`

### 3.14 Demand

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| title | String | Yes | — | — |
| description | String? | No | null | — |
| organizationId | UUID? | No | null | FK → Organization |
| createdBy | UUID | Yes | — | FK → User |
| status | DemandStatus | Yes | DRAFT | DRAFT/PUBLISHED/SUBMITTED/PROCESSING/CLOSED/CANCELLED |
| parametersJson | JSON? | No | null | — |
| budgetRange | String? | No | null | — |
| quantity | Int? | No | null | — |
| quantityUnit | String? | No | null | — |
| expectedDeliveryDate | DateTime? | No | null | — |
| contactName | String? | No | null | — |
| contactPhone | String? | No | null | — |
| contactEmail | String? | No | null | — |
| contactVisible | Boolean | Yes | false | — |
| publishedAt | DateTime? | No | null | — |
| closedAt | DateTime? | No | null | — |
| closeReason | String? | No | null | — |
| categoryId | UUID? | No | null | FK → ProductCategory |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Relations**: `createdByUser` (User), `organization` (Organization?), `category` (ProductCategory?), `rfq` (RFQ?), `parameters` (DemandParameter[]), `matches` (DemandMatch[])

**Indexes**: `organizationId`, `createdBy`, `status`, `publishedAt`, `categoryId`

### 3.15 DemandParameter

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| demandId | UUID | Yes | — | FK → Demand |
| parameterDefinitionId | UUID | Yes | — | FK → ParameterDefinition |
| value | String? | No | null | — |
| valueMin | Float? | No | null | Numeric range |
| valueMax | Float? | No | null | Numeric range |
| required | Boolean | Yes | true | — |
| priority | Int | Yes | 0 | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Unique**: `[demandId, parameterDefinitionId]`

**Indexes**: `parameterDefinitionId`

### 3.16 DemandMatch

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| demandId | UUID | Yes | — | FK → Demand |
| productId | UUID | Yes | — | FK → Product |
| matchScore | Float | Yes | — | — |
| matchStatus | DemandMatchStatus | Yes | PENDING | PENDING/MATCHED/REVIEWED/ACCEPTED/REJECTED/EXPIRED |
| matchDetails | JSON? | No | null | — |
| offerId | UUID? | No | null | FK → Offer |
| matchedAt | DateTime? | No | null | — |
| reviewedAt | DateTime? | No | null | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Unique**: `[demandId, productId]`

**Indexes**: `productId`, `matchStatus`, `matchScore`

### 3.17 RFQ

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| demandId | UUID | Yes | — | FK → Demand (Unique) |
| createdBy | UUID | Yes | — | FK → User |
| status | RFQStatus | Yes | DRAFT | DRAFT/OPEN/RESPONDING/CLOSED/CANCELLED |
| publishedAt | DateTime? | No | null | — |
| closedAt | DateTime? | No | null | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Indexes**: `createdBy`, `status`

### 3.18 RFQResponse

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| rfqId | UUID | Yes | — | FK → RFQ |
| organizationId | UUID | Yes | — | FK → Organization |
| offerId | UUID? | No | null | FK → Offer |
| message | String? | No | null | — |
| status | RFQResponseStatus | Yes | SUBMITTED | SUBMITTED/VIEWED/ACCEPTED/REJECTED |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Unique**: `[rfqId, organizationId]`

**Indexes**: `organizationId`, `offerId`, `status`

### 3.19 WorkflowEvent

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| entityType | WorkflowEntityType | Yes | — | DEMAND/RFQ/RFQ_RESPONSE |
| entityId | UUID | Yes | — | — |
| action | WorkflowAction | Yes | — | CREATED/SUBMITTED/OPENED/RESPONDED/ACCEPTED/REJECTED/CLOSED |
| operatorId | UUID | Yes | — | FK → User |
| metadata | JSON? | No | null | JSONB |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Indexes**: `[entityType, entityId]`, `operatorId`, `action`, `createdAt`

### 3.20 Notification

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| userId | UUID | Yes | — | FK → User |
| type | NotificationType | Yes | — | SYSTEM/DEMAND_UPDATE/RFQ_UPDATE/RESPONSE_UPDATE |
| status | NotificationStatus | Yes | UNREAD | UNREAD/READ |
| title | String | Yes | — | — |
| message | String | Yes | — | — |
| referenceType | String? | No | null | — |
| referenceId | UUID? | No | null | — |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Indexes**: `[userId, status]`, `type`, `createdAt`

### 3.21 FileAsset

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| entityType | FileEntityType | Yes | — | PRODUCT/ORGANIZATION/DEMAND/RFQ/RFQ_RESPONSE |
| entityId | UUID | Yes | — | — |
| fileType | FileType | Yes | — | IMAGE/DOCUMENT/CERTIFICATE/OTHER |
| fileName | String | Yes | — | — |
| storageKey | String | Yes | — | S3 key |
| mimeType | String | Yes | — | — |
| fileSize | Int | Yes | — | bytes |
| uploadedBy | UUID | Yes | — | FK → User |
| createdAt | DateTime | Yes | now() | — |
| updatedAt | DateTime | Yes | @updatedAt | — |

**Indexes**: `[entityType, entityId]`, `uploadedBy`

### 3.22 AuditLog

| Field | Type | Required | Default | Notes |
|-------|------|:---:|---------|-------|
| id | UUID | Yes | uuid() | PK |
| entityType | String | Yes | — | — |
| entityId | UUID | Yes | — | — |
| action | AuditAction | Yes | — | CREATE/UPDATE/DELETE/STATUS_CHANGE/LOGIN |
| operatorId | UUID | Yes | — | FK → User |
| oldValue | JSON? | No | null | JSONB |
| newValue | JSON? | No | null | JSONB |
| createdAt | DateTime | Yes | now() | — |

**Indexes**: `[entityType, entityId]`, `operatorId`, `action`, `createdAt`

---

## 4. Entity Relationship Diagram (Textual)

```
User ──1:N── OrganizationMember ──N:1── Organization
User ──1:N── WorkflowEvent
User ──1:N── Demand (createdBy)
User ──1:N── RFQ (createdBy)
User ──1:N── Notification
User ──1:N── FileAsset (uploadedBy)
User ──1:N── UserInvitation (createdBy)
User ──N:1── Organization (organizationId)

Organization ──1:N── OrganizationMember ──N:1── User
Organization ──1:N── Offer
Organization ──1:N── Demand
Organization ──1:N── RFQResponse
Organization ──1:N── UserInvitation

ProductCategory ──1:N── Product (categoryId)
ProductCategory ──1:N── Demand (categoryId)
ProductCategory ──self── parentId (tree)

Product ──1:N── ProductParameterDefinition
Product ──1:N── ProductParameterValue
Product ──1:N── ProductMedia
Product ──1:N── Offer
Product ──1:N── DemandMatch

ParameterDefinition ──1:N── ProductParameterDefinition
ParameterDefinition ──1:N── ProductParameterValue
ParameterDefinition ──1:N── ParameterOption
ParameterDefinition ──1:N── DemandParameter
ParameterDefinition ──N:1── ParameterGroup (parameterGroupId)

Offer ──1:N── RFQResponse
Offer ──1:N── DemandMatch

Demand ──1:1── RFQ (demandId)
Demand ──1:N── DemandParameter
Demand ──1:N── DemandMatch

RFQ ──1:N── RFQResponse
```

---

## 5. Frozen Status

Schema is **FROZEN** as of M8.7. No model changes, field additions, or enum modifications are permitted before M9 Admin System V1 development completes.