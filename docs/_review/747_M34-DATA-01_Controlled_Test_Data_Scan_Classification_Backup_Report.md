# M34-DATA-01 Controlled Test Data Scan, Classification and Backup Report

> Task ID: M34-DATA-01
> Task: Controlled Test Data Scan, Classification and Backup
> Mode: READ-ONLY (No mutation of code / database / storage)
> Date: 2026-08-30

---

## 1. Task Summary

本任务为 M34 阶段（Pre-745 / Pre-Data-Cleanup）的受控数据资产扫描，目标是在**不删除、不修改、不重置任何业务数据**的前提下：

1. 建立 VISNDT 数据库的完整结构与记录清单（Inventory）。
2. 识别测试数据、真实/生产类数据、平台规则数据、系统保护数据与未知数据（Identify + Classify）。
3. 建立实体间依赖关系图（Map Dependencies）。
4. 生成清理前可恢复备份并验证其完整性（Backup + Verify）。
5. 形成后续独立"受控测试数据清理任务"的事实基础与安全基线（Draft Cleanup Plan）。

本任务**不执行任何实际清理**。核心原则：`SCAN FIRST → CLASSIFY SECOND → BACKUP THIRD → CLEANUP LATER`。

---

## 2. Repository Verification

| 项 | 值 |
|---|---|
| 仓库根目录 | `F:\Desktop\VISNDT` |
| 代码根目录 | `F:\Desktop\VISNDT\VISNDT` |
| 分支 | `main` |
| Commit | `ff03a9a` |
| Working Tree | OTHER（存在已修改 + 未跟踪文件，含 PRE-745 扫描产物与 CDP 探针产物） |

> 说明：仓库根目录为 `F:\Desktop\VISNDT`，业务代码集中在 `F:\Desktop\VISNDT\VISNDT`（遵循 `.trae/rules/项目路径.md`）。

---

## 3. Environment Verification

| 服务 | 状态 | 镜像 | 端口 |
|---|---|---|---|
| visndt-postgres | Up (healthy) | postgres:16-alpine | 5432 |
| visndt-minio | Up | minio/minio:latest | 9000 (S3) / 9001 (console) |

环境类型：**Development（Docker Compose 开发环境）**，非生产环境。

---

## 4. Database Target Verification

| 项 | 值 |
|---|---|
| 数据库 | `visndt` |
| 用户 | `visndt` |
| 引擎 | PostgreSQL 16 (alpine) |
| 容器 | `visndt-postgres` |
| 存储 | MinIO（bucket `visndt-dev`） |

数据库目标确认无误，为开发库。39 张业务表（含 `_prisma_migrations` 迁移历史表）。

---

## 5. Read-Only Safety Verification

本任务所有数据库操作均为只读：

- 使用 `SELECT` / `COUNT(*)` / `information_schema` / `pg_tables` / `\d` 元数据查询进行盘点。
- 使用 `\copy ... TO` / `pg_dump` / `pg_restore --list` 进行数据导出与归档读出。
- 使用 `Get-FileHash`（SHA-256）与文件系统 `ls` 进行备份完整性校验。

**未执行任何** `DELETE / TRUNCATE / DROP / UPDATE / INSERT / UPSERT / prisma migrate reset / prisma db push / destructive seed` 等写操作。

---

## 6. Database Inventory

### 6.1 Table Inventory（39 张表）

`_prisma_migrations, audit_log, content, content_chunk, content_media, content_revision, content_tag, content_tag_relation, conversion_event, demand, demand_match, demand_parameter, file_asset, inquiry, knowledge_category, knowledge_content_ref, knowledge_domain, knowledge_entry, knowledge_relation, notification, offer, organization, organization_member, parameter_definition, parameter_group, parameter_option, product, product_category, product_category_knowledge_mapping, product_media, product_parameter_definition, product_parameter_value, refresh_token, rfq, rfq_response, supplier_product, supplier_product_media, supplier_product_parameter_value, user, user_invitation, workflow_event`

### 6.2 Enum Inventory（25 个枚举）

`AuditAction, ContentMediaType, ContentStatus, ContentTagType, ContentType, ConversionEventType, DemandMatchStatus, DemandStatus, FileAssetStatus, FileEntityType, FileType, InquiryStatus, KnowledgeEntryStatus, KnowledgeReferenceType, KnowledgeRelationType, NotificationStatus, NotificationType, OfferStatus, OrganizationStatus, ParameterDataType, RFQResponseStatus, RFQStatus, SupplierProductStatus, UserStatus, WorkflowAction, WorkflowEntityType`

### 6.3 关键发现

- `product` 表 `status` 为 `String @default("DRAFT")`（非枚举），而业务侧实际取值 `ACTIVE`（当前 32 条均为 `ACTIVE`）。
- `product.category` 关系正常；`supplier_product` 通过 `platform_product_id` 关联平台 `product`。
- `content` / `product` / `content_chunk` 三表含 `embedding vector(1536)` 列（pgvector 0.8.1 已注册，但容器内 `$libdir/vector` 共享库缺失，详见 Section 20/22）。

