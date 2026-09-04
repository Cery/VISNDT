# 815 — Post-M39 SupplierProduct Ownership, Claim & Governance Model Audit

**Task**: 815_Post_M39_SupplierProduct_Ownership_Claim_And_Governance_Model_Audit
**Version**: V3.2.3 Enhanced
**Status**: POST-M39 / READ-ONLY ARCHITECTURE GOVERNANCE AUDIT
**Date**: 2026-09-03
**Mode**: READ-ONLY — no code / schema / migration / API / permission changes.

Evidence markers: **VERIFIED**(runtime/persistence/API/browser) · **OBSERVED**(repo inspection) · **INFERRED** · **CONDITIONAL** · **UNVERIFIED** · **PRE-EXISTING**.

## 1. Executive Decision

SupplierProduct 的当前所有权模型拥有充分 schema/API/运行时/历史文档证据，可被冻结，**无需新增 Claim 实体、无 schema 迁移、无新 RBAC 权限**。

- **SupplierProduct = Hybrid Model C（按当前实现 = 平台治理的供应商所属型号实体）**
- SupplierProduct 是**必有组织归属（organizationId 必填）**、**必挂平台能力节点（platformProductId 必填）**的供应商具象型号（WHICH MODEL）。
- **创建/提交/审核/批准/发布全部为 ADMIN-only**；供应商端**只读**（运行时能力）；create/submit 自服务被历史文档显式冻结为 `self-service=Future`。
- 供应商今天的实际"挂靠/挂载"自服务路径是 **Offer（报价）**（org 域隔离、authenticated 自主创建），不是 SupplierProduct 写路径。
- **所有权 = 组织（organizationId）**，所有权隔离在服务层强制；无跨组织 supplier 管理路径；发布权威 = 平台管理员（仅 PUBLISHED 进入公开发现）。

**决策门**：**B = READY WITH CONDITIONS**（所有权可冻结；未来自服务启动层级 / 发布权限委托 / unpublish·edit / 媒体·参数写路径为条件项，需独立授权后决定，本任务不实施）。

## 2. Baseline

```
M35 = CONDITIONAL / NON-BLOCKING HISTORICAL DEBT
M36 = CLOSED
M37 = CONDITIONAL / NON-BLOCKING HISTORICAL DEBT
M38 = CLOSED
M39 = CLOSED
810 = AUDITED / CONDITIONALLY AUTHORIZED
811 = VERIFIED / NON-BLOCKING FOLLOW-UP
812 = CLOSED
813 = CLOSED / ALIGNMENT AUDIT COMPLETE
814 = CLOSED
815 = AUTHORIZABLE（本次审计结论见上）
```

不重开：M39 / 811 / 812 / 813 / 814。已知 802/M39 Web 基线错误（`knowledge-base/[slug]/page.tsx:322 RelatedProductItem.status`）为 PRE-EXISTING、与 815 判断无关，予以保留。

## 3. Primary Ownership Question

证据支持 **Model C（当前实现 = Model A 主导 + 供应商仅通过 Offer 表达商业挂靠）**。见 §4/§7/§8/§9/§10/§12。

## 4. Schema Ownership Audit（VERIFIED）

Source: `database/prisma/schema.prisma`（只读检视）。

