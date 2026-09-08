# 837_WP-5A_Supplier_Workspace_Report

> Version: **V3.3.15**
> Status: **FROZEN / INDEPENDENT WORK PACKAGE / SUPPLIER WORKSPACE PRODUCTIZATION**
> Work Package: **WP-5A Supplier Workspace**
> Repository: `F:\Desktop\VISNDT`
> Code Root: `F:\Desktop\VISNDT\VISNDT`
> Branch: `main`
> Date: 2026-09-06

---

## 1. Executive Summary

WP-5A (837) 将 Supplier Workspace 从 **Member Center / Dashboard / Quick Cards** 正式重构为 **Supplier Workbench**：

- My SupplierProducts → Model Identity → Media → Technical Parameters → Review → Publication → Public Capability。
- 补足 R1（SupplierProduct Media Write）与 R2（SupplierProduct Parameter Write）自服务写路径：经授权的**最小后端写端点**（org-scoped + DRAFT/APPROVED 生命周期门控），**无 Schema / Migration / Domain 变更**。
- 冻结层全部保持：Database / Schema / Migration / Domain / Authority / API 既有契约 / Route Semantics / Permission / Lifecycle / Business Logic 全冻结。
- 经验证：构建全过、真实浏览器 R1/R2 持久化、提交审核生命周期与写门禁锁定、所有权 Cross-org DENIED、公开边界正确、Mobile 375-1440 无溢出、回归 8/8。

**Conclusion: CONDITIONAL PASS** —— Core Supplier Workflow / R1 / R2 / Ownership / Lifecycle / Publication / Public Boundary / Security / Runtime / Build / Regression / A11y / Mobile 全部 PASS，P0=0、P1=0；仅受控测试数据稀缺（P2）顺延。**837 = CONDITIONAL PASS；WP-5A = CONDITIONAL PASS；WP-5B = BLOCKED BY WP-5A。**

---

## 2. Repository Verification

| 项 | 值 |
| --- | --- |
| 仓库根目录 | `F:\Desktop\VISNDT` |
| 代码根目录 | `F:\Desktop\VISNDT\VISNDT` |
| 分支 | `main` |
| HEAD | `37bea13` |

`git status --short`：WP-5A 变更集中于 `apps/api/supplier-products/*`（5 个最小写端点）+ `apps/web`（Workbench 列表/详情 + 2 个编辑器组件）+ 3 个 DTO + 运行验证脚本 `database/wp5a_runtime.ts`；仓库层级 `docs/_review` 与 `docs/project-management` 已同步（本报告 + STATUS/ROADMAP/MATRIX）。其余已列 M/D/U 为既有 WP（834/835/836）遗留未提交项，非本 WP 新引入。

---

## 3. Baseline Verification

| 项 | 状态 |
| --- | --- |
| 836（WP-4 Rebaseline / Closeout） | PASS / CLOSED |
| WP-4（SupplierProduct Media / Parameter Read） | PASS / CLOSED |
| WP-5A（Supplier Workspace） | READY / NEXT（本任务执行） |
| 824–836 | 未重开，仅继承基线 |

---

## 4. Supplier Workspace IA Verification — ✅ PASS

Supplier Workspace IA 彻底重建为 **WORKBENCH**：

```
WORKBENCH
├─ Overview
├─ My SupplierProducts（All / Draft / Review / Published 状态筛选）
└─ SupplierProduct（Identity / Media / Parameters / Review / Public Preview）
```

页面为 dense workbench 结构：面包屑 + 能力锚点（平台权威只读绑定）+ 生命周期状态徽章 + 下一步操作区 + 分节卡片（型号身份 / 型号媒体 / 型号技术参数 / 公开上下文 / 说明）。无 Hero / Marketing Banner / Decorative Metrics Wall / Excessive Cards。具体页面与路由服从既有 Route Semantics，未新建业务对象。

---

## 5. SupplierProduct List Verification — ✅ PASS

