# 303_M14_Freeze_Delta_Report

**日期**: 2026-08-08  
**任务编号**: M14.0.1 Freeze Delta & Task Decomposition  
**审查方式**: 代码事实复核 / 文档输出 / 不修改业务代码  
**仓库根目录**: `F:\Desktop\VISNDT`  
**代码根目录**: `F:\Desktop\VISNDT\VISNDT`  
**当前分支**: `main`

---

## 0. 执行结论

M13.9 的 `Web MVP Freeze` 结论只能继续作为 **2026-08-04 当日的 Web 历史冻结结论** 使用，已经**不能再代表今天整个仓库的真实开发起点**。

当前 M14 启动应承认以下事实：

1. 仓库顶层与代码根目录是两层结构，`Git top-level = F:\Desktop\VISNDT`，业务代码位于 `VISNDT/` 子目录。
2. `database/prisma` 已在 Freeze 后继续前进，当前为 **19 个 migration**，其中 **4 个 migration 晚于 2026-08-04 Freeze**。
3. `apps/web` 路由总数仍为 **20 个页面路由**，但已出现多处“有入口、无闭环”的真实缺口。
4. `apps/api` 已存在 RFQ Response、Notification、Inquiry、Offer 等能力，但 Web 产品化入口仍不完整。
5. M14 第一阶段应先解决 **角色入口、Supplier 平台内工作台、RFQ Response 前台闭环、通知中心、公开询价修复**，而不是继续扩 Buyer 页面。

---

## 1. 复核范围与方法

本次复核以以下证据为准：

- 当前代码树：`VISNDT/apps/web`、`VISNDT/apps/api`、`VISNDT/database/prisma`
- 当前 Git 历史：`2026-08-04` 之后相关提交
- 当前文档基线：
  - `docs/_review/296_M13.9_Web_MVP_Freeze_Report.md`
  - `docs/_review/297_M13.9.2_Web_MVP_Baseline_Report.md`
  - `docs/_review/300_M13.9.3_System_Verification_Report.md`
  - `docs/_review/301_M14_Pre_Development_Audit_Report.md`
  - `docs/_review/302_M14启动上下文 V2.0 Final.md`

本轮未执行 `build`、未执行迁移、未修改业务代码。

---

## 2. 根路径偏移

### 2.1 当前真实路径结构

| 项 | 当前事实 |
|---|---|
| Git 仓库顶层 | `F:\Desktop\VISNDT` |
| 业务代码目录 | `F:\Desktop\VISNDT\VISNDT` |
| Review 报告目录 | `F:\Desktop\VISNDT\docs\_review` |

### 2.2 对 M14 的影响

`301` 和更早的 `296/297` 均把 `F:\Desktop\VISNDT\VISNDT` 表述为“项目根目录”。这在“代码工作目录”层面可用，但对新窗口接手并不够准确。

M14 之后应统一区分：

- **仓库根目录**：`F:\Desktop\VISNDT`
- **代码根目录**：`F:\Desktop\VISNDT\VISNDT`

否则后续在执行 Git、统计文档、生成报告时，容易再次出现路径误判。

---

## 3. 数据库 Freeze Delta

### 3.1 当前数据库基线

当前 `schema.prisma` 统计结果：

| 维度 | 当前事实 |
|---|---|
| Prisma model | 24 |
| Prisma enum | 16 |
| Migration 目录 | 19 |

### 3.2 Freeze 后新增 migration

相对 `2026-08-04` 的 Freeze 基线，当前新增 migration 为：

1. `20260807000000_add_audit_log_ip_address`
2. `20260807074423_add_offer_price_currency`
3. `20260808031506_add_offer_created_by`
4. `20260808051535_add_product_created_by`

### 3.3 已落入 schema 的真实偏移

| 域 | 当前事实 | 证据 |
|---|---|---|
| AuditLog | 新增 `ipAddress` | `schema.prisma` 中 `AuditLog.ipAddress` |
| Offer | 已有 `currency`、`createdBy` | `schema.prisma` 中 `Offer.currency`、`Offer.createdBy` |
| Product | 已有 `createdBy` | 最新 migration 与当前 schema 对齐 |

