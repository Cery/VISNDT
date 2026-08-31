# 741_跨角色平台感感知审计报告（Cross-Role Platform Perception Audit）

> 报告编号：741_Cross_Role_Platform_Perception_Audit
> 报告类型：Frontend UX / Platform Perception Audit（只读审计，零代码变更）
> 评估日期：2026-08-29
> 评估范围：Web 前端（:3000）Buyer/Supplier/公共页面、Admin 运营中心（:3001）
> 评估方式：CDP 真实浏览器截图（Edge headless，375×812 / 1440×900 双视口）+ 运行时 DOM 度量
> 执行指令：VISNDT 架构冻结期审查原则——不修改 Backend、Frontend、Database、Architecture、TECH_STACK_DECISION.md
> 审计脚本：`VISNDT/database/_741_role_gate.mjs`
> 截图目录：`VISNDT/database/_741_role_shots/`

---

## 一、任务概述

用户反馈当前前端「始终没有脱离官网类，没有达到综合的平台效果」。本次审计以 **真实登录态** 分别访问 Buyer（采购方）、Supplier（供应商）、Admin（管理员）三类角色的可访问页面，从「平台感 vs 官网感」维度定位问题根因，输出可验证的缺陷清单与改进方向。

本次审计 **不修改任何业务代码、数据库、API、前端路由或 Admin 模块**，所有发现仅作为冻结期后的迭代输入或范围裁决依据。

---

## 二、运行时与环境现状

| 服务 | 端口 | 状态 | 说明 |
|------|------|------|------|
| Web（Next.js 15） | 3000 | ✅ | 公开站 + Buyer/Supplier Workspace + Dashboard |
| Admin（Vite + AntD 5） | 3001 | ✅ | 工业运营中心 |
| API（NestJS） | 4000 | ✅ | `/api/v1/auth/login` 角色登录正常 |
| CDP（Edge headless） | 9222 | ✅ | 真实浏览器截图与 DOM 度量 |

**测试账号（来自 `database/seed_demo.ts`）**

| 角色 | 邮箱 | 组织 |
|------|------|------|
| Buyer | `demo.buyer.01@visndt.local` | 江南航空检测技术中心（BUYER） |
| Supplier | `demo.supplier.01@visndt.local` | 明视工业检测设备有限公司（SUPPLIER） |
| Admin | `demo.admin@visndt.local` | VISNDT 平台运营中心（ADMIN） |

---

## 三、关键路由入口核查

| 角色 | 旧入口 | 新入口 | 状态 |
|------|--------|--------|------|
| Buyer | `/workspace` | `/dashboard/buyer` | 双入口并存，旧入口为简化版「采购方工作空间」 |
| Supplier | `/workspace/supplier` | `/dashboard/supplier` | 双入口并存，旧入口为显式标注的「Compatibility Shell」 |
| Admin | `/workspace`（仅引导） | `:3001/home` / `:3001/operation-center` | Admin 工作台在独立 Admin 应用 |

**重大发现**：Supplier 存在两条差异极大的工作台路径：
- `/workspace/supplier`：页面标题为「供应商兼容入口 (Compatibility Shell)」，正文声明「该页面仅保留为历史路由兼容入口，用于维持 Supplier 工作区壳层访问，不承担业务工作台扩展职责」，并提示正式入口为 `/dashboard/supplier`。
- `/dashboard/supplier`：为功能完整的「供应商工作台」，含业务概览、快捷操作、定向询价快照、响应跟踪、最近活动、业务导航。

该双入口状态本身即「平台感不足」的直接证据：角色核心工作台存在「临时兼容壳」与「正式工作台」两层，用户极易误入壳层页面。

---

## 四、跨角色平台感诊断

### 4.1 公共页面：官网外壳未随角色状态变化

 Buyer、Supplier 登录后访问 `/`、`/products`、`/categories`、产品详情页时，页面内容与未登录态几乎完全一致：

| 页面 | Buyer bodyLen | Supplier bodyLen | 差异 |
|------|---------------|------------------|------|
| `/` 首页 | 3777 | 3777 | 0 |
| `/products` | 2984 | 2984 | 0 |
| `/categories` | 1989 | 1989 | 0 |
| 产品详情 | 1096 | 1096 | 0 |

顶部导航在所有角色下均为官网结构：「首页、产品中心、产品分类、解决方案、知识中心、商务合作、关于我们」，无角色相关快捷入口（如「我的工作台」「我的需求」「我的报价」）。搜索框文案仍为「搜索工业检测设备…」，未因角色切换为「搜索能力/需求/商机」。

**结论**：公共页面对已登录角色零感知，用户登录后仍处于「浏览官网」的体验中，未进入「使用平台」的状态。

### 4.2 Buyer：新 Dashboard 已具平台感，但被旧入口与官网外壳稀释

- `/dashboard/buyer`：功能完整，含业务概览（需求/询价/匹配/待决策响应）、待处理事项、业务导航。已具备平台工作台特征。
- `/workspace`（旧入口）：为简化版「采购方工作空间」，底部存在「进入完整采购方工作台」提示，说明自身不完整。
- `/workspace/demands`：列表信息密度低，条目以 `TC716-… 需求` 编号为主，缺乏业务摘要。
- 问题：旧入口仍可直接访问，且登录后顶部导航/底部 Footer 仍为官网样式，破坏平台沉浸感。

