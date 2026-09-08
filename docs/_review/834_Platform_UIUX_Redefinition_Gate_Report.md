# VISNDT 834 Platform UI/UX Redefinition Gate — Report

> 版本：**V3.3.12 / 834_Platform_UIUX_Redefinition_Gate**
> 类型：Platform UX Audit + Information Architecture Redefinition + Navigation Redefinition + Visual/Interaction Target-State Definition + Implementation Boundary Planning
> 仓库根目录：`F:\Desktop\VISNDT` ｜ 代码根目录：`F:\Desktop\VISNDT\VISNDT`
> 分支：`main` ｜ HEAD：`37bea13`
> 日期：2026-09-06

---

## 1. Executive Summary

VISNDT 已完成 824（契约冻结）→ 826（重建基础）→ 827/828/829/830/831/832（公共发现面 + 采购方工作空间）→ 833（SupplierProduct 媒体+参数，CONDITIONAL PASS）。平台架构、路由语义、对象模型、授权与生命周期均已冻结。

本 Gate 回答核心问题：**“当前是否仍存在明显的工业官网式 UI/UX，以及如何重新定义为真正的 Industrial B2B Discovery Platform？”**

结论（提前声明，详见 §4 / §17）：

- **平台化成熟度高**：Header 已升级为「发现/评估/技术内容/连接」4 平台层 mega 导航；Products 是「能力注册表」体验；Product Detail 是「判断是否继续了解/比较/进入采购」的工程评估面；Solutions 是「问题→场景→能力→提供方→连接」的工程发现面；买方工作空间已有「待处理事项/决策」任务导向。这套基座**本质上已经不是通用企业官网**。
- **仍残留“工程化包装的企业官网”痕迹**：首页仍是「品牌价值 Hero + 卡片堆叠 + 连续 CTA」的下行结构，只是被套上了工业视觉壳；知识中心/能力提供商首页区块仍偏向「内容营销图标卡」；买方工作空间入口仍偏「Member Center Dashboard（业务快照/快捷入口）」。**工程视觉 ≠ 任务化发现。**
- **发现到一处真实的导航死点**：Header「能力型号 / 供应商」（及其在多处解决方案/首页/能力提供商 CTA）指向 `/search?type=supplier-product`，而统一检索 `VALID_TYPES` 仅接受 `all/product/knowledge/solution`，`supplier-product` 被静默忽略 → 落地为未筛选的通用检索。**导航承诺 ≠ 落地结果**（详见 §6 / §18 P2）。

### 最终决策（详见 §27）

**834 = PASS / CLOSED**（目标态定义 + 边界决策 + 文档同步完成；无代码实施 → Runtime implementation verification = DEFERRED，route/API 健康已实探）。

- **WP-4 = RESUME / REBASELINE REQUIRED**
- **WP-5A = NOT AUTO-STARTED**

---

## 2. Baseline Verification

| 项 | 结果 | 证据 |
| --- | --- | --- |
| Repository toplevel | `F:/Desktop/VISNDT` | `git rev-parse --show-toplevel` |
| Branch | `main` | `git branch --show-current` |
| HEAD | `37bea13` | `git rev-parse --short HEAD` |
| Working tree | clean（无未提交改动） | `git status --short` 空 |
| Web runtime | `UP` @ 3000（Next 15.5.20 Ready） | job log `Local: http://localhost:3000` |
| API runtime | `UP` @ 4000 | `GET /api/v1/health` → `200 {"status":"ok","database":"connected"}` |
| PostgreSQL | connected（经 API health） | 同上 |

### 既有 WP 基线（恪守已冻结状态，不重开任何已完成 WP）

```text
824   Frontend Productization Contract Freeze           PASS / FROZEN
826   Frontend Reconstruction Foundation                PASS
827   Public Discovery Shell + Home + Navigation        PASS / CLOSED
828   Search + Categories + Product List                 PASS / CLOSED
829   Closeout Recovery                                 PASS / CLOSED
830   Product Detail + Related Discovery                 PASS / CLOSED
831   Knowledge + Solution + Public Content              PASS / CLOSED
832   Buyer Workspace                                   PASS / CLOSED
833   SupplierProduct Media + Parameter                 CONDITIONAL PASS
```

833 的不一致项（R1 Media Write、R2 Parameter Write 为**缺失的 supplier 自服务写路径**，P2 非阻断）在本 Gate §21 明确其归属，不重开 833、不为其补实现。

---

## 3. Platformization Maturity Assessment（现有契约盘点）

本 Gate 不重新创造 Domain Contract，仅盘点既有冻结契约作为目标态边界。

