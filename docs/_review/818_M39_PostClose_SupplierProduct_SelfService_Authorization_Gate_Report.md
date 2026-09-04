# 818 — M39 Post-Close · SupplierProduct Self-Service Authorization Gate

> Version: V3.2.3
> Type: **Architecture Audit + Data Semantics Audit + Permission/Governance Audit + Implementation Authorization Gate (AUTHORIZED AUDIT ONLY)**
> Date: 2026-09-03
> Branch: `main` · HEAD: `76b08e5`
> Repo Root: `F:\Desktop\VISNDT` · Code Root: `F:\Desktop\VISNDT\VISNDT`
> Evidence basis: Runtime/Browser/API/Persistence > Code > Schema > Documentation > Historical Decision

---

## 1. Executive Decision

**818 = B — CLOSED / NON-BLOCKING FOLLOW-UP**（架构审计闸门通过，下一步 SupplierProduct Self-Service **可进入但须独立授权**）。

> 架构闸门结论：**AUTHORIZATION-READY WITH CONDITIONS**。
> - SupplierProduct 从「组织所有的 DRAFT（Attach）」推进到「供应商可管理型号 / Submit → Admin Review → Approve → Publish」所需的数据模型、唯一性、归属、治理生命周期、公开边界均已在 816/817 + M28 Hybrid 基础上**验证为稳定**。
> - 未发现 P0/P1 阻断；未发现 Supplier 可跨组织访问、可改 Platform Product、可直接 Publish、可绕过治理、公开/搜索/SEO 暴露 DRAFT 等阻断项。
> - 存在 4 项**非阻断** carry-forward（见 §17），属于下一阶段实现前置条件，**不在本闸门内修**。
> - **本任务不对 SupplierProduct Self-Service 进行任何实现；按 §21/§23，即使在 READY 也立即 STOP，等待独立授权。**

---

## 2. Baseline（§4 核验）

| 任务 | 指令快照 | PROJECT_STATUS 实际 | 一致性 |
|------|:---:|:---:|:---:|
| M39 | CLOSED | CLOSED（808）| ✓ |
| 811 | VERIFIED / NON-BLOCKING FOLLOW-UP | IMPLEMENTED + VERIFIED，Next=STOP | ✓ |
| 812 | CLOSED | A=CLOSED | ✓ |
| 813 | CLOSED | AUDIT 完成（A=AUTHORIZATION READY）| ✓ |
| 814 | CLOSED | A=CLOSED | ✓ |
| 815 | READY WITH CONDITIONS | B=READY WITH CONDITIONS | ✓ |
| 816 | CLOSED | CLOSED | ✓ |
| 817 | CLOSED | CLOSED | ✓ |

**基线一致，无 BASELINE DRIFT。**

> 注：git HEAD 停留于工作树未提交的历史快照（M34.6 之后 M35–M39/811–817 全部为未跟踪工作树+文档状态），这是本项目既有治理模式；状态权威以 `docs/project-management/PROJECT_STATUS.md` 为准，已核对一致。

---

## 3. Current SupplierProduct Semantics