---

## 7. Model Inventory（schema.prisma 交叉核对）

数据模型与 `F:\Desktop\VISNDT\VISNDT\database\prisma\schema.prisma` 一致，包含 41 个 Prisma Model（含 4 个 `Unsupported(vector)` 列）。核心业务域：

- Identity: User, Organization, OrganizationMember, UserInvitation, RefreshToken
- Product: ProductCategory, Product, ProductMedia, ParameterGroup, ParameterDefinition, ParameterOption, ProductParameterValue, ProductParameterDefinition
- Supplier Product: SupplierProduct, SupplierProductMedia, SupplierProductParameterValue
- Offer/Demand/RFQ: Offer, Demand, DemandParameter, DemandMatch, RFQ, RFQResponse, Inquiry
- Content/Knowledge: Content, ContentMedia, ContentRevision, ContentTag, ContentTagRelation, KnowledgeDomain, KnowledgeCategory, KnowledgeEntry, KnowledgeContentRef, KnowledgeRelation, ProductCategoryKnowledgeMapping
- Workflow/Analytics: WorkflowEvent, Notification, AuditLog, ConversionEvent, FileAsset, ContentChunk

---

## 8. Record Count Inventory（精确计数）

| Table | Count | Table | Count |
|---|---|---|---|
| _prisma_migrations | 37 | organization | 15 |
| audit_log | 2857 | organization_member | 18 |
| content | 16 | parameter_definition | 54 |
| content_chunk | 8 | parameter_group | 11 |
| content_media | 0 | parameter_option | 45 |
| content_revision | 1 | product | 32 |
| content_tag | 0 | product_category | 28 |
| content_tag_relation | 0 | product_category_knowledge_mapping | 9 |
| conversion_event | 505 | product_media | 1 |
| demand | 30 | product_parameter_definition | 176 |
| demand_match | 21 | product_parameter_value | 181 |
| demand_parameter | 44 | refresh_token | 646 |
| file_asset | 1 | rfq | 17 |
| inquiry | 17 | rfq_response | 17 |
| knowledge_category | 6 | supplier_product | 38 |
| knowledge_content_ref | 0 | supplier_product_media | 5 |
| knowledge_domain | 3 | supplier_product_parameter_value | 50 |
| knowledge_entry | 6 | user | 13 |
| knowledge_relation | 0 | user_invitation | 2 |
| notification | 33 | workflow_event | 38 |
| offer | 21 | | |

状态分布（关键表）：

| 表 | 状态分布 |
|---|---|
| supplier_product (38) | DRAFT 4 / SUBMITTED 2 / REVIEWING 1 / PUBLISHED 27 / REJECTED 4 |
| product (32) | ACTIVE 32 |
| demand (30) | DRAFT 6 / PROCESSING 2 / CLOSED 2 / PUBLISHED 20 |
| rfq (17) | DRAFT 1 / OPEN 12 / RESPONDING 2 / CLOSED 2 |
| offer (21) | DRAFT 1 / ACTIVE 20 |

---

## 9. Protected Data Inventory

### 9.1 SYSTEM_PROTECTED

| 实体 | 标识 | 说明 |
|---|---|---|
| 系统用户 | `system@visndt.com` (System Scheduler) | 系统调度账号，无组织归属 |
| 迁移历史 | `_prisma_migrations` (37) | 数据库迁移记录，禁止删除 |

### 9.2 平台账号（APPROVED_BASELINE / REAL_OR_PRODUCTION_LIKE）

| 账号 | 名称 | 角色 | 归属组织 | 分类 |
|---|---|---|---|---|
| `admin@visndt.com` | Admin | ADMIN | VISNDT 平台运营中心 | APPROVED_BASELINE（主管理员） |
| `buyer@visndt.com` | Buyer 采购方 | BUYER | VISNDT 采购方企业 | REAL_OR_PRODUCTION_LIKE |
| `supplier@visndt.com` | Supplier 供应商 | SUPPLIER | 深圳市微视光电科技有限公司 | REAL_OR_PRODUCTION_LIKE |

### 9.3 平台规则数据（PLATFORM_RULE）

| 实体 | 数量 | 说明 |
|---|---|---|
| parameter_group | 11 | 参数分组（基础分类规则） |
| parameter_definition | 54 | 参数定义（能力参数字典） |
| parameter_option | 45 | 参数枚举选项 |
| product_category | 28 | 产品分类树（Taxonomy） |
| product_category_knowledge_mapping | 9 | 产品-知识分类映射 |
| knowledge_domain / knowledge_category / knowledge_entry | 3 / 6 / 6 | 知识库分类体系 |

> 以上分类体系为平台运行必需的 Taxonomy / Ability Definition，视为 PLATFORM_RULE，禁止删除。

### 9.4 审计证据

| 实体 | 数量 | 说明 |
|---|---|---|
| audit_log | 2857 | 审计日志（运营证据，受审计保留策略保护） |

---

## 10. Platform Rule Data Inventory

