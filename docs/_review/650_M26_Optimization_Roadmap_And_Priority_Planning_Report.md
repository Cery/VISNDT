# 650_M26_Optimization_Roadmap_And_Priority_Planning — Report

> Task Status: **PASS**
>
> Stage: **M26 Optimization Planning**
>
> Execution Mode: **Audit Consolidation / Architecture Planning / Roadmap Refinement**
>
> Baseline: **649_M26_Operational_Experience_Audit（CONDITIONAL PASS）**
>
> Date: 2026-08-22

> **执行方法说明**
> 本任务为纯规划任务（Audit / Planning Only，零代码变更）。基于 649 真实浏览器三角色审计结果，对全部 UX/Functional/Operational Findings 进行重新分类、实施边界分析与路线图制定。本任务输出 Optimization Roadmap，非 Optimization Implementation。

## 1. Repository Verification

| 项 | 值 |
| --- | --- |
| Repository Root | `F:/Desktop/VISNDT` |
| Code Root | `F:/Desktop/VISNDT/VISNDT` |
| Branch | `main` |
| Working Tree | 有 648 修复窗口遗留改动（未提交），符合 M26.0 状态 |
| Baseline 648 | `648_M26.0_Fix_Window_Core_Stability — PASS` |
| Baseline 649 | `649_M26_Operational_Experience_Audit — CONDITIONAL PASS` |
| Documentation Sync | `PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` / `MODULE_COMPLETION_MATRIX.md` 已同步 649 |
| Architecture Freeze | Database / API / Business Logic / Matching / Search / AI Runtime 全部 UNCHANGED |

## 2. 649 Finding Consolidation

汇总 649 报告全部 24 项发现（A 系列 Admin ×10 + B 系列 Buyer ×9 + S 系列 Supplier ×5 + C 系列 Cross Role ×3）。

### 2.1 A 系列 — Admin

| # | 问题 | 649 严重度 | 实施类型初判 |
| --- | --- | --- | --- |
| A1 | 页面标题全英文（产品/用户/需求/RFQ 管理） | High | Frontend Only |
| A2 | 产品统计卡片缺数字（总数/已上架/草稿/已下架） | Medium | Frontend Only |
| A3 | 需求"分类"列全为"-" | Medium | Frontend Only |
| A4 | 预算范围格式不统一 | Low | Frontend Only |
| A5 | RFQ 创建按钮术语不一致（"创建询价"） | Medium | Frontend Only |
| A6 | RFQ 编号为截断 UUID | Medium | Frontend Only（方案 A）/ Database（方案 B） |
| A7 | 同需求 7 条重复 RFQ 不可区分 | Medium | Frontend Only（分组展示） |
| A8 | RFQ 表缺少"目标供应商"列 | Medium | Frontend Only |
| A9 | 用户表缺少"角色"列 | Medium | Frontend Only |
| A10 | 控制台 3 条 ERR_ABORTED | Low | Frontend Only（请求生命周期） |

### 2.2 B 系列 — Buyer

| # | 问题 | 649 严重度 | 实施类型初判 |
| --- | --- | --- | --- |
| B1 | 登录后重定向到空白 `/workspace/dashboard` | High | Frontend Only（路由重定向） |
| B2 | 工作台业务概览询价/匹配缺数字 | Medium | Frontend Only |
| B3 | 待处理项显示 UUID | Medium | Frontend Only（方案 A） |
| B4 | 侧边栏"询价单" vs 业务导航"询价管理" | Low | Frontend Only |
| B5 | 参数单位重复（0.02mm mm / 1-10MHz MHz） | Medium | Frontend Only |
| B6 | 产品页副标题英文"Industrial Capability Discovery" | Low | Frontend Only |
| B7 | 预算格式不统一（同 A4） | Low | Frontend Only |
| B8 | 需求数量显示不一致（部分不显示） | Low | Frontend Only |
| B9 | 需求 ID 格式良好（正面发现） | — | — |