### 4.3 Supplier：问题最严重，旧入口是「兼容壳」，新入口被隐藏

- `/workspace/supplier`（旧入口）：显式自曝为 Compatibility Shell，正文说明「本页不新增 RFQ 列表、Response 操作、产品管理或其他 Supplier 业务能力；相关业务导航请进入正式 Dashboard」。该页面直接削弱用户对平台专业性的信任。
- `/workspace/supplier/rfqs`：页面标题为「供应商询价管理」，但列表内容实际为 Buyer 侧「需求」（含「对…有检测需求」文案），存在角色内容错位。
- `/workspace/supplier/offers`：相对正常，为「我的报价」卡片列表。
- `/workspace/supplier/profile`：仅展示企业名称、类型、ID、时间戳，信息过于简陋。
- `/dashboard/supplier`：功能完整，与 Buyer Dashboard 对称，含业务概览、快捷操作、定向询价、响应跟踪等。

**结论**：Supplier 的完整工作台存在，但默认路由/旧路由将其导向一个「兼容壳」，这是平台感缺失的核心根因之一。

### 4.4 Admin：最接近平台感，但仍有数据可信度问题

- `/home`：平台运营总览，数据卡片、业务流转、匹配引擎状态、待处理事项、快捷操作齐全。
- `/operation-center`：运营域总览与待办队列，视觉与功能均达到运营后台水平。
- `/products`：能力管理表格，支持筛选、分页、操作列。
- 注意：「平均匹配度 10,000%」等数据在视觉上不合常理，需后续验证是否为展示 bug。

### 4.5 移动端（375×812）

- Buyer/Supplier Dashboard 在移动端 bodyLen 与桌面端接近，说明已实现响应式，但小屏下信息密度高、卡片堆叠，平台感弱于桌面端。
- `/workspace/demands` 在 375 视口下 `innerWidth=521`，说明存在横向缩放或布局溢出。
- `/workspace/supplier` 在移动端存在 83 个 overflow 元素，壳层页面移动端体验差。

---

## 五、缺陷清单（按严重程度）

### P0 — 平台定位/角色闭环阻塞

| 编号 | 缺陷 | 证据 | 影响 |
|------|------|------|------|
| P0-1 | Supplier 旧工作台入口 `/workspace/supplier` 为显式「Compatibility Shell」，且直接暴露给用户 | 截图 `supplier_workspace_legacy_1440.png`、代码 `SupplierWorkspaceEntry.tsx` | 用户登录后进入「非正式」页面，严重破坏平台信任感；违反「综合平台」定位 |
| P0-2 | 公共页面（首页/产品/分类）对已登录 Buyer/Supplier 零角色感知 | 运行时 bodyLen 完全一致（3777/2984/1989） | 登录后仍像浏览官网，无「进入业务」的状态转换 |
| P0-3 | Supplier `/workspace/supplier/rfqs` 列表显示 Buyer 侧「需求」内容，角色数据错位 | 截图 `supplier_rfqs_legacy_1440.png` | 供应商看到采购方视角文案，业务逻辑混乱 |

### P1 — 入口/导航/信息架构

| 编号 | 缺陷 | 证据 | 影响 |
|------|------|------|------|
| P1-1 | Buyer/Supplier 存在 `/workspace` 与 `/dashboard/*` 双入口，功能不一致 | 路由文件与截图对比 | 用户迷失， bookmarks/外链可能指向旧入口 |
| P1-2 | 登录后顶部导航无角色快捷入口（我的工作台、我的需求、我的报价等） | 所有公共页截图 | 平台效率低于官网，用户需多次点击进入业务 |
| P1-3 | 工作台页面仍使用官网 Footer（产品/解决方案/平台/支持/联系我们） | `buyer_dashboard_1440.png`、`supplier_dashboard_1440.png` | 平台沉浸感被官网外壳切断 |
| P1-4 | Buyer `/workspace/demands` 列表以编号为主，缺乏业务摘要 | 截图 `buyer_demands_1440.png` | 信息密度低，运营效率差 |

### P2 — 视觉/响应式/可访问性

| 编号 | 缺陷 | 证据 | 影响 |
|------|------|------|------|
| P2-1 | 多页面色彩对比度低于 4.5:1（公共页 110+/383 样本，Admin 31–64/100–400 样本） | `measure.jsonl` `contrastBelow45` | 可访问性不达标 |
| P2-2 | `/workspace/demands` 在 375 视口下 `innerWidth=521`，存在横向溢出 | `measure.jsonl` | 移动端布局异常 |
| P2-3 | `/workspace/supplier` 移动端存在 83 个 overflow 元素 | `measure.jsonl` | 移动端体验差 |
| P2-4 | Admin 首页「平均匹配度 10,000%」等数据不合常理 | 截图 `admin_home_1440.png` | 数据可信度受损 |

### P3 — 细节优化