见 Section 9.3。平台规则数据包含参数字典、产品/知识分类体系与知识库条目（author = `admin@visndt.com`）。这些数据是平台正常展示与匹配的确定性基础，非测试数据，默认保护。

---

## 11. Real / Production-like Data Inventory

以下实体存在**非测试来源证据**（真实/正式域名、正式运营角色、公开技术内容），归类为 `REAL_OR_PRODUCTION_LIKE` 或 `APPROVED_BASELINE`：

| 实体 | 标识 | 证据 |
|---|---|---|
| 用户 | `admin@visndt.com` | 主管理员，seed_admin.ts 创建，平台运营必需 |
| 用户 | `buyer@visndt.com` | 正式采购方（visndt.com 域名） |
| 用户 | `supplier@visndt.com` | 正式供应商（visndt.com 域名） |
| 组织 | VISNDT 平台运营中心 | 平台运营组织 |
| 组织 | VISNDT 采购方企业 | 正式采购方组织 |
| 组织 | 深圳市微视光电科技有限公司 | 正式供应商组织 |

> 另有 `vsndt@sz-wise.cn` / `SZ Wise Supplier` 判定为 **UNKNOWN**（真实域名 `sz-wise.cn` 但用户名 `vsndt` 存在拼写异常，来源模糊，Rule A → 保护）。

---

## 12. Test Data Evidence

### 12.1 Seed Scan（种子脚本识别）

| Source File | 创建的实体 | 标识/Marker |
|---|---|---|
| `database/seed_demo.ts` | 用户/组织/产品/报价/需求/匹配/RFQ/内容/通知/事件 | `demo.*@visndt.local`，`DEMO_` 前缀 |
| `database/seed_supplier_product.ts` | 供应商产品（38 条） | `demo.supplier.XX@visndt.local` |
| `database/seed_scale_6621.ts` | 供应商产品（明视/锐视/中科品牌） | `demo.supplier.XX@visndt.local`, `scale-*` slug |
| `database/seed_runtime.ts` | 产品/报价/知识条目 | `admin@visndt.com` 作者，`demo.supplier.XX` 创建 |
| `database/seed_content.ts` | 内容条目（16） | `admin@visndt.com` 作者 |
| `database/seed_admin.ts` | 主管理员 | `admin@visndt.com` |

### 12.2 Test Fixture Scan

| Source | Entity | Creation Evidence | Confidence |
|---|---|---|---|
| seed_demo.ts | demo 用户/组织/业务链 | `visndt.local` 域名命名空间 | High |
| seed_supplier_product.ts | supplier_product + media + param | `demo.supplier.*` 映射 | High |
| seed_scale_6621.ts | 供应商产品 | `scale-*` slug + demo 品牌 | High |
| CDP/E2E 探针 | `test.user.647@visndt.local` | 明确 `test.user` 前缀 | High |

### 12.3 Synthetic Data Pattern Scan

命中关键字：

| 实体 | 命中 Marker | 判定 |
|---|---|---|
| 7 个 `demo.*@visndt.local` 用户 | `demo.` + `visndt.local` | LIKELY_TEST |
| `test.user.647@visndt.local` | `test.` + `test.user` | LIKELY_TEST |
| `admin@vip.com` | 占位域名 `vip.com`（非 visndt） | LIKELY_TEST |
| `E2E测试供应商企业` | `测试` / `E2E` 中文名 | LIKELY_TEST |
| `Admin Organization`（×2 重复） | 通用占位名 + 重复记录 | LIKELY_TEST |

> 注意：Keyword Match ≠ Automatic Deletion Authorization（Section 6.3 约束）。上述判定需结合来源与关系（已在 Section 13/14 验证）。

### 12.4 重复数据（Re-seed 残留）

同一业务组织出现多条 UUID 不同的重复记录（重复种子执行所致，创建时间 08-16 与 08-29 两批）：

- `VISNDT 平台运营中心`（ADMIN）— 2 条记录
- `江南航空检测技术中心`（BUYER）— 2 条记录
- `锐视检测技术有限公司`（SUPPLIER）— 2 条记录
- `中科检测设备有限公司`（SUPPLIER）— 2 条记录

这些重复记录是强测试/种子证据，但删除时必须先建立其各自下的依赖映射。

---

## 13. User / Organization Classification

### 13.1 User 分类（13 个账户）