### 3.4 数据库结论

> M14 设计输入必须以“当前 `schema.prisma` + 19 个 migration”作为唯一数据库事实基线。  
> `296/297/300` 中“database frozen / no migrations needed”的表述，不再适用于 2026-08-08 今日仓库。

---

## 4. API Freeze Delta

### 4.1 当前 API 基线

| 维度 | 当前事实 |
|---|---|
| AppModule 模块导入 | 26 |
| Controller 数 | 25 |
| 关键业务域 | Offer / RFQ / RFQResponse / Notification / Inquiry / AuditLog 均已存在 |

### 4.2 Freeze 后可确认的 API 层继续变动

`2026-08-07` 与 `2026-08-08` 的提交已修改：

- `apps/api/src/demands/*`
- `apps/api/src/offers/*`
- `apps/api/src/notifications/*`
- `apps/api/src/inquiries/*`
- `apps/api/src/products/*`
- `apps/api/src/users/*`
- `apps/api/src/organizations/*`
- `apps/api/src/parameter-*/*`

这说明：

> 仓库已经不是“只冻结 Web、其余保持静止”的状态，而是进入了 Freeze 后受控修补态。

### 4.3 已有但尚未被 Web 产品化的 API 能力

| 能力 | 当前 API 事实 | Web 状态 |
|---|---|---|
| RFQ Response | 已有 `GET /rfqs/:id/responses`、`POST /rfqs/:id/responses`、`PATCH /rfq-responses/:id`、`GET /rfq-responses/mine` | Buyer 详情只读聚合，Supplier 无提交页 |
| Notification | 已有列表、详情、未读数、单条已读、全部已读 | 只有侧栏未读数，缺通知中心页 |
| Inquiry | 已有 `POST /inquiries`、`GET /inquiries/mine`、`GET /inquiries/:id` | 前台入口实际未闭环 |
| Offer | 后端域完整存在 | Web 无 Supplier 入口 |

### 4.4 Auth / Role 关键偏移

当前 `apps/web` 的 `RoleGuard` 已声明 `BUYER | SUPPLIER | ADMIN`，但实际仍写死：

```ts
const hasRole = roles.includes('BUYER');
```

同时当前 `/auth/me` 返回的用户类型只有：

- `id`
- `email`
- `name`
- `organizationId`

并**不包含** `organization.type` / `organizationMember.role` / `role`。

结论：

> M14.1 的角色入口工作不是纯前端任务。  
> 若继续以“平台内角色化工作台”为目标，必须先补齐前端可消费的角色上下文来源。

---

## 5. Web Freeze Delta

### 5.1 当前 Web 基线

| 维度 | 当前事实 |
|---|---|
| App Router 页面路由 | 20 |
| 组件文件 | 44 |
| API 模块 | 7 |

路由数量与 M13.9 冻结时一致，但 Freeze 后仍发生了持续修补与行为变化。

### 5.2 Freeze 后可确认的 Web 继续变动

`2026-08-05` 至 `2026-08-08` 的提交涉及：

- 产品页 / 产品详情页
- Dashboard / Workspace / Demand / RFQ / Match 页面
- Sidebar
- InquiryForm / RFQDetail / RFQResponseList
- Register 页面

说明 M13.9 之后 `apps/web` 仍在继续迭代，不再是原始静态冻结快照。

### 5.3 当前真实缺口清单

| 缺口 | 当前事实 | 结论 |
|---|---|---|
| RoleGuard 未实现 | `RoleGuard.tsx` 仍写死 `BUYER` | Supplier 入口无法成立 |
| Notification 菜单缺页 | `WorkspaceSidebar` 包含 `/workspace/notifications`，但 `app/workspace/notifications/page.tsx` 不存在 | 导航假入口 |
| RFQ 编辑路由缺失 | `workspace/rfqs/[id]/page.tsx` 有 `/workspace/rfqs/${id}/edit` 按钮，但无对应路由 | 操作假入口 |
| 公开询价不可用 | 产品详情页未向 `InquirySection` 传 `offerId` / `organizationId`，且制造商信息传 `organization={null}` | 前台询价假闭环 |
| Demand 搜索未接线 | `workspace/demands/page.tsx` 存在 `searchQuery`，但 `getDemands()` 调用未使用该参数 | 假搜索 |
| RFQ 搜索未接线 | `workspace/rfqs/page.tsx` 同样只保存输入，不参与查询 | 假搜索 |

