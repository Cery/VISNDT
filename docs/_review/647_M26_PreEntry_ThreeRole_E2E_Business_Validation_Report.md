# 647_M26_PreEntry_ThreeRole_E2E_Business_Validation_Report

> Task: 647_M26_PreEntry_ThreeRole_E2E_Business_Validation
>
> Type: Full Business Journey Validation / Browser E2E Testing / Functional Audit
>
> Stage: M26 Entry Validation
>
> Execution Mode: Trae Validation / Browser Automation / Functional Audit
>
> Baseline: 646.1_Release_Validation_Patch（PASS）+ 645_M25_Final_Closeout（M25 Productization Foundation Complete）
>
> Status: **CONDITIONAL PASS**

---

## 1. Test Environment

### 1.1 环境标识

| 项 | 配置 |
| --- | --- |
| Repository Root | `F:\Desktop\VISNDT`（V3.2.3 指令一致） |
| Code Root | `F:\Desktop\VISNDT\VISNDT`（V3.2.3 指令一致） |
| API | `localhost:4000`（NestJS `api/v1`） |
| Web | `localhost:3000`（Next.js 15.5.20） |
| Admin | `localhost:3001`（Vite 6.4.3） |
| PostgreSQL | `localhost:5432` |
| 测试基线包 | @visndt/design-system / identity-contract / rule-engine-contract（EXISTING，未重建） |

### 1.2 服务可用性

| 服务 | 端口 | 初始探测 | 处理 |
| --- | --- | --- | --- |
| API | 4000 | AVAILABLE | 全程在线 |
| PostgreSQL | 5432 | AVAILABLE | 全程在线 |
| Web | 3000 | 运行中，但 Next.js 多次因内存不足崩溃（ENOMEM） | 已重启（`--max-old-space-size=4096`） |
| Admin | 3001 | 初始未监听 | 已重启（`pnpm dev`） |

> 注意：Web 服务在本次 E2E 中多次因 `RangeError: Failed to allocate memory` 崩溃（详见第 10 章 UX/Infra 缺陷）。属开发环境内存约束问题，非业务逻辑缺陷。

---

## 2. Account Verification

### 2.1 认证链路验证

通过浏览器登录 + API `POST /auth/login`、`GET /auth/me` 双重验证。

| 账号 | 角色（预期） | 登录 | `/auth/me` `workspaceRole` | 工作区跳转 | 状态 |
| --- | --- | --- | --- | --- | --- |
| `demo.admin@visndt.local` | ADMIN | ✓ | —（Admin 走控制台） | `/`（3001 控制台） | PASS |
| `demo.buyer.01@visndt.local` | BUYER | ✓ | `BUYER` | `/dashboard/buyer` | PASS |
| `demo.supplier.01@visndt.local` | SUPPLIER | ✓ | `SUPPLIER` | `/dashboard/supplier` | PASS |

### 2.2 组织归属（DB 复核）

| 账号 | 组织 | 组织类型 | 状态 |
| --- | --- | --- | --- |
| demo.admin@visndt.local | VISNDT 平台运营中心 | ADMIN | ACTIVE |
| demo.buyer.01@visndt.local | 江南航空检测技术中心 | BUYER | ACTIVE |
| demo.supplier.01@visndt.local | 明视工业检测设备有限公司 | SUPPLIER | ACTIVE |

### 2.3 权限隔离结论

- **Buyer** 登录 → `/dashboard/buyer`，侧边栏仅 Buyer 菜单（需求/RFQ/匹配/通知/设置），无 Admin/Supplier 入口：**隔离正确**。
- **Supplier** 登录 → `/dashboard/supplier`，侧边栏仅 Supplier 菜单（RFQ/Responses/Offers/Opportunities/Profile/Display/Notifications）：**隔离正确**。
- **Admin** 登录 → Admin Console（3001），不进 Buyer/Supplier 工作区：**隔离正确**。（初期观察到「工作区角色未配置」为旧会话/缓存误显示，作根因定位后确认非缺陷；Buyer 重新登录后正常。）

---

## 3. Admin Journey Result

> 执行环境：Login（A1）+ 直接路由访问 Admin 各页（A2-A8）。因 AntD 下拉在自动化中偶发不可交互，部分录入改用 JS 事件触发，属工具交互限制，非产品缺陷。