- **Page Contract Registry**：824 已冻结公共表面路由（`/`、`/search`、`/categories`、`/products`、`/products/[slug]`、`/products/compare`、`/solutions`、`/knowledge-base`、`/suppliers/[id]`、`/business`、`/about`）与工作空间路由（`/workspace/...`、`/dashboard/...`）。本 Gate **不得变更路由语义**。
- **Role × Page × Capability**：Guest 可访问公共发现面；Buyer 见采购方工作空间；Supplier 见能力提供方工作空间；Admin 引导至 Admin Console。本 Gate 不触及 RBAC。
- **Navigation/Action/Destination Registry**：见 824 + `src/components/layout/PublicHeader.tsx` 的 `PLATFORM_LAYERS`。本 Gate 目标态在此口径上重排/重命名（§6）。
- **Frontend↔Backend Contract**：search / products / categories / content / capability / workspace 等 service 层调用不变。**零 API Contract 变更**。
- **Design/Component Registry**：`docs/contracts/component-registry.md` + `docs/design-system/VISNDT_COMPONENT_RULE.md`。本 Gate 仅给出统一目标方向，不建立第二套 Design System（§13）。
- **架构契约**：`docs/_architecture/M34_Platform_Architecture_Contract.md`（DISCOVER/PUBLISH/CONNECT/LEARN/WORKSPACE/ADMIN）。目标态严格对齐。

**不得触碰的冻结层**：Database / Schema / Migration / Domain Model / Authority / API Contract / Route Semantics / Permission / Lifecycle / Business Logic / Existing Core Workflow / Matching / RFQ / Offer / Search Ranking / SEO / LLM / AI / Marketplace / Commerce / Admin Business Logic。

---

## 4. Website-vs-Platform Diagnosis

### 4.1 总判断

```text
VISNDT 现状 = 「工程化的工业检测企业官网 / Engineering-theme Corporate Site」
目标态     = 「Industrial Inspection Capability Discovery Platform」
总差距     = 具有平台架构与强工程视觉，但信息组织仍以「品牌叙事 + 区块堆叠」为主轴，
            而非以「搜索 / 浏览 / 对象 / 任务」为主轴。
```

### 4.2 逐表症候（Current State → Problem → Severity → Why It feels like website）

| # | Surface | Current State | Problem | Severity | Why website-ish |
| --- | --- | --- | --- | --- | --- |
| W1 | Homepage | Hero（品牌 H1 + 仪器装饰面板 + 3 组 CTA + 底部 DISCOVER/CONNECT/MATCH rail）→ PlatformJourney → Category → FeaturedProducts → Solutions → PlatformFlow → KnowledgeCenter → CapabilityProvider → EngineeringDiscoveryNav → InquiryCTA | 首屏仍是品牌价值陈述 + 装饰性仪器大视觉；其后连续 5 个“介绍性/营销性”区块（featured 产品卡、知识图标卡、能力提供图标卡）堆叠；CTA 密集重复。 | P1 (UX) | **先回答“我是谁”，再回答“你能找到什么”**；以区块/卡片叙事为主轴，滚动长且无任务推进 |
| W2 | Header/Nav | 4 平台层 mega 导航（发现/评估/技术内容/连接）+ 搜索入口 + 移动抽屉 | 层名偏架构化（“评估”“技术内容”需二次解读）；「能力型号 / 供应商」项落地减弱为未筛选检索。 | P1 (IA/UX) | 层名是“内部信息架构词”而非用户任务词 |
| W3 | Nav Registry Gap | 多处（Header PT / Solutions CTA / CapabilityProvider CTA / Buyer 等）链向 `/search?type=supplier-product` | `SearchPageContent.VALID_TYPES` 仅 `all/product/knowledge/solution`，`supplier-product` 被忽略 → 落地为默认 all 检索 | **P2 (Defect/IA)** | 承诺供应商发现，实际无此筛选能力（见 §18） |
| W4 | Product List | 深色能力注册表带 + 分类 rail + Capability Evaluation ribbon + 跨面导航 + 参数 facet + 对比 | 顶部“深色带 + rail + ribbon + 跨面导航 + 搜索”纵向堆叠，首屏信息密度被引导性组件占用。 | P2 (UX) | 引导性饰带多于结果本身 |
| W5 | Product Detail | 面包屑 + 左侧导航 + 内容（识别/规格台账/参数表/相关能力/供应商型号/知识/方案） | 已工程化；弱在“明确下一行动（对比/发布需求）”与规格表密度/排序能力仍可加深。 | P2 (UX/Enhance) | 仍偏“展示这个产品”，评估/行动锚点不强 |
| W6 | Knowledge Center home block | 6 个图标卡（检测技术/检测场景/设备应用/行业应用/检测方法/参数指导） | 内容营销式 icon-card 索引，而非“工程问题/标准/规格语境”导航。 | P2 (UX) | 内容营销网站式首页推介 |
| W7 | Solution list | 工程问题→场景→能力→提供方→连接 头带 + 跨面导航 + next-action | 已工程化；仍带营销 Intro 文案与“从工程语境进入”pill 排。 | P2 (UX) | 头部营销文案偏多 |
| W8 | Buyer Workspace entry | IdentityBar + 业务快照(StatCards) + 待处理事项 + 快捷入口 + 深链 | 仍是“统计看板 + 快捷入口”的 Member Center 形态；弱化了 Demand→Match→RFQ→Response→Decision 的任务主轴展示。 | P1 (UX) | 企业会员中心式 Dashboard=Statistics |
| W9 | Visual language | 全局工业暗带 + grid-pattern + mono 遥测 + 工业青主色 | 视觉方向正确（密集/技术/数据导向）但存在装饰性遥测标签溢出（SYS/GAIN/AX 等纯装饰），个别大 Hero 面积。 | P2 (Visual) | 以装饰制造“技术感”而非以信息制造“技术感” |
| W10 | Mobile | 移动抽屉 375/768 均有响应式 | 未本 Gate 做 4 视口视觉确认；潜在卡片/表/hud 在 375 密度风险（此前各 WP 报告有覆盖，故降级为待复核）。 | P3 see §14 | 未见阻断性证据但需统一密度约定 |