### 5.4 Web 结论

> 当前 Web 不是“功能不足”，而是“Buyer MVP 已成型，但多处入口仍处于占位、假连接或只读状态”。  
> 这也是 M14 应优先做入口修补和角色化工作台，而不是继续扩 Buyer 页面的根本原因。

---

## 6. 文档 Freeze Delta

### 6.1 当前 docs/_review 状态

当前 `docs/_review` 文件数：**326**

### 6.2 M14 启动文档链已形成

当前 M14 启动相关文档链为：

1. `300_M13.9.3_System_Verification_Report.md`
2. `301_M14_Pre_Development_Audit_Report.md`
3. `302_M14启动上下文 V2.0 Final.md`
4. `303_M14_Freeze_Delta_Report.md`（本报告）
5. `304_M14_Task_Decomposition_Report.md`

### 6.3 文档层级判断

M14 之后建议固定三层：

1. **历史冻结层**：`296/297/299/300`
2. **当前事实层**：`301/303`
3. **执行规划层**：`302/304`

---

## 7. Git 时间线复核

### 7.1 Freeze 后主要提交带来的结构性事实

| 日期 | 提交 | 主要影响 |
|---|---|---|
| 2026-08-05 | `3725f7a` | 产品页、产品详情页、静态页继续调整 |
| 2026-08-07 | `312a78c` / `456c7fa` / `49d7396` | API + Workspace + Notification + Inquiry + Schema 持续修补 |
| 2026-08-08 | `e1d5d33` | 数据层新增 `Offer/Product createdBy` 等补丁，Buyer Workspace 相关页面继续调整 |

### 7.2 Git 结论

> 真实仓库状态应描述为：  
> `M13.9 Web MVP Freeze`  
> `+ 2026-08-05 UI / Public Page 调整`  
> `+ 2026-08-07 API / Workspace / Notification / Inquiry 修补`  
> `+ 2026-08-07 / 2026-08-08 数据层补丁迁移`

---

## 8. M14 启动冻结判断

### 8.1 当前可以确认的冻结结论

| 维度 | 结论 |
|---|---|
| Buyer MVP 基础 | 保持成立 |
| Admin 运维骨架 | 保持成立 |
| Supplier Web 入口 | 仍缺失 |
| 内容中心 / 知识库 | 仍未产品化 |
| 数据库原始 Freeze | 已失效 |
| 当前新基线 | 需要以 301 + 303 共同确认 |

### 8.2 M14 启动建议

M14 现在应以以下事实基线启动：

> `当前 schema.prisma + 当前 migration 目录 + 当前 apps/web/apps/api/apps/admin 代码 + 301 + 302 + 303`

而不是继续引用“2026-08-04 当天的单次 Freeze 快照”。

---

## 9. Build 结果

本轮为审计与拆解任务：

- 未执行 `pnpm build`
- 未执行测试
- 未执行迁移

历史最近验证依据仍为：

- `docs/_review/300_M13.9.3_System_Verification_Report.md`

但该结果仅能作为历史参考，不能替代本日重新构建。

---

## 10. 最终结论

M14 的真实第一步已经明确：

1. 承认 M13.9 Freeze 之后仓库已发生数据库、API、Web、文档多维偏移
2. 以 `301 + 303` 重建事实基线
3. 以 `302 + 304` 约束后续任务顺序
4. 第一开发任务应围绕 **Workspace 角色与导航基础** 启动，而不是继续散点修补 Buyer 页

因此：

> `303_M14_Freeze_Delta_Report.md` 结论为 **PASS**。  
> M14 可以进入任务拆解后的首个开发任务定义阶段。
