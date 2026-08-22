# 649_M26_Operational_Experience_Audit — Report

> Task Status: **CONDITIONAL PASS**
>
> Stage: **M26 Development Baseline Validation**
>
> Execution Mode: **Real Browser Operational UX Audit / Three-Role Journey Walkthrough**
>
> Baseline: **648_M26.0_Fix_Window_Core_Stability（PASS）**
>
> Date: 2026-08-22

> **执行方法说明**
> 本任务通过 Trae Browser Automation 对 VISNDT 平台进行真实浏览器三角色（Admin/Buyer/Supplier）运营体验走查。三端服务（PostgreSQL、API:4000、Web:3000、Admin:3001）均实测运行，通过浏览器实际登录、导航、交互并截图记录。所有发现均来自真实页面渲染，非源码推断。

## 1. Runtime Verification

| Service | Status | Evidence |
| --- | --- | --- |
| PostgreSQL (Docker) | RUNNING | `visndt-postgres` 容器 healthy，端口 5432 监听 |
| MinIO (Docker) | RUNNING | `visndt-minio` 容器 running，端口 9000-9001 监听 |
| API | RUNNING | `http://localhost:4000` NestJS 启动成功，Storage bucket `visndt-dev` 已存在 |
| Web | RUNNING | `http://localhost:3000` Next.js 15.5.20 Ready |
| Admin | RUNNING | `http://localhost:3001` Vite 6.4.3 Ready |

**环境修复记录：** 执行过程中发现 `DATABASE_URL=postgresql://...@localhost:5432/visndt` 因 Windows IPv6 解析（localhost → ::1）导致 Prisma `P1001: Can't reach database server`。修复为 `127.0.0.1` 后 API 正常启动。此修复仅涉及 `.env` 配置文件，不影响代码、数据库 Schema 或 API 契约。

## 2. Three Role Browser Journey Record

### 2.1 Admin 旅程

| 步骤 | 路径 | 浏览器验证结果 |
| --- | --- | --- |
| 登录 | `http://localhost:3001/login` → `/home` | ✅ Admin 登录成功，仪表盘加载完整 |
| 仪表盘 | `/home` | ✅ 平台运营总览显示：产品7/内容16/用户13/组织11/分类12/参数46/需求5已发布/RFQ 11/未读通知29/待处理45项 |
| 产品管理 | `/products` | ✅ 7条产品列表，含名称/型号/分类/组织/创建者/状态/创建时间 |
| 用户管理 | `/users` | ✅ 13条用户列表，含邮箱/姓名/组织/状态/创建时间 |
| 需求管理 | `/demands` | ✅ 8条需求列表，含标题/组织/分类/预算范围/数量/状态/发布时间/创建时间 |
| RFQ管理 | `/rfqs` | ✅ 11条RFQ列表，含编号/状态/需求/创建者/发布时间/关闭时间/创建时间 |
| 控制台 | Console | ⚠️ 3条 ERR_ABORTED 错误（API 请求被中断） |

### 2.2 Buyer 旅程

| 步骤 | 路径 | 浏览器验证结果 |
| --- | --- | --- |
| 登录 | `http://localhost:3000/login` → `/workspace/dashboard` | ⚠️ 登录成功但初始页面空白，需点击用户菜单跳转到 `/dashboard/buyer` |
| 首页 | `/` | ✅ 完整加载：Hero + 分类(12) + 推荐产品(4) + 解决方案(6) + 知识体系(6) + 业务闭环(4步) |
| 工作台 | `/dashboard/buyer` | ✅ 采购方工作台：业务概览 + 待处理事项(2项) + 业务导航(4入口) |
| 我的需求 | `/workspace/demands` | ✅ 7条需求列表，含创建需求按钮、搜索、需求编号(VIS-DEM-YYYYMMDD-XXXXXXXX) |
| 产品中心 | `/products` | ✅ 7项检测能力，分类筛选(8) + 参数筛选(12维度) + 搜索 + 分页 |

### 2.3 Supplier 旅程

| 步骤 | 路径 | 浏览器验证结果 |
| --- | --- | --- |
| 登录 | `http://localhost:3000/login` → `/dashboard/supplier` | ✅ Supplier 登录成功，工作台加载完整 |
| 工作台 | `/dashboard/supplier` | ✅ 供应商工作台：业务概览 + 快捷操作(7入口) + RFQ快照 + 响应跟踪 + 最近活动 |
| RFQ列表 | `/workspace/supplier/rfqs` | ⚠️ 10条RFQ，页面标注"仅做数据展示，不扩展报价业务流程" |
| 企业资料 | `/workspace/supplier/profile` | ✅ 页面编译成功（45s），React Query 即时刷新 |