| 模型 | 关键字段/约束 | 语义 |
|---|---|---|
| **SupplierProduct** | `organizationId`(必填) `platformProductId`(必填) `brand/series/modelNumber/slug` `status`(enum) `submittedAt/reviewedAt/reviewedBy/reviewedNote/publishedAt` `@@unique([organizationId, platformProductId, modelNumber])` `platformProduct onDelete: Restrict` | 必属一组织 + 必挂一平台能力；无 `createdBy`（对照 Product.createdById）→ 所有权由 organizationId 表达 |
| **Product** | `createdById` `slug` `seoTitle`，无 organizationId | 平台权威节点 |
| **Organization** | `type` `status` `supplierProducts[]` | 所有权与治理范围主体 |
| **OrganizationMember** | `role`(string, 默认 MEMBER) `@@unique([organizationId,userId])` | 组织内成员/角色 |
| **User** | `organizationId?` `reviewedSupplierProducts[]` | 属某组织；可作审核人 |
| **SupplierProductMedia** | `supplierProductId`(必填) | 属 SupplierProduct 自身（级联） |
| **SupplierProductParameterValue** | `supplierProductId`+`parameterDefinitionId` `@@unique([..,..])` | Supplier-owned 值；ParameterDefinition=平台 owned 定义 |
| **ParameterDefinition** | `code @unique` `dataType` | 平台权威定义 |
| **Offer** | `organizationId`(必填) `productId`(必填) `supplierProductId?`(可选) `@@unique([organizationId, productId])` `supplierProduct onDelete: Restrict` | 商业响应，引用 SupplierProduct 可选 |

### @@unique([organizationId, platformProductId, modelNumber]) 操作性解释（明确）

- 一个组织 ≤ 对同一平台产品可用不同 **modelNumber** 多条记录（同组织多型号）。
- 不同组织各自拥有对同一平台产品的一条独立 SupplierProduct（唯一键含 org）。
- **modelNumber 非全局唯一**：仅同一 (org, platformProduct) 内唯一 → 跨供应商可同名型号。
- **"一条共享 SupplierProduct 被多供应商引用"在 schema 上被显式排除**（org 必填且单值，唯一键含 org）。

## 5. Existing Data Audit（VERIFIED，只读持久化探针，无写入）

> 仅 count/groupBy/distinct，未改数据；ID 匿名化（前 8 位）。

| 指标 | 值 |
|---|---|
| SupplierProduct 总数 | 5 |
| 状态分布 | PUBLISHED=5（无草稿/待审） |
| 涉及组织数 | 2 |
| 组织分布 | org`697c99b2`→3（ZB-K60/ZB-TJ095/ZB-K60-EX）；org`be7e5cd7`→2（POP4/MetroY Ultra） |
| 涉及平台产品数 | 4 |
| 平台产品分布 | `ebb1c034`→2；其余 3 个各 1 |
| 有 PUBLISHED 记录的组织 | 2 |
| Offer 总数 / 引用 SupplierProduct 的 Offer | 1 / **0** |
| Platform Product/分类/参数定义/组织总数 | 4/13/54/10 |
| 同 (org,platformProduct) 最大型号数 | 2（`697c99b2`×`ebb1c034`：ZB-K60+ZB-K60-EX）|
| 复数组数 | 1 |
| 同一平台产品被 ≥2 组织绑定 | 0（结构支持，数据未实证多供应商共享）|

### §9 数据解读

- 全部 PUBLISHED、组织归属完整 → 与 **Admin 播种/治理** 形态一致；无供应商自建草稿/待审。
- 无 DRAFT→SUBMITTED 供应商提交轨迹 → 当前数据是"平台治理完成的发布资产"，非"供应商待运营草稿"。
- 示例（匿名）：org`697c99b2`→Product`ebb1c034`→ZB-K60（PUBLISHED）；同组还有 ZB-K60-EX（多型号实证）。
- Offer 引用 SupplierProduct=0 → 关联链数据未使用。

## 6. Relationship Semantics（VERIFIED）

Schema 表达"1 平台产品 → N（每供应商）SupplierProduct"（多供应商×各自型号），与 M34 `Product↔SupplyProduct 1:N` 一致。**"共享一条 SupplierProduct 挂多供应商"模型在 schema 上不成立**。

## 7. Admin Workflow（OBSERVED，apps/api/src/supplier-products/*）