### 2.3 S 系列 — Supplier

| # | 问题 | 649 严重度 | 实施类型初判 |
| --- | --- | --- | --- |
| S1 | 侧边栏全英文（RFQs/Responses/Offers/Opportunities/Profile/Notifications/Display） | High | Frontend Only |
| S2 | 业务概览匹配机会/公开 RFQ/我的 Offer/未读通知 缺数字 | Medium | Frontend Only |
| S3 | RFQ ID/Response ID 显示完整 UUID | Medium | Frontend Only（方案 A） |
| S4 | 状态值英文（OPEN/CLOSED/SUBMITTED/VIEWED/ACCEPTED） | Medium | Frontend Only |
| S5 | RFQ 列表只读，无在线响应流程 | Medium | Frontend + 复用既有 API（无新 Endpoint） |

### 2.4 C 系列 — Cross Role

| # | 问题 | 649 严重度 | 实施类型初判 |
| --- | --- | --- | --- |
| C1 | 询价 vs RFQ 术语不统一（Admin 双菜单 / Buyer"询价单" / Supplier"RFQs"） | High | Frontend Only |
| C2 | Next.js 内存不足 ERR_MEMORY_ALLOCATION_FAILED | Medium | 工程配置（NODE_OPTIONS / turbopack） |
| C3 | UUID 替代可读编号（同 A6/B3/S3） | High | Frontend Only（方案 A） |

## 3. Priority Classification

将 24 项发现重新归类为 P0 / P1 / P2 / Future 四级。

### 3.1 P0 — User Blocking（用户阻断）

| ID | 问题 | 影响 | 实施类型 | DB | API | Frontend | 计划 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-1 | 全界面中文化（A1/S1/B6） | Admin 标题 / Supplier 侧边栏 / 产品页副标题英文，用户偏好阻断 | Frontend Only | NO | NO | YES | M26.1 |
| P0-2 | Buyer 登录重定向空白页（B1） | 登录成功后 main 空白，需手动跳转才能进入工作台 | Frontend Only（路由） | NO | NO | YES | M26.1 |
| P0-3 | UUID 替代可读编号（A6/B3/S3/C3） | 实体标识不可读，影响全角色数据识别 | Frontend Only（方案 A：复用 641 identity-contract） | NO | NO | YES | M26.1 |
| P0-4 | 询价 vs RFQ 术语统一（C1/A5/B4） | 同语义不同术语造成认知混乱 | Frontend Only | NO | NO | YES | M26.1 |

### 3.2 P1 — Operation Efficiency（运营效率）

| ID | 问题 | 影响 | 实施类型 | DB | API | Frontend | 计划 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1-1 | Admin 产品统计卡片缺数字（A2） | 运营看不到关键指标 | Frontend Only | NO | NO | YES | M26.2 |
| P1-2 | Admin 需求分类列全为"-"（A3） | 分类信息丢失 | Frontend Only | NO | NO | YES | M26.2 |
| P1-3 | Admin RFQ 管理增强（A5/A7/A8） | 创建按钮术语/重复 RFQ/缺供应商列 | Frontend Only | NO | NO | YES | M26.2 |
| P1-4 | Admin 用户表缺角色列（A9） | 无法识别用户角色 | Frontend Only | NO | NO | YES | M26.2 |
| P1-5 | 参数单位重复（B5） | "0.02mm mm" 不专业 | Frontend Only | NO | NO | YES | M26.2 |
| P1-6 | Buyer 工作台业务概览缺数字（B2） | 询价/匹配指标空白 | Frontend Only | NO | NO | YES | M26.2 |
| P1-7 | Supplier 工作台数据修复（S2/S4） | 部分指标缺数字/状态值英文 | Frontend Only | NO | NO | YES | M26.2 |
| P1-8 | Supplier RFQ 响应流程（S5） | RFQ 列表只读，无在线响应入口 | Frontend Only（复用既有 RFQResponse API） | NO | NO | YES | M26.2 |