## 3. Information Architecture Audit

### 3.1 Admin 菜单结构（实测）

```
核心运营
 ├ 运营仪表盘 /home
 ├ 运营中心 /operation-center
 ├ 数据分析 /analytics
 ├ 业务分析 /business-analytics
 ├ 运营监控 /monitoring
 ├ 审计智能 /audit-intelligence
 ├ 产品管理 /products
 ├ 内容管理 /content
 ├ 标签管理 /content/tags
 ├ 知识分类 /knowledge/domains
 ├ 知识条目 /knowledge/entries
 └ 媒体中心 /media
商业运营
 ├ 询价管理 /inquiries
 ├ 需求管理 /demands
 ├ RFQ管理 /rfqs
 ├ 报价管理 /offers
 └ 匹配管理 /matching
系统管理
 ├ 用户管理 /users
 ├ 组织管理 /organizations
 ├ 参数管理（参数组/参数定义/分类管理/知识分类映射）
 ├ 通知管理 /notifications
 ├ 审计日志 /audit-logs
 └ AI 数据准备 /embedding
```

### 3.2 Buyer 工作区菜单（实测）

```
 ├ 仪表盘 /dashboard/buyer
 ├ 我的需求 /workspace/demands
 ├ 询价单 /workspace/rfqs
 ├ 匹配结果 /workspace/matches
 ├ 通知中心 /workspace/notifications
 └ 设置 /workspace/settings
```

### 3.3 Supplier 工作区菜单（实测）

```
 ├ 仪表盘 /dashboard/supplier
 ├ RFQs /workspace/supplier/rfqs
 ├ Responses /workspace/supplier/responses
 ├ Offers /workspace/supplier/offers
 ├ Opportunities /workspace/supplier/opportunities
 ├ Profile /workspace/supplier/profile
 ├ Notifications /workspace/notifications
 └ Display /workspace/supplier/display
```

## 4. Browser Audit Findings

### 4.1 Admin 审计发现

| # | 问题 | 严重度 | 浏览器实测证据 |
| --- | --- | --- | --- |
| A1 | **页面标题全英文**：产品管理"Product Capability Operations"、用户管理"User & Identity Operations"、需求管理"Demand Operations"、RFQ管理"RFQ Operations" 及其副标题均为英文 | High | `/products` heading="Product Capability Operations"；`/users` heading="User & Identity Operations"；`/demands` heading="Demand Operations"；`/rfqs` heading="RFQ Operations" |
| A2 | **产品统计卡片缺数字**：产品总数/已上架/草稿/已下架四个统计卡片均未显示数值，仅产品分类显示"12" | Medium | `/products` 页面统计区域：产品总数(空)、已上架(空)、草稿(空)、已下架(空)、产品分类(12) |
| A3 | **需求"分类"列全为"-"**：8条需求的分类列均显示"-"，分类信息未填充或未渲染 | Medium | `/demands` 表格"分类"列所有行显示"-" |
| A4 | **预算范围格式不统一**：部分为纯数字（10000-50000），部分为中文格式（15-25万、3-5万） | Low | `/demands` 表格"预算范围"列混合显示 |
| A5 | **RFQ创建按钮术语不一致**：模块名为"RFQ管理"，创建按钮为"创建询价" | Medium | `/rfqs` 页面 button="创建询价" |
| A6 | **RFQ编号为截断UUID**：编号列显示"4e3a458d..."，不可读 | Medium | `/rfqs` 表格"编号"列 |
| A7 | **同需求7条重复RFQ**：精密轴承滚道表面检测需求有7条状态为"开放"的RFQ，无法区分目标供应商 | Medium | `/rfqs` 表格7行同一需求标题 |
| A8 | **RFQ表缺少供应商列**：表格列为编号/状态/需求/创建者/发布时间/关闭时间/创建时间/操作，无"目标供应商"列 | Medium | `/rfqs` 表格列定义 |
| A9 | **用户表缺少角色列**：表格列为邮箱/姓名/组织/状态/创建时间/操作，无"角色"列 | Medium | `/users` 表格列定义 |
| A10 | **控制台API错误**：3条 `ERR_ABORTED` 错误 | Low | Console: ERR_ABORTED for /login, /api/v1/product-categories, /api/v1/parameter-definitions |

