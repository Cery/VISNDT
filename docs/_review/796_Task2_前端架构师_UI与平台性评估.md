# VISNDT — 任务二：前端架构师视角 · UI 设计与平台性目标评估

> 定位：前端架构评审（只读，不修改代码、不改 M39 授权与路线文档）
> 依据：三角色 E2E 实测 DOM/页面证据 + design-tokens + 平台设计目标（Vertical Industrial NDT / Engineering Discovery > Corporate Website / Reuse > Extend > New / Mobile first-class）
> 日期：2026-09-01

---

## 一、平台设计目标回顾（评审基准）

1. **Vertically-focused Industrial NDT / Inspection Equipment Platform**，而非 Generic B2B / 企业官网。
2. **Engineering Discovery 优先**于商务交易：公开可发现、能力参数化、技术知识。
3. **Unified platform**：一个公网发现面（Web）+ 一个 Role workspace + 一个 Platform Governance Center（Admin）。
4. **复用 > 扩展 > 新建**；单一入口 / 单一数据源；避免碎片化系统。
5. **Mobile 一等公民**（375/768/1024/1440），历史 carry-forward：768px≈140px 水平溢出。

---

## 二、正向评估（达成平台目标的部分）

### 2.1 公开发现面 — Engineering Discovery 达成度高 ✅
- 访客可访问：`/products`(能力注册表，参数筛选)、`/categories`(能力分类索引)、`/solutions`、`/knowledge-base`(知识中心)、`/search`(统一检索)、`/products/compare`。
- 页面以「能力分类 → 检测能力 → 技术参数 → 方案 → 知识」组织，语义是**能力注册表**而非商品货架，契合 Vertical Discovery。
- 存在 `robots.ts` / `sitemap.ts` / `seo-config` → SEO 可发现性已结构化（见 §五）。

### 2.2 单一入口 / 统一检索 Authority ✅
- 全域搜索落地 `/search`，未发现第二套检索系统，符合项目硬约束。

### 2.3 角色化工作区 — 平台分层清晰 ✅
- Buyers：`/workspace`(采购方) → 需求/匹配/RFQ/通知/设置；`/dashboard/buyer`.
- Suppliers：`/workspace/supplier` → RFQ机会/响应/报价/询价/商机/展示/企业资料/成员；`/dashboard/supplier`.
- 导航与落地页按角色完全隔离，`/dashboard` 按角色路由到 `/dashboard/buyer` 或 `/dashboard/supplier` → **一个入口、按角色分流的平台化设计正确**。
- 供应商端体现「Supplier Self-service」（企业资料、展示完整度 60% 自服务），符合「Reuse + Self-service + Minimal Review」。

### 2.4 UI 一致性与信息架构 ✅
- 全站头部导航高度一致：`首页 搜索 能力分类 产品中心 能力型号/供应商 解决方案 知识中心`。
- 全站页脚一致：产品/解决方案/知识中心/平台/支持 + 联系邮箱 + 版权。
- H1/标题/面包屑层级清晰；角色徽标（BUYER/SUPPLIER）、状态文案统一。

### 2.5 空态与引导 ✅
- 空数据页均有明确「无数据 → 下一步动作」引导（如 我的需求「浏览产品」、RFQ create「请先创建需求」），业务闭环对用户友好。

---

## 三、问题评估（按架构/平台目标维度）

### ✗ 3.1 运营治理面大量「空转/错误态」→ 直接削弱「平台治理」与"Unified Platform"承诺
- Admin 28 模块中 **约 13+ 模块内容区为空或处于错误态**：`/home` `/operation-center`（错误边界 reload）、10 个模块仅剩「重 试」、`/content` 整白、analytics/business-analytics/monitoring 空白、`/offers` 无列表。
- **平台性影响**：作为平台「Governance Center」，管理员无法在多数治理页看到任何数据，这会破坏"一个平台、一套治理面"的可信度；属于**平台完整性（P1）**问题，而非单纯样式问题。