- `@Controller('admin/supplier-products') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN)` — 整控制器 ADMIN-only。
- 操作映射：Create(DRAFT)→admin；List/Detail=治理池 admin；Submit(DRAFT→SUBMITTED)→admin；Review(→REVIEWING)→admin；Approve(→APPROVED)→admin；Reject(→REJECTED)→admin；Publish(→PUBLISHED)→admin。
- **关键**：`createDraft` 的 `organizationId` 由 `user.organizationId`（认证管理员自身组织）服务端派生（DTO 刻意省略 org）。今天 Admin 在**自己所属组织**名下创建，非跨组织指派 UI。
- 服务层注明：SupplierProduct=Supplier Owned Model Entity; belongsTo Organization(ownership isolation); binds to platformProductId(Platform Capability Node, NOT owned)。
- **无 PATCH/PUT/DELETE：创建后无编辑端点、无 unpublish、无 delete。**

**§10 答案**：Admin 创建的是**已归属组织的 DRAFT**并全链 Admin 审→发；无"Admin 代建待供应商后续运营"的手续交接，因供应商端只读且无 edit。历史意图=create/submit 为 `self-service=Future`。

## 8. Supplier Workspace（OBSERVED）

| 中文菜单 | 路由 | 实际领域对象 | 读写 |
|---|---|---|---|
| 能力展示/展示管理 | workspace/supplier/display | **Offer** 面板（活跃报价/覆盖/完整度）| 只读 |
| 我的报价 | workspace/supplier/offers | **Offer** | 读+自助创建 |
| 运行时能力 | workspace/supplier/runtime | **SupplierProduct** 只读列表 | 只读 |

**§11 语义消歧**："能力展示/展示管理"指 **Offer 驱动的供应能力**，非 SupplierProduct 管理；SupplierProduct 入口=中文"运行时能力"（只读）。既有标签漂移，非 SupplierProduct 管理已实现。

## 9. Claim / Attach 语义（§12 挂靠翻译）

"挂靠"已有两个数据表达，无需新 Claim：
1. **SupplierProduct（型号挂靠）**：org+platformProduct+modelNumber 表达"某供应商某平台能力下的具象型号归属"（创建 admin-only）。
2. **Offer（商业挂靠）**：org+productId（可选 supplierProductId）表达"供应商以报价挂载到平台标准产品"（**供应商自助执行**）。

translate：**ATTACH(经 Offer，现有)+ASSIGN/OWN(admin 创建的 SupplierProduct，现有)**；CLAIM 无独立必要（见 §33）。

## 10. Create vs Claim Decision（§13）

与 schema 最一致的未来供应商动作 = **Option 2（Attach Platform Product→系统建 org-owned DRAFT）+ Option 3（Request→Admin 创建）** 组合。
- Option 1（认领跨组织现有记录）：与唯一约束/隔离冲突，不推荐。
- 推荐：现在=Option 4（Admin assignment，已实现）+ 未来自服务第一步=Option 2（Attach）。均无 schema 变更。

## 11. Multi-Supplier Model（§14）

- schema 支持 A→OrgA、B→OrgB、C→OrgC=VERIFIED（结构）。当前数据 multiSupplierPlatformProducts=[]（未实例化多供应商共享）。
- 判定：schema 原生目标形态，非缺陷。

## 12. Multi-Model Model（§15）

- 同(org, platformProduct)多型号=VERIFIED；数据实证 n=2（ZB-K60+ZB-K60-EX）。**一供应商对一平台产品多型号=已实现结构。**

## 13. Platform Authority（§16）

- SupplierProduct 操作仅 CRUD/状态机自身；对平台产品仅 `ensurePlatformProductExists`（只读校验）。**无创建/修改 Product/Category/ParameterDefinition 的 SupplierProduct 操作=VERIFIED 无违规。** 平台权威保持中央化。

## 14. Supplier Organization Authority（§17）

`organizationId` 综合判定= **OWNERSHIP + GOVERNANCE SCOPE + PUBLIC-OWNER**；非单纯 contact/publisher 标签。服务层以此强制隔离。

