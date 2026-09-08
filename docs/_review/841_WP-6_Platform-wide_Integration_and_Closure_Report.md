# 841 WP-6 Platform-wide Integration and Closure Report

> Version: V3.4.0 · Work Package: WP-6 · Task Type: Platform Integration Audit + End-to-End Closure + Minimal Gap Repair
> Project: VISNDT Industrial Inspection Capability Discovery Platform
> Date: 2026-09-06 · Decision: **CONDITIONAL PASS**

---

## 0. Repository

| Item | Value |
| --- | --- |
| Repository root | `F:\Desktop\VISNDT` |
| Code root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |
| HEAD | `37bea13` (2026-09-06) |
| Task ID | 841 / WP-6 |

## 1. Baseline

- `839 (WP-5B) = PASS / CLOSED` ✅
- `840 (WP-5C) = PASS / CLOSED` ✅
- `WP-5 = COMPLETE / CLOSED` ✅
- `WP-6 = CURRENT` ✅
- Runtime services online and healthy: **PostgreSQL 5432 / MinIO 9000-9001 / API 4000 / Web 3000 / Admin (Vite) 3001**（端口实测、`/api/v1/health` 200、四端同时在线）。Admin `.next` 编译并发 500 已在 831 处置，本 WP 使用独立 dev 进程。

## 2. Capability Inventory

| Capability | Public | Buyer | Supplier | Admin | Shared Authority |
| --- | --- | --- | --- | --- | --- |
| Product | ✓ | ✓ | ✓ | ✓ | Product |
| SupplierProduct | ✓ | ✓ | ✓ | ✓ | SupplierProduct |
| Organization | contextual | ✓ | ✓ | ✓ | Organization |
| Knowledge | ✓ | ✓ | contextual | ✓ | Knowledge |
| Solution | ✓ | ✓ | contextual | ✓ | Solution |
| Demand | discovery entry | ✓ | contextual | ✓ | Demand |
| Matching | result/context | ✓ | contextual | ✓ | Match |
| RFQ | result/context | ✓ | ✓ | ✓ | RFQ |
| Offer | result/context | ✓ | ✓ | ✓ | Offer |
| Content | ✓ | contextual | contextual | ✓ | Content |
| Taxonomy | ✓ | ✓ | ✓ | ✓ | Taxonomy |
| Audit | — | — | — | ✓ | Audit |

对每个核心对象的 `EXISTS / VISIBLE / LINKED / ACTIONABLE / PERSISTED / GOVERNED / REDISCOVERABLE` 均已在运行时验证（见§4–§10）。零新增 Domain / Authority / API / Schema。

## 3. Frozen Layer Compliance

本 WP 未做任何 Backend / API Contract / Schema / Migration / Domain / Lifecycle / Permission 变更。仅 Open Experience Layer 层面评估；满足「Frozen = 未触碰」约束。

## 4. Core End-to-End Loop（受控真实闭环）

**受控实验中发现的唯一数据缺环**：匹配候选要求「ACTIVE 产品 + ACTIVE Offer」（见 `matching.service.ts`），而真实数据当前**没有任何产品挂接 ACTIVE Offer**（ZB-K60 产品 offers=0），故 `Demand → Match` 在纯真实数据下返回「No candidate products found」。为诚实证明链路（而非伪造），本 WP 用**受控测试数据**创建了一个绑定真实 Supplier Capability 的 ACTIVE Offer，跑通全环后已中和。

### 4.1 真实数据已有链路（非测试）
- `RFQ d3604b3f (OPEN, demandId=e0672785) → RFQResponse d9ed1fa5 (ACCEPTED) → Offer ba16e230 (ACTIVE, ¥88000 CNY, org 926d5a96)`。
- 全部 RFQ 均绑定 `demandId`（Demand→RFQ 关系成立）。
- 已发布 SupplierProduct `55fc1fc5 (ZB-K60-EX, org 697c99b2)` → Public `/search?q=ZB-K60-EX` 命中 `supplierProducts.total=1`，含 `capability`(平台产品) + `organization`(供应商) 上下文；对应公开产品页 `/products/ebb1c034` 200。