- **Platform Product = WHAT**（`Product`，平台能力权威，`status` 为普通字符串 DRAFT，非枚举；平台侧治理）。
- **SupplierProduct = WHICH MODEL**（组织所有、绑定 `platformProductId` 的供应商型号实体；`SUPPLIER_ORG_TYPES` 校验组织为 ACTIVE SUPPLIER 型）。
- **Supplier = WHO**（Organization）；**Offer = COMMERCIAL**（price/currency 仅在 Offer，不在 SupplierProduct）。
- 817 Attach = 供应商选定既有 Platform Product → 系统派生 organizationId + 新建 status=DRAFT 的 SupplierProduct，平台产品只读不建不改（[workspace.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/workspace/workspace.service.ts#L700-L738)）。
- 持久化现状（read-only probe）：6 条 SupplierProduct = {DRAFT:1, PUBLISHED:5}；3 个拥有组织；2 个组织含 PUBLISHED。

---

## 4. Placeholder Data Audit（Critical Audit A）

**A1 — brand/modelNumber 性质：ATTACH FOUNDATION PLACEHOLDER。**
- 实据：attach 新建的 DRAFT `90fc786d`，`brand == Platform Product.name`（"ZB-K60 工业检测内窥镜"）且 `modelNumber == Platform Product.slug`（`zb-k60`），`isPlaceholder=true`（persistence probe）。不是真实供应商业务数据。

**A2 — placeholder 是否可能进入公开面：分区判定。**
- Public Capability Detail `/capabilities/:id`：**本期不可达**——DRAFT 不进 PUBLIC（实测 `draftAbsentFromPublicCapability=true`）。
- Search：**不可达**（`buildWhere` 强制 `status=PUBLISHED`，[supplier-model-facet-search.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/search/supplier-model-facet-search.service.ts#L173-L174)；实测 `/search?q=zb-k60` 不包含 DRAFT id）。
- SEO / Sitemap：**不可达**——sitemap.ts 无任何 SupplierProduct/独立型号 URL；APPROVED/PUBLISHED 均不产生独立 SEO 权威。
- SupplierProduct Facet / Admin Publish / Offer：placeholder 仅当**管理员手动走完整审→发链路**后才可能进入 PUBLISHED 集合；当前无任何自动耦合建 Offer（`offerWithSupplierProduct=0`）。

**A3 — 是否可绕过真实数据补全直达 APPROVED/PUBLISHED：NON-BLOCKING DESIGN CONSTRAINT（非 P1）。**
- Supplier **无** submit/review/approve/publish 写路径（均为 `admin/supplier-products/*` + `@Roles(Role.ADMIN)`；submit=ADMIN-ONLY）。
- DRAFT→…→PUBLISHED 必须由 Admin 逐级触发 `DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED`，`transition()` 对 source state 做硬校验，**无 DRAFT→APPROVED / DRAFT→PUBLISHED 跳变**。
- 因此 placeholder **不可能由供应商自行绕过治理**；是否存在"发布 placeholder"取决于 Admin 的治理判断——这是**设计约束（缺"发布前须真实数据"闸门）**，记录为 non-blocking carry-forward（§17-F），不等于 P1 绕过。

---

## 5. Multiple-Model Audit（Critical Audit B）

- Schema/Data/UI/治理**已支持** One Platform Product → Multiple SupplierProducts：
  - 跨组织：platform `ebb1c034` 有 2 个组织各持有型号（persistence：`multiSupplierPlatforms=[{pp:ebb1c034, orgs:2}]`）。
  - 同组织多型号：org `697c99b2` + pp `ebb1c034` 下 2 个**真实不同型号** `ZB-K60` / `ZB-K60-EX`（`distinctModels=2`），PUBLISHED、+ Admin UI 可见。
- 但**当前 817 Attach 为 association 级限制**：`modelNumber = platform.slug`（固定）→ 复合唯一 `(org,pp,modelNumber)` 使同 org 同 platform 只能 attach 1 条；重复 attach 直接返回 `alreadyAttached=true`（[workspace.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/workspace/workspace.service.ts#L716-L723)）。
- 结论：**「组织可挂靠的第二个/更多型号」目前不是 Attach Foundation 能力，而是未来管理批次的职责**（写入真实不同 modelNumber 即可被同一复合唯一容纳）。此为 817 既有受控限制，非缺陷，不改。

---

## 6. Uniqueness Audit（Critical Audit C）

- Schema 复合唯一：`@@unique([organizationId, platformProductId, modelNumber])`（[schema.prisma](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L591)）。
- 语义比较：
  - **Association Uniqueness**（同一组织 on 同一平台能力只一条）：Attach 阶段，因 `modelNumber` 固定为 slug，上述复合唯一在 attach 载荷下**退化为 association 唯一**；应用层也以 `findFirst({org,pp})` + `alreadyAttached` 显式强制。
  - **Supplier Model Uniqueness**（同一组织 on 同一平台能力下，每个真实 modelNumber 唯一）：相同复合唯一在**真实不同 modelNumber**载荷下**精确表达** model 级唯一；Admin `update()` 另有 `modelNumber`/`slug` 显式冲突守卫（[supplier-products.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/supplier-products/supplier-products.service.ts#L316-L343)）。
- **结论：两者共同成立（BOTH，无冲突）**——同一索引表达 model-level uniqueness；association 唯一是 attach 阶段叠加的应用策略。**无需 Migration**。

---

## 7. Ownership Audit（Critical Audit D）

- `SupplierProduct.organizationId` 为**唯一业务所有权锚点**（`@relation Organization`，非空）。
- 不存在 shared / cross-org / claim 所有权：
  - schema：唯一 `organizationId`（无 second-owner/claim 字段）；无 Claim Entity。
  - 运行：`owningOrgCount=3`、每行单 org；`demo.supplier.01`(org `926d5a96`) 仅拥有其 DRAFT，另一供应商读该 DRAFT → **403**（cross-org 隔离实据）。
- 与 815 结论一致：**不需要新增 Claim Entity**。

---

## 8. Permission Audit（Critical Audit E）

- 恢复当前权限链：`JwtAuthGuard` → JWT 载荷（`organizationId` + `workspaceRole`）→ `getSupplierOrganizationId` 断言 `workspaceRole==='SUPPLIER'` + org 上下文；法务/平台端 Admin 走 `RolesGuard + @Roles(Role.ADMIN)`。
- 当前 Attach 由 **workspaceRole=SUPPLIER 直接授权**，对 Foundation 足够。
- **PERMISSION STORAGE GAP**：代码中 **不存在**"organization-level capability / feature permission"（如 `SupplierProduct Management Enabled`）的存储字段；现有 `OrganizationMember.role` / JWT `workspaceRole` 是 per-user / per-membership 委托，**不能独立表达「组织启用该能力 + 成员被允许」的 org 级开关**。
- 按 §10：**如实输出 `PERMISSION STORAGE GAP`**，不新增实现；该 gap 是未来「全量自服务」的授权前置（§17-F）。

---

## 9. Admin Governance Audit（Critical Audit F）

- `Admin = Platform Governance Authority`：
  - create / list / get / submit / review / approve / reject / publish / unpublish / update / delete 全部位于 `@Controller('admin/supplier-products')` + `@Roles(Role.ADMIN)` + `RolesGuard`（[supplier-products.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/supplier-products/supplier-products.controller.ts#L32-L34)）。
  - 所有权锚点 `organizationId`/`platformProductId` 在 `update()` 中**不可变**。
- Supplier 自助能力即使未来实现，也不产生：取权建/改 Platform Product（attach 仅 `findUnique` 校验，不 create/mutate Product）、Supplier 不可直接 publish（`/admin/.../publish` 仅 ADMIN）。**Supplier operational ownership + Platform governance authority 成立。**

---

## 10. Lifecycle Audit（Critical Audit G）

- Schema 枚举：`DRAFT / SUBMITTED / REVIEWING / APPROVED / PUBLISHED / REJECTED`（[schema.prisma](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L135-L142)）＋治理时间戳 `submittedAt/reviewedAt/reviewedBy/reviewedNote/publishedAt`。
- 实现级（Service/Controller/Admin UI 全链路，均 ADMIN-only）：
  - `DRAFT→SUBMITTED`(submit) → `SUBMITTED→REVIEWING`(review) → `REVIEWING→APPROVED`(approve)｜`REVIEWING→REJECTED`(reject,note 必填) → `APPROVED→PUBLISHED`(publish)；`PUBLISHED→APPROVED`(unpublish)。
  - `transition()` 对 source state 硬校验（[supplier-products.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/supplier-products/supplier-products.service.ts#L399-L421)）。
  - Admin UI（SupplierProductDetail/List）暴露 submit/review/approve/publish/reject/unpublish 操作与中文状态映射。
- **未发现 DOCUMENTATION / CODE / RUNTIME DRIFT**：枚举、Controller、Service、Admin UI、Client、运行时状态一致；`DRAFT→…→PUBLISHED` 与 816 报告一致。

---

## 11. Public Boundary Audit（Critical Audit H）

- **DRAFT**：不进 Public Capability、Search、SEO、Sitemap、AI/LLM 发现。
  - 实测：`draftAbsentFromPublicCapability=true`；`draftAbsentFromPublicSearch=true`；sitemap 无 SupplierProduct；facet 强制 PUBLISHED。
- **APPROVED**：**非公开**（仅 PUBLISHED 进入公开发现 —— unpublish 即为 PUBLISHED→APPROVED）。
- 依据真实 Query/Runtime 而非枚举名：public `/capabilities` 仅投影 PUBLISHED（`findCapabilityGraph` statusFilter），Search `buildWhere` 仅 PUBLISHED。判定：**PASS**。

---

## 12. Commerce Boundary Audit（Critical Audit I）

- `SupplierProduct ≠ Offer`（schema 独立模型，price/currency 仅在 Offer）。
- Attach 不自动建 Offer / Price / Currency / Inventory / Commercial Terms：实测 `offerWithSupplierProduct=0`、`offerTotal=1`（唯一 offer 未挂接 attach 型号）。
- 错误耦合检查：
  - Attach 路径：**无耦合**。
  - 供应商私域 `getSupplierProducts` 含 `commercialSummary`（total/activeCount/minPrice/maxPrice）——属**私有 workspace（JWT 门）**，非公开，合理合法，不是污染。
  - 残留项：公开 `/capabilities/:id` 载荷仍返回 `supplierProducts[].commercialSummary`(priceFrom/priceTo/currency) + `offers[]`（M28 Hybrid【既有】，render 层 SupplierModelsSection 已 814 冻结不渲染价格）。属 **P2 payload 层商业边界残留**（pre-existing、非 817/818 引入；见 §17-I）。

---

## 13. Field Authority Matrix（Critical Audit J）

| 字段 | required | 来源 | supplier-owned | platform-owned | admin-controlled | 说明 |
|------|:---:|------|:---:|:---:|:---:|------|
| organizationId | 必填 | 认证派生 / Admin 选择 | ✓（所有权锚点）| — | 不可变 | 唯一业务所有权锚点 |
| platformProductId | 必填 | Attach 参数 / Admin 选择 | — | ✓（能力锚点）| 不可变 | 平台能力只读引用 |
| brand | 非空 | Attach 从 platform.name **placeholder 派生** | ✓（可编辑）| 种子 | Admin edit | 非空≠真实值；真实值由后续治理三步提供 |
| series | 可选 | supplier | ✓ | — | Admin edit | 无 placeholder |
| modelNumber | 非空 | Attach 从 platform.slug **placeholder 派生**（唯一性作用域 org,pp）| ✓（可编辑）| 种子 | Admin edit | 非空≠真实值；唯一性承载 |
| slug | 可选/唯一 | supplier | ✓ | — | Admin edit | 全局唯一冲突守卫 |
| description / technicalDescription / applicationInfo | 可选 | supplier | ✓ | — | Admin edit | 无 placeholder |
| status | 默认 DRAFT | 治理 | — | — | ✓ Admin | 生命周期 |
| submittedAt / reviewedAt / reviewedBy / reviewedNote / publishedAt | 可选 | 治理 | — | — | ✓ Admin | 治理时间戳 |

> 结论：**NOT NULL（brand/modelNumber）由 attach keyword 派生满足，不应解释为「Attach 阶段必须补真实值」。真实值补全 = 下一阶段自服务治理三步 / Admin 治理的职责，非现状缺陷。**

---

## 14. Runtime Evidence（read-only）

- 环境：PostgreSQL `5432`(up) · Web `3000`(up) · API `4000`(health `{"status":"ok","database":"connected"}`)。本轮对 API 仅执行 GET（无写、无 DELETE/UPDATE/MIGRATION/RESET）。
- Persistence probe（`_818_probe.mjs`）：6 行 = {DRAFT:1, PUBLISHED:5}；attach 占位 DRAFT=1；`maxModelsPerOrgPlatform=2`；platform `ebb1c034` 跨 2 组织；`offerWithSupplierProduct=0`；`owningOrgCount=3`、`orgsWithPublished=2`。
- API probe（`_818_api.mjs`）：
  - Admin 治理池 `GET /admin/supplier-products` → 看到 attach DRAFT（status=DRAFT）+ 5 PUBLISHED。
  - 拥有者 Supplier（org `926d5a96`）`GET /workspace/supplier/runtime/products` → 见自己 DRAFT。
  - 另一 Supplier `GET .../inquiry-context/{draftId}` → **403**（cross-org 隔离）。
  - 公开 `GET /capabilities/:id(pp)` → 200，`publicPublishedCount=2`，`draftAbsentFromPublicCapability=true`。
  - 公开 `GET /search?q=zb-k60` → `draftAbsentFromPublicSearch=true`。

---

## 15. Regression（§19）

| App | 命令 | 结果 | 分类 |
|-----|------|:---:|------|
| API | `npx tsc --noEmit` | 0 errors | ✓ PASS |
| API | `npx nest build` | 0 errors | ✓ PASS |
| Admin | `npx tsc -b` | 0 errors | ✓ PASS |
| Admin | `npx vite build` | 0 errors（仅 chunk-size 警告）| ✓ PASS |
| Web | `next build` | 仅 `knowledge-base/[slug]/page.tsx:322 RelatedProductItem.status` | ⚠️ **PRE-EXISTING / NON-BLOCKING**（802/M39 已知基线，与 811/812/814/816/817 记录一致，**非 818 回归，未误归因**） |

> 818 为 audit-only，**未改动任何应用源码**；工作树差异均来自先前阶段累积，不含 818 引入项。未误把 Web `RelatedProductItem.status` 归因给 818。

---

## 16. Architecture Risks

1. **权限存储缺口**（PERMISSION STORAGE GAP）：无 org 级能力开关字段 → 全量自服务的「组织启用+成员允许」需新增表达（未来，独立授权）。
2. **占位数据无「发布前补全」强制**：Admin 可审→发一个仍为 placeholder 的型号到 PUBLISHED（设计约束，非供应商绕过）。
3. **Attach association 级**：同 org 同一平台多型号需后续管理批次（不同 modelNumber）方可建；当前 `alreadyAttached` 封顶 1 条。
4. **公开 `/capabilities` payload 商业残留**（P2）：pre-existing，render 已降级，建议载荷层一致性清理（独立授权）。

---

## 17. Recommended Future Model

- **数据**：保持 `SupplierProduct.organizationId + platformProductId + modelNumber`（复合唯一=model 级）零迁移。新增/编辑型号即写真实 modelNumber；同 org 同平台多型号自然成立。
- **生命周期**：沿用现状态机（DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED / REJECTED / unpublish），不新增 UNPUBLISHED 枚举。
- **权限（授权前置）**：引入 org 级能力开关（如 `SupplierProduct Management Enabled`）+ 现有 `OrganizationMember.role`/`workspaceRole` 联动 = 表达「org enabled + member allowed」；**不建第二套 RBAC**。
- **治理三步**：Submit/Admin Review/Approve/Publish 前，强制品牌/型号/描述/参数真实（placeholder 拒绝发布闸门）。
- **公开边界**：DRAFT 永不公开；仅 PUBLISHED 进入 Public/Search/Facet；SupplierProduct 从属 Platform Product，不作独立 SEO/搜索权威；清理 `/capabilities` payload 商业残留。

---

## 18. Authorization Gate

- **判定：AUTHORIZATION-READY WITH CONDITIONS → 818 = B（CLOSED / NON-BLOCKING FOLLOW-UP）。**
- 已稳定的三支柱（数据模型 / 唯一性 · 归属 / 治理生命周期）+ 公开边界支持进入下一阶段；
- 下一阶段（SupplierProduct 自服务实现：brand/series/modelNumber/description/media/parameter values + Governed Submit→Admin Review→Platform Publish）**未获本任务授权**；触发条件（§17 权限 gap、placeholder 补全闸门、Attach 多模型放开）须在独立授权的任务中落地。
- 分类对照（§21）：非 D（模型/生命周期/唯一性足够，非架构 gap）、非 E（无组织隔离/权限/公开/治理绕过阻断）。**未发现 P0/P1。**

---

## 19. State Synchronization

```
Code State = Runtime State = Documentation State =
Architecture State = Roadmap State = Progress Snapshot State
```

- 需同步文件：`PROJECT_STATUS.md`（追加 818）、`PROJECT_ROADMAP.md`、`MODULE_COMPLETION_MATRIX.md`。
- 818 不改变既有实施态；不重开 M39/811–817；不改 schema/migration/API/权限/搜索/SEO/UI。

---

## 20. STOP

- 本任务为 **AUDIT-ONLY**，未实现、未改源代码、未改 schema/migration/API，未执行破坏性写。
- 按 §22，复查 STOP 条件均未触发（无 816/817 文档/代码/Schema/Runtime 不可解释不一致；无新 P0/P1；无新 typecheck/build 错误；无需 Migration/新 Claim/新 RBAC）。
- 按 §23/§25：**DO NOT continue** 到 SupplierProduct Edit / Media / Parameter / Submit / Publish / Search / SEO / AI。
- 即使 818=B（READY WITH CONDITIONS），**必须 STOP，等待独立授权**。
- 遗留 evidence 脚本：`apps/api/_818_probe.mjs`、`apps/api/_818_api.mjs`（read-only），与既有 `_815_ro_probe.mjs` 等探针模式一致，随工作树保留。

---

### Final State Snapshot

```
M39 = CLOSED
811 = VERIFIED / NON-BLOCKING FOLLOW-UP
812 = CLOSED
813 = CLOSED
814 = CLOSED
815 = READY WITH CONDITIONS
816 = CLOSED
817 = CLOSED
818 = B  (CLOSED / NON-BLOCKING FOLLOW-UP)
```

**STEPPED.**