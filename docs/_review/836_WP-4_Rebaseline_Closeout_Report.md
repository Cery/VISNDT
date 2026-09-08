# 836 WP-4 Rebaseline / Closeout Report

> Version: **V3.3.14** | Status: **FROZEN / WP-4 REBASELINE + CLOSEOUT GATE / INDEPENDENT WORK PACKAGE**
> Work Package: **836 WP-4 Rebaseline / Closeout**
> Repository: `F:\Desktop\VISNDT` | Code Root: `F:\Desktop\VISNDT\VISNDT` | Branch: `main`
> Report: `docs/_review/836_WP-4_Rebaseline_Closeout_Report.md`
> 判定: **836 = PASS / CLOSED · WP-4 = PASS / CLOSED · WP-5A = READY / NEXT（NOT AUTO-STARTED）**

---

## 1. Executive Summary

「836 WP-4 Rebaseline / Closeout」为一次**严格收口（Closeout Gate）**，不是新开发也不是重新设计 WP-4。目的为在 833（CONDITIONAL PASS）、834（PASS / CLOSED）、835（CONDITIONAL PASS）基础上，确认：

- 833 的**核心只读交付**（SupplierProduct Media Read / Parameter Read / Model Context / Ownership / Publication / Security / Runtime / Responsive）已经完成；
- 835 新平台 UI 基线（紧凑 / 结构化 / 技术 / 对象中心 / 规格中心）下，SupplierProduct 只读语义**仍然成立**；
- **R1（Media Write）/ R2（Parameter Write）正式归属 WP-5A**，不再作为 WP-4 未完成项循环阻塞。

实测结论（Runtime + Browser/CDP + Build）：
- 供应商（demo.supplier.01）登录 → `我的产品` → SupplierProduct Detail（【型号媒体】【型号技术参数】只读区渲染）全链路 PASS；
- 公共 `Product Detail`（/products/zb-tj095）仅呈现 PUBLISHED SupplierProduct（371a9160）上下文；非发布（APPROVED，e037dea8，publishedAt=null）被正确隐藏；
- Own=ALLOWED（200）、Cross-org=DENIED（403）；
- Security：敏感字段未泄漏（passwordHash 仅出现于输入 DTO）；
- Build/Typecheck：Web tsc + next build、API tsc + nest build 全过；
- Mobile：375/1440（必测）+ 768/1024（抽测）横向溢出 = 0，console 错误 = 0，异常 = 0，5xx = 0。

R1/R2 边界已正式确认；P0=0、P1=0。唯一剩余为**媒体/参数种子数据稀缺（P2，非阻塞）**。据此判定 **PASS / CLOSED**。

---

## 2. Repository Verification

| 项 | 实测 |
|---|---|
| 仓库根目录 | `F:\Desktop\VISNDT` |
| 代码根目录 | `F:\Desktop\VISNDT\VISNDT` |
| 分支 | `main` |
| HEAD | `37bea13` |
| 运行服务 | API `http://localhost:4000`（/api/v1/health → `{"status":"ok","database":"connected"}`）；Web `http://localhost:3000`（HTTP 200）；CDP Chrome `127.0.0.1:9222` |
| Working Tree | 含 835 平台 UI/UX 未提交前端改动 + 既有文档改动；**未 reset / clean / checkout / restore / stash / delete / overwrite** |
| Frozen Layer | Database / Schema / Migration / Domain Entity / Domain Authority / API Contract / Route Semantics / Permission Model / Lifecycle / Business Logic / Product Authority / SupplierProduct Authority **均未触碰** |

本任务未修改任何业务源码、Schema、Migration 或 API。

---

## 3. Baseline Verification

| Work Package | 前置判定 | 本任务用途 |
|---|---|---|
| 833 WP-4 SupplierProduct Media + Parameter | CONDITIONAL PASS | 确认其核心只读交付已完成 |
| 834 Platform UI/UX Redefinition Gate | PASS / CLOSED | 作为 UI/UX 目标态边界依据 |
| 835 Platform UI/UX Redefinition Implementation | CONDITIONAL PASS | 作为本次收口的新 UI 基线 |