### 3.3 P2 — Product Experience（产品体验优化）

| ID | 问题 | 影响 | 实施类型 | DB | API | Frontend | 计划 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P2-1 | 预算格式统一（A4/B7） | "10000-50000" vs "15-25万" | Frontend Only | NO | NO | YES | M26.3 |
| P2-2 | 需求数量显示统一（B8） | 部分需求不显示数量 | Frontend Only | NO | NO | YES | M26.3 |
| P2-3 | Admin IA 收敛（FB16） | 6 个近义看板入口收敛为 2 级 | Frontend Only | NO | NO | YES | M26.3 |
| P2-4 | Admin 内容中心重组（FB17） | 内容/标签/知识/媒体重组为统一中心 | Frontend Only | NO | NO | YES | M26.3 |
| P2-5 | Web dev server 内存优化（C2） | 频繁 ERR_MEMORY_ALLOCATION_FAILED | 工程配置（NODE_OPTIONS / 可选 turbopack） | NO | NO | YES | M26.3 |
| P2-6 | 控制台 ERR_ABORTED 优化（A10） | API 请求生命周期优化 | Frontend Only | NO | NO | YES | M26.3 |

### 3.4 Future Candidate（延期）

| ID | 能力 | 理由 |
| --- | --- | --- |
| F-1 | AI 智能推荐（参数→产品语义匹配） | 违反当前 Matching 确定性约束，AI 仍 FROZEN |
| F-2 | 自动报价（Supplier 自动生成 Offer） | 超出当前"人工驱动"业务模型 |
| F-3 | 高级分析（趋势预测/转化漏斗） | 需新建分析 Schema 与事件总线，违反 Database Freeze |
| F-4 | 在线交易（订单/支付） | 违反"Inquiry = Demand Expression"非交易定位 |
| F-5 | CRM 能力（客户跟进/销售漏斗） | 超出 VISNDT 工业检测能力发现平台定位 |
| F-6 | Database Business Number Field（方案 B/C） | 需新增 Schema 字段，违反 Database Freeze；641 identity-contract 已提供 Frontend Format Layer（方案 A）足够 |
| F-7 | Supplier 完整 RFQ 响应工作流（多轮谈判/还价） | 当前为单次 Response，工作流扩展属未来阶段 |

## 4. Architecture Impact Matrix

| Optimization | DB | API | Frontend | Business Logic | Risk |
| --- | --- | --- | --- | --- | --- |
| P0-1 全界面中文化 | NO | NO | YES | NO | LOW（纯文案替换，无契约变更） |
| P0-2 Buyer 登录重定向 | NO | NO | YES（路由） | NO | LOW（前端 redirect 逻辑） |
| P0-3 UUID 展示治理 | NO | NO | YES（复用 641） | NO | LOW（641 identity-contract 已存在 derive/parse） |
| P0-4 术语统一 | NO | NO | YES | NO | LOW（纯文案） |
| P1-1 Admin 统计卡片 | NO | NO | YES | NO | LOW（数据查询/绑定） |
| P1-2 Admin 需求分类列 | NO | NO | YES | NO | LOW（字段渲染） |
| P1-3 Admin RFQ 管理 | NO | NO | YES | NO | LOW（列定义/分组/按钮文案） |
| P1-4 Admin 用户角色列 | NO | NO | YES | NO | LOW（已有 userRole 数据，仅展示） |
| P1-5 参数单位去重 | NO | NO | YES | NO | LOW（展示层模板修复） |
| P1-6 Buyer 工作台数据 | NO | NO | YES | NO | LOW（统计查询绑定） |
| P1-7 Supplier 工作台数据 | NO | NO | YES | NO | LOW（同 P1-6） |
| P1-8 Supplier RFQ 响应入口 | NO | NO | YES（复用 RFQResponse API） | NO | MEDIUM（需校验既有 POST /rfq-responses 可复用，无新 Endpoint） |
| P2-1 预算格式统一 | NO | NO | YES | NO | LOW（formatter） |
| P2-2 需求数量显示 | NO | NO | YES | NO | LOW（空值降级） |
| P2-3 Admin IA 收敛 | NO | NO | YES | NO | MEDIUM（菜单重组影响导航习惯，需回归测试） |
| P2-4 Admin 内容中心重组 | NO | NO | YES | NO | MEDIUM（多模块合并，路由调整） |
| P2-5 Web 内存优化 | NO | NO | YES（配置） | NO | LOW（NODE_OPTIONS / turbopack 评估） |
| P2-6 控制台请求优化 | NO | NO | YES | NO | LOW（请求生命周期管理） |