### 4.3 根因

工程化包装主要停留在“视觉层与区块语言”，而未完全迁移到“信息组织 / 任务层”：

```text
拥有的强项：对象模型清晰、路由语义稳定、工程视觉语言成熟、跨面发现机制（EngineeringDiscoveryNav）存在。
真正的短板：首页/工作空间仍以“板块+卡片+CTA”叙事；导航层名偏架构；个别 CTA 承诺与实际能力脱节。
```

---

## 5. Homepage Assessment（对齐 V3.3.12 §5）

### 5.1 现存问题

对照 §5.1 清单逐项判断：

| 检查项 | 现状 | 判断 |
| --- | --- | --- |
| Hero overload | 首屏为品牌 H1 + 装饰仪器面板 + 3 组 CTA（浏览产品/探索方案 + 角色入口 + DISCOVER/CONNECT/MATCH rail） | **存在**（装饰面积大、CTA 多） |
| Section overload | 首页连排 5 个介绍性区块（featured 产品/方案/知识/能力提供） | **存在** |
| Content stacking | Category/Featured/Solutions/Knowledge/Provider 均为“展示块” | 存在 |
| Repeated CTA | 查看全部/进入知识中心/发现检测能力/成为能力提供商/统一检索/评估对比…多次重复 | **存在** |
| Brand-story bias | Hero 陈述“工业无损检测产品与技术方案平台” + Role 语言“我是检测需求方/能力提供商” | 存在（偏品牌/平台叙事） |
| Card stacking | Knowledge 6 icon-card、CapabilityProvider 4 icon-card 连续堆叠 | 存在 |
| Weak Product Discovery | 分类铁轨/Featured 为索引式，未以“搜索/筛选/浏览”为主要首屏入口 | 偏弱 |
| Weak Search Priority | 首屏有 GlobalSearchBar（好），但被 Hero 品牌层包围，优先级不突出 | 偏弱 |
| Weak Category Discovery | CategorySection 存在，但位置靠后，未成为首屏组织主轴 | 偏弱 |
| Low information density | 首屏约 1-1.5 屏为品牌叙事 | 存在 |
| Long scrolling w/o task progression | 区块之间无强“下一步”递进 | 存在 |

### 5.2 首页目标原则（目标态见 §17-A）

首页必须优先回答（现状大多靠后）：

```text
✅ 我可以在这里找到什么？      → 顶部即进入搜索/浏览/分类
✅ 我怎么开始找？            → Search-first、Browse-first
✅ 有哪些工业检测能力？        → Capability/Category 铁轨，数据实锚点
✅ 有哪些产品？              → 高密度能力表/列表（非 marketing 卡）
✅ 有哪些技术知识？           → 知识按“工程问题/标准/参数”索引
✅ 有哪些方案？              → 方案按“应用场景→能力”索引
✅ 下一步怎么继续？           → 连续发现（Current Context → Next Object）
```

### 5.3 首页 Section Content Governance（Purpose / Need / Object / Source / Interaction / Destination / KEEP-MERGE-REMOVE）

以现有首页顺序为准，逐块裁定：