| # | 场景 | 操作 | 结果 | 证据 |
| --- | --- | --- | --- | --- |
| A1 | Login | `demo.admin@visndt.local` + Dashboard Stats/Activities/Pending | PASS | Dashboard 成功加载（stats/activities/pending 正常返回） |
| A2 | User Management | 列表 / 创建 / 编辑 / 详情 | CONDITIONAL | 页面与 CRUD 可用；用户编辑表单姓名输入框未预填当前值 → **缺陷 D1** |
| A3 | Organization Management | 列表 / 创建 Supplier 组织 / 编辑 | PASS | 创建与列表显示正常，组织类型/状态可编辑 |
| A4 | Product Management | 创建 → 基础信息 → 分类 → 参数 → 保存 → 编辑 → 发布/上下架 | CONDITIONAL | 主流程可运行；产品编辑表单中已保存的**参数值未回显** → **缺陷 D2**；产品媒体页**运行时崩溃** → **缺陷 D3** |
| A5 | Parameter Management | 参数组 / 参数定义 / 绑定产品 | PASS | 参数组创建、参数定义创建、类型限制基本可用 |
| A6 | Media Center | 图片/文件上传、展示、删除、关联产品 | CONDITIONAL | FileAsset 管理界面与治理逻辑存在；**上传因 S3 bucket `visndt-dev` 不存在而失败** → **缺陷 D4** |
| A7 | Content Management | 建文章 / 编辑 / SEO / 发布 / Web 展示 | PASS | 内容 CRUD 与发布流程可用，Web 端可呈现内容入口 |
| A8 | Demand/RFQ/Offer/Matching/Response | 各业务视图 | PASS | 数据关系、状态展示、管理入口存在且可用 |

**Admin 维度评分**

| 维度 | 评分 | 说明 |
| --- | --- | --- |
| Existence | PASS | 全部菜单/页面存在 |
| Access | PASS | ADMIN-only 路由与菜单正确隔离 |
| Interaction | CONDITIONAL | 主流程可操作；媒体上传被 D4 阻塞，产品媒体被 D3 阻塞 |
| Persistence | CONDITIONAL | 用户/产品编辑表单字段回显异常（D1/D2） |
| Business Logic | PASS | 组织/参数/内容/业务视图逻辑正确 |
| UX | CONDITIONAL | 编辑回显丢字段（D1/D2） |
| Error Handling | PASS | 大部分错误可提示 |

---

## 4. Buyer Journey Result

> 执行环境：Browser Automation。

| # | 场景 | 结果 | 证据 |
| --- | --- | --- | --- |
| B1 | Public Discovery（首页） | PASS | `/` 品牌 Banner、导航、产品快速入口、分类入口、内容入口均加载，无阻塞错误 |
| B2 | Product Discovery | PASS | `/products` 展示 7 个产品卡片；详情页 `/products/e2f9b4a5-...` 可切换「技术参数」并展示规格表 |
| B3 | Demand Creation | PASS | Buyer 登录 → `/workspace/demands/create` → 提交成功 → 列表刷新 |
| B4 | RFQ / Inquiry | PASS | `/workspace/rfqs` 显示「+创建询价」与历史询价记录；新建需求可正常进入流程 |
| B5 | Response Viewing | PASS | `/workspace/matches`（暂无匹配，符合刚发布未触发匹配）、`/workspace/notifications` 正常加载 |

**关键数据证据**：Buyer 创建并发布需求「闭环验证-需求-20260822000630」，DB 中 `status=PUBLISHED`、`publishedAt` 生效、数据在列表与详情页正确回显。

**Buyer 维度评分**：Existence PASS / Access PASS / Interaction PASS / Persistence PASS / Business Logic PASS / UX PASS / Error Handling PASS。

---

## 5. Supplier Journey Result

> 执行环境：Browser Automation。

| # | 场景 | 结果 | 证据 |
| --- | --- | --- | --- |
| C1 | Supplier Login | PASS | `/dashboard/supplier` 正常加载，侧边栏仅 Supplier 菜单，无「角色未配置」 |
| C2 | Supplier Profile | CONDITIONAL | 编辑保存生效（DB `updatedAt` 更新且名称持久化 `明视工业检测设备有限公司`）；恢复保存后 UI 回显短暂不一致（缓存未即时刷新）→ **UX 缺陷 D5**（数据库侧正确，非数据丢失） |
| C3 | Capability / Offer Management | PASS | `/workspace/supplier/offers/new` 关联产品 → 标题自动填入 → 创建成功 → 跳转 `/workspace/supplier/offers/4327d14a-.../edit`，内容已保存 |
| C4 | RFQ Response | PASS | `/workspace/supplier/rfqs` 10 条 RFQ，详情可查看需求与响应表单；既有 RFQ 已有响应记录，未重复提交 |
| C5 | Buyer Feedback / Status | PASS | `/workspace/supplier/responses` 9 条响应（1 提交/1 查看/7 接受）；`/workspace/supplier/offers` 显示 E2E 新建 Offer；`/workspace/notifications` 未读 6 条（含 New Product Inquiry 与 New RFQ） |

**Supplier 维度评分**：Existence PASS / Access PASS / Interaction PASS / Persistence PASS / Business Logic PASS / UX CONDITIONAL（D5）/ Error Handling PASS。

---

## 6. Business Closed Loop Verification