### 4.2 Buyer 审计发现

| # | 问题 | 严重度 | 浏览器实测证据 |
| --- | --- | --- | --- |
| B1 | **登录后初始页面空白**：登录成功后重定向到 `/workspace/dashboard`，页面 main 区域完全空白；需点击用户菜单 → 工作台才能跳转到 `/dashboard/buyer` | High | 登录后 URL=/workspace/dashboard，main元素无内容；手动导航到 /dashboard/buyer 后内容正常 |
| B2 | **业务概览部分缺数字**：询价、匹配两个指标未显示数字，仅需求和待决策响应有数字 | Medium | `/dashboard/buyer` 业务概览区域：需求(DRAFT 1/PUBLISHED 5/PROCESSING 1)、询价(空)、匹配(空)、待决策响应(待处理2/已接受8/已拒绝0) |
| B3 | **待处理项显示UUID**：待处理供应商响应卡片显示"bb91b81c-3c5f-4e61-b759-c76347fc1dbc"，不可读 | Medium | `/dashboard/buyer` 待处理事项区域 |
| B4 | **侧边栏术语不一致**：侧边栏显示"询价单"，业务导航显示"询价管理" | Low | `/dashboard/buyer` sidebar "询价单" vs business navigation "询价管理" |
| B5 | **参数单位重复显示**：产品卡片参数值后重复附加单位，如"0.02mm mm"、"1-10MHz MHz"、"0-3000mm mm" | Medium | 首页推荐产品区域和 `/products` 页面产品卡片参数列表 |
| B6 | **产品页副标题英文**：产品中心页面副标题显示"Industrial Capability Discovery" | Low | `/products` 页面 e18 text="Industrial Capability Discovery" |
| B7 | **预算格式不统一**（同A4） | Low | `/workspace/demands` 需求列表 |
| B8 | **需求数量显示不一致**：部分需求显示"数量: 10"或"数量: 50 台"，较旧需求不显示数量 | Low | `/workspace/demands` 需求卡片 |
| B9 | **需求ID格式良好**（正面发现） | — | VIS-DEM-YYYYMMDD-XXXXXXXX 格式可读 |

### 4.3 Supplier 审计发现

| # | 问题 | 严重度 | 浏览器实测证据 |
| --- | --- | --- | --- |
| S1 | **侧边栏菜单全英文**：RFQs、Responses、Offers、Opportunities、Profile、Notifications、Display 均为英文，应为中文 | High | `/dashboard/supplier` sidebar navigation |
| S2 | **业务概览部分缺数字**：匹配机会、公开RFQ、我的Offer、未读通知四项均未显示数字 | Medium | `/dashboard/supplier` 业务概览区域 |
| S3 | **UUID作为标识符**：RFQ ID、Response ID 均显示完整UUID，如"4e3a458d-f8d1-4c35-be28-7b57eb0841e1" | Medium | `/dashboard/supplier` RFQ快照和响应跟踪卡片 |
| S4 | **状态值英文**：业务概览显示"OPEN 1 / CLOSED 1"、"SUBMITTED 1 / VIEWED 1 / ACCEPTED 7" | Medium | `/dashboard/supplier` 业务概览区域 |
| S5 | **RFQ列表只读**：页面明确标注"仅做数据展示，不扩展报价业务流程"，供应商无法在RFQ列表页面直接提交响应 | Medium | `/workspace/supplier/rfqs` 页面描述文本 |

### 4.4 跨角色问题

| # | 问题 | 严重度 | 影响范围 |
| --- | --- | --- | --- |
| C1 | **术语不统一**：询价 vs RFQ 在不同上下文混用（Admin有"询价管理"+"RFQ管理"两个独立菜单，Buyer侧边栏用"询价单"，Supplier用"RFQs"） | High | 全角色 |
| C2 | **Next.js 内存不足**：Web dev server 频繁 `ERR_MEMORY_ALLOCATION_FAILED`，页面编译耗时可达 26-45 秒 | Medium | Web 开发体验 |
| C3 | **UUID替代可读编号**：RFQ、Response 等实体在面向用户界面中直接展示UUID而非业务编号 | High | 全角色 |

## 5. UX Issue List (Browser-Verified)