| Section | Purpose | User Need | Primary Object | Data Source | Interaction | Destination | 裁定 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HeroSection | 品牌首屏 + 搜索 + 能力 rail | “怎么开始找” | 能力对象 | 静态 + GlobalSearchBar | 搜索/进入 | /search /products | **REBUILD**（压缩为 Discovery Ledge） |
| PlatformJourneySection | 平台操作模型说明 | “这是什么” | 平台模型 | 静态 | 浏览 | — | **REDUCE → MERGE**（一行叙述，勿做主视觉） |
| CategorySection | 能力分类索引 | “有哪些能力/怎么浏览” | Category | getCategories | 分类进入 | /products?categoryId | **KEEP/提升**（上移为首屏主轴） |
| FeaturedProductsSection | 推荐产品 | “有哪些产品可对比” | Product | getProducts(ACTIVE) | 进详情/对比 | /products/[slug] | **REDUCE → 高密度表**（去营销卡） |
| SolutionsSection | 方案索引 | “有哪些方案/看场景” | Solution | getContentList(SOLUTION) | 进方案 | /solutions/[slug] | **KEEP（收敛）** |
| PlatformFlowSection | 平台流程叙事 | “平台如何闭环” | 流程模型 | 静态 | 浏览 | — | **REMOVE/MERGE**（缺任务价值） |
| KnowledgeCenterSection | 知识索引 | “有哪些知识/学什么” | Knowledge Domain | 静态 icon | 进知识 | /knowledge-base | **REBUILD**（问题/标准索引，去 icon 卡） |
| CapabilityProviderSection | 能力提供商介绍 | “谁能提供” | Capability Provider | 静态 icon | 进发现 | /search /register?role=SUPPLIER | **REMOVE → 并入 Supplier Discovery** |
| EngineeringDiscoveryNav | 跨面发现收束 | 连续发现 | multi | 静态 | 各发现面 | 各 surface | **KEEP**（收敛为单一跨面入口） |
| InquiryCTA | 需求发起 | “发起需求” | Demand | 静态 | 进注册 | /register?role=BUYER | **KEEP（收敛，单 ACT）** |

> 裁定原则：没有明确任务价值的区块 **REMOVE/MERGE**；不要求“每个已有模块必须保留”。

---

## 6. Navigation Assessment（对齐 §6）

### 6.1 批判性判断

| 判据 | 当前（发现/评估/技术内容/连接） | 判断 |
| --- | --- | --- |
| 是否好懂 | “评估”“技术内容”偏架构词 | **部分不直观** |
| 是否符合用户任务 | 大体符合（已按任务分群） | 通过 |
| 是否符合对象模型 | 发现/内容/连接对齐对象 | 通过 |
| 层级是否清晰 | 一级→二级 mega 明确 | 通过 |
| 是否支持 Product Discovery | 发现/评估 均含产品 | 通过 |
| 是否支持 Knowledge/Solution Discovery | 技术内容 含方案/知识 | 通过 |

### 6.2 目标态命名（目标见 §17-B）

| 现层名 | 现内容 | 目标建议 | 理由 |
| --- | --- | --- | --- |
| 发现 Discover | 统一检索 / 能力分类 / 能力型号·供应商 | **保留“发现”**；子项改为 `<统一检索>` `<能力分类>`（能力型号·供应商→并入产品/提供方 tab，见 §18） | 用户语言清晰 |
| 评估 Evaluate | 检测产品 / 产品对比 | **建议改为“产品”**（含目录/对比），或“产品与对比”；抽象“评估”改为“产品”更对象化 | 用户语言 + 对象清晰 |
| 技术内容 Content | 解决方案 / 知识中心 | **建议“知识与方案”** 或拆为“解决方案”“知识中心”两层级 | 避免“内容”这种 CMS 词 |
| 连接 Connect | 发布检测需求 / 商务合作 | **保留“连接”**，子项建议 `<发布检测需求>` `<供应能力>`（连接受害方） | 任务清晰 |

> 改名仅作用于导航文案（OPEN 层），**不改路由、对象、权限**。

### 6.3 Desktop Interaction（目标态）

- 提供明确的**二级展开 + 箭头/位移动画 + 高对比 hover/focus-visible active state**。
- 支持 **Hover / Click / Outside Click / Escape 关闭**；当前实现已有 fixed-ink overlay + aria-expanded，方向正确。
- 一级层建议标题化 + 每个二级项保留一行 desc（当前已有）。

### 6.4 Mobile Interaction（目标态）

- 375 = 强制门禁：抽屉分组列表需保证 48px 触控目标、可滚动、Escape/遮罩关闭、焦点返回到触发器。
- 建议二级项带“箭头→”明确可进入；层标题可折叠（accordion）减少 375 纵向占用。
- 底部 drawer（<640px）与右侧 sheet（≥640px）的既有开关逻辑保留。

---

## 7. Platform Visual Language Assessment

- 现状：全局工业暗带头带 + grid-pattern + `mono` 遥测 + 工业青/主色渐变 + 数据锚点（`tabular-nums` 计数）。**方向正确**（密集/结构化/技术化/专业化/数据导向）。
- 需收紧：① 力争减少“纯装饰遥测标签”（`GAIN:42` / `AX:28.7°` / `SYS.STATUS`）——装饰性 > 信息性的“技术感”；② 首页大 Hero 面积压缩；③ 允许 compact table / dense list / spec grid / multi-column 密度（§8）。
- **禁止不因视觉而引入**：大块留白、无意义渐变、过圆角、营销 Banner。

