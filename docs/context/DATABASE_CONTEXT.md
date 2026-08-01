# DATABASE CONTEXT

**Last Updated:** 2026-08-01  
**Schema Version:** v1.0  
**Migration Count:** All migrations complete (init + 001-004)  
**Status:** ✅ FROZEN — No schema changes allowed

---

## 1. Prisma Models Overview

### 1.1 Models (24 Total)

| # | Model | Table | Description |
|---|---|---|---|
| 1 | `User` | `user` | Application users with roles |
| 2 | `Organization` | `organization` | Business organizations |
| 3 | `OrganizationMember` | `organization_member` | User-Organization membership |
| 4 | `Product` | `product` | Global product catalog |
| 5 | `ProductCategory` | `product_category` | Category tree (self-referencing) |
| 6 | `ProductMedia` | `product_media` | Product images & documents |
| 7 | `ProductParameter` | `product_parameter` | Product-parameter value mapping |
| 8 | `ParameterGroup` | `parameter_group` | Parameter grouping |
| 9 | `ParameterDefinition` | `parameter_definition` | Parameter definitions |
| 10 | `Offer` | `offer` | Organization product offers |
| 11 | `OfferItem` | `offer_item` | Offer line items |
| 12 | `Demand` | `demand` | Procurement demands |
| 13 | `DemandItem` | `demand_item` | Demand line items |
| 14 | `DemandMatch` | `demand_match` | Matching results |
| 15 | `RFQ` | `rfq` | Request for Quotation |
| 16 | `RFQItem` | `rfq_item` | RFQ line items |
| 17 | `RFQResponse` | `rfq_response` | Organization responses to RFQs |
| 18 | `RFQResponseItem` | `rfq_response_item` | Response line items |
| 19 | `Supplier` | `supplier` | Supplier profiles (linked to Organization) |
| 20 | `SupplierProduct` | `supplier_product` | Supplier's offered products |
| 21 | `WorkflowEvent` | `workflow_event` | Business workflow audit trail |
| 22 | `Notification` | `notification` | User notifications |
| 23 | `FileAsset` | `file_asset` | Uploaded files (S3/MinIO) |
| 24 | `AuditLog` | `audit_log` | System audit log |
| 25 | `UserInvitation` | `user_invitation` | Registration invitation tokens |

### 1.2 Enums (14 Total)

| # | Enum | Values |
|---|---|---|
| 1 | `OrganizationStatus` | ACTIVE, INACTIVE, SUSPENDED |
| 2 | `UserStatus` | ACTIVE, INACTIVE, SUSPENDED |
| 3 | `OfferStatus` | DRAFT, ACTIVE, INACTIVE |
| 4 | `DemandStatus` | DRAFT, PUBLISHED, SUBMITTED, PROCESSING, CLOSED, CANCELLED |
| 5 | `RFQStatus` | DRAFT, OPEN, RESPONDING, CLOSED, CANCELLED |
| 6 | `RFQResponseStatus` | SUBMITTED, VIEWED, ACCEPTED, REJECTED |
| 7 | `WorkflowEntityType` | DEMAND, RFQ, RFQ_RESPONSE |
| 8 | `WorkflowAction` | CREATED, SUBMITTED, OPENED, RESPONDED, ACCEPTED, REJECTED, CLOSED |
| 9 | `NotificationType` | SYSTEM, DEMAND_UPDATE, RFQ_UPDATE, RESPONSE_UPDATE |
| 10 | `NotificationStatus` | UNREAD, READ |
| 11 | `FileEntityType` | PRODUCT, ORGANIZATION, DEMAND, RFQ, RFQ_RESPONSE |
| 12 | `FileType` | IMAGE, DOCUMENT, CERTIFICATE, OTHER |
| 13 | `AuditAction` | CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN |
| 14 | `DemandMatchStatus` | PENDING, MATCHED, REVIEWED, ACCEPTED, REJECTED, EXPIRED |
| 15 | `ParameterDataType` | STRING, NUMBER, BOOLEAN, ENUM |

---

## 2. Core Entity Relations

### 2.1 Identity & Organization

```
User ──────────→ Organization (optional, many-to-one)
User ──────────→ OrganizationMember (one-to-many)
Organization ──→ OrganizationMember (one-to-many)
```