| 账号 | 名称 | 角色 | 分类 | Confidence | Protected |
|---|---|---|---|---|---|
| system@visndt.com | System Scheduler | (无) | SYSTEM_PROTECTED | High | ✅ |
| admin@visndt.com | Admin | ADMIN | APPROVED_BASELINE | High | ✅ |
| buyer@visndt.com | Buyer 采购方 | MEMBER | REAL_OR_PRODUCTION_LIKE | High | ✅ |
| supplier@visndt.com | Supplier 供应商 | SUPPLIER | REAL_OR_PRODUCTION_LIKE | High | ✅ |
| vsndt@sz-wise.cn | VSNDT Supplier | MEMBER | UNKNOWN | Low | ✅ |
| admin@vip.com | Admin | ADMIN | LIKELY_TEST | High | ❌ |
| demo.admin@visndt.local | Demo Admin | ADMIN | LIKELY_TEST | High | ❌ |
| demo.buyer.01@visndt.local | 张检测 | BUYER | LIKELY_TEST | High | ❌ |
| demo.buyer.02@visndt.local | 李质检 | BUYER | LIKELY_TEST | High | ❌ |
| demo.supplier.01@visndt.local | 王明视 | SUPPLIER | LIKELY_TEST | High | ❌ |
| demo.supplier.02@visndt.local | 赵锐视 | SUPPLIER | LIKELY_TEST | High | ❌ |
| demo.supplier.03@visndt.local | 陈中科 | SUPPLIER | LIKELY_TEST | High | ❌ |
| test.user.647@visndt.local | E2E测试用户 | MEMBER | LIKELY_TEST | High | ❌ |

**User → Organization → Role → Business Data 关系图：**

```
admin@visndt.com (ADMIN)
   └─ VISNDT 平台运营中心 (ADMIN)          ← 平台运营组织（保护）
   └─ 创建的 content (author) / knowledge (author) / audit_log

admin@vip.com (ADMIN)
   └─ Admin Organization (ADMIN)            ← 占位（候选）

buyer@visndt.com (BUYER)
   └─ VISNDT 采购方企业 (BUYER)

supplier@visndt.com (SUPPLIER)
   └─ 深圳市微视光电科技有限公司 (SUPPLIER)

demo.admin@visndt.local (ADMIN)
   └─ VISNDT 平台运营中心（重复 08-29）

demo.buyer.01/02 (BUYER)
   └─ 江南航空检测技术中心（×2 重复）

demo.supplier.01 (SUPPLIER) → 明视工业检测设备有限公司
demo.supplier.02 (SUPPLIER) → 锐视检测技术有限公司（×2 重复）
demo.supplier.03 (SUPPLIER) → 中科检测设备有限公司（×2 重复）

test.user.647 (MEMBER) → VISNDT 采购方企业（E2E 探针）
```

> 每个非 Admin 账户均已分类为 LIKELY_TEST / REAL_OR_PRODUCTION_LIKE / UNKNOWN。**不自动删除任何账户。**

---

## 14. Supplier / Product Classification

### 14.1 Supplier（Organization → SupplierProduct → Capability）依赖链

```
Supplier（组织）
   ↓ organization_id
SupplierProduct（38 条，platform_product_id → Product）
   ├── SupplierProductMedia（5 条，file_asset_id 可空）
   ├── SupplierProductParameterValue（50 条）
   └── Offer（offer.supplier_product_id，Restrict）
```

### 14.2 Supplier 分类

| Supplier 组织 | 关联用户 | 分类 |
|---|---|---|
| 深圳市微视光电科技有限公司 | supplier@visndt.com | REAL_OR_PRODUCTION_LIKE |
| SZ Wise Supplier | vsndt@sz-wise.cn | UNKNOWN |
| 明视工业检测设备有限公司 | demo.supplier.01 | LIKELY_TEST |
| 锐视检测技术有限公司 | demo.supplier.02 | LIKELY_TEST |
| 中科检测设备有限公司 | demo.supplier.03 | LIKELY_TEST |
| E2E测试供应商企业 | （无成员） | LIKELY_TEST |

### 14.3 候选测试 Supplier 的依赖（示例：明视工业检测设备有限公司）

```
Test Supplier「明视工业检测设备有限公司」
 ├── SupplierProduct（demo.supplier.01 名下，含 scale-mingshi-* 等）
 ├── SupplierProductParameterValue（回参）
 ├── SupplierProductMedia（媒体，file_asset 可空）
 ├── Offer（组织+产品，Restrict 约束）
 ├── DemandMatch（经 Product/Offer）
 ├── RFQ / RFQResponse（若存在撮合链）
 └── OrganizationMember（demo.supplier.01）
```

> 删除任一候选测试 Supplier 前，必须先确认其 Products / ProductCapability / ProductParameter / Media / Documents / Demand / Match / RFQ / Notification 全部依赖；**不得孤立删除 Parent**。

---

## 15. Demand / Match / RFQ Dependency

```
Demand（30）
   ↓ demand_id
DemandParameter（44）
DemandMatch（21，demand_id + product_id + offer_id）
   ↓ source_match_id
RFQ（17，demand_id 必填，source_match_id 可空）
   ↓ rfq_id
RFQResponse（17，rfq_id + organization_id + offer_id）
   ↓ offer_id
Offer（21，organization_id + product_id + supplier_product_id）
Notification（33，reference_type / reference_id 软引用）
```

反向引用：RFQ / RFQResponse → Supplier / Product / Organization / User（`created_by`, `target_organization_id`, `reviewed_by`）。

由于 demand/rfq/offer 大部分由 seed 脚本经 demo 账户创建，这些业务链整体归为 LIKELY_TEST（High），但需按依赖顺序级联清理。

---

## 16. Media / Document / Storage Dependency