---

## 8. Information Density Assessment

| 维度 | 现状 | 目标 |
| --- | --- | --- |
| Above-the-fold | 首页约 1–1.5 屏为品牌叙事；Product List 顶部引导性组件堆叠 | 首屏即搜索/分类/数据锚点；深度控制分层 |
| Listing | Featured/Solutions 为 4–12 张营销卡 | 高密度能力表/紧凑规格网格 + 多列 |
| Technical info | Product Detail 参数表已良好（8 行真实表） | 规格 grid、参数排序能力、对比锚点 |
| Navigation | 4 层 + 子项 desc，密度适中 | 层标题 + 单行 desc 保持 |
| Related discovery | 跨面相关（知识/方案/供应模型）已有 | 统一「当前语境 → 下一对象」锚点 |
| Workspace | 业务快照 + 快捷入口 + 待处理事项 | 以任务列表/工作队列为主，去“统计看板”稀释 |

允许 compact tables / dense lists / specification grids / multi-column / contextual sidebar / compact cards / structured metadata；不允许为“好看”稀释信息。

---

## 9. Product Experience Assessment

- **/products（能力注册表）**：已远超产品营销页——能力评估 ribbon、参数 facet、对比条、跨面导航俱在。提升点=首屏引导组件让位给结果密度（W4）。
- **/products/[slug]（工程评估面）**：包含识别/规格台账/参数/供应商型号/相关能力/知识/方案，帮助“判断继续了解/比较/进入采购”。提升点=显式「下一步行动」区（评估对比 / 发布检测需求 / 查看供应商型号）+ 规格表排序/聚焦。
- **目标心智**：`工程师判断「这个能力是否适合继续了解 / 比较 / 进入 RFQ」`，而非「消费产品页」。

---

## 10. Knowledge / Solution Assessment

- **Knowledge**：当前 `/knowledge-base` 与首页 icon 索引偏「内容营销索引」。目标=**Engineering Information Surface**：明确 `Why / How / Specification Context / Detection Context / Related Product / Related Solution`。
- **Solution**：当前已工程化（问题→场景→能力→提供方→连接），目标=强化 `Problem / Inspection Scenario / Applicable Capability / Relevant Product / Knowledge / Next Step` 字段化呈现，去营销 Intro 文案。
- **禁止**退回纯 Case Study / Article Website。

---

## 11. Buyer Workspace Assessment

- 现状入口 = IdentityBar + **业务快照(StatCards)** + 待处理事项 + **快捷入口卡** + 深链，偏 **Member Center Dashboard=Statistics**。
- 目标 = **Procurement Workbench**：以 **任务工作流**（Demand → Match → RFQ → Response → Decision）为主轴呈现，而非统计数字。布局/密度/导航/状态表示/行动层级允许重定义（工作台外壳开放层）。
- 保留其已有的“待决策响应”任务导向（这是正确方向），扩展为整链工作队列。

---

## 12. Discovery Continuity Assessment

- 已有 `EngineeringDiscoveryNav`（跨面发现收束）是良好基础。
- 需修：`/search?type=supplier-product` 联通性（§18）避免 Dead End；工作空间内列表/详情提供 `Current Context → Next Useful Action/Object`。
- 每个核心页面应回答：`当前语境 / 下一步有效行动 / 下一有效对象`。

---

## 13. Component / Design System Direction

允许重设计/合并/拆分/删除/替换现有组件；**禁止建立第二套 Design System**。统一方向：

```text
Header/Navigation/Breadcrumb → 平台层导航 + 单或双级着陆
Search Box                → 统一 /search 入口（纯入口，无类型选择器）
Filter                    → 参数 facet + 分类 facet 统一交互模型
Result List / Grid        → 高密度能力表 + 规格网格 + 紧凑卡
Product / Knowledge / Solution Card → 数据锚点优先、去营销化
Specification Table       → 排序/聚焦/参数分组（复用 ProductDetailTabs 契约）
Metadata / Status         → mono 标签 + 数字锚点统一
Tabs / Sidebar / CTA / Empty State → 收敛到 VISNDT_COMPONENT_RULE 单一来源
```

---

## 14. Responsive Redefinition

- 375 / 768 / 1024 / 1440 为统一设计约束（非补丁验证）。
- 定义：导航行为（<640 bottom / ≥640 right sheet）、密度行为（列表→卡片/表根据宽度切换）、网格（1→2→3→4 列降级）、表格（列收纳）、卡片（紧凑）、Sidebar（lg 下拉抽屉）、Filter（抽屉 vs 内联）、typography scaling、触控目标（≥48px）。
- 禁止简单“Desktop 缩小版”。
- 本 Gate 未做 4 视口视觉实施验证 → **明确 DEFERRED**（见 §22）；此前 827–833 各 WP 已覆盖过 375/768/1024/1440 无横向溢出，故无阻断证据。