### 2.2 Product Domain

```
Product ────────→ ProductCategory (many-to-one)
Product ────────→ ProductMedia (one-to-many)
Product ────────→ ProductParameter (one-to-many)
Product ────────→ OfferItem (one-to-many)
Product ────────→ SupplierProduct (one-to-many)
ProductMedia ───→ FileAsset (optional, many-to-one, ON DELETE SET NULL)
ProductParameter → ParameterDefinition (many-to-one)
ParameterGroup ─→ ParameterDefinition (one-to-many)
```

### 2.3 Business Domain

```
Organization ───→ Offer (one-to-many)
Offer ──────────→ OfferItem (one-to-many)
User ───────────→ Demand (one-to-many)
Demand ─────────→ DemandItem (one-to-many)
Demand ─────────→ DemandMatch (one-to-many)
DemandMatch ────→ Offer (many-to-one)
Demand ─────────→ RFQ (one-to-one)
RFQ ────────────→ RFQItem (one-to-many)
RFQ ────────────→ RFQResponse (one-to-many)
Organization ───→ RFQResponse (one-to-many)
RFQResponse ────→ RFQResponseItem (one-to-many)
```

### 2.4 File & Audit

```
FileAsset ──────→ User (many-to-one, uploadedBy)
FileAsset ──────→ ProductMedia (reverse, one-to-many)
User ───────────→ AuditLog (one-to-many)
User ───────────→ Notification (one-to-many)
User ───────────→ WorkflowEvent (one-to-many)
```

---

## 3. ProductMedia ↔ FileAsset Relation (Critical)

```
ProductMedia.fileAssetId ──→ FileAsset.id (FK, nullable)
  ON DELETE: SET NULL
  (When FileAsset is deleted, ProductMedia.fileAssetId → NULL)

FileAsset.media ──→ ProductMedia[] (reverse relation)
  (One FileAsset can be referenced by multiple ProductMedia records)
```

### Lifecycle (Post-M13.2.7)

| Action | ProductMedia | FileAsset (DB) | FileAsset (S3) |
|---|---|---|---|
| Upload file | — | Created (entityId=placeholder) | Object stored |
| Create ProductMedia | Created | entityId updated | — |
| Create fails | — | Deleted (rollback) | Object deleted |
| Delete ProductMedia | Deleted | Deleted (cascade) | Object deleted |
| User abandons | — | Orphaned (detectable) | Object remains |

---

## 4. Migration Status

| Migration | Name | Content | Status |
|---|---|---|---|
| init | Initial | Complete schema | ✅ |
| 001 | Identity | User, Organization, OrganizationMember | ✅ |
| 002 | Organization + Product | Product, Category, Organization | ✅ |
| 003 | Offer + Demand + RFQ | Offer, Demand, RFQ, Matching | ✅ |
| 004 | Notification + Audit | Notification, AuditLog, WorkflowEvent | ✅ |

**No new migrations since M8. All migrations complete.**

---

## 5. FileAsset entityId Design

| Field | Type | Default | Purpose |
|---|---|---|---|
| `entityType` | `FileEntityType` | `'PRODUCT'` (hardcoded) | Type of entity owning this file |
| `entityId` | `String` (UUID) | `'00000000-0000-0000-0000-000000000000'` (placeholder) | ID of the owning entity |

**Post-M13.2.7.3:** `entityId` is updated to the actual `ProductMedia.id` when a ProductMedia is successfully created. The placeholder value indicates an orphan FileAsset.

**Index:** `@@index([entityType, entityId])` — supports efficient querying by entity.

---

## 6. Prohibited Operations

| Operation | Prohibited? |
|---|---|
| Add new model | ✅ Prohibited |
| Remove existing model | ✅ Prohibited |
| Add new field | ✅ Prohibited |
| Remove existing field | ✅ Prohibited |
| Change field type | ✅ Prohibited |
| Add new enum | ✅ Prohibited |
| Change enum value | ✅ Prohibited |
| Add new relation | ✅ Prohibited |
| Change onDelete behavior | ✅ Prohibited |
| Add new index | ✅ Prohibited |
| Create new migration | ✅ Prohibited |
| Run `prisma generate` | ✅ Allowed (regenerates client) |

---

*Generated by M13.2.9 Context Handoff System Design*