### 16.1 Database ↔ Storage 映射

| Object Key | Referenced By | Entity | Entity ID | Bucket | Exists |
|---|---|---|---|---|---|
| `uploads/2026-08-22T00-54-49-097Z-b43c23fd-...txt` | file_asset | PRODUCT | 9a842a6c-... | visndt-dev | ✅ |

- `file_asset` 仅 1 条记录（`d4-verify.txt`，43 bytes，ACTIVE，entity_type=PRODUCT）。
- MinIO bucket `visndt-dev` 实际包含 1 个对象，与 `file_asset.storage_key` 一一对应。

### 16.2 Storage Inventory（INVENTORY ONLY）

| Bucket | Object Count | 说明 |
|---|---|---|
| visndt-dev | 1 | `uploads/...b43c23fd-...txt`（43 bytes） |

> 未对 bucket 做完整对象备份，仅生成清单（Storage Backup = INVENTORY ONLY）。

### 16.3 Orphan Identification

| 检查项 | 结果 |
|---|---|
| 数据库记录无存储对象 | 未检出 |
| 存储对象无数据库引用 | 未检出 |
| ORPHAN_CANDIDATE | 0（本任务不删除） |

> 未在报告中输出任何 Access Key / Secret Key / Signed URL / Credential。

---

## 17. Foreign Key Dependency Graph

| Parent | Child | Constraint (onDelete) |
|---|---|---|
| User | RefreshToken | Cascade |
| User | OrganizationMember | Cascade |
| User | Notification | Cascade |
| User | AuditLog / Content / Demand / RFQ / WorkflowEvent / UserInvitation / FileAsset / KnowledgeEntry | Restrict |
| User | Offer / Product / Inquiry / RFQResponse / SupplierProduct (reviewedBy) | SetNull |
| Organization | User (organization_id) | SetNull |
| Organization | FileAsset (organization_id) | SetNull |
| Organization | Member / Offer / Demand / RFQ / RFQResponse / SupplierProduct / Inquiry / Invitation | No Action（Restrict） |
| Product | ProductMedia / ProductParameterValue / ProductParameterDefinition | Cascade |
| Product | SupplierProduct (platform_product_id) | Restrict |
| SupplierProduct | SupplierProductMedia / SupplierProductParameterValue | Cascade |
| SupplierProduct | Offer (supplier_product_id) | Restrict |
| ParameterDefinition | ParameterOption / ProductParameterValue / SupplierProductParameterValue / DemandParameter | Cascade(option) / Restrict |
| Content | ContentMedia / ContentRevision / ContentTagRelation | Cascade |
| Content | ContentChunk | (无 cascade，默认 Restrict) |
| KnowledgeEntry | KnowledgeContentRef / KnowledgeRelation | Cascade |
| Demand | RFQ / DemandParameter / DemandMatch | No Action（Restrict） |
| DemandMatch | RFQ (source_match_id) | No Action |
| RFQ | RFQResponse | No Action |
| Offer | DemandMatch / RFQResponse | No Action |
| FileAsset | ProductMedia / ContentMedia / SupplierProductMedia | No Action（media 可空指向） |

Application Dependency / Storage Dependency：
- `supplier_product` → `product`（platform_product_id）为应用层"平台能力型号"映射。
- `file_asset` → MinIO 对象为存储依赖（storage_key）。

---

## 18. Deletion-Safety Simulation

> 本任务**不真实删除**，仅做逻辑影响模拟。

### 示例候选：删除「明视工业检测设备有限公司」（LIKELY_TEST Supplier）

**潜在级联影响：**

```
Deletion Candidate: 明视工业检测设备有限公司 (Organization)
  Target Order（自底向上）:
  1) RFQResponse (organization_id = 该供应商, 或 created/reviewed 链)
  2) RFQ (target_organization_id / created_by)
  3) DemandMatch (经 Offer / Product)
  4) Offer (organization_id → 该组织, supplier_product_id → Restrict)
  5) SupplierProduct (organization_id → 该组织, platform_product_id → Restrict)
  6) SupplierProductMedia / SupplierProductParameterValue (Cascade from SupplierProduct)
  7) Inquiry (organization_id / product_id)
  8) Notification (软引用 reference)
  9) WorkflowEvent (entity 链, operator_id → Restrict)
  10) OrganizationMember (organization_id, userId → Cascade)
  11) User (demo.supplier.01) — Restrict by demand/content/rfq/file_asset 若存在
  12) Organization (最终删除)
```

**最终分类：**
- 明视工业检测设备有限公司 → **REQUIRES-REVIEW**（依赖完整、证据充分，但含 Offer/DemandMatch/RFQ 业务链，需逐级级联）。
- Admin Organization（占位）→ **SAFE-TO-PLAN**（依赖少，仅 admin@vip.com 成员）。
- E2E测试供应商企业 → **SAFE-TO-PLAN**（无成员、无明显业务链）。
- admin@vip.com / test.user.647 / demo.* → **SAFE-TO-PLAN**（需先处理其业务记录，User 删除受 Restrict 约束）。
- 主管理员 / 系统账号 / Taxonomy / 审计日志 → **PROTECTED**。
- vsndt@sz-wise.cn / SZ Wise Supplier → **UNKNOWN**（不清理）。