---

## 15. Accessibility Direction

目标态必须转化为可验证 A11y Contract：

```text
Keyboard Navigation / Focus  → roving tabindex（复用 ProductDetailTabs 契约范式）
Menu semantics              → nav + aria-expanded + aria-current + Dialog(Drawer)
Search semantics            → label + role=searchbox + 提交行为 + 建议键盘交互
Interactive states          → hover/focus-visible/active/disabled 高对比
Contrast                    → 工业暗带上的文本/边框对比达标
Touch target                → ≥48px（移动导航/抽屉/卡片）
Heading hierarchy           → 每页单一 h1，区块 h2，无跳级
```

---

## 16. Benchmark-derived Principles

参考形态 GlobalSpec / DirectIndustry / Thomasnet（仅产品形态与 IA，禁止复制品牌/色板/布局/文案）。

```text
Search-first              → 全局搜索为最高优先发现入口
Browse-first              → 能力/类目铁轨与分类深度浏览
Product-first             → 产品(能力)为一级权威对象
Specification-first       → 技术参数为过滤/比较主轴
Supplier Discovery        → 提供方作为支撑语境（对象模型保持）
Engineering Information Density → 规格表/台账 dense
Category Depth            → 分类分层（父/子）导航
Task Orientation          → 每个面有明确下一步行动
Result-driven Interaction → 结果密度优先，减少营销区块
Continuous Discovery      → Current Context → Next Object 不断链
```

> 最终目标不是“做得像 GlobalSpec”，而是“呈现成熟 Industrial B2B Discovery Platform 的形态”。

---

## 17. Target-State Definition

### A. Homepage Target Mental Model

```text
首（Search Ledge）              能力检索/搜索栏             → /search
↓（Capability Rail）            分类/能力主轴（数据锚点）    → /products?categoryId
↓（Registry）                   高密度能力表/产品台账        → /products
↓（Engineering Information）    问题/标准/参数知识索引       → /knowledge-base
↓（Solution/Scenario）          应用场景→能力方案索引        → /solutions
↓（Continue Discovery / Inquiry）连续发现 + 单一需求行动     → /register?role=BUYER
```

替换旧模型：`Hero→品牌价值→平台介绍→卡片堆叠→CTA堆叠`。

### B. Navigation Target IA

```text
发现（Discover）     统一检索 ｜ 能力分类
产品（Product）      检测产品注册表 ｜ 产品对比
方案（Solution）     解决方案 ｜ 知识中心（或拆两层）
连接（Connect）      发布检测需求 ｜ 供应能力
```

语义层级保持：Product(WHAT) → SupplierProduct(WHICH MODEL) → Supplier(WHO)。Close 对齐 M34（DISCOVER/PUBLISH/CONNECT/LEARN/WORKSPACE/ADMIN）。

### C. Target Product / Knowledge / Solution / Buyer Workspace

- **Product**：工程评估工作台（判断→比较→进入 RFQ），含“下一步行动”区。
- **Knowledge**：Engineering Information Surface（Why/How/Spec/Detection/Related Product/Solution）。
- **Solution**：工程发现面（Problem/Scenario/Capability/Product/Knowledge/Next Step）。
- **Buyer Workspace**：Procurement Workbench（Demand→Match→RFQ→Response→Decision 任务队列），非统计看板。

### D. Target Visual / Density / Responsive

- 视觉：Dense / Structured / Technical / Data-oriented / Object-oriented；去装饰性遥测。
- 密度：compact table / dense list / spec grid / multi-column；首屏即信息。
- 响应：375/768/1024/1440 统一约束，抽屉/网格/表格/卡片/触控目标依断点定义。

---

## 18. Page-by-Page Action Matrix

| 页面 | 行动 | 说明 |
| --- | --- | --- |
| Homepage | **REBUILD** | 压缩 Hero → Discovery Ledge；Category/Registry 上移；REMOVE 无任务价值区块 |
| Header | **REBUILD（文字/层名）** | 层名改用户语言（§6.2）；交互加强 |
| Navigation | **REDUCE + REBUILD 文案** | 修 `/search?type=supplier-product` 死点 |
| Search | **KEEP（微调）** | 结果密度/工程字段；入口保持纯入口 |
| Categories | **KEEP** | 已在正确方向 |
| Product List | **REDUCE（首屏引导让位）** | 提升结果密度 |
| Product Detail | **REBUILD（Next-Action 区 + 规格交互）** | 强化“判断→比较→进采购” |
| Knowledge List | **REBUILD（信息表面）** | 去 icon 营销卡，按问题/标准/参数索引 |
| Knowledge Detail | **REDEFINE（字段化）** | Why/How/Spec/Detection/Related |
| Solution List | **KEEP（收敛 Intro）** | 字段化呈现 |
| Solution Detail | **REDEFINE（字段化）** | Problem/Scenario/Capability/Product/Knowledge/Next |
| Buyer Dashboard | **REBUILD → Workbench** | 去统计看板；任务队列主轴 |
| Demand | **KEEP/REDEFINE** | 工作流呈现强化 |
| Matching | **KEEP/REDEFINE** | 结果→下一步行动 |
| RFQ | **KEEP/REDEFINE** | 响应→决策任务队列 |