## 15. Supplier User Authority（§18）

现有链条 `User.organizationId → OrganizationMember(role) → workspaceRole → SupplierProduct.organizationId` 足够承载未来自服务；无需新 RBAC 权限。未来可加维度（VIEW/ATTACH/EDIT/SUBMIT/MEDIA/PARAMETERS/UNPUBLISH）——仅评估未实施。

## 16. Permission Level Evaluation（§19/§21/§34）

- 推荐最小兼容 = **Hybrid：组织级能力开关 + 成员角色委托**（组织级控"谁可用"，成员角色控"谁能操作"），利于低运维 + 防 turnover。
- 开关位置=Organization 能力/设置，非全局 feature-flag、非新 RBAC 角色。管理权限≠平台产品权威。

## 17. Publishing Authority（§22）VERIFIED

唯一发布端点 admin；公开搜索/产品详情仅 `status=PUBLISHED`。**平台管理员=最终公开发布权威**；供应商只能 submit，不能绕过平台产品权威/公开治理/SEO/搜索权威。即使未来 Trusted Supplier 也不自动获公开发布权。

## 18. Lifecycle Semantics（§23/§24）VERIFIED

状态机 DRAFT→SUBMITTED→REVIEWING→APPROVED/REJECTED→(APPROVED)→PUBLISHED：
- DRAFT=初始草稿(admin)；SUBMITTED=已提交待审；REVIEWING=审核中；APPROVED=**已批准非公开**；PUBLISHED=**公开（唯一可见态）**；REJECTED=拒绝（需 note），**无返回路径**。
- APPROVED 公开？否。PUBLISHED 公开？是。提交后可编辑？当前**无编辑端点**（任何状态）。批准/发布后编辑/撤回？无 edit / 无 unpublish / 无 delete。
- **§24**：unpublish/delete 缺失且 admin 目标；unpublish 是发布资产生命周期值得补齐的必要项（未来授权）；不新增未证状态（ARCHIVED/DISABLED）。删除受 onDelete:Restrict+Offer 引用保护。

## 19. Media / Parameter Ownership（§25）

- SupplierProductMedia=SupplierProduct-owned；SupplierProductParameterValue=Supplier-owned 值 + ParameterDefinition(平台 owned 定义)。
- 写路径当前 admin-only/未暴露。未来可在组织内交 SUPPLIER 成员管理（媒体=自有附件；参数值=自有值，定义仍平台）。本任务不实施方案、不开写路径。

## 20. Offer Relationship（§26）VERIFIED

`Offer.supplierProductId` 可选（nullable），onDelete:Restrict；唯一性在 (organizationId,productId)。Offer **可**引用 SupplierProduct 作为可选具象型号实现；数据实证=0 引用。Offer 仍是 COMMERCIAL RESPONSE、非产品身份权威（身份权威=platformProductId）。未改动 Offer/价格存储。

## 21. Search / SEO / AI Boundary（§27/§28/§40）VERIFIED（复用 814）

仅 PUBLISHED SupplierProduct 进入搜索；Product=主搜索/SEO 权威；无公开价格/货币/库存/销售/折扣/商业汇总（814 载荷层已清）。无 Central Catalog/无 Supplier 搜索类型/无 SupplierProduct SEO 门户/sitemap flood。语义层级=WHAT→WHICH MODEL→WHO，无公共商业语义。**815 不改搜索/SEO/AI。**

## 22. Historical Reconstruction（§29）

- 供应商手册 `07_VISNDT供应商手册.md`：能力型号（Supplier Product）创建/审核由平台管理员统一治理；供应商端"运行时能力"只读；创建/提交为未来项 `self-service=Future`；供应商可自助：企业资料/报价(Offer)创建/RFQ 响应/商机。→ 原设计与实现一致。
- 管理员手册 `05`：管理员治理池管理能力型号生命周期；供应商端只读。
- M34 契约：Hybrid Model C；SupplyProduct=Supplier Owned Model Entity, belongsTo Organization, binds to platformProductId(NOT owned); Product↔SupplyProduct 1:N；生命周期复用现有、不重新设计。
- **矛盾点**：部分文档/UI 以"能力展示/展示管理"呈现的内容实现上实为 Offer 面板（§8）→ 标签漂移（G10）；以**当前运行时/代码为准**。无证据显示存在过供应商自助创建 SupplierProduct 的实现。