### ✗ 3.2 供应商「仪表盘」404 死路由 → 角色导航完整性破损
- `/workspace/supplier/dashboard` 返回 404；而买家 `/workspace/dashboard` 正确重定向 `/dashboard/buyer`。角色侧能力不对称，存在死链风险（P1）。

### ✗ 3.3 双前端 = 双设计体系 → 平台视觉一致性是"声明"而非"强约束"
- Web 用 Next.js + Tailwind，Admin 用 Vite + Ant Design 5；`packages/design-tokens/tokens.json`（主色 `#2563eb`/Inter）**注释写明"说明性镜像，权威值以 src/index.ts 为准"** —— 即 token 未真正成为全平台单一事实源。
- 共享能力（`design-system`、`design-tokens`）已建包，但两前端并未统一消费同一源；长期易产生"平台一套、后台一套"的视觉漂移（**P2，架构负债**）。

### ✗ 3.4 元信息语义不一致 → SEO/可发现性受损
- `/products/compare` 页面 `title` 仍为「能力注册表」（实测），与页面语义「产品对比」不符；作为公开 SEO 面，会让搜索引擎判定混乱（**P2**）。

### ✗ 3.5 控制台规范告警
- RFQ 管理页触发 antd `columns.render` 废弃警告（性能相关，建议 `onCell`）（**P2**）。

### △ 3.6 Mobile 一等公民 — 未在本次重新校验
- 项目 memory 标注"历史 768px≈140px 水平溢出保留为 carry-forward"。本次 E2E 仅测 1440px 横屏，**未做 375/768 断点回归**；该 carry-forward 若未解决，将延续影响"Mobile first-class"目标（**待办，列为未覆盖项**）。

---

## 四、前端架构评审小结

| 架构维度 | 评级 | 说明 |
|---|---|---|
| 公开发现面（Engineering Discovery） | **A** | 能力索引/参数筛选/知识/方案/统一搜索完整 |
| 角色分层（买家/供应商工作区） | **A** | 单一入口+角色分流，闭环清晰 |
| 平台治理面（Admin）可用性 | **D** | 13+ 模块空转/错误态，治理侧完整性不足 |
| 设计系统单一事实源 | **C** | tokens/design-system 已建但未被统一强制消费 |
| 信息架构与文案一致性 | **B+** | 导航/页脚高度统一，个别元信息错位 |
| Mobile 一等公民 | **未覆盖** | 768 溢出 carry-forward 待回归，勿放任 |

### 优先建议（均为评审建议，非本次执行改动）
1. **P1**：排查 Admin 空转模块接口根因（matching/users/organizations/… retry 态 + home/operation-center 错误边界 + content 空白），恢复治理面可用——这是"平台性"最直接缺口。
2. **P1**：修复供应商仪表盘死路由 `/workspace/supplier/dashboard`（或改导航指向已存活的 `/dashboard/supplier`），并对导航菜单 href 做全量可达性扫描。
3. **P2**：将 `design-tokens` 提升为 Web/Admin 共同消费的单一源，消除"说明性镜像"的漂移风险。
4. **P2**：修正 `/products/compare` 的 `title/SEO` 元信息；清理 antd `columns.render` 废弃告警。
5. **待办**：补齐 375/768/1024 响应式回归，明确处置 768px 历史溢出 carry-forward。

---

## 五、结论

VISNDT 前端在**对外 Engineering Discovery 面**和**角色化工作区分层**上，达到了"垂直工业检测能力发现平台，优于企业官网"的设计目标，公开可发现、统一检索、供应商自服务均已落地并在真实浏览器验证通过。

但作为"平台"的**另一半——管理侧治理面**，当前有大量模块无法渲染内容（空转/错误态），直接拉低了"统一平台"的完成度；叠加供应商死路由、设计系统未统一、SEO 元信息错位等问题，说明**读侧（公开+角色）已成熟，写侧/治理侧仍需补齐**。建议按 §四优先级由 P1→P2 纳入下一轮收敛（本次仅评审，未改动任何文件、未触碰 M39 授权状态与路线文档）。