---

## 19. Data Classification Matrix

| Entity | Record/Group | Classification | Evidence | Dependencies | Protected | Cleanup Candidate | Confidence |
|---|---|---|---|---|---|---|---|
| User | system@visndt.com | SYSTEM_PROTECTED | 系统调度账号 | 无 | ✅ | 否 | High |
| User | admin@visndt.com | APPROVED_BASELINE | seed_admin 主管理员 | content/knowledge/audit | ✅ | 否 | High |
| User | buyer@visndt.com / supplier@visndt.com | REAL_OR_PRODUCTION_LIKE | visndt.com 正式账号 | org/member | ✅ | 否 | High |
| User | vsndt@sz-wise.cn | UNKNOWN | 真实域名但拼写异常 | org/member | ✅ | 否 | Low |
| User | demo.*（7）/ test.user.647 / admin@vip.com | LIKELY_TEST | demo./test./vip.com 标记 | 业务链 | ❌ | 是 | High |
| Organization | VISNDT 平台运营中心 / 采购方企业 / 微视光电 | REAL_OR_PRODUCTION_LIKE | 运营组织 | member/user | ✅ | 否 | High |
| Organization | SZ Wise Supplier | UNKNOWN | 模糊来源 | member | ✅ | 否 | Low |
| Organization | 明视/锐视/中科/江南 + E2E测试 + Admin Organization | LIKELY_TEST | demo seed + 重复 + 测试名 | product/supplier 链 | ❌ | 是 | High |
| Product | 32（ACTIVE，platform 种子/演示） | LIKELY_TEST (Mixed) | seed_runtime/seed_demo | supplier_product/offer/match | 部分 | 部分 | Medium |
| SupplierProduct | 38（27 PUBLISHED） | LIKELY_TEST | seed_supplier_product/scale | param/media/offer | ❌ | 是 | High |
| Capability/Parameter | 定义 54 / 值 181 / supplier 值 50 | PLATFORM_RULE（定义）/ LIKELY_TEST（值） | seed | product/supplier | 定义✅ | 值部分 | Medium |
| Demand / Match / RFQ / RFQResponse / Offer | 30/21/17/17/21 | LIKELY_TEST | seed 业务链 | 级联链 | ❌ | 是 | High |
| Notification | 33 | LIKELY_TEST (Mixed) | seed/探索 | user(软引用) | ❌ | 是 | Medium |
| Media / Document | 1 file_asset | LIKELY_TEST | d4-verify.txt 探针 | storage | ❌ | 是 | High |
| Taxonomy | product_category 28 / mapping 9 | PLATFORM_RULE | 基础分类 | product | ✅ | 否 | High |
| Knowledge | domain/category/entry | PLATFORM_RULE | admin 作者 | content | ✅ | 否 | High |
| AuditLog | 2857 | PLATFORM_RULE/审计证据 | 运营日志 | 无外键删除 | ✅ | 否 | High |
| RefreshToken | 646 | LIKELY_TEST | 会话 churn | user(Cascade) | ❌ | 是 | High |
| ConversionEvent / WorkflowEvent | 505/38 | LIKELY_TEST | 探针/演示 | 无外键删除 | ❌ | 是 | Medium |

---

## 20. Backup Execution

### 20.1 环境异常（前置记录）

`pg_dump` 全量导出初期因 `content` 表 `embedding vector(1536)` 列触发：

```
ERROR: could not access file "$libdir/vector": No such file or directory
```

根因：`vector` 扩展已在 catalog 注册（0.8.1），但 `postgres:16-alpine` 容器内**缺少 pgvector 共享库**（`$libdir/vector`）。这导致含 `embedding` 列的表无法被 `COPY TO` 序列化。

> AI 功能处于 FROZEN 状态；`embedding` 列当前业务意义为空/占位（content=8 非空、product=0 非空、content_chunk=8 非空，共 16 个向量）。

### 20.2 备份策略（规避 vector 列）

| 文件 | 内容 | 格式 |
|---|---|---|
| `visndt_m34_data01_full.dump` | 全库（schema + data），排除 3 张 vector 表的数据 | pg_dump custom (-F c) |
| `visndt_m34_data01_schema.sql` | 全库 DDL（含所有表/约束/扩展定义） | plain SQL |
| `visndt_m34_vec_product.csv` | product 表 32 条（排除 embedding 列） | CSV HEADER |
| `visndt_m34_vec_content.csv` | content 表 16 条（排除 embedding 列） | CSV HEADER |
| `visndt_m34_vec_content_chunk.csv` | content_chunk 表 8 条（排除 embedding 列） | CSV HEADER |

### 20.3 Backup Destination