## 23. Ownership Decision Matrix（§30）

| 问题 | Model A 平台指派 | Model B 供应商认领 | Model C 混合 | 证据 | 推荐 |
|---|---|---|---|---|---|
| 谁创建初始 SupplierProduct | Admin | 供应商 | Admin(当前)/供应商(未来) | controller ADMIN; 手册 self-service=Future | Model C |
| 谁拥有 organizationId | 组织 | 组织 | 组织 | schema 唯一+隔离 | 组织 |
| 谁选择 Platform Product | Admin | 供应商 | Admin(当前)/供应商(未来Attach) | create DTO=admin 指定 | Future=供应商 |
| 谁编辑供应商字段 | Admin(无edit) | 供应商 | 未来=组织成员 | 无 PATCH | Future 组织内 |
| 谁提交 | Admin | 供应商 | Admin当前/供应商未来 | submit admin | Future 供应商 |
| 谁审批 | Admin | Admin | Admin | review/approve admin | Admin |
| 谁发布 | Admin | Admin | Admin(平台最终) | publish admin; 仅 PUBLISHED 公开 | 平台 |
| 谁可 unpublish | —（缺失）| — | 平台 Admin(未来) | 无操作 | 平台 |
| 多供应商可否共同一平台产品 | 是 | 是 | 是 | 唯一键含 org | 是 |
| 一供应商可否多型号 | 是 | 是 | 是(已实证) | 数据 n=2 | 是 |
| 难以认领现有记录 | — | 冲突 | 不推荐独立 Claim | 唯一+隔离 | 否(Attach/新建) |

## 24. Permission Matrix（§31，目标矩阵，非实现）

| 能力 | Platform Admin | Supplier Org Admin | Supplier User | Buyer | Public |
|---|---|---|---|---|---|
| View SupplierProduct | ✅ | ✅(org) | ✅(org 只读) | ✅(公开 PUBLISHED) | 🔹(公开上下文) |
| Create | ✅ | 🔹(L2) | 🔹 | ❌ | ❌ |
| Claim/Attach | ✅(指派) | 🔹(未来) | 🔹 | ❌ | ❌ |
| Edit | ✅(未来需补端点) | 🔹 | 🔹 | ❌ | ❌ |
| Submit | ✅ | 🔹 | 🔹 | ❌ | ❌ |
| Approve | ✅ | ❌ | ❌ | ❌ | ❌ |
| Publish | ✅ | ❌(平台最终) | ❌ | ❌ | ❌ |
| Unpublish | ✅(未来需补) | 🔹(组织内) | ❌ | ❌ | ❌ |
| Manage Media | ✅(未来) | 🔹 | 🔹 | ❌ | ❌ |
| Manage Parameter Values | ✅(未来) | 🔹 | 🔹 | ❌ | ❌ |
| Create Platform Product | ✅ | ❌ | ❌ | ❌ | ❌ |
| Modify Platform Product | ✅ | ❌ | ❌ | ❌ | ❌ |

`✅`=现有 · `🔹`=未来授权目标 · `❌`=不允许。**Supplier Management Permission ≠ Platform Product Authority**。

## 25. Current-State Capability Matrix（§35）