**结论**：全部 18 项优化均 **不需要** Database 变更、**不需要** API Contract 变更、**不需要** Business Logic 变更。架构冻结边界全程保持。

## 5. M26 Roadmap

### 5.1 M26.1 Foundation Experience Stabilization

**目标**：解决 4 项 P0 用户阻断问题，恢复基本可用性。

**范围**：

| Task | 内容 | 实施类型 | 对应发现 |
| --- | --- | --- | --- |
| M26.1.1 | 全平台中文化：Admin 页面标题/副标题、Supplier 侧边栏菜单、产品页副标题统一为中文 | Frontend Only | A1/S1/B6 |
| M26.1.2 | Buyer 登录重定向修复：登录成功后按 workspaceRole 重定向到 `/dashboard/buyer` 或 `/dashboard/supplier`，不再落到空白 `/workspace/dashboard` | Frontend Only（路由） | B1 |
| M26.1.3 | UUID 展示治理：在 Admin/Buyer/Supplier 全部面向用户的列表/详情页，使用 `@visndt/identity-contract` 的 `deriveBusinessIdentity` 替代原生 UUID 显示（方案 A：Frontend Format Layer） | Frontend Only（复用 641） | A6/B3/S3/C3 |
| M26.1.4 | 术语统一：全平台统一使用"RFQ"（Admin 菜单"询价管理"与"RFQ 管理"合并或明确区分；Buyer 侧边栏"询价单" → "RFQ"；Supplier"RFQs" → "RFQ 管理"） | Frontend Only | C1/A5/B4 |

**实施边界**：
- Database: UNCHANGED
- API: UNCHANGED
- Business Logic: UNCHANGED
- Matching / Search / AI: UNCHANGED
- Migration: NONE
- 影响已有闭环: NO

**Identity System 方案决策（P0-3）**：

```
方案 A: Frontend Format Layer ✅ ADOPTED
  - 复用 @visndt/identity-contract（641 已交付）
  - deriveBusinessIdentity(uuid, type) → VIS-{PREFIX}-{YYYYMMDD}-{SEQUENCE}
  - 零 Schema 变更，零 API 变更
  - 641 已在 Web RFQList/RFQDetail/DemandList 与 Admin 6 Detail 接入，仅需扩展到全角色全列表

方案 B: Database Business Number Field ❌ REJECTED（违反 Database Freeze）
  - 需新增 rfq.businessNumber / response.businessNumber 等字段
  - 需 Migration
  - 与 M25 架构冻结冲突

方案 C: 统一 Identifier Service ❌ DEFERRED（架构演进，超出 M26 范围）
  - 新建 Identifier Service 模块
  - 涉及 API 扩展
  - 延期至 Future Candidate（F-6）
```

### 5.2 M26.2 Operation Efficiency Improvement

**目标**：提升 Admin 与 Supplier 日常运营效率，修复 8 项 P1 数据展示与流程缺失。

**范围**：