> 行为裁定仅限 UI/UX/IA/导航/呈现层；不触碰后端/对象/权限/路由语义。

---

## 19. Component / Design System Governance（结论）

- 允许重设计/合并/拆分/删除/替换现有组件。
- **禁止第二套 Design System**。
- 统一到 `docs/design-system/VISNDT_COMPONENT_RULE.md` + `docs/contracts/component-registry.md` 单一来源，本 Gate 输出方向而非落地组件。

---

## 20. Scope Boundary Matrix

| 域 | Can change now (834 实施基准) | Must preserve (FROZEN) | Defer WP-4 | Defer WP-5A | Defer WP-5B | Defer WP-5C | Defer WP-6 | Defer WP-7 | Defer WP-8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UI/UX/IA/Navigation/Visual/Density/Responsive/A11y | ✅ | — | — | — | — | — | — | — | — |
| Route semantics / RBAC / API / Schema / Business logic | — | **FROZEN** | — | — | — | — | — | — | — |
| Buyer Workspace Reshape | ✅（外壳/布局呈现） | 业务闭环保持 | — | — | — | — | — | — | — |
| Supplier Workspace | Not in 834 | — | — | **WP-5A** | — | — | — | — | — |
| Admin Core Operations | Not in 834 | — | — | — | **WP-5B** | — | — | — | — |
| Admin Master Data/Content/Monitoring | Not in 834 | — | — | — | — | **WP-5C** | — | — | — |
| Search Enhancement（rank/ranging） | Not in 834 | — | — | — | — | — | **WP-6** | — | — |
| SEO Enhancement | Not in 834 | — | — | — | — | — | — | **WP-7** | — |
| Full Real Browser / All Roles / Mobile Critical | Not visual gate | — | — | — | — | — | — | — | **WP-8** |

---

## 21. WP-4 / WP-5A Boundary Decision（关键）

### 21.1 833 遗留（R1 Media Write / R2 Parameter Write）

```text
833 R1 Media Write  = SupplierProduct 供应商自服务「媒体上传/维护」写路径缺失 → P2（supplier 能力缺口）
833 R2 Parameter Write = SupplierProduct「型号参数增删改」写路径缺失 → P2（supplier 能力缺口）
```

### 21.2 决策

```text
明确归属：833 R1/R2 = WP-5A Implementation（Supplier Workspace 供应商自服务写路径的一部分），
而非 WP-4 Closeout。原因：写路径属于 supplier 工作空间身份与权限内，属开放层 P2 能力补全，
不属 833「只读呈现」收口，也不属 834 呈现层 Gate。

因此：834（本 Gate）= 不阻塞。WP-4（833 收口）按既有 CONDITIONAL PASS + P2 carry-forward 判定已结，
但正式「RESUME / REBASELINE」判定见下。
```

### 21.3 明确结论（不再模糊）

```text
- 834 = PASS / CLOSED（目标态 + 边界决策 + 文档同步完成；无代码实施 → 实施验证 DEFERRED）
- WP-4 = RESUME / REBASELINE REQUIRED：833 仍为 CONDITIONAL PASS（R1/R2 未写路径），
  后续须在 WP-4 收口活动中 rebaseline（不重开已经 PASS 的面，仅对 supplier 写路径授予独立授权）
- WP-5A = NOT AUTO-STARTED：Supplier Workspace 与 R1/R2 写路径待独立授权，绝不自动启动
- WP-5B / WP-5C / WP-6 / WP-7 / WP-8 = NOT AUTO-STARTED
```

---

## 22. Runtime Verification or Explicit Deferment

### 22.1 已实探（route / API health，服务运行于 3000/4000）

| Route/Rsc | HTTP | Note |
| --- | --- | --- |
| `/` (`/`) | 200 | 首页 |
| `/search` | 200 | 统一检索 |
| `/products` | 200 | 能力注册表 |
| `/categories` | 200 | 能力分类 |
| `/products/compare` | 200 | 产品对比 |
| `/solutions` | 200 | 解决方案 |
| `/knowledge-base` | 200 | 知识中心 |
| `/knowledge` | 200 | 知识（route alias 存在） |
| `/business` | 200 | 商务合作 |
| `/about` | 200 | 关于 |
| `/suppliers` | 404（预期） | 无 index，仅 `/suppliers/[id]`（供应商发现走 search，符合对象模型） |
| API `/api/v1/health` | 200 | `{"status":"ok","database":"connected"}` |