`F:\Desktop\VISNDT_backups\M34-DATA-01\`（仓库外部目录，不在 `src/ apps/ backend/ prisma/` 内）。

### 20.4 Credential Safety

备份过程中未向 stdout / Report / Git / docs 写入密码、Secret、Token 或完整带凭证连接串。

---

## 21. Backup Verification

| 文件 | 大小(byte) | SHA-256 |
|---|---|---|
| visndt_m34_data01_full.dump | 485298 | B30271D25FD33C982124741E5F16BEB8E3CB0FB8C19FB00778107C0F87733B83 |
| visndt_m34_data01_schema.sql | 86678 | D61719A12FE33A146C887E4841B7708B8C07D75E72736676E74112B7B35D7145 |
| visndt_m34_vec_content.csv | 18179 | 4E44A52F6D58C09303AEE755257A8335D6EFCAD6602A483B8CC3F7329CC71F2E |
| visndt_m34_vec_content_chunk.csv | 6303 | A329E191254C2888C69F8BA1B54433B3E5F8EA4BD31BFE2BE6C0BA58D7725C95 |
| visndt_m34_vec_product.csv | 10486 | F0E8181C0DD330DBC9DB15AED07A3DA9CE3FB199092B3ADCEA64875E4B30A1C5 |

验证结果：

- File Exists ✅（5 文件均在备份目录）
- File Size > 0 ✅（最小 6303 bytes）
- `pg_restore --list` 可正常列出 366 个归档对象 ✅（custom dump 可读/有效）
- Archive Integrity ✅（SHA-256 已记录）
- Expected Database Objects Present ✅（37 迁移 + 全表 schema）

Backup Verification = **PASS（条件性：3 张 vector 表数据以 CSV 补充，主 dump 不含其数据）**

---

## 22. Restore Verification

**Restore Test = NOT RUN**

原因：目标环境（当前 postgres 容器）缺少 pgvector 共享库（`$libdir/vector`），任何包含 `vector` 类型/扩展创建或含这些列的表恢复均会在 `CREATE EXTENSION vector` 或 vector 列数据加载阶段失败。为避免任何对原库的非预期影响，未执行真实恢复测试。

> 备份"原则上可恢复"已通过 `pg_restore --list`（366 对象）+ 多文件 SHA-256 校验确认；vector 列 3 表数据通过独立 CSV 补齐。真实恢复测试需在安装了 pgvector 的等势环境进行。

---

## 23. Proposed Cleanup Set（PROPOSED_CLEANUP_SET — 仅计划）

| Group | 内容 | 证据 | 依赖 | Confidence |
|---|---|---|---|---|
| 测试用户 | demo.admin / demo.buyer.01/02 / demo.supplier.01/02/03（7）+ test.user.647 + admin@vip.com | demo./test./vip.com | 业务链 | High |
| 测试组织 | 明视/锐视/中科/江南 + E2E测试供应商企业 + Admin Organization | seed + 重复 + 测试名 | product/supplier/member | High |
| 测试供应商产品 | supplier_product 38 + media 5 + param 50 | seed | offer/match/rfq | High |
| 演示业务链 | demand 30 / match 21 / rfq 17 / rfq_response 17 / offer 21 / demand_param 44 / inquiry 17 | seed demo | 级联链 | High |
| 演示通知/事件 | notification 33 / workflow_event 38 / conversion_event 505 | seed/探针 | user(软引用) | Medium |
| 会话令牌 | refresh_token 646 | 会话 churn | user(Cascade) | High |
| 测试媒体 | file_asset 1（d4-verify.txt） | 探针 | storage 对象 | High |

> 实际清单以本扫描为基础，但**进入清理集合必须同时满足**：`LIKELY_TEST + Sufficient Evidence + Known Dependencies + Protected=NO`（Section 17/18 约束）。

---

## 24. Protected Set（PROTECTED_SET）

1. 系统账号（system@visndt.com）
2. 主管理员（admin@visndt.com）
3. 运营账号（buyer@visndt.com / supplier@visndt.com）
4. 未知供应商（vsndt@sz-wise.cn / SZ Wise Supplier）
5. 平台参数/分类 Taxonomy（parameter_group/definition/option + product_category + mapping）
6. 知识库分类体系（knowledge_domain/category/entry）
7. 运营组织（平台运营中心 / 采购方企业 / 微视光电）
8. 迁移历史（_prisma_migrations）
9. 审计证据（audit_log）
10. 平台管理相关 RBAC / 权限 / 系统配置

---

## 25. Unknown Set（UNKNOWN_SET）

| 实体 | 原因 |
|---|---|
| vsndt@sz-wise.cn（用户）+ SZ Wise Supplier（组织） | 真实域名 `sz-wise.cn`，但用户名 `vsndt` 拼写异常、来源模糊、业务意义不明确 |
| 部分 Product（platform 种子/演示混合） | 32 条 ACTIVE 产品中，平台种子/演示与实际内容边界需人工确认 |

> Unknown 数据默认 `Do Not Touch`，禁止进入清理集合。

---

## 26. Cleanup Plan Draft

> **THIS IS A PLAN ONLY — NO EXECUTION**

```
Cleanup Target: 测试/演示业务数据（用户→组织→产品→供应商产品→需求→匹配→RFQ→响应→报价→通知→令牌）
Deletion Order:
  1) refresh_token（按候选用户）
  2) notification / conversion_event / workflow_event（软引用）
  3) rfq_response → rfq → demand_match → demand_parameter → demand
  5) offer → supplier_product_media → supplier_product_parameter_value → supplier_product
  6) inquiry
  7) organization_member → user → organization