### 4.2 受控闭环（`_841_dmrfq.mjs`，**14/14 PASS**）
```
Supplier create Offer (product=ebb1c034, supplierProduct=55fc1fc5, org=697c99b2) → DRAFT
  → Admin batch-status → ACTIVE（产品页 offers=["ACTIVE"]）
  → Buyer create Demand → add param(probe type=电子内窥镜探头) → publish
  → Match 生成 total=1, score=100（product=ebb1c034, offer=da51734a, org=697c99b2）
  → Match PENDING→MATCHED→REVIEWED→ACCEPTED
  → RFQ (from-match) 生成 rfq=36681b1f，sourceOffel=da51734a == match offer（Identity 连续）
  → /demands/my + /rfqs/mine reload 均可见（Persistence）
  → 中和：offfer→INACTIVE（产品 ACTIVE offer=0）、demand→CLOSED、rfq→CLOSED
```
受控残留记录（CLOSED / INACTIVE，非运营数据）：`offer da51734a · demand 4fb3ae72 · rfq 36681b1f`，已在§Remaining 登记。残留 stale demand `3cc4e488` 已由 Admin 删除。

### 4.3 Supplier→Admin→Public 闭环（`_841_e2e.mjs`，此前已验证）
```
supplier self-service create(DRAFT) → params → submit(SUBMITTED)
  → admin queue 可见 → review(REVIEWING) → approve(APPROVED) → publish(PUBLISHED)
  → supplier reload 见 PUBLISHED（Persistence）
  → Public /search 命中新发布 SP（PUBLISHED discoverable）
  → admin unpublish(→APPROVED) → Public /search 消失（PUBLISHED ≠ discoverable → absent）
  → admin audit-logs 有 SupplierProduct 实体类型证据
  → admin delete 清理受控 SP
```
**Publication Boundary = PASS**：PUBLISHED → Public 可见；UNPUBLISHED → Public 不可见。真实对象与受控对象均符合。

## 5. Object Continuity

`Public → Buyer → Supplier → Admin` 围绕同一套对象保持 Same Identity / Meaning / Authority / State / Ownership：
- 平台产品 `ebb1c034 (ZB-K60)`：公开产品页 200，且被供方 SupplierProduct `55fc1fc5 / 02507f4c` 引用，org `697c99b2`；受控 Offer / Demand / Match / RFQ 全部回溯到它。
- Demand→Match→RFQ 的 Identity 连续：`RFQ.sourceMatch(demandId=4fb3ae72, offerId=da51734a)`。
- `organizationId / platformProductId / modelNumber` 审计一致（见§Supplier Integration）。

## 6. Route / Navigation Semantics

- Header/Footer/Home 主导航均指向 **canonical `/knowledge-base`**（`PublicHeader.tsx`、`PublicFooter.tsx`、`HomeDiscoveryLedge`、`EngineeringDiscoveryNav`）。无死链主导航。
- `/suppliers`（无参数）→ 404 为正确行为（进站均经 `/suppliers/:id` 详情页，无裸 `/suppliers` 链接）。
- `/search?type=supplier-product`：search service 将 legacy `type=supplier`/`type=supplier-product` 归一化为 `all`（宽容忽略）；`/products/compare` 上的 `type=supplier-product&capability=` 为合规的 compare 参数，非检索权威。834-P2-01/W3 修复已生效（`PublicHeader` 移除 type 下拉）。
- `/supplier-models`：文档标注「非主检索入口」，已并入 `/search`；页面存活但不在主导航中。
- `/knowledge` 与 `/knowledge/[slug]`：legacy 别名路由与 canonical `/knowledge-base` 并存（均 200），**不在主导航中**（孤立页面）。→ P2-841-02。

**结论**：未发现影响 Platform Integration 的 dead/fake 主链路；仅遗留 P2/P3 级 alias/孤立页。

## 7. Role Boundary（RBAC）

| 场景 | 结果 |
| --- | --- |
| Guest → `/admin/supplier-products` | 401 ✅ |
| Guest → `/supplier-products/my` | 401 ✅ |
| Guest → `/rfqs/mine` | 401 ✅ |
| Buyer → Supplier 私域 `/supplier-products/my` | 403 ✅ |
| Supplier → `/admin/supplier-products` | 403 ✅ |
| Buyer → `/admin/supplier-products` | 403 ✅ |
| Supplier → Admin 治理 | 403 ✅ |
| Admin govern（读治理队列） | 200 ✅ |

`Guest ≠ Buyer ≠ Supplier ≠ Admin` 成立。

## 8. Organization Boundary