| 能力 | Schema | API | Admin | Supplier | 运行时 | 目标 | 状态 |
|---|---|---|---|---|---|---|---|
| SupplierProduct 创建 | ✅ | ✅ | ✅ | ❌ | ✅ | L2 | ADMIN-ONLY |
| 组织关联 | ✅ | ✅ | ✅ | ❌ | ✅ | 组织 | IMPLEMENTED(org 隔离) |
| 供应商认领/Attach | ✅(结构) | ❌ | — | ❌ | ❌ | Future | MISSING |
| 供应商编辑 | ✅(结构) | ❌ | — | ❌ | ❌ | Future | MISSING |
| 供应商提交 | ✅(状态) | ❌ | ✅ | ❌ | ❌ | Future | ADMIN-ONLY |
| Admin 审核/批准/拒绝 | ✅ | ✅ | ✅ | — | — | 平台 | IMPLEMENTED |
| Admin 发布 | ✅ | ✅ | ✅ | — | — | 平台 | IMPLEMENTED |
| 供应商媒体 | ✅(结构) | ❌写 | — | ❌ | ❌ | Future | WRITE-MISSING |
| 供应商参数值 | ✅(结构) | ❌写 | — | ❌ | ❌ | Future | WRITE-MISSING |
| 权限委托 | ✅(orgMember) | ❌ | ❌ | ❌ | — | Hybrid | UNVERIFIED/MISSING |
| Unpublish | ❌ | ❌ | ❌ | ❌ | — | 平台Admin | MISSING |

## 26. Gap Classification（§36）

| Gap | 描述 | 严重度 |
|---|---|---|
| G1 Ownership Ambiguity | 已消歧（org=ownership/治理/公开owner），待文档冻结 | P2 |
| G2 Association/Claim Gap | 未来 Attach 未实现 | P2 |
| G3 Permission/Delegation Gap | 组织级开关/成员委托未实现 | P2 |
| G4 Lifecycle Gap | 无 edit / unpublish（创建后不可改、发布后不可撤）| **P1** |
| G5 Supplier UX Gap | "能力展示/展示管理"标签=Offer 面板，与 SupplierProduct 语义漂移 | P2 |
| G6 API Gap | SupplierProduct 无 supplier 写 / 无 edit/unpublish | P2（G4 为 P1）|
| G7 Schema Gap | 无（schema 支持目标）| — |
| G8 Search/Discovery Drift | 无（814 冻结未回归）| — |
| G9 Display Boundary Drift | 无（814 载荷层清）| — |
| G10 Documentation Drift | 手册/标题 vs 实现（Offer vs SupplierProduct）| P2 |

无 P0；G4=唯一 P1（unpublish/edit 缺失），不阻断既定 Admin 审→发闭环，故审计可 READY(B)。不把未来自服务能力缺失抬到 P1。

## 27. Fundamental Change Decision（§37）

目标所有权可用现有架构表达：SupplierProduct + organizationId + platformProductId + 现有 Organization/RBAC + 现有状态生命周期。**NOT FUNDAMENTAL CHANGE**。FUNDAMENTAL CHANGE CANDIDATE=否。（新实体否/新关系否/新授权权威否/schema 迁移否/新生命周期否，仅补 edit/unpublish 操作、不新增状态值。）

## 28. Target Ownership Architecture（§32/§38）

```
                    PLATFORM（权威中央化）
                       │
                       ▼
             Platform Product（WHAT · 平台权威）
                       │
              ┌────────┴────────┐
              ▼                 ▼
       SupplierProduct A   SupplierProduct B  （WHICH MODEL · 组织所属/隔离）
          Model A             Model B
              │                 │
              ▼                 ▼
         Supplier A          Supplier B       （WHO · Organization）
              │                 │
              └────────┬────────┘
                       ▼
                       Offer（COMMERCIAL RESPONSE · 供应商自助路径）
```

## 29. Recommended Governance Model（§41）