### 6.1 数据流

```text
Admin Create Data ──► Web Display ──► Buyer Interaction ──► Supplier Response ──► Buyer Feedback ──► Admin Monitoring
```

### 6.2 逐环验证

| 环节 | 验证 | 结果 |
| --- | --- | --- |
| Admin Create Data | A2-A8 Admin 创建/管理用户、组织、产品、参数、内容、媒体 | PASS |
| Web Display | B1-B2 Web 首页/产品/内容展示正常 | PASS |
| Buyer Interaction | B3-B4 Buyer 创建需求、发布需求（DB `PUBLISHED`）、筛选/查看 | PASS |
| Supplier Response | C3-C4 Supplier 关联产品建 Offer、查看并响应 RFQ | PASS（既有 RFQ/Response 数据完整） |
| Buyer Feedback | C5 Supplier 查看响应状态与通知；Buyer 侧 notifications 可用 | PASS |
| Admin Monitoring | Admin `/demands` 可见 Buyer 新建需求「闭环验证-需求-20260822000630」`已发布`；`/matching` 监控页面可用；统计/待处理可读 | PASS |

### 6.3 新建需求 → RFQ 派发说明

Buyer 新建需求「闭环验证-需求-20260822000630」发布后**匹配数 = 0**（`DemandMatch.count = 0`），故未生成 RFQ 派发给 Supplier。经代码核验，平台冻结业务语义为：

```text
Demand.PUBLISHED → Matching 计算评分 → DemandMatch.ACCEPTED → 创建 Targeted RFQ → 派发至目标 Supplier → Supplier Response
```

RFQ 创建前置条件必须为 `DemandMatch.status = ACCEPTED`（`rfqs.service.createFromMatch` / `demands.service`）。新需求无 ACCEPTED match，因此不派发 RFQ — **符合冻结设计，非缺陷**。

### 6.4 既有闭环完整数据佐证

| 指标 | 数值 |
| --- | --- |
| 全库 RFQ | 11 |
| Supplier 响应（SUBMITTED/ACCEPTED） | 11 |
| Supplier 侧 Responsses 展示 | 9 条（1 提交/1 查看/7 接受） |
| Admin 可见新建需求状态 | 已发布 |

### 6.5 Business Loop 结论

**VERIFIED**（针对性新数据链 + 既有完整闭环数据）。`Admin → 数据 → Buyer → Supplier → Admin` 各环节数据可创建、展示、流转，权限隔离正确；新建需求因匹配数为 0 未触发 RFQ 属预期业务语义。

---

## 7. Defect List

### 7.1 缺陷汇总表

| ID | Role | Severity | Problem | Impact | Suggestion |
| --- | --- | --- | --- | --- | --- |
| D1 | Admin | MEDIUM | 用户编辑表单姓名输入框未预填当前值 | 编辑用户时需重新输入姓名，易误改 | 编辑页初始化时从详情数据回填 name |
| D2 | Admin | MEDIUM | 产品编辑表单中已保存的参数值未回显 | 再次编辑产品时参数值丢失感，可能被覆盖 | 编辑时载入已存 ProductParameterValues 并回填表单 |
| D3 | Admin | HIGH | 产品媒体页运行时崩溃（读取 `undefined.length`） | 产品媒体列表/详情全部无法打开，阻断媒体关联 | 对齐 API 返回结构（后端返回数组 vs 前端期待 `{data,total}`），修正前端解析或类型 |
| D4 | Admin | HIGH | 媒体上传失败（S3 bucket `visndt-dev` 不存在） | 图片/文件无法上传，媒体中心不可用 | 在 MinIO 创建 bucket / 或确认初始化写入 bucket |
| D5 | Supplier | LOW | Profile 编辑保存后 UI 回显短暂不一致（数据库已持久化） | 视觉上未即时刷新，易误认为未保存 | 保存成功后强制 invalidate 并刷新组织 Query |

### 7.2 验证维度矩阵（三角色）

| 维度 | Admin | Buyer | Supplier |
| --- | --- | --- | --- |
| Existence | PASS | PASS | PASS |
| Access | PASS | PASS | PASS |
| Interaction | CONDITIONAL（D3/D4） | PASS | PASS |
| Persistence | CONDITIONAL（D1/D2） | PASS | CONDITIONAL（D5 UI） |
| Business Logic | PASS | PASS | PASS |
| UX | CONDITIONAL（D1/D2） | PASS | CONDITIONAL（D5） |
| Error Handling | PASS | PASS | PASS |

---

## 8. Architecture Impact

本任务为 **Testing Only**（E2E 验证、功能审计、缺陷记录），**不含任何代码/数据库/架构变更**。