836 基于 833/834/835 既定基线执行，**不重复实现** 833 已交付的只读功能，仅验证其在 835 新 UI 下不回归。

---

## 4. 833 Rebaseline Verification

确认 833 的核心只读交付已经完成且仍成立：

- **Media Read**：`GET /api/v1/supplier-products/my/:id` → `media` 字段结构存在（本型号 seed 0 条，属数据稀缺）；详情页【型号媒体】只读区正常渲染空态，并声明“媒体顺序以系统保存的主媒体与排序为准，不做前端临时排序”。
- **Parameter Read**：同一详情返回 `parameterValues` 字段结构；详情页【型号技术参数】只读区渲染（该型号无覆盖值 → 按平台能力默认呈现）。
- **Model Context**：详情页呈现“能力锚点：ZB-TJ095 光纤检测内窥镜”及型号（Model Number）/系列/品牌上下文；Product=WHAT / SupplierProduct=WHICH MODEL 语义保持。
- **Read-only**：详情页明确“本页为只读呈现，不提供无后端支撑的伪造编辑动作” —— 无伪 Write 交互，R1/R2 未在此越界。

**结论：833 核心只读交付 = PASS（不重做）。**

---

## 5. 835 Compatibility Verification

在 835 新平台 UI 基线（Search-first / 紧凑 / 结构化 / 技术 / 对象中心 / 规格中心）下实测：

- SupplierProduct 只读页（`/workspace/supplier/products` 列表 + `/workspace/supplier/products/[id]` 详情）在 375/768/1024/1440 均正常渲染，无横向溢出、无 console 错误、无运行时异常；
- 详情页 Dense 结构化呈现（型号级媒体/技术参数区 + 能力锚点 + 只读说明），符合 835 信息密度与规格中心取向；
- 公共 `Product Detail` 的“供应商型号 / 供应商 / 能力型号”上下文在新 UI 下正常落地（见 §9）。

**结论：835 兼容性 = PASS。未发现需要前端调整之处；故 836 未做任何前端改动（Frontend Source = NO）。**

---

## 6. Media Read Verification

- **API**：`GET /api/v1/supplier-products/my/:id`（demo.supplier.01 own）→ 200，`media` 数组字段返回（length=0，seed 媒体数据稀缺）。
- **公共投影**：`/api/v1/capabilities/:platformProductId` 的 `supplierProducts[].media` 字段存在。
- **UI**：详情页【型号媒体】区域渲染 + 空态文案“该型号暂未配置媒体”+ 引导“由供应商组织在授权流程中维护”（明确写入归属 WP-5A 流程语义）。
- **只读性**：无媒体上传/替换/删除/排序类编辑 UI；系统保存的顺序为准，不做前端排序。

**结论：Media Read = PASS（结构 + 投影 + UI + 只读边界成立；数据稀缺为 P2）。**

---

## 7. Parameter Read Verification

- **API**：`GET /api/v1/supplier-products/my/:id` → 200，`parameterValues` 数组字段返回（length=0，seed 无覆盖值）。
- **公共投影**：`/api/v1/capabilities/:platformProductId` 的 `supplierProducts[].parameterValues` 字段存在。
- **UI**：详情页【型号技术参数】区域渲染，空态文案“该型号尚未填写型号级参数覆盖”；未覆盖的平台参数按能力默认呈现（参数定义权威保留于 Platform Product，未重申别名 / 未新建定义）。
- **只读性**：无参数新增/更新/删除 UI；本页仅呈现真实型号数据。

**结论：Parameter Read = PASS（结构 + 投影 + UI + 只读边界成立；覆盖值数据稀缺为 P2）。**

---

## 8. Ownership Verification

- **Own = ALLOWED**：`demo.supplier.01@visndt.local` 登录 → `GET /api/v1/supplier-products/my` = **200**（count=1）；`GET /api/v1/supplier-products/my/:id` = **200**（APPROVED）。
- **Cross-org = DENIED**：`demo.supplier.02@visndt.local` 访问 supplier.01 的 SupplierProduct → **403 Forbidden**（`Supplier product self-service is not enabled for this organization`，SupplierSelfServiceGuard 拦截，先于组织级作用域）。
- **Server-side scoping**：自助服务 `findOne(id, organizationId)` / `findAllByOrganization(organizationId)` 全程服务端按认证组织作用域；`organizationId` 永不由客户端传入（`supplier-products-self-service.controller.ts` 注释确认），所有权不可伪造。
- 未修改权限实现。