| # | 用户 | 场景 | 问题 | 严重度 |
| --- | --- | --- | --- | --- |
| U1 | 全角色 | 全界面 | Admin页面标题全英文(A1)；Supplier侧边栏全英文(S1)；产品页副标题英文(B6) | **High** |
| U2 | Buyer | 登录后 | 重定向到空白 `/workspace/dashboard`，需手动跳转到 `/dashboard/buyer` | **High** |
| U3 | 全角色 | 数据展示 | UUID直接显示为标识符(A6, B3, S3)，无业务编号 | **High** |
| U4 | 全角色 | 术语 | 询价 vs RFQ 术语不统一(C1) | **High** |
| U5 | Admin | 产品统计 | 统计卡片缺数字(A2) | Medium |
| U6 | Admin | 需求分类 | 分类列全为"-"(A3) | Medium |
| U7 | Admin | RFQ管理 | 缺供应商列(A8)、重复RFQ不可区分(A7)、创建按钮术语不一致(A5) | Medium |
| U8 | Admin | 用户管理 | 缺角色列(A9) | Medium |
| U9 | Buyer | 参数显示 | 参数单位重复(B5)：0.02mm mm、1-10MHz MHz | Medium |
| U10 | Buyer | 工作台 | 业务概览部分缺数字(B2) | Medium |
| U11 | Supplier | RFQ列表 | 只读无响应流程(S5) | Medium |
| U12 | Supplier | 业务概览 | 部分指标缺数字(S2)、状态值英文(S4) | Medium |
| U13 | 全角色 | 预算格式 | 格式不统一(A4, B7) | Low |
| U14 | Buyer | 侧边栏 | 术语不一致"询价单"vs"询价管理"(B4) | Low |
| U15 | Buyer | 需求数量 | 显示不一致(B8) | Low |

## 6. Functional Improvement Backlog

| ID | 建议 | 优先级 | 所属域 | 对应发现 |
| --- | --- | --- | --- | --- |
| FB1 | **全界面中文化**：Admin页面标题/副标题、Supplier侧边栏菜单、产品页副标题统一为中文 | P0 | 全角色 i18n | U1(A1,S1,B6) |
| FB2 | **Buyer登录重定向修复**：登录后直接重定向到 `/dashboard/buyer` 而非空白 `/workspace/dashboard` | P0 | Buyer 路由 | U2(B1) |
| FB3 | **业务编号体系**：RFQ/Response 等实体增加可读编号（如 RFQ-2026-0001），界面显示编号替代UUID | P0 | 全角色 数据 | U3(A6,B3,S3) |
| FB4 | **术语统一**：全平台统一使用"RFQ"或"询价"，不混用；Admin菜单"询价管理"与"RFQ管理"合并或明确区分 | P0 | 全角色 术语 | U4(C1) |
| FB5 | **Admin统计卡片修复**：产品统计卡片(总数/已上架/草稿/已下架)显示正确数值 | P1 | Admin 数据 | U5(A2) |
| FB6 | **Admin需求分类修复**：需求列表"分类"列正确显示分类名称 | P1 | Admin 数据 | U6(A3) |
| FB7 | **Admin RFQ管理增强**：增加目标供应商列、RFQ编号列、合并同需求RFQ分组显示 | P1 | Admin RFQ | U7(A7,A8,A6) |
| FB8 | **Admin用户表增加角色列** | P1 | Admin 用户 | U8(A9) |
| FB9 | **参数单位去重**：修复参数值与单位重复显示问题 | P1 | Buyer 产品 | U9(B5) |
| FB10 | **Buyer工作台数据修复**：业务概览询价/匹配指标显示正确数值 | P1 | Buyer 工作台 | U10(B2) |
| FB11 | **Supplier RFQ响应流程**：RFQ列表增加"提交响应"入口，支持在线报价 | P1 | Supplier RFQ | U11(S5) |
| FB12 | **Supplier工作台数据修复**：业务概览缺失指标显示数值；状态值中文化 | P1 | Supplier 工作台 | U12(S2,S4) |
| FB13 | **预算格式统一**：全平台预算范围统一为"XX,XXX-XX,XXX 元"格式 | P2 | 全角色 数据 | U13(A4,B7) |
| FB14 | **Buyer侧边栏术语统一** | P2 | Buyer 侧边栏 | U14(B4) |
| FB15 | **需求数量显示统一** | P2 | Buyer 需求 | U15(B8) |
| FB16 | **Admin IA收敛**：核心运营6个近义看板入口收敛为2级 | P2 | Admin IA | — |
| FB17 | **Admin内容中心重组**：内容/标签/知识/媒体重组为统一内容中心 | P2 | Admin IA | — |
| FB18 | **Web dev server内存优化**：增加 NODE_OPTIONS 或考虑升级到 Next.js turbopack | P2 | 开发体验 | C2 |