| Task | 内容 | 实施类型 | 对应发现 |
| --- | --- | --- | --- |
| M26.2.1 | Admin 数据展示修复：产品统计卡片补齐数值、需求分类列正确显示分类名 | Frontend Only | A2/A3 |
| M26.2.2 | Admin RFQ 管理增强：创建按钮术语统一为"创建 RFQ"、增加"目标供应商"列、同需求 RFQ 分组展示 | Frontend Only | A5/A7/A8 |
| M26.2.3 | Admin 用户表增加角色列：显示用户主角色（复用既有 userRole 数据） | Frontend Only | A9 |
| M26.2.4 | Buyer 参数单位去重：修复参数值与单位重复显示（"0.02mm mm" → "0.02 mm"） | Frontend Only | B5 |
| M26.2.5 | Buyer 工作台业务概览补齐：询价/匹配指标显示正确数值 | Frontend Only | B2 |
| M26.2.6 | Supplier 工作台数据修复：业务概览缺失指标显示数值、状态值中文化（OPEN → 开放） | Frontend Only | S2/S4 |
| M26.2.7 | Supplier RFQ 响应入口：RFQ 列表增加"提交响应"入口，复用既有 POST /rfq-responses（无新 Endpoint，无业务逻辑变更） | Frontend Only（复用 API） | S5 |
| M26.2.8 | P1 回归测试：Playwright E2E 补充 Admin/Supplier 工作台数据展示用例 | 测试脚手架 | — |

**实施边界**：
- Database: UNCHANGED
- API: UNCHANGED（M26.2.7 仅复用既有 POST /rfq-responses，不新增/修改 Endpoint）
- Business Logic: UNCHANGED（RFQResponse 状态机不变）
- Migration: NONE
- 影响已有闭环: NO（仅展示层与入口扩展）

### 5.3 M26.3 Product Experience Enhancement

**目标**：提升 Buyer 发现与决策体验，收敛 Admin 信息架构。

**范围**：

| Task | 内容 | 实施类型 | 对应发现 |
| --- | --- | --- | --- |
| M26.3.1 | 预算格式统一：全平台统一为"XX,XXX-XX,XXX 元"格式（前端 formatter） | Frontend Only | A4/B7 |
| M26.3.2 | 需求数量显示统一：补齐旧需求数量字段空值降级显示 | Frontend Only | B8 |
| M26.3.3 | Admin IA 收敛：6 个近义看板入口（运营仪表盘/运营中心/数据分析/业务分析/运营监控/审计智能）收敛为 2 级 | Frontend Only | FB16 |
| M26.3.4 | Admin 内容中心重组：内容/标签/知识/媒体重组为统一内容中心（路由结构调整，零 API 变更） | Frontend Only | FB17 |
| M26.3.5 | Web dev server 内存优化：评估 NODE_OPTIONS=--max-old-space-size=8192 默认化或升级至 Next.js turbopack | 工程配置 | C2 |
| M26.3.6 | 控制台请求生命周期优化：修复 ERR_ABORTED（请求取消/竞态） | Frontend Only | A10 |
| M26.3.7 | M26 Final Regression Audit：M26.1+M26.2+M26.3 全量回归审计 | Audit Only | — |

**实施边界**：
- Database: UNCHANGED
- API: UNCHANGED
- Business Logic: UNCHANGED
- Migration: NONE
- 影响已有闭环: NO
- Admin IA 收敛与内容中心重组需 Playwright E2E 覆盖回归

### 5.4 Future Candidate

**明确延期至 M27+ 或不实施**：

| ID | 能力 | 延期理由 |
| --- | --- | --- |
| F-1 | AI 智能推荐 | AI FROZEN，Matching 确定性约束 |
| F-2 | 自动报价 | 超出"人工驱动"业务模型 |
| F-3 | 高级分析（转化漏斗/趋势预测） | 需新建 Schema 与事件总线 |
| F-4 | 在线交易（订单/支付） | 违反 Inquiry = Demand Expression 非交易定位 |
| F-5 | CRM 能力（客户跟进/销售漏斗） | 超出工业检测能力发现平台定位 |
| F-6 | Database Business Number Field（方案 B/C） | 需新增 Schema 字段，违反 Database Freeze；641 identity-contract 方案 A 已满足当前需求 |
| F-7 | Supplier 多轮谈判 RFQ 响应工作流 | 当前单次 Response 模型，工作流扩展属未来阶段 |
| F-8 | Figma 视觉 Diff 自动化（M25.1 遗留） | 需 Figma MCP 连接，运行环境未就绪 |