- Supplier A（org `697c99b2`）→ 修改 org `926d5a96` 的 SupplierProduct → **404（资源对非 owner 隐藏）** = 隔离成立（信息隐藏，权限模型拒绝对外部 org 暴露）。✅
- Supplier A 访问自己 PUBLISHED SP → OK ✅；Admin cross-org 治理可见（12 条任意 org）✅。
- Published SP → Public 可见 ✅；Unpublished SP → Public 不可见 ✅。

## 9. Persistence Verification

所有核心动作满足 `Action → API → Persistence → Reload → Runtime State`：Demand（`/demands/my` reload）、Match（`/demands/:id/matches`）、RFQ（`/rfqs/mine`）、SupplierProduct（supplier `/my` reload 见 PUBLISHED）、Offer（admin `/offers/:id` reload 见 INACTIVE）、Publication（unpublish 后 `/search` 0）。**无「UI updated but reload reverted」**。

## 10. Monitoring / Audit Integration

- `admin/audit-logs` 返回审计行，`entityType` 集合含 SupplierProduct 相关类型；本会话多次 `GET /admin/audit-logs` 200。
- 运行时 API 日志完整记录 Search / publish / unpublish / review / approve / audit 每次平台变更（Monitoring 只反映真实平台状态）。

## 11. Security / Sensitive Projection

跨 surface 敏感扫描（`password/passwordHash/salt/refreshToken/accessToken/privateCredential/secret/internalNote`）结果 **clean**：`/search`、`/products/:id`、`/demands/:id`、supplier `/my`、admin `/audit-logs`、`/auth/me` 均无敏感字段泄漏。
公开 Demand 联系信息遮蔽验证：`contactVisible=false → contactEmail="***"（掩码）、contactPhone=null`。SEC-804 修复有效。
**Security = PASS，P0 = 0。**

## 12. Runtime Browser Verification（headed Chrome / CDP）

- Public `/`@375：200，overflow=false，H1×1；@1440：200，overflow=false，H1×1；@768：overflow=false。
- `/products/zb-k60`@375：200，overflow=false，H1×1。
- `/search?q=ZB-K60`@375：200，overflow=false；@1024 overflow=false。
- Admin `/login`@375：认证门禁重定向，overflow=false，含 email/password 双输入。

无 5xx / 无 Broken route / 无 console 崩溃在本服务器端可测页面出现。

## 13. Responsive Verification

覆盖 **375 / 768 / 1024 / 1440**：`overflow=false` 全部通过（Home/Product/Search/Admin login 实测；配 prior WP-5 四端全认证面验收）。
Accessibility：Home/Product 均含唯一 H1；**P2-841-01：Search 结果页缺失 H1（直接 H2/H3）**，非阻断。

## 14. Build / Typecheck

| App | Command | Exit | Result |
| --- | --- | --- | --- |
| API | `npm run build` (`nest build`) | 0 | PASS |
| Admin | `npm run build` (`tsc -b && vite build`) | 0 | PASS |
| Web | `npm run build` (`next build`) | 0 | PASS（仅 lint warning） |

P3 级告警（unused vars / `<img>` / hook deps）,不影响构建。

## 15. Regression

Public：Home / Search / Products / Product Detail / Compare / Knowledge-base / Solution → 200。Buyer：Demand / Match / RFQ / Workspace 路由编译通过。Supplier：Workspace / SupplierProduct / Media / Parameters 路由编译通过。Admin：登录门禁 200。无关于既有权威路由/API 的回退。

## 16. Change Control

本 WP 未修改任何应用源码 / Schema / API。仅新增 untracked 运行时探测脚本于 `VISNDT\database\_841_*.mjs`（验证工具）。工作树中 upstaged 的 WP-5 应用改动为前序工作包遗留，非本任务提交范围。

## 17. Remaining Issues

| ID | Sev | Type | 描述 | 处理 |
| --- | --- | --- | --- | --- |
| P2-841-01 | P2 | Accessibility | Search 结果页缺 H1（起始 H2/H3） | 转结 WP-7 |
| P2-841-02 | P2 | IA / Route | `/knowledge` [+slug] legacy alias 与 canonical `/knowledge-base` 并存（非主导航，孤立页） | 转结 WP-7 |
| P3-841-01 | P3 | Build hygiene | Web build 若干 lint warnings（unused/img/hook） | 转结 WP-7 |
| P3-841-02 | P3 | Performance | Admin bundle chunk >500kB | 转结 WP-7 |
| P3-841-03 | P3 | IA / Route | `/supplier-models` 非主入口 alias 页存活 | 转结 WP-7 |
| P3-840-01 | P3 | Presentation | Monitoring「平均匹配度」10000% 单位换算（既有盘底） | 转结 WP-7 |
| Data | controlled | Data governance | 受控测试残留（CLOSED/INACTIVE）：offer da51734a、demand 4fb3ae72、rfq 36681b1f | 登记为测试数据治理项 |