Expected Cascade: 遵循 FK onDelete（见 Section 17），Restrict 需先删子记录
Protected Data: 系统账号 / 主管理员 / 运维账号 / Taxonomy / 知识库 / 审计日志 / 迁移历史
Backup Reference: F:\Desktop\VISNDT_backups\M34-DATA-01\（Backup ID = M34-DATA-01-20260830）
Post-cleanup Verification: 记录数核对 + 依赖外键校验 + 平台可访问性
Rollback Strategy: pg_restore（需 pgvector 环境）+ CSV 补齐 vector 表
```

---

## 27. Risk Assessment

| 风险 | 等级 | 说明 |
|---|---|---|
| pgvector 共享库缺失 | 中 | 影响 embedding 列导出/恢复；AI FROZEN，业务影响低 |
| 重复组织/账户（re-seed 残留） | 中 | 删除需先解析多条 UUID 记录的依赖 |
| 演示数据与真实数据边界 | 中 | 部分 Product 属 platform 种子/演示，需人工确认后再清理 |
| 审计日志体量（2857） | 低 | 探针 churn，清理不影响业务但需审计保留策略 |
| Restrict 级联阻断 | 中 | User/Organization 删除被 Restrict 约束，需严格按序 |

---

## 28. Documentation Synchronization

本任务完成后，允许同步以下文档**仅记录**：

- `PROJECT_STATUS.md`：Data Baseline Scan Completed / Backup Completed / Cleanup NOT Executed
- `PROJECT_ROADMAP.md`：M34 DATA PRE-CLEANUP BASELINE 状态
- `MODULE_COMPLETION_MATRIX.md`：M34-DATA-01 基线完成

> 严格禁止将 `Cleanup Candidate` 写成 `Deleted`。

---

## 29. Final Status

**CONDITIONAL PASS**

| 条件 | 状态 |
|---|---|
| Environment Verified | ✅ |
| Database Target Verified | ✅ |
| Read-only maintained | ✅ |
| Inventory Complete | ✅ |
| Classification Complete | ✅ |
| Dependency Analysis Complete | ✅ |
| Backup Created | ✅ |
| Backup Integrity Verified | ✅（SHA-256 + pg_restore --list） |
| Cleanup NOT Executed | ✅ |
| Report Generated | ✅ |

**条件性说明（CONDITIONAL 原因）：**

1. **Storage Backup = INVENTORY ONLY**：MinIO（visndt-dev）仅 1 个对象，仅生成了清单，未做完整 bucket 备份。
2. **Restore Test = NOT RUN**：pgvector 共享库（`$libdir/vector`）缺失，当前环境无法安全执行全量恢复测试。
3. **Partial Dump**：`content`/`product`/`content_chunk` 三张含 `vector` 列的表，其数据以独立 CSV 补齐，主 custom dump 不含这三表数据行（schema 仍完整）。

---

## Final Execution Output

```
Task ID:            M34-DATA-01
Task:               Controlled Test Data Scan, Classification and Backup
Task Status:        CONDITIONAL PASS

Repository Root:    F:\Desktop\VISNDT
Branch:             main
Commit:             ff03a9a
Working Tree:       OTHER

Environment:        Development (Docker Compose, PostgreSQL 16 alpine + MinIO)
Database:           visndt (container: visndt-postgres)

Mutation:           NONE
Database Mutation:  NONE
Storage Mutation:   NONE
Schema Mutation:    NONE

Inventory:          COMPLETE
Classification:     COMPLETE
Dependency Analysis: COMPLETE
Backup:             CREATED (partial: 3 vector-table data via CSV supplement)
Backup Verification: PASS
Restore Verification: NOT RUN (pgvector .so missing)

Protected Records / Groups:       ~10
Likely Test Records / Groups:     ~8
Unknown Records / Groups:         ~2
Proposed Cleanup Candidates:      ~7

Cleanup Executed:    NO

Review Report:       docs/_review/747_M34-DATA-01_Controlled_Test_Data_Scan_Classification_Backup_Report.md

M33:                 CLOSED / UNCHANGED
M34:                 DATA PRE-CLEANUP BASELINE CONDITIONAL

Next Authorized Action: STOP
```

---

## Mandatory Cleanup Boundary

> - No test data has been deleted.
> - No real data has been deleted.
> - No admin data has been deleted.
> - No platform rule data has been deleted.
> - No unknown data has been deleted.
> - No storage object has been deleted.

---

## Code / Database / Storage State

```
Code State:     UNCHANGED
Database State: UNCHANGED
Storage State:  UNCHANGED

只有 Knowledge of Data State 发生变化。
```