## 6. Risk Assessment

### 6.1 数据库冻结影响

| 项 | 评估 |
| --- | --- |
| 是否影响数据库冻结 | **NO** — 全部 18 项优化均为 Frontend Only 或工程配置 |
| 是否需要 Migration | **NONE** — 零迁移 |
| 是否新增字段 | **NO** — 全部复用既有 Schema |
| UUID 治理方案 | 采用方案 A（Frontend Format Layer），复用 641 identity-contract，零 Schema 变更 |

### 6.2 业务闭环影响

| 闭环环节 | 影响 |
| --- | --- |
| Demand → DemandMatch → RFQ → RFQResponse → Notification | **UNCHANGED** |
| M26.2.7 Supplier RFQ 响应入口 | 仅前端入口扩展，复用既有 POST /rfq-responses，状态机不变 |
| Matching 算法 | UNCHANGED |
| Search 契约 | UNCHANGED |
| AI Runtime | FROZEN |

### 6.3 M26 范围控制

| 项 | 评估 |
| --- | --- |
| 是否扩大 M26 范围 | **NO** — 全部优化项均源自 649 Findings，无新增范围 |
| 是否需要架构变更 | **NO** — 仅前端展示层与工程配置 |
| 是否引入新 Package / Token / Identity Type | **NO** — 复用既有 640 design-system / 641 identity-contract |
| 是否触发 ADR 评审 | **NO** — 不修改 ADR-M24-008/009/010，不修改 580-586 治理 ADR |

### 6.4 风险矩阵

| 风险 | 概率 | 影响 | 缓解 |
| --- | --- | --- | --- |
| M26.2.7 误用 RFQResponse 状态机 | LOW | MEDIUM | 严格复用既有 POST /rfq-responses，禁止状态扩展 |
| M26.3.3 Admin IA 收敛破坏现有导航 | MEDIUM | LOW | Playwright E2E 覆盖回归 |
| M26.3.5 turbopack 升级引入兼容性问题 | MEDIUM | LOW | 优先 NODE_OPTIONS 方案，turbopack 评估后实施 |
| M26.1.4 术语统一引发文案争议 | LOW | LOW | 统一为"RFQ"（与已冻结 ADR 一致），保留"询价"作为动作描述 |

## 7. Final Decision

```
650 Status: PASS

理由：
1. 649 全部 24 项 Findings 已汇总并重新分类为 P0×4 / P1×8 / P2×6 / Future×8
2. 18 项优化项全部为 Frontend Only 或工程配置，零 Database / API / Business Logic 变更
3. UUID 治理方案 A（Frontend Format Layer）已决策，复用 641 identity-contract，零 Schema 变更
4. M26.1 / M26.2 / M26.3 / Future 路线图已定义，实施边界清晰
5. 业务闭环保护确认：Demand → DemandMatch → RFQ → RFQResponse → Notification 全程 UNCHANGED
6. 架构冻结边界保持：Database / API / Matching / Search / AI Runtime 全部 UNCHANGED
7. 风险评估完成，无高风险项

M26 Optimization Execution Ready
```

## 8. Documentation Synchronization

- `docs/project-management/PROJECT_STATUS.md` — 增加 650 段（650 COMPLETED / PASS）✅ SYNCED
- `docs/project-management/PROJECT_ROADMAP.md` — M26 Optimization Planning 650 完成 ✅ SYNCED
- `docs/project-management/MODULE_COMPLETION_MATRIX.md` — 650 Audit Completed ✅ SYNCED

## Next

**M26 Optimization Implementation Planning** — 基于 650 Roadmap，进入 M26.1 P0 Optimization 实施（FB1-FB4：全界面中文化 / Buyer 登录重定向 / UUID 展示治理 / 术语统一）。