| 范围 | 状态 | 说明 |
| --- | --- | --- |
| Database | **UNCHANGED** | 无 Schema / Migration / Enum / Data Model 变更 |
| API | **UNCHANGED** | 无新 Endpoint / Controller / DTO / 业务逻辑变更 |
| Migration | **NONE** | 无迁移 |
| Storage | **UNCHANGED** | S3/MinIO 无配置与代码变更（bucket 缺失为环境初始化问题，非代码） |
| Matching | **UNCHANGED** | 匹配逻辑未触碰 |
| Search | **UNCHANGED** | 搜索未触碰 |
| AI | **UNCHANGED** | AI 保持 FROZEN（仅接口/契约） |
| Frontend | UNCHANGED（本任务未改） | 未新增/修改代码 |

缺陷 D3/D4/D5 为已识别问题，遵循「Report First, Fix Later」原则，留待 M26.0 修复窗口处理，不在本任务修改。

---

## 9. Purpose / Nature Confirmation

- 真实用户全旅程模拟 ✓（盘三角色真实登录与操作）
- 非功能开发 ✓（未新增功能）
- 非架构变更 ✓（冻结边界保持）
- 非重构 ✓（未改代码）
- Evidence Before Improvement ✓（所有结论附证据）

---

## 10. Improvement Recommendation

### Critical Bug（需在 M26.0 修复窗口处理）
- **D3**：产品媒体页崩溃 — 阻塞产品媒体查看与关联，最高优先级。
- **D4**：S3 bucket 缺失致上传失败 — 阻塞媒体中心，需初始化 bucket。

### Functional Gap
- **D1 / D2**：编辑回显缺陷（用户姓名、产品参数值）— 影响编辑体验与数据准确性。

### UX Improvement
- **D5**：Profile 保存后 UI 刷新不一致。
- Buyer 新建需求发布后如需测试匹配→RFQ 闭环，建议保留带参数的需求样例数据，便于验收匹配链路。

### Future Candidate
- 建立 **Playwright E2E 自动化体系**：本次多次依赖脚本化浏览器自动化且截图工具超时、Web dev 内存崩溃，建议引入可重复的 E2E 用例 + 稳定截图/录制；开发环境建议提升 Node 内存或改用生产构建验证。

---

## 11. Documentation Synchronization

| 文档 | 同步内容 | 状态 |
| --- | --- | --- |
| `docs/project-management/PROJECT_STATUS.md` | 新增 `647_M26_PreEntry_ThreeRole_E2E_Business_Validation — CONDITIONAL PASS`，记录 D1-D5 与 Scope Boundary | SYNCED |
| `docs/project-management/PROJECT_ROADMAP.md` | M26 Entry 行更新 `647 = CONDITIONAL PASS` | SYNCED |
| `docs/project-management/MODULE_COMPLETION_MATRIX.md` | M26 Entry 列 647 状态 + 缺陷 D1-D5 待修复 | SYNCED |
| `docs/_review/647_M26_PreEntry_ThreeRole_E2E_Business_Validation_Report.md` | 本报告 | CREATED |

> 说明：文末 Final Output 面板由 A 角色在主线程生成时，需先完成上述三件套文档同步（见第 11 章）；第 12 章 Final Output 为任务最终结论面板。

---

## 12. Final Execution Output

```text
Task:
647_M26_PreEntry_ThreeRole_E2E_Business_Validation


Status:
CONDITIONAL PASS


Admin Journey:
VERIFIED (CONDITIONAL — D1/D2/D3/D4)


Buyer Journey:
VERIFIED


Supplier Journey:
VERIFIED (CONDITIONAL — D5)


Business Loop:
VERIFIED


Critical Issues:
2 (D3 产品媒体崩溃, D4 S3 bucket 缺失)


UX Issues:
3 (D1/D2 编辑回显, D5 Profile 刷新)


Database:
UNCHANGED


API:
UNCHANGED


Migration:
NONE


Storage:
UNCHANGED


Matching:
UNCHANGED


Search:
UNCHANGED


AI:
UNCHANGED


Documentation:
UPDATED


Review Report:
docs/_review/647_M26_PreEntry_ThreeRole_E2E_Business_Validation_Report.md


Next:
M26 Planning
Execution Principle
647 = Real User Simulation
```

---

## 13. Final Decision for Execution Instruction

根据 V3.2.3「执行完成后，根据报告决定」：

| 决策项 | 建议 |
| --- | --- |
| 是否进入 M26 | **是**，但建议先行 M26.0 修复窗口 |
| 是否需要 M26.0 修复窗口 | **需要**：优先处理 Critical（D3 产品媒体崩溃、D4 S3 bucket 缺失），含 **FileAsset Governance 恢复**；其次 D1/D2 编辑回显。遵循「Report First, Fix Later」 |
| 是否需要 Playwright E2E 自动化体系 | **建议建立**：核心旅程（登录/需求/报价/RFQ/响应/闭环）应固化为主干回归用例，减少人工/脚本化重复验证 |