My SupplierProducts 列表为 dense table，优先显示（§14 要求字段全部来自真实数据）：

- 产品/型号（`{brand} {series} {modelNumber}`）
- 品牌、系列（内联展示）
- 状态徽章（草稿/已提交/已批准…）语义色
- 完备度（媒体×25 + 参数×2 → pct → 待完善/资料不足/较完善）
- 媒体数 `_count.media`、参数数 `_count.parameterValues`
- 能力锚点（platformProduct.name）
- 最近更新（updatedAt）
- 主操作（下一有效动作：提交审核 / 待发布 / 工作台）

桌面/移动端均验证渲染正确；首行草稿型号显示「提交审核」按钮，已批准显示「待发布」占位，其余仅有「工作台」。

---

## 6. SupplierProduct Detail Verification — ✅ PASS

Model Workbench 详情页（非 Marketing Product Page），按 Object→Data→Action→State→Publication→Public Context 组织：

- 型号身份（Identity）：能力锚点（只读）＋ 可编辑 brand/series/modelNumber/description/technicalDescription/applicationInfo（DRAFT/APPROVED）。
- 生命周期下一步卡片：`nextActionFor(status)` 渲染唯一有效 CTA（DRAFT→提交审核；PUBLISHED→查看公开上下文）。
- 媒体、参数、公开上下文分区齐全；「说明」列明服务端写门禁与组织隔离语义。

真实浏览器渲染验证 6 个 section 全部正常。

---

## 7. Media Write Verification — ✅ PASS（R1）

`SupplierModelMediaEditor` 完成闭环：**Select → Upload → API → Persist → Reload → Verify**。

- **Upload+Persist**（浏览器）：上传一张图片 → toast「媒体已上传并持久化」→ 媒体计数 1→2 → reload 后仍为 2（持久化）。
- **Set Primary / Reorder / Delete / Preview**：主图按钮、上移/下移、删除（confirm→API→持久化→reload）、图内预览均在编辑器渲染；服务端处理主图降级与 displayOrder。
- 排序契约：持久化 `displayOrder` 驱动 UI 顺序；每次变更调 API 后 `onReload` 回读真实列表，无前端-only 状态。
- 持 JSON 中媒体仅含 `fileAsset`（S3 引用），无敏感字段。

> 补充：编辑与删除子动作的持久化在 API 级运行脚本 `database/wp5a_runtime.ts` 覆盖（update/delete/reorder 的 org-scope + 生命周期门控）。

---

## 8. Parameter Write Verification — ✅ PASS（R2）

`SupplierModelParameterEditor` 完成闭环：**Edit → Save → API success → Reload → Same value**。

- 精神模型严格保持：Platform Product → Parameter Definition（权威）→ SupplierProduct-specific Override（本编辑器仅写覆盖）。
- 浏览器实测：编辑「导向方式」覆盖值=“单方向可调” → 保存按钮由「已保存」(disabled) 变「保存参数」(enabled，Dirty 态) → 点击保存 → toast「参数覆盖已保存并经 API 持久化」→ 按钮回「已保存」 → **reload 后值仍为“单方向可调”**（持久化一致）。
- 缺失值显示「— / Not provided」，不自动填充工程数据。
- 全量 replace 语义 + 事务（service `setParameterOverrides`，upsert + 删除多余项）。

---

## 9. Lifecycle Verification — ✅ PASS

保持既有生命周期 DRAFT→SUBMITTED→REVIEWING→APPROVED→PUBLISHED（及 REJECTED / UNPUBLISHED），**未新增状态**。

浏览器实测：草稿型号点击「提交审核 (DRAFT → SUBMITTED)」→ 状态徽章变「已提交」→ 同时 **上传媒体 / 保存参数 / 编辑身份 控件全部消失**（写门禁为服务端强制，非前端隐藏）。remaining 状态表达由 `nextActionFor` 呈现。

---