**结论：Ownership = PASS。**

---

## 9. Publication Boundary Verification

- **PUBLISHED → Public visible**：平台产品 `zb-tj095`（98fe9224-12b1-4b2e-ba5d-f17f23f7e9e2）的公共 Capability 中 `supplierProducts` 恰含 PUBLISHED 型号 `371a9160`（brand=VSNDT，model=ZB-TJ095）；公共 Product Detail 呈现“1 已发布能力型号 · 1 家提供商”，供应商型号上下文落地。
- **非 PUBLISHED → Public hidden**：本任务 own 型号 `e037dea8`（status=APPROVED，publishedAt=null）在公共 Capability 中 `includes = false`（被排除），未出现于供应商型号列表。
- **服务端强制（非前端隐藏）**：`supplier-model-facet-search.service.ts` L173-174 `ands.push({ status: SupplierProductStatus.PUBLISHED })`；公共 Capability 服务同样仅回 PUBLISHED。非发布状态不依赖前端 hiding。
- 未修改 publication logic。

**结论：Publication Boundary = PASS。**

---

## 10. Security Verification

- **敏感词扫描**（`password / passwordHash / hashedPassword / salt / credential / secret / accessToken / refreshToken / privateContact / internalNote / adminOnly / commercial`）：
  - API DTO 内 `passwordHash` 仅出现在 `create-user.dto.ts` / `update-user.dto.ts` —— 均为**输入 DTO（@Body，创建/更新请求体）**，不是响应投影，非泄漏。
  - 公共 Capability `supplierProducts` 投影 keys 实测 = `id,organizationId,brand,series,modelNumber,slug,status,description,technicalDescription,organization,media,parameterValues` —— **无** password/accessToken/refresh/secret/privateContact 等敏感字段。
  - 供应商自助详情（own）返回 keys 亦无敏感字段。
- **边界**：Own=ALLOWED（200）/ Cross-org=DENIED（403）/ Unpublished（APPROVED）= NOT PUBLIC（§9 实证）。
- **非前端隐藏**：发布/可见性由后端 `status=PUBLISHED` 强制，非前端 hiding。

**结论：Security = PASS。**

---

## 11. Runtime Verification（Real Browser / CDP）

- **链路**：Supplier 登录（demo.supplier.01）→ `我的产品`（列表渲染 own 型号行）→ SupplierProduct Detail（【型号媒体】【型号技术参数】只读区渲染）→ Media/Parameter Read 结构呈现。
- **公共**：登录 Apple / Web `/`、`/products/zb-tj095`（公开供应商型号上下文渲染）。
- **CDP collector**（对 `SUP-Products`、`SUP-Detail`、`PUB-Product`、`PUB-Home` 四个页面捕获 `Runtime.consoleAPICalled:error`、`Runtime.exceptionThrown`、`Network.loadingFailed`、`Log.entryAdded:error`）：
  - console error = **0**
  - runtime exception = **0**
  - load failure = **0**
- API `:4000/api/v1/health` = ok；Web `:3000` = 200；运行期未观测到 unexpected 5xx / broken route（扫描 API 与 Web 运行日志无 `5xx` / `UnhandledPromise` 新增）。

**结论：Runtime = PASS。**

---

## 12. Mobile Verification

必测 375 / 1440，抽测 768 / 1024（视口横向溢出 `scrollWidth > innerWidth`）：

| 页面 | 375 | 768 | 1024 | 1440 |
|---|---|---|---|---|
| SUP 我的产品（列表） | sw360 OK | sw753 OK | sw1009 OK | — |
| SUP 产品详情 | sw360 OK | — | — | sw1425 OK |
| 公共 Product Detail (/products/zb-tj095) | sw360 OK | — | — | sw1425 OK |

- **horizontal overflow = 0**（全部 false）。
- 无 375 下新增横向滚动；各视口关键信息可见、无重叠导致的断句/截断回归。