| 编号 | 缺陷 | 证据 | 影响 |
|------|------|------|------|
| P3-1 | 所有工作台页面 `document.title` 均为「VISNDT – 工业检测能力发现平台」，无角色/页面区分 | `measure.jsonl` title 字段 | 浏览器标签/历史记录难以辨识 |
| P3-2 | Supplier 企业资料页仅展示基础字段，无能力展示/资质/联系信息预览 | 截图 `supplier_profile_1440.png` | 供应商身份展示薄弱 |

---

## 六、与冻结约束的关系

根据项目记忆与 `ARCHITECTURE_FREEZE.md` 精神：

- **允许**：审计脚本调整、截图、度量、报告输出、文档更新。
- **禁止**（冻结期）：修改 Backend、Frontend、Database、Architecture、TECH_STACK_DECISION.md；新增 Supplier Store / Marketplace / Transaction / Schema / API / 独立供应商页面；激活 AI/RAG。

因此，本报告列出的 P0/P1 项在冻结期内 **不得通过新增页面、重命名路由、改写业务逻辑等方式修复**。若需临时缓解，仅允许低风险操作：
- 在旧入口页面增加显式跳转到新 Dashboard 的链接（低风险文案/链接调整）；
- 更新文档，明确 `/dashboard/buyer` 与 `/dashboard/supplier` 为正式入口。

根本性平台感改造（统一入口、角色感知导航、移除官网 Footer、工作台布局重构）应纳入冻结期后的产品迭代。

---

## 七、截图证据索引

| 文件名 | 说明 | 关键问题 |
|--------|------|----------|
| `buyer_home_1440.png` | Buyer 登录态首页 | 与未登录态一致，无角色感知 |
| `buyer_workspace_legacy_1440.png` | Buyer 旧入口 `/workspace` | 简化版，提示「进入完整采购方工作台」 |
| `buyer_demands_1440.png` | Buyer 需求列表 | 信息密度低，编号为主 |
| `buyer_dashboard_1440.png` | Buyer 正式工作台 `/dashboard/buyer` | 功能完整，但底部官网 Footer |
| `supplier_workspace_legacy_1440.png` | Supplier 旧入口 `/workspace/supplier` | **Compatibility Shell** |
| `supplier_rfqs_legacy_1440.png` | Supplier 旧 RFQ 页 | 显示 Buyer 侧「需求」内容 |
| `supplier_profile_1440.png` | Supplier 企业资料 | 字段简陋 |
| `supplier_dashboard_1440.png` | Supplier 正式工作台 `/dashboard/supplier` | 功能完整，但底部官网 Footer |
| `supplier_dashboard_375.png` | Supplier Dashboard 移动端 | 响应式可用，但信息密度高 |
| `admin_home_1440.png` | Admin 首页 | 平台运营总览，数据可信性待核 |
| `admin_operation_center_1440.png` | Admin 运营中心 | 运营域总览与待办队列 |
| `admin_products_1440.png` | Admin 能力管理 | 表格功能完整 |

---

## 八、结论

1. **平台感缺失的根因不是「没有工作台」**，而是：
   - 完整工作台（`/dashboard/buyer`、`/dashboard/supplier`、Admin）被旧/临时入口（`/workspace/*`）和官网式公共页面包围；
   - 公共页面对已登录角色零感知；
   - Supplier 旧入口显式自曝为「兼容壳」，直接打击平台专业感。

2. **Admin 端最接近综合平台效果**，Buyer/Supplier 的正式 Dashboard 已具备平台工作台雏形，但入口与外壳未收敛。

3. **冻结期内建议**：
   - 文档化正式入口为 `/dashboard/buyer` 与 `/dashboard/supplier`；
   - 在 `/workspace` 与 `/workspace/supplier` 顶部增加强引导至新 Dashboard；
   - 不启动任何路由重构、页面重设计或数据库变更。

4. **冻结期后建议**：
   - 统一角色工作台入口，移除旧 `/workspace/*` 路由或将其 301 重定向至 `/dashboard/*`；
   - 公共页面登录态增加角色感知：顶部导航出现「工作台/我的需求/我的报价」等快捷入口；
   - 工作台页面移除官网 Footer，使用平台专属布局；
   - 修复 Supplier RFQ 列表数据错位与 Admin 首页异常数据展示。

---

## 九、验证清单

- [x] Buyer 可登录并访问 `/`、`/products`、`/workspace`、`/workspace/demands`、`/workspace/rfqs`、`/dashboard/buyer`
- [x] Supplier 可登录并访问 `/`、`/products`、`/workspace/supplier`、`/workspace/supplier/rfqs`、`/workspace/supplier/offers`、`/workspace/supplier/profile`、`/dashboard/supplier`
- [x] Admin 可登录并访问 `:3001/home`、`:3001/operation-center`、`:3001/products`
- [x] 双视口（375×812 / 1440×900）截图已捕获
- [x] DOM 运行时度量已记录至 `database/_741_role_shots/measure.jsonl`
- [x] 未修改任何业务代码、数据库、API、前端组件

---

*报告结束。下一步建议由产品负责人确认：冻结期后是否将「统一角色入口 + 公共页角色感知」纳入下一迭代范围。*