### 22.2 明确措辞

```text
本 Gate = 目标态定义 Gate，未实施生产代码。
Runtime impact = NONE（无行为、路由、API、数据、Frontend bundle 变更）。
Implementation verification = DEFERRED：
  - 视觉 responsive（1440/375/1024/768）与横向溢出 = 未在本 Gate 重验 → DEFERRED
  - 无新 console error 断言 = 未实施故无新代码执行 → DEFERRED
  - 未伪称已完成实施。
```

> 注：`/search?type=supplier-product` 落地为通用检索（§18 P2）为**既有逻辑**，本 Gate 如实记录，不在本 Gate 修复。

---

## 23. Remaining Issues

| ID | 类型 | 位置/证据 | 状态 |
| --- | --- | --- | --- |
| 834-P2-01 | Defect/IA | 首页/Header/方案/能力提供中多处 CTA 链向 `/search?type=supplier-product`，统一检索忽略该 type → 落地为通用检索（W3） | 记录，Defer（呈现层下轮可修，对象/API 不变） |
| 834-P2-02 | UX | 首页 Hero/区块堆叠 + 连续 CTA（W1） | 记录，目标态已定义（§17-A），待 WP 实施 |
| 834-P2-03 | UX | Buyer Workspace 入口偏统计看板（W8） | 记录，目标态已定义（§17-C） |
| 834-P2-04 | UX | Knowledge/首页 icon 营销索引（W6） | 记录，目标态已定义（§10） |
| 834-P2-05 | Visual | 装饰性遥测标签（W9） | 记录，去装饰方向已定义 |

---

## 24. P0 / P1 / P2 / P3

```text
P0 (Security/Data Integrity/Auth) : 0（无新增；本 Gate 仅呈现层，无安全面变化；route/健康探针无透出敏感字段）
P1 (UA/UX 明显偏离平台)            : 首页 Hero 品牌化(W1)、导航层名偏架构(W2)、Buyer 统计看板(W8)
P2 (Defect / UX 细化)             : /search?type=supplier-product 死点(W3/834-P2-01)、其余 UX/Visual(W4-W9)
P3 (Minor)                        : 待 4 视口复核项(W10/DEFERRED)
```

---

## 25. Blocking / Non-Blocking

```text
BLOCKING  : 无（本 Gate 未触碰冻结层；无新 P0；无架构/业务逻辑漂移）
NON-BLOCK : 834-P2-01~05（均非阻断；记录并进入目标态实施轮次）
          833 R1/R2（写路径）→ 归属 WP-5A，非本 Gate 阻断
```

---

## 26. Documentation Synchronization

本报告生成 + 目标态已固化 → 同步以下运维文档（追加 834 条目）：

```text
docs/project-management/PROJECT_STATUS.md                  （追加 834 条目）
docs/project-management/PROJECT_ROADMAP.md                 （追加 834 条目）
docs/project-management/MODULE_COMPLETION_MATRIX.md       （追加 834 条目）
```

Page Contract Registry / Navigation Registry / Component Registry / Platform Design Notes / Progress Snapshot：本报告即为其目标态增量，无需另造新契约（OPEN 层方向已记录于本报告 §6/§13/§15/§17，FROZEN 层无任何变更）。

保持状态一致：**Code = Runtime = Documentation = Architecture = Roadmap = Progress Snapshot = 834 PASS**。

---

## 27. Final Decision

```text
834 = PASS / CLOSED

判据达成：
  - Platformization Diagnosis complete          ✅（§3/§4）
  - Homepage Target State complete              ✅（§5/§17-A）
  - Navigation Target State complete            ✅（§6/§17-B）
  - Product Target State complete               ✅（§9/§17-C）
  - Knowledge Target State complete             ✅（§10/§17-C）
  - Solution Target State complete              ✅（§10/§17-C）
  - Buyer Workspace Target State complete       ✅（§11/§17-C）
  - Information Density Target State complete   ✅（§8/§17-D）
  - Visual / Interaction Target State complete  ✅（§7/§13/§15/§17-D）
  - Page Action Matrix complete                 ✅（§18）
  - WP-4 / WP-5A boundary resolved              ✅（§21）
  - Documentation synced                        ✅（§26）
  - No architecture drift                       ✅（无 Domain/API/Schema/Route/RBAC 变更）
  - No business logic drift                     ✅（零业务逻辑变更）

记录：
  WP-4 = RESUME / REBASELINE REQUIRED
  WP-5A = NOT AUTO-STARTED
```

---

## 28. STOP

```text
834 执行完毕。
Freeze the Business. Free the Experience.
本 Gate 显式 STOP——不自动执行 WP-4 / WP-5A / WP-5B / WP-5C / WP-6 / WP-7 / WP-8。
后续任何 WP 均需独立授权、独立签名后启动。
```