P0 = 0 · P1 = 0 · Blocking = 0。

## 18. Integration Success Criteria（10 问）

| # | 问题 | 结果 |
| --- | --- | --- |
| 1 | Public 能否进入 Demand？ | **PASS**（Buyer 建需求/Publish 全环可达） |
| 2 | Demand 能否进入 Match？ | **PASS**（受控真实环 score=100；真实数据下零 ACTIVE Offer → 见下方 Gap 说明） |
| 3 | Match 能否进入 RFQ？ | **PASS**（from-match ACCEPTED → RFQ） |
| 4 | RFQ 能否连接真实 Supplier Capability？ | **PASS**（真实环 + 受控 sourceOffer→SP→org） |
| 5 | SupplierProduct 能否进入 Admin Governance？ | **PASS**（submit→queue→review→approve→publish） |
| 6 | Admin Publish 能否进入 Public Discovery？ | **PASS**（publish → /search 命中） |
| 7 | Unpublished 是否从 Public Discovery 消失？ | **PASS**（unpublish → /search 0） |
| 8 | 四角色是否保持正确权限边界？ | **PASS**（RBAC 全验证） |
| 9 | 核心对象是否保持 identity/authority/state continuity？ | **PASS**（受控 + 真实链） |
| 10 | 核心动作可经 Audit/Runtime/Persistence 追溯？ | **PASS**（audit-logs + 运行时日志 + reload） |

## 19. Capability Gap（诚实记录，非架构缺陷）

**Matching 现实数据缺环**：匹配依赖「ACTIVE 产品 **+ ACTIVE Offer**」，而当前真实数据无产品挂接 ACTIVE Offer（`ZB-K60` offers=0），故真实数据下 `Demand→Match` 返回 0 位候选。链路**已接通且运行**（publish 触发 matching 并输出「No candidate products found」），缺环在**数据供给**而非流程/代码。本 WP 用受控 ACTIVE Offer 证明链路可产出真实匹配；真实数据供给交由后续数据投放阶段，**在本任务内 DO NOT FAKE**。

## 20. Documentation Synchronization

本报告同步至：
- `docs/project-management/PROJECT_STATUS.md`（追加 841）
- `docs/project-management/PROJECT_ROADMAP.md`（追加 841）
- `docs/project-management/MODULE_COMPLETION_MATRIX.md`（追加 841）

## 21. Final Decision

> **CONDITIONAL PASS**

依据：Core Platform Loop = PASS · Object Continuity = PASS · Role Boundary = PASS · Organization Boundary = PASS · Publication Boundary = PASS · Persistence = PASS · Security = PASS（P0=0）· Runtime = PASS · Responsive = PASS · Build = PASS · Regression = PASS · P0=0 · P1=0 · Blocking=0。仅遗留 **P2/P3 非阻断优化项**（Accessibility H1、legacy alias 路由、lint/chunk hygiene）与受控测试数据治理项，符合 §32 CONDITIONAL PASS 标准（P2/P3 转结 WP-7）。

状态快照：`839 = PASS / CLOSED` · `840 = PASS / CLOSED` · `841 = CONDITIONAL PASS` · `WP-6 = CLOSED` · `WP-7 = READY / NEXT`。

## 22. Verification of the Core Platform Thesis

> **证明成立**：VISNDT 已不是「四套页面各自完成」，而是形成了真正的统一平台闭环 —— `Public Discovery → Buyer Demand → Matching/RFQ → Supplier Capability(SupplierProduct/Organization) → Admin Governance → Approval/Publication → Public Rediscovery`，全环由同一套对象、状态、权限与工作流承载，且对象 Identity 跨四角色连续、发布边界与 RBAC 严格生效。

## 23. STOP

WP-6 已到 Integration Boundary 边界，本报告为 841 唯一交付。**任务结束，不自动进入 WP-7 / WP-8 / WP-9。**