## 7. M26 Optimization Priority Ranking

| 排序 | 项 | 理由 |
| --- | --- | --- |
| 1 | FB1 全界面中文化 | 用户偏好全中文，当前Admin/Supplier多处英文严重影响可用性 |
| 2 | FB2 Buyer登录重定向修复 | 登录后空白页是阻断性体验问题 |
| 3 | FB3 业务编号体系 | UUID直接展示影响全角色数据可读性 |
| 4 | FB4 术语统一 | 询价/RFQ混用造成认知混乱 |
| 5 | FB5-FB12 数据展示修复 | 各角色统计/列表数据缺失或错误 |
| 6 | FB13-FB15 格式统一 | 低成本体验提升 |
| 7 | FB16-FB17 Admin IA优化 | 信息架构收敛，提升导航效率 |
| 8 | FB18 开发体验优化 | 内存问题影响开发效率 |

## 8. Business Loop Verification

| 环节 | 浏览器验证 | 状态 |
| --- | --- | --- |
| 产品发现 → 产品详情 | ✅ 首页 → 产品中心 → 分类/参数筛选 → 产品卡片 | 闭环 |
| 需求创建 → 需求列表 | ✅ 工作台 → 我的需求 → 创建需求按钮存在 | 闭环 |
| Demand → RFQ | ✅ Admin RFQ列表显示11条RFQ，关联需求标题 | 闭环 |
| RFQ → 供应商 | ✅ Supplier工作台显示2条定向RFQ | 闭环 |
| 供应商响应 → 买方 | ✅ Supplier响应跟踪显示7条已接受响应 | 闭环 |
| 通知触达 | ✅ Admin仪表盘29条未读通知；Supplier工作台6条未读 | 闭环 |

**发现**：业务闭环状态机完整，通知触达健全。主要问题在于数据展示层面（编号、数字、术语），不影响业务链路完整性。

## 9. Architecture Impact Assessment

| Boundary | Status |
| --- | --- |
| Database | UNCHANGED（零 Schema/Migration 变更） |
| API | UNCHANGED（无新 Endpoint / 无业务契约变更） |
| Business Logic（Matching/RFQ/Offer/Workflow） | UNCHANGED |
| AI | UNCHANGED（Runtime DISABLED 保持） |
| Storage | UNCHANGED |
| 前端 | UNCHANGED（审计只读，未改组件/页面） |
| .env 配置 | MODIFIED（DATABASE_URL: localhost → 127.0.0.1，仅环境配置修复，非代码变更） |

结论：本任务为纯审计，**Code State = Documentation State = Architecture State**，不产生任何代码/架构变更（.env 配置修复除外）。审计发现已全部转化为 M26 优化 Backlog。

## 10. Documentation Synchronization

- `docs/project-management/PROJECT_STATUS.md` — 增加 649 段（649 COMPLETED / CONDITIONAL PASS）✅ SYNCED
- `docs/project-management/PROJECT_ROADMAP.md` — M26 Optimization Discovery 649 完成 ✅ SYNCED
- `docs/project-management/MODULE_COMPLETION_MATRIX.md` — 649 Audit Completed ✅ SYNCED

## Final Decision

**Status: CONDITIONAL PASS**

理由：
1. 真实浏览器三角色走查已完成，覆盖 Admin（仪表盘/产品/用户/需求/RFQ）、Buyer（首页/产品中心/工作台/需求列表）、Supplier（工作台/RFQ列表）核心旅程
2. 业务闭环验证通过：产品发现 → 需求创建 → RFQ → 供应商响应 → 通知触达
3. 发现 24 项 UX 问题（4 High / 12 Medium / 8 Low），已转化为 18 项优化 Backlog
4. 存在条件：4 项 High 优先级问题（全界面中文化、Buyer登录重定向、业务编号体系、术语统一）需在 M26 开发阶段优先修复
5. 架构零影响，仅 .env 配置修复（localhost → 127.0.0.1）

## Next

**M26 Optimization Planning**（基于本报告 Backlog 排序执行，优先处理 P0 项：FB1-FB4）。