**结论：Mobile = PASS。**

---

## 13. Build / Typecheck

| 步骤 | 命令 | 结果 |
|---|---|---|
| Web Typecheck | `npx tsc --noEmit -p apps/web/tsconfig.json` | exit 0 |
| Web Build | `npx next build`（apps/web） | exit 0；Compiled successfully；48 静态页生成；Next 15.5.20 |
| API Typecheck | `npx tsc --noEmit -p apps/api/tsconfig.json` | exit 0 |
| API Build | `npx nest build`（apps/api） | exit 0 |

- Web 构建仅余**既有非阻断 lint warnings**（未使用变量 / `<img>` 提示等，均非本任务引入，不阻断构建）。

**结论：Build / Typecheck = PASS。**

---

## 14. Regression Verification

- **最小回归路径**（在 835/836 构建产物上）：
  - **Home** `/` = 200，正常渲染；
  - **Search** `/search`（统一检索权威）构建正常；
  - **Products** `/products` = 200；
  - **Product Detail** `/products/zb-tj095` = 200，公共供应商型号上下文正常；
  - **Knowledge / Solution** 路由均纳入 `next build` 静态生成成功；
  - **Buyer Workspace** `/dashboard/buyer`、`/workspace/*` 路由构建正常；
  - **SupplierProduct Read** `/workspace/supplier/products` + 详情 Render OK。
- API `nest build` + `next build` 均 exit 0；无新 Domain / Authority / API / Schema / Migration；未触碰 833 R1/R2（归属 WP-5A）。

**结论：Regression = PASS。**

---

## 15. R1 / R2 Boundary Decision

正式确认：

- **R1 = SupplierProduct Media Write**（挂载/替换/删除/排序媒体）
- **R2 = SupplierProduct Parameter Write**（型号级技术参数覆盖写入）

**归属 = WP-5A（Supplier Workspace）**，原因为：
1. R1/R2 属于 **Supplier self-service write capability**；
2. 属于 **Supplier Workspace identity**；
3. 属于 **Organization-scoped mutation**（写入端必须是组织治理/审核流程）。

而非 Public Product Experience（只读/展示）。

因此：
- **WP-4 = Read / Present**（本任务已收口）
- **WP-5A = Supplier Workspace + Media Write + Parameter Write**

**R1/R2 不再作为 WP-4 未完成项循环阻塞。R1/R2 边界 = RESOLVED / FORMALLY CONFIRMED。**

---

## 16. Files Changed

| 类型 | 变更 |
|---|---|
| Business Source | NO（零改动） |
| Schema / Migration | NO |
| API Contract / API Source | NO |
| Frontend Source | NO（零改动；835 既有改动未触碰） |
| 新增 | `docs/_review/836_WP-4_Rebaseline_Closeout_Report.md`（本报告） |
| 文档同步 | `docs/project-management/PROJECT_STATUS.md`、`PROJECT_ROADMAP.md`、`MODULE_COMPLETION_MATRIX.md` 追加 836（§20） |
| 临时验证脚本 | `.s836*.mjs`（测试工具，非业务代码，验证后清理删除） |

**本任务未对任何应用源码、数据库/Schema/API 或前端做修改。**

---

## 17. Remaining Issues

1. **P2 · 媒体数据稀缺（非缺陷）**：seed 中 SupplierProduct 媒体 0 条，Media Read 结构/投影/UI 空态已验证但无法以真实填充数据呈现单张图面/规格书渲染。
2. **P2 · 参数覆盖数据稀缺（非缺陷）**：seed 中型号级参数覆盖 0 条，Parameter Read 仅能呈现“按平台默认呈现”路径，无法以真实覆盖值呈现。
3. **P2/备注 · 未发布型号默认不出现**：own 型号 APPROVED/publishedAt=null 在公共上下文隐藏，属正确行为（非问题），记录以便澄清。
4. **非阻塞 · 构建 lint warnings**：既有未用变量 / `<img>` 提示，非本任务引入，不阻断。

以上均为**受控数据/既有可观测项**，不构成业务完整性失败（符合既有受控数据治理约定），顺延至后续数据填充阶段处理。

---

## 18. P0 / P1 / P2 / P3