## 10. Ownership Verification — ✅ PASS

- Own（Supplier A→own SupplierProduct）：View / Edit / Media Write / Parameter Write = ALLOWED（浏览器实测保存成功）。
- Cross-org（Supplier A→Supplier B SupplierProduct）：**DENIED**（403/404），服务端组织作用域。
- 服务端强制实现：`requireOwnEditable(supplierProductId, organizationId)`、`validateForOrganization`、自服务 `findOne` 用 `where:{ id, organizationId }`（不存在→通用 404，不泄露他组织存在性）。组织 ID 取自认证会话注入，不信任客户端。
- API 级运行脚本 `database/wp5a_runtime.ts`记录 cross-org read/mutation = DENIED。

---

## 11. Publication Boundary — ✅ PASS

未改变既有 Publication Logic：

- PUBLISHED SupplierProduct → Public Product Context（Product Detail `supplier-models` 上下文）可见（浏览器见 /products/ebb1c034… 渲染 supplier-models）。
- DRAFT / SUBMITTED / REVIEWING / REJECTED / UNPUBLISHED → 公开隐藏。
- 媒体与参数遵循同一发布边界（未发布型号的媒体/参数不会进入公开发现）。
- 由后端 `status=PUBLISHED` 强制，非前端隐藏。

---

## 12. Public ↔ Supplier Workspace Continuity — ✅ PASS

- Public Product → Supplier Context：公开产品详情含能力提供商/型号上下文。
- Supplier Workspace → Public Product：工作台「公开上下文」区提供「查看平台能力详情（公开）」链接（发布后提供「查看公开能力上下文」）。
- 公共游客不见 Supplier Workspace 操作（写控件仅在 DRAFT/APPROVED 自组织可见，且经 RoleGuard/AuthGuard）。

---

## 13. Accessibility — ✅ PASS

- 表单显式 label + required（品牌/型号）+ 保存禁用态（缺必填）。
- 键盘访问 / focus-visible ring（input 类含 focus:outline-2）。
- 保存成功（「已保存」disabled + toast）、错误（toast err）、Dirty（enabled）、未保存变化（dirty 标志）状态齐全。
- 媒体控件（上传文件 input、设主图、上移/下移、删除）均有 aria-label；参数输入有 aria-label；表格用 role=table/row/cell；状态徽章语义文本。
- 触控目标：编辑按钮 h-9/h-10（36/40px）——部分次要操作为 36/40px（与 44px 建议有轻微差距，但主要提交/保存/上传按钮为 40px）；此项记为 P3 UX 顺延项，非阻断。

---

## 14. Mobile — ✅ PASS（375 = hard gate）

真实浏览器 375 / 768 / 1024 / 1440 视口：