**推荐：D. Hybrid staged governance（混合分阶段）**
- 起始层级：**Level 0 — Platform Managed**（现状，冻结共识）。
- 长期层级：**Level 2 — Supplier Managed + Admin Review**（组织内成员在平台最终审核/发布下自助；发布仍平台）。
- 平台最终权威：平台管理员（种子创建、审批、最终公开发布）。
- 供应商权威：仅组织内（自有 SupplierProduct 自助），无权改平台产品/分类/参数/SEO/搜索权威。
- 组织级权限：组织能力开关（Admin 开启）。
- 用户级权限：现有 OrganizationMember.role/workspaceRole 委托。
- Claim 机制：**无独立 Claim**；用 Attach(建 org-owned DRAFT) 实现认领语义；跨组织共享=排除。
- Create 机制：Admin（现有）+ 未来组件 Attach/请求生成 DRAFT。
- Publish 机制：平台 Admin（仅公开权威）；供应商仅 SUBMIT。

这些决策**不在 815 实施**。**§21 Level 模型判定**：L0–L3 整体兼容，标记 **CONDITIONAL**（L0=冻结现状；L1–L3=未来授权前置）。

## 30. Recommended Future Batches（RECOMMENDED，未授权不实施）

- **Batch A（G4 关键，优先）**：组织级管理开关 + 补齐 **edit/unpublish（平台）** + 组织内 Attach(Option 2)。
- **Batch B**：组织内 SUPPLIER 成员对自有 SupplierProduct 的 create/submit（进 Admin 审核）+ 媒体/参数写路径。
- **Batch C**：自服务 UX 修正（"能力展示"标签漂移；明确"运行时能力=SupplierProduct 只读"）。
- **Batch D（可选）**：REJECTED→重新提交返回路径、unpublish 合规/审计（独立评估）。

不列入：无 Claim 实体、无 SupplierProduct 目录/SEO 门户、无自服务发布权。

## 31. Final Decision

**B = READY WITH CONDITIONS**。Ownership 可由现有 schema 冻结（=Hybrid，org=ownership，平台=最终权威，仅 PUBLISHED 公开）；条件=未来自服务起始层级(L0)、unpublish/edit(G4)、媒体/参数写、委托粒度 —— 均未来授权前置，不阻断冻结本审计既有模型。无 P0、无跨组织泄露、无平台权威冲突、无 schema 依赖、搜索/SEO/公开边界未受损。

**FINAL STATE**:
```
FINAL STATE: B — READY WITH CONDITIONS
OWNERSHIP MODEL: Hybrid — Platform-governed, Organization-owned SupplierProduct; Supplier self-service = Future (Offer is the supplier self-serve attach today)
CLAIM MODEL: existing relation (no separate Claim entity needed)
PERMISSION MODEL: Hybrid — Organization-level capability + existing member/workspace role delegation; no new RBAC authority
PUBLISHING AUTHORITY: Platform Admin (final public authority; supplier only submits)
CURRENT IMPLEMENTATION: partially aligned (Admin-governed lifecycle + org isolation = aligned; supplier self-service / edit / unpublish / media-param-write = missing)
NEXT AUTHORIZED WORK: NONE (READ-ONLY audit only)
NEXT RECOMMENDED WORK: SupplierProduct Governance batch A — org-level management enable + lifecycle edit/unpublish + org Attach (requires separate authorization)
M39: CLOSED
```

## 32. Non-Goals & Final Authority Invariant（§47/§49）

本审计**未实施**：Claim/self-service UI/SupplierProduct CRUD/权限开关/新 RBAC/媒体上传/参数值管理/搜索或 SEO/Product 或 Offer 或 Supplier 修改/schema/migration/新 Claim 实体。未重开 M39/814、未建 M39.1。

最终权威不变量：**Product=WHAT=平台权威 · SupplierProduct=WHICH=供应商具象 · Supplier=WHO=组织/提供商 · Offer=COMMERCIAL RESPONSE**；**Supplier 管理权限 ≠ 平台产品权威**；治理委托目的是降低 Admin 运维成本而非委托平台权威。平台权威中央化、运维可委托、公开发现权威平台中心。

**STOP。**