| 级别 | 数量 | 内容 |
|---|---|---|
| **P0**（Security/DataIntegrity/Authorization 违规） | **0** | — |
| **P1**（核心只读完整性 / 授权） | **0** | — |
| **P2**（数据稀缺 / 视觉细项 / 受控数据治理） | **2** | 媒体数据稀缺；参数覆盖数据稀缺 |
| **P3**（非功能性 lint 提示） | 若干 | 既有构建 warnings，不阻断 |

---

## 19. Blocking / Non-Blocking

- **Blocking（阻断）**：**0**。
- **Non-Blocking（非阻塞，顺延）**：
  - P2 媒体/参数数据稀缺（待 WP-5A 写入路径落地或其后再治理）；
  - R1/R2 写能力（正式归属 WP-5A，非 WP-4 范围）；
  - 构建 lint warnings（既有）。

---

## 20. Documentation Synchronization

已同步 `docs/project-management/`：

- **PROJECT_STATUS.md**：追加 836；明确 **833 / WP-4 → PASS / CLOSED**。
- **PROJECT_ROADMAP.md**：追加 836；R1（Media Write）/ R2（Parameter Write）→ **Deferred to WP-5A**。
- **MODULE_COMPLETION_MATRIX.md**：追加 836；状态位更新为 **WP-4 = PASS / CLOSED**。

同步后状态：

```
833 / WP-4     → PASS / CLOSED
R1 Media Write → Deferred to WP-5A（SUPPLIER self-service write）
R2 Param Write → Deferred to WP-5A
WP-5A           → READY / NEXT（NOT AUTO-STARTED）
```

> 说明：WP-5A 为 READY / NEXT，但**不自动启动**，须独立授权后启动。

---

## 21. Final Decision

每项收口判据如下：

| 判据 | 结果 |
|---|---|
| Core Read Capability | **PASS**（Media/Parameter/Model Context Read 结构 + UI + 投影成立） |
| 835 Compatibility | **PASS**（新 UI 基线下无回归、无前端改动） |
| Ownership | **PASS**（Own=200 ALLOWED / Cross-org=403 DENIED，服务端作用域） |
| Publication | **PASS**（仅 PUBLISHED 公共可见，非发布隐藏，服务端强制） |
| Security | **PASS**（敏感字段不泄漏；非前端隐藏机制） |
| Runtime | **PASS**（console error=0 / exception=0 / load failure=0 / 5xx=0） |
| Mobile | **PASS**（375/1440 必测 + 768/1024 抽测溢出=0） |
| Build / Typecheck | **PASS**（Web+API tsc、next build、nest build 全过） |
| Regression | **PASS**（Home/Search/Products/Detail/Knowledge/Solution/Buyer/SupplierRead 正常） |
| R1/R2 Ownership Boundary | **RESOLVED / 正式确认归属 WP-5A** |
| P0 | **0** |
| P1 | **0** |

**判定：**

```
836 = PASS / CLOSED
WP-4 = PASS / CLOSED
WP-5A = READY / NEXT（NOT AUTO-STARTED）
```

依据：所有强制收口判据（Core Read PASS、835 Compat PASS、Ownership PASS、Publication PASS、Security PASS、Runtime PASS、Build PASS、Regression PASS、R1/R2 边界已正式确认、P0=0、P1=0）全部满足；唯一剩余为受控数据稀缺（P2，非阻塞，已如实记录）。此属「Close What Is Complete」——833 已收口，R1/R2 归属 WP-5A，不重建已工作的内容。

---

## 22. STOP

本指令执行完成，**立即 STOP**。

- **不自动启动**：WP-5A / WP-5B / WP-5C / WP-6 / WP-7 / WP-8。
- 后续 Work Package（WP-5A Supplier Workspace 等）均须**独立授权**后方可启动。
- 冻结层保持不变：Database = Domain = Authority = API Contract = Route Semantics = Permission = Lifecycle = Business Logic = **FROZEN**；UI/UX/IA/Information Density/Navigation/Visual Language = **OPEN**（由后续授权 WP 决定）。
- **持守**：One Rebaseline / One Boundary Decision / One Review Report / One Documentation Sync / Then STOP。