- 修复一处 5px 横向溢出：生命周期操作栏 `flex shrink-0` 在 375 下超宽 → 改为 `w-full sm:w-auto`（[page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/workspace/supplier/products/[id]/page.tsx#L212)）。
- 修复后 375：`sw=375` 无溢出；768/1024/1440 均 `sw=cw` 无溢出。
- 列表页 375 无溢出；Workbench 详情各分节在 375 下正常换行堆叠（非仅缩小 Desktop）。

---

## 15. Runtime Browser — ✅ PASS

Real headed Chrome/CDP（default session）：

1. Supplier 登录当组织工作台命令行（既有会话）。
2. /workspace/supplier/products：My SupplierProducts dense table 渲染 6 条真实型号。
3. /workspace/supplier/products/:id：Workbench 详情 6 分节渲染。
4. **R1 媒体上传 + 持久化**：上传 → media 1→2 → reload 后 2（持久化）。
5. **R2 参数覆盖保存 + 持久化**：导向方式=“单方向可调” → 保存 → toast → reload 后值保留（持久化一致）。
6. **提交审核**：DRAFT→SUBMITTED → 写控件消失（生命周期门控锁定）。
7. 公共产品详情 /products/ebb1c034… 渲染 supplier-models 上下文，无溢出。

console error = 0；5xx = 0。

---

## 16. Security — ✅ PASS

- 新增后端文件（self-service controller/service）敏感词扫描：`password/passwordHash/hashedPassword/salt/credential/secret/accessToken/refreshToken/privateContact/internalNote/adminOnly/commercial` = **NONE**（前端 `credentials:'include'` 为合法 fetch 选项）。
- 自服务 `findOne` 采用 `where:{ id, organizationId }` org-scoped 查询 + 明确 include（仅 platformProduct/media/parameterValues），**无 createdByUser / sensitive 投影**，规避 SEC-804-P0 模式。
- Cross-org = DENIED（服务端）；Unpublished = NOT PUBLIC；无新增公开写端点（新端点为 SUPPLIER 认证 + org 作用域）。
- 无越权（P0=0）。

---

## 17. API / Schema / Backend Change — ✅ 最小后端 Contract Gap（授权）

| 层 | 变更 |
| --- | --- |
| Schema | NO |
| Migration | NO |
| Domain | NO（复用既有 SupplierProductMedia / SupplierProductParameterValue 关系与实体） |
| Route Semantics | NO（沿用既有 `/supplier-products/my/...` 语义） |
| API | 5 个新自服务写端点（最小 Contract Gap，经本次授权的 WP-5A 实施）：`POST /my/:id/media/upload`、`POST /my/:id/media`、`PATCH /my/:id/media/:mediaId`、`DELETE /my/:id/media/:mediaId`、`PUT /my/:id/parameters` |

所有新端点：SupplierSelfServiceGuard + `requireOwnEditable`（org 作用域 + DRAFT/APPROVED 生命周期门控）；media 上传 atomic（失败回滚 fileAsset）；参数覆盖全量 replace + 事务。未重新设计 SupplierProduct / Parameter / Media Domain。

---

## 18. Build / Typecheck — ✅ PASS

| 命令 | 结果 |
| --- | --- |
| Web `npx tsc --noEmit`（apps/web） | exit 0 |
| Web `npx next build` | exit 0（`/workspace/supplier/products` 8.23kB、`/workspace/supplier/products/[id]` 8.87kB 成功构建） |
| API `npx tsc --noEmit`（apps/api） | exit 0 |
| API `npx nest build` | exit 0 |

> 注：root 无 tsc，须在 apps/* 子目录以本地 `.bin/tsc` 运行。

---

## 19. Regression — ✅ PASS（8/8 代表性路径）

HTTP 200 + 真实浏览器渲染复核：

| # | 路径 | 状态 |
| --- | --- | --- |
| 1 | `/`（Home） | 200 |
| 2 | `/search?q=检测` | 200 |
| 3 | `/products`（Products） | 200 |
| 4 | `/products/{id}`（Product Detail，含 supplier-models 上下文） | 200 |
| 5 | `/knowledge`（Knowledge） | 200 |
| 6 | `/solutions`（Solution） | 200 |
| 7 | `/about`（About / 商务） | 200 |
| 8 | `/dashboard/buyer`（Buyer Workspace） | 200 |

Plus Supplier Workspace `/workspace/supplier/products` = 200。未破坏 Public Core / Buyer Core。

---

## 20. Files Changed

**Backend（最小写端点）**
- `VISNDT/apps/api/src/supplier-products/supplier-products-self-service.controller.ts`（+5 端点）
- `VISNDT/apps/api/src/supplier-products/supplier-products.service.ts`（media/parameter 写方法 + `_count` 投影）
- `VISNDT/apps/api/src/supplier-products/supplier-products.module.ts`（FileAssetModule 依赖导入）
- `VISNDT/apps/api/src/supplier-products/dto/create-my-supplier-product-media.dto.ts`（新）
- `VISNDT/apps/api/src/supplier-products/dto/update-my-supplier-product-media.dto.ts`（新）
- `VISNDT/apps/api/src/supplier-products/dto/set-my-supplier-product-parameters.dto.ts`（新）

**Frontend（Workbench IA）**
- `VISNDT/apps/web/src/app/workspace/supplier/products/page.tsx`（dense 列表）
- `VISNDT/apps/web/src/app/workspace/supplier/products/[id]/page.tsx`（Workbench 详情；修复 375 溢出）
- `VISNDT/apps/web/src/components/supplier-product/SupplierModelMediaEditor.tsx`（新）
- `VISNDT/apps/web/src/components/supplier-product/SupplierModelParameterEditor.tsx`（新）
- `VISNDT/apps/web/src/lib/api/supplier-self-service.ts`（写调用 + `_count` 类型）

**验证 / 治理**
- `VISNDT/database/wp5a_runtime.ts`（API 级运行验证脚本）
- `docs/_review/837_WP-5A_Supplier_Workspace_Report.md`（新）
- `docs/project-management/PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md`（追加 837）

Schema=NO；Migration=NO；Domain=NO。

---

## 21. Remaining Issues

- **P2（受控数据稀缺）**：媒体/参数公开 seed 数据量小；工作台已用真实存在型号验证。属数据治理，非业务缺陷。
- **P3（UX 顺延）**：若干次要操作按钮为 36/40px（触控建议 44px）；主要提交/保存/上传为 40px。记录为 A11y UX refinements，非阻断。
- 测试型号 `56ecf71d…` 已由 DRAFT 提交为 SUBMITTED——属受控 E2E 测试数据状态变更，已在本文档如实记录，不入运营指标。

---

## 22. P0 / P1 / P2 / P3

| 级别 | 数量 | 说明 |
| --- | --- | --- |
| P0 | 0 | 无安全 / 数据完整性 / 授权越权 |
| P1 | 0 | 无阻断 UI 缺陷 |
| P2 | 1 | 受控测试数据稀缺（媒体/参数 seed 量小） |
| P3 | 1 | 次要操作触控目标 36/40px（A11y 建议） |

---

## 23. Blocking / Non-Blocking

- **Blocking**：无。Core Supplier Workflow / R1 / R2 / Ownership / Security / Runtime / Build 全部 PASS。
- **Non-Blocking**：P2 数据稀缺、P3 触控目标 —— 顺延至后续 WP / 后期整改，不阻塞本 WP 判定。

---

## 24. Documentation Synchronization — ✅

- `docs/project-management/PROJECT_STATUS.md`（追加 837 段落）
- `docs/project-management/PROJECT_ROADMAP.md`（追加 837 段落）
- `docs/project-management/MODULE_COMPLETION_MATRIX.md`（Supplier Workspace 行更新 → 88%）
- 本报告（`docs/_review/837_...`）

已同步 Supplier Workspace / SupplierProduct / Media / Parameter 能力到治理文件。角色×页面×能力（Supplier 自服务写路径）已在本报告 §17 与 STATUS 段落记录。Code State = Runtime State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State 成立。

---

## 25. Final Decision

**CONDITIONAL PASS**

- 全部必测项 PASS：Supplier Workbench、SupplierProduct 列表/详情、R1 Media Write、R2 Parameter Write、Ownership、Lifecycle、Publication、Public Boundary、Accessibility、Mobile（375 hard gate）、Security、Runtime、Build、Regression。
- P0 = 0；P1 = 0；仅 P2（受控数据稀缺）+ P3（触控目标 A11y refinements）非阻断顺延。
- **837 = CONDITIONAL PASS；WP-5A = CONDITIONAL PASS；WP-5B（Admin Core Operations）= BLOCKED BY WP-5A。**

---

## 26. STOP

本指令执行完成，立即 **STOP**。不自动执行 WP-5B / WP-5C / WP-6 / WP-7 / WP-8。后续 Work Package 仅在独立授权后启动。

> Freeze the Business. Free the Experience.