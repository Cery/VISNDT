# VISNDT M33 Frontend Visual Design Contract And Redesign Specification（V1.0）

> 任务编号：`726_M33.0_Frontend_Visual_Design_Contract_And_Redesign_Specification`
> 阶段：**M33.0 — Frontend Visual Redesign Contract**
> 类型：Architecture / Design Contract / Visual Specification / Planning
> 状态：**中（M33 PLANNING）** 本文档为 **Design Contract（Documentation State）**，**不等于 Implementation**
> 上游输入：`725_M33.0_Frontend_Visual_Redesign_Audit_And_Design_Direction`（PASS）+ M32 `719/720/721/722/723` + M33 Entry `724` + 真实运行时与 725 Before-State 截图 + `docs/design-system/` + `packages/design-tokens`

---

## 0. 文档定位与契约性质

本 Contract 将 **725 已确认的「需要显著视觉重设计（Gap=C）」** 从 Direction 层提升为 **可执行、可验证、可关闭的视觉设计合同**。

- 本 Contract **只定义**，**不实施**。
- 本 Contract 回答 10 个核心问题（见 §1-§39 对应章节）。
- 本任务零代码变更：`Schema=UNCHANGED / Migration=NONE / Backend=UNCHANGED / API=UNCHANGED / Matching=UNCHANGED / Search=UNCHANGED / AI=UNCHANGED / Runtime Dependency=UNCHANGED / UI Library=UNCHANGED`。
- 链路：`Design Direction(725) → Visual Design Contract(726) → Implementation → Runtime Visual QA → Before/After Verification → Visual Transformation Confirmed`。**禁止跳过本 Contract 直接进入大规模 UI Implementation。**

---

## 1. Executive Design Goal

**将 VISNDT 从「Functional B2B UI」升级为「Premium Industrial B2B Platform」，同时保持平台业务语义（Organization / Demand / RFQ / Capability / Capability Model）完全不变、不变成 Consumer SaaS / E-commerce / 营销落地页 / Dashboard-only 产品 / AI 产品。**

目标视觉形态：

```text
Industrial Precision  ×  Technical Professional  ×  Modern B2B
Engineering Confidence  ×  Data Clarity           ×  Operational Trust
```

- 视觉关键词（冻结）：`Precision / Structure / Depth / Clarity / Professional / Technical / Controlled / Modern / Industrial`
- 目标完成后：`Web Redesign = REQUIRED` 达成、`Admin Redesign = REQUIRED` 达成、`Visual Transformation = CONFIRMED`。

---

## 2. Baseline（冻结审计事实，不得推翻）

来源于 725（本 Contract 不重定义 725 已确认事实）：

| 项 | 值 |
|---|---|
| M32 | **CLOSED**（不得重开） |
| M33 | **PLANNING** |
| Overall Visual Score | **67 / 100** |
| Visual Redesign Gap | **C（Significant Visual Redesign Required）** |
| Web Redesign / Admin Redesign / Core Page Redesign / Component Redesign | **REQUIRED / REQUIRED / REQUIRED / REQUIRED** |
| Visual Transformation | **NOT CONFIRMED**（未经实施） |
| Design Token Utilization / Typography / Color / Component / Layout / Brand / Responsive | 725 评分（4/3/4/3/3/3/4） |
| Before-State | `VISNDT/database/_725_shots/*.png`（11 张，375/768/1440） |

**基线关系**：`725 = Visual Audit Baseline` → `726 = Visual Design Contract` → `Future M33 Implementation`。

---

## 3. Brand Direction（§4.1 冻结方向）

- **Brand Positioning**：Industrial Precision / Technical Professional / Modern B2B / Engineering Confidence / Data Clarity / Operational Trust。
- **Visual Personality（目标值）**：

| 维度 | 目标 |
|---|---|
| Professional / Industrial / Technical | HIGH |
| Premium | MEDIUM-HIGH |
| Visual Depth | HIGH |
| Marketing / Consumer / E-commerce Feeling | LOW |
| Decoration | LOW |

- **禁止**：过度渐变 / 过度圆角 / 大面积高饱和色 / 卡片堆砌 / 营销式 Banner / 电商式商品卡 / 无意义装饰 / 大量 emoji。

---

## 4. Visual Personality Contract

目标人设与禁止项，每项均落在 P0 页面验收：

- 允许：Industrial grid、technical pattern、subtle depth、technical diagram language、controlled gradient、visual field。
- 禁止：大面积营销渐变、过度动画、视频背景、复杂 WebGL、高成本视觉运行时。
- **Color = Signal，不是 Color = Decoration。**

---

## 5. Typography Contract

建立在 **720 冻结 TYPOGRAPHY 单源事实**（`VISNDT_TYPOGRAPHY.md` + `design-tokens.typography`）上。原则：`Token Applied + Hierarchy Consistent + Cross-page Rhythm Consistent` —— 满足三合一才算通过。

### 5.1 全站四级信息层级（冻结）

```text
Level 1 — Page Title        → H1 36 / Bold 700
Level 2 — Section/Subsection→ H2 30 / H3 24 / Semibold
Level 3 — Primary Content   → H4 20 / Body 16
Level 4 — Metadata/Aux      → Body SM 14 / Caption 12
```

### 5.2 角色化排印（冻结数值依据 `VISNDT_TYPOGRAPHY.md`）

| 角色 | 字号 | 字重 | 行高 | letter-spacing | 色 |
|---|---|---|---|---|---|
| Display | 48 | 700 | 1.1 | -0.02em | Neutral-900 |
| Title (H1) | 36 | 700 | 1.15 | -0.025em | Neutral-900 |
| Subtitle (H2) | 30 | 600 | 1.2 | -0.02em | Neutral-800 |
| Section (H3) | 24 | 600 | 1.25 | -0.015em | Neutral-800 |
| Body (Body) | 16 | 400 | 1.6 | 0 | Neutral-700 |
| Meta (Body SM) | 14 | 400 | 1.5 | 0 | Neutral-500 |
| Caption/Label | 12 | 400 | 1.4 | 0.04em | Neutral-500 |
| Numeric/Technical | 依角色 | Mono | 对齐 | 0 | Neutral-800/状态色 |

### 5.3 应用规则

- 标题层级不跳跃（H1→H2→H3 语义递减，禁止 H1→H4）。
- 中文正文 16px 起；表单/表格正文 14px。
- 数字/参数场景 Mono（`JetBrains Mono`）保证对齐。
- **跨端一致性**：Web 与 Admin 同一字段同一层级大小相近（实现细节可不同）。
- **726 契约要求新增产出**：非内容页（列表/工作台/卡片）排版节奏统一到上述四级；Hero 呈现 Display 层级。

---

## 6. Color Contract

**保持既有冻结品牌色**（来自 `VISNDT_COLOR_SYSTEM.md` + `design-tokens.colors`），**不重新发明品牌主色**：

| 品牌色 | 值 | 语义用途 |
|---|---|---|
| Primary | `#2563EB` | Primary CTA / Key Action / Selected State / Important Indicator / Brand Accent |
| Secondary | `#0EA5E9` | 技术强调 / hue / 次级信息高亮 |
| Accent | `#F59E0B` | 关注 / warning 强调 |
| Success | `#10B981` | 正向状态持久 |
| Warning | `#F59E0B` | 待关注 |
| Error | `#EF4444` | 负向/终止 |
| Info | `#0EA5E9` | 信息性 |
| Neutral | `#64748B` | 中性/归档 |

### 6.1 品牌色使用约束（Color = Signal）

- 品牌色**不得**大面积页面背景、所有 Card、所有标题、所有 Border、所有 Icon。
- 品牌主色只在「Primary CTA / 选中态 / 重要指标 / 品牌点缀」出现。
- 层次优先靠 Surface + Spacing + Border + Shadow + Typography，而非堆颜色。

### 6.2 语义状态

- 状态统一走 `STATUS_TONE` + `TONE_TO_HEX` / `TONE_TO_ANTD_COLOR`（已冻结），未知回退 neutral。
- M33 不新增语义色；不在业务代码里硬编码新 hex。

---

## 7. Surface Contract

建立明确视觉层级（基于现有 token，不新增色板），**不靠颜色变化制造层次，靠 Surface+Spacing+Border+Shadow+Typography 建立层次**：

```text
Surface Hierarchy（冻结）：
Surface 0  — Page Background   layoutBg  #F5F7FA（Web）/ AntD Layout bg
Surface 1  — Primary Surface   cardBg    #FFFFFF（主卡、标准区块）
Surface 2  — Secondary Surface neutral-100 #F1F5F9（次级区块、分组底、表格斑马）
Elevated   — 浮层             #FFFFFF + shadow-md/lg（Dropdown/Modal/Popover）
Overlay    — 弹层蒙层         rgba(15,23,42,0.5)
Interactive Surface — Hover/Available 用 neutral-50/100 + border strong
```

| 表面 | 背景 | 边框 | 阴影 | 圆角 | 用途 |
|---|---|---|---|---|---|
| Surface 0 | layoutBg | — | 无 | — | 页面底 |
| Surface 1 | #FFFFFF | 1px default `#E2E8F0` | shadow-sm（可选） | radius-md 8 | Card / 表 / 表单容器 |
| Surface 2 | neutral-100 | 1px default | 无 | radius-md | 分组、斑马、inset |
| Elevated | #FFFFFF | 1px strong | shadow-md/lg | radius-lg 12 | Modal / Dropdown / Popover |

- 约束：默认平面 UI 用边框区分，阴影仅用于提升层级；Elevation 不滥用。

---

## 8. Spacing Contract

基于 **720 冻结 SPACING（8px 网格 + 语义化）**，建立统一容器与节奏：

| Token | px | 用途 |
|---|---|---|
| space-1 | 4 | 图标-文字间隙 |
| space-2 | 8 | 组内元素 |
| space-3 | 12 | 表单紧凑内边距 |
| space-4 | 16 | 卡片内边距 |
| space-6 | 24 | 区块内 / Card 间距 |
| space-8 | 32 | 版面区块间距 |
| space-10 | 40 | Section 紧凑 |
| space-12 | 48 | Section 标准 |
| space-16 | 64 | 大版面分区 |

- 页面内容 max-width 1280px 居中；Section 顶部 space-10/12。
- 移动端所有间距至少 space-2 起。

### 8.1 Web Container / Section Rhythm（726 契约新增产出）

```text
Page Container     max-width 1280px 居中（默认）
Wide Content Width 1480px（Hero 全宽内可含视觉场，内容仍受 1280 约束）
Reading Width      760-820px（内容/知识正文）
Grid Gap           space-6（24）横向 / space-8（32）纵向（页面级统一）
Mobile Padding     16px / Tablet 24px / Desktop 32px
```

- Section 统一节奏：`Section Start → Section Title(Level2) → Section Content → Section End`。
- **禁止**：随机 margin / 随机 padding / 页面级视觉参数漂移。

---

## 9. Layout Contract

**禁止**继续以 `Title → Card Grid → Card Grid → Card Grid` 作为主要页面构成。

### 9.1 业务页通用模板（冻结）

```text
Page Context（返回/标题/元信息）
→ Primary Task（主操作区）
→ Primary Content（主内容）
→ Supporting Information（辅助信息）
→ Secondary Action
```

### 9.2 Home 首页叙事流（冻结，可据现有业务内容调整）

```text
Brand Hero
→ Industrial Capability
→ Product/Category Discovery
→ Solution Discovery
→ Technical Knowledge
→ Workflow / Trust
→ Primary CTA
```

必须形成 **Narrative Flow**，而不是 **Component Stack**。

---

## 10. Icon Contract

- 建立统一 **Icon System**。
- **强制规则：M33 P0/P1 页面禁止业务视觉使用 emoji**，尤其：Admin Dashboard KPI / Operation Center / Navigation / Status / Action / Capability。
- 图标要求：consistent stroke/weight、consistent size、consistent alignment、semantic meaning、Token-compatible color。
- 禁止随意混用 emoji 与多套 icon visual language。
- **726 契约约束**：使用一种图标源（Web 侧与 Admin 侧各选一套，跨端语义一致）；替换边界在实施时定义，需保持零新增运行时 icon 库依赖（若需新增 icon 库须 Architecture Review 单独批准）。

---

## 11. Motion Contract

- 保持 **CSS-first**。不得新增 Framer Motion / GSAP / 大型 Animation Runtime。
- 允许：opacity、transform、color、shadow、page transition、hover、press。
- 要求：subtle、fast、functional、non-distracting。
- 保留 `prefers-reduced-motion`。
- 时长依据 `design-tokens.motion`：fast 120 / base 200 / slow 320；easing standard/enter/exit。

---

## 12. Component Contract

以下核心组件建立新视觉契约（每项含 Purpose / Visual Role / Surface / Spacing / Typography / Border / Radius / Shadow / Interaction（hover·active·focus·disabled）/ Responsive）：

允许清单（参数化值取 720 冻结 token）：`Button / Card / ProductCard / ProductGrid / Hero / SectionHeader / Badge / StatusTag / KPI-StatCard / Table / Filter / Pagination / Tabs / Drawer / Modal / Toast / EmptyState / ErrorState / LoadingState / Media / Navigation`。

- Button：primary/success/warning/error/default；radius-md 8；hover 用 primaryDark；focus-visible ring。
- Card：Surface 1；radius-md；内边距 space-4/space-6；标题 H3/H4。
- Badge/StatusTag：走 STATUS_TONE，radius-sm/full。
- Table：body 14、header neutral-700、斑马 surface 2、边界 default。
- Filter：表单紧凑 space-3，支持响应式折叠。
- Tabs/Drawer/Modal/Pagination：AntD 定制（Admin）+ Web 原生（Web），radius-md/lg。
- Empty/Error/Loading：品牌化，禁止裸文案。

---

## 13. ProductCard Contract（核心）

**ProductCard 从「普通商品卡片」升级为「Industrial Capability Card」**。

- 体现：Product Identity / Technical Capability / Key Parameters / Category / Availability-Status / Primary Action / Secondary Metadata。
- 视觉目标：Technical、Precise、Dense but breathable、Professional、Non-ecommerce。
- **禁止**：淘宝式商品卡 / 价格导向 / 营销角标堆叠 / 过度图片占比。
- 结构模板：顶部（StatusBadge + Category）→ 主体（Title+Capability 摘要）→ 参数行（Mono 数值）→ 底部（Primary Action + Secondary Metadata）。
- 响应式：375 单列、768 双列、1024/1440 三列（ProductGrid 统一栅格 24-16-12-12）。

---

## 14. Hero Contract

Hero 不得只是 `Banner + Title + CTA`，须含：Brand Context / Primary Value Proposition / Capability Context / Visual Anchor / Primary Action / Secondary Action。

- 允许：industrial grid、technical pattern、subtle depth、technical diagram language、controlled gradient、visual field。
- 必须 subtle、precise、low-noise、non-marketing。
- **禁止**：大面积营销渐变 / 过度动画 / 视频背景 / 复杂 WebGL / 高成本视觉运行时。

---

## 15. Web Page Contract（逐页）

> 每页含：Current Problem / Visual Objective / New Layout Structure / Visual Hierarchy / Surface Strategy / Typography Strategy / Component Strategy / Responsive Strategy / Before-State Reference / Acceptance Criteria。禁止只写「优化视觉/增加高级感/美化页面」。所有 Before-State 引用 `_725_shots/`。

### 15.1 Home — P0
- Current Problem：Component Stack（Hero+网格堆叠），层次弱、留白少。
- Visual Objective：Narrative Flow、工业纵深。
- New Layout：见 §9.2 Narratiive Flow。
- Surface：Surface 0 底 + Surface 1 区块 + Hero 深层面。
- Typography：Display/H1/H2/H3 四级；Hero Display 48。
- Component：HeroContract + SectionHeader + ProductCard + ContentCard。
- Responsive：375-1440 重组叙事节奏。
- Before：`web_home_1440.png` / `web_home_375.png`。
- Acceptance：VT-1 首页视觉结构显著变化。

### 15.2 Products — P0
- Current Problem：Filter/Grid/Category/Technical 视觉优先级弱。
- Visual Objective：Capability Discovery + Technical Comparison + Category Understanding + Parameter Recognition。
- New Layout：Filter 区 → 结果工具条（数量/排序/视图）→ ProductGrid → 状态/空态。
- Surface/Type/Component：ProductCardContract + Filter + Pagination。
- Responsive：375 抽屉筛选、768 双列、desktop 三列。
- Before：`web_products_1440.png` / `web_products_375.png`。
- Acceptance：VT-2。

### 15.3 Search — P0
- Current Problem：Query/Filter/Result 上下文不明显。
- Visual Objective：让用户明确「搜了什么/筛了什么/得到什么/为何重要」。
- New Layout：Query Context → Filter Context → Result Context → Result Quality。
- Before：`web_search_1440.png`。
- Acceptance：VT-3。

### 15.4 Product Detail — P1
- Current Problem：区块层次 + 参数表格普通 HTML table。
- Visual Objective：Identity→Capability→Parameters→Application→Related→Inquiry 的叙事。
- 技术要求：Parameter Group / Primary Parameter / Secondary Parameter / Technical Metadata / Responsive Table Strategy（窄屏横滚）。
- Before：Product Detail 截图（725 可补充）。
- Acceptance：P1 判定项（明细页层级+参数表格）。

### 15.5 Knowledge / Articles / Solutions — P1
- 统一内容视觉语言（Content Header / Metadata / Reading Width 760-820 / Content Typography / Related / CTA），**禁止三套视觉系统**。
- Before：`web_knowledgebase_1440.png` / `web_articles_1440.png`。

### 15.6 Workspace Dashboard — P1
- 仅视觉（Hierarchy / KPI / Navigation / Density / Empty / Action），不重构业务逻辑；保持 Buyer/Supplier/Admin 业务语义。
- Before：workspace 截图（725 可补充）。

---

## 16. Admin Page Contract（逐页）

Admin 目标 **Industrial Operations Console**（Operational / Dense / Precise / Readable / Professional / Controlled），不改为营销视觉。

### 16.1 Admin Login — P0
- Current Problem：品牌感不足（登录品牌化已初始增强，需细化）。
- Visual Objective：品牌识别 + 工业纵深（渐变/说明区细化）。
- Before：`admin_login_1440.png` / `admin_login_375.png`。

### 16.2 Admin Dashboard — P0
- Current Problem：KPI emoji、视觉层次弱、Card 堆叠、Chart 与 KPI 缺关系、空间利用率与纵深不足。
- Visual Objective：Executive KPI → Operational Trend → Business Activity → Operational Detail 层级。
- 关键动作：**KPI emoji 全清 → 统一图标**；Chart 与 KPI 建立关联布局。
- Before：`admin_home_1440.png` / `admin_home_375.png`。
- Acceptance：VT-4 + VT-6（emoji 全清）。

### 16.3 Admin List / Detail / Operation Center — P1
- Visual：表格视觉节奏、状态表达统一、五视图视觉层级。
- Before：对应截图（725 可补充）。

---

## 17. Responsive Contract

必须在 `375 / 768 / 1024 / 1440` 四视口验证非「不溢出」，而是 **Responsive Transformation（合理重组）**：

- Hierarchy / Spacing / Card composition / Typography / Navigation / CTA / Filter / Drawer / Table / Hero 均需合理重组。
- 目标：`Responsive Transformation` 而非 `Desktop Shrink`。
- 726 约束：重设计后仍保持 720-723 的无横向溢出（375/768/1024/1440）。

---

## 18. Accessibility Contract

M33 不得降低现有 Accessibility PASS。视觉重设计不得以牺牲可访问性换取「高级感」：

- Contrast ≥ 4.5:1（主文本）。
- Focus visible（rail/ring，增强 720 shadow/outline）。
- Keyboard navigation、Semantic structure、aria semantics、Reduced Motion 全保留。

---

## 19. Before/After Contract

- 继续使用 725 Before-State（`_725_shots/`）为基线。
- 流程：`Before → After → Difference → Acceptance`。
- **Visual Transformation 不得依赖 build/runtime/lint/TS PASS 证明**，必须证明 human-visible redesign。

---

## 20. Visual Transformation Gate（VT 门禁，冻结）

**最终 M33 走向 CONFIRMED 至少满足 VT-1..VT-12**：

| VT | 门禁项 |
|---|---|
| VT-1 | 首页视觉结构显著变化 |
| VT-2 | Products 视觉结构显著变化 |
| VT-3 | Search 视觉结构显著变化 |
| VT-4 | Admin Dashboard 视觉结构显著变化 |
| VT-5 | P0 核心组件视觉体系显著变化 |
| VT-6 | KPI emoji 全部清除 |
| VT-7 | Typography hierarchy 明显提升 |
| VT-8 | Surface hierarchy 明显提升 |
| VT-9 | Layout rhythm 明显提升 |
| VT-10 | Mobile composition 明显提升 |
| VT-11 | Token 单一事实源保持 |
| VT-12 | 无新增 backend/schema/API/business logic |

---

## 21. Anti-Cosmetic Gate（冻结）

以下行为**不能被认定为 M33 Visual Redesign**：只改颜色、圆角、阴影、字体、渐变、padding、换几个 icon、hover、Button。**若页面整体构成没有变化 → Visual Transformation = NOT CONFIRMED。**

---

## 22. Page Redesign Matrix（P0/P1/P2 冻结）

| 优先级 | 页面 |
|---|---|
| **P0** | Home，Products，Search，Admin Dashboard，ProductCard，Hero，KPI，Core Surface，Typography Hierarchy |
| **P1** | Product Detail，Knowledge，Articles，Solutions，Workspace，Admin List，Admin Detail，Operation Center，Status Components |
| **P2** | Empty State，Error State，Pagination，Modal，Drawer，Secondary Components，Micro Polish |

---

## 23. Component Redesign Matrix（冻结）

| 优先级 | 组件 |
|---|---|
| **P0** | ProductCard / ProductGrid，HeroSection，KPI StatCard（emoji→icon），Core Surface（Surface 0/1/2/Elevated），Typography System |
| **P1** | StatusTag / Badge 系，MediaImage / MediaGallery，SectionHeader，Table，Filter，Navigation，Toast |
| **P2** | EmptyState / ErrorState / LoadingState，Pagination，Modal / Drawer，Secondary Components，Micro Polish |

---

## 24. Token Gap Register

> 原则：现有 token 不足时**不得直接修改 `packages/design-tokens` 或 `docs/design-system`**，须登记到本 Register，交由 M33 implementation 前置的独立 Token 评估决定是否扩展。

| Gap ID | Token 域 | Current State | Required State | Reason | Impact | Recommendation | Implementation Stage |
|---|---|---|---|---|---|---|---|
| TG-01 | Surface 层级 | 仅 `surfaces.{layoutBg,cardBg,tableHeaderBg,siderBg,headerBg}` | 需显式 Surface 0/1/2/Elevated/Overlay 语义 token | §7 Surface 契约需要明确五个表面层级以支撑「靠表面+边框+阴影建立层次」 | 双端表面统一 | 在现有色值上命名化（在 `toCssVariables` 暴露前先评估，不改色值） | M33 P0 Foundation（ContractC 阶段回归确认） |
| TG-02 | Border 语义 | 仅 `border.color.{default,strong}` | 需 on-surface 边框（如 on-Surface-2）与 focus-ring 颜色 | §18 可访问性 focus visible | Focus 一致性 | 复用 primary 作为 focus ring（无需新色） | M33 P0 Foundation |
| TG-03 | Container 宽度 | 未在 token 层显式定义 | 需 maxWidth {content:1280,wide:1480,reading:760-820} | §8.1 容器约束需可 token 化 | Web 容器统一 | 在 Web tailwind config 或设计文档登记，不改 core token | M33 P0 Foundation / Web P0 |
| TG-04 | Icon 语义集 | 无 Icon system token（emoji 散落） | 需一套语义 Icon 命名（status/action/nav/capability） | §10 Icon Contract | KPI/导航图标统一、VT-6 | 选用单一 icon 源并 token 化 size/stroke；若需新增 icon 运行时库须独立 Architecture Review | M33 P0（Admin Dashboard / Web P0） |
| TG-05 | Data Numeric Emphasis | 依赖 Mono，色彩未规范化 | 需数字配色规则（neutral-800 + 状态色） | §5.2 numeric/technical | 参数/表格数据可读性 | 直接复用现有 status/neutral（无需新色）；登记排印上下文 | M33 P0 / P1 Detail |

> 以上 Gap 均为「命名化/语义化/范围化」，**不引入新色值** → 不需修改 core token 色值；任何真正新增色需独立评估。

---

## 25. Scope Boundary

### Allowed（Frontend Visual-Only）
`Frontend JSX/TSX / CSS / Tailwind classes / existing design tokens / existing component styling / layout composition / responsive composition / icon replacement / visual hierarchy / typography application / surface treatment / animation CSS / accessibility visual fixes`

### Forbidden
`Backend / API Contract / Database / Prisma / Schema / Migration / Matching / Search Logic / AI / RAG / Vector / Authentication Logic / Authorization Logic / Business Workflow / New UI Library / New Runtime Dependency / New Animation Runtime`

---

## 26. Anti-Scope-Expansion Gate

以下内容**不得**纳入 M33 Implementation（保持 Future Candidate）：Dark Mode、Search V2、AI、RAG、Vector Search、Supplier Search、Supplier Self-Service、Advanced CMS、Recommendation Engine、Buyer Inquiry Ownership、ProductForm DTO Expansion、Backend Refactor、Schema Refactor。

---

## 27. Dependency Constraint（冻结）

M33 不得新增：UI framework / component library / animation runtime / design system runtime / chart library / icon runtime，**除非未来单独 Architecture Review 明确批准**。本任务仅定义 Contract，不安装任何依赖。

---

## 28. Implementation Order（推荐顺序，本任务不执行）

```text
Foundation（Token Surface/Typography 语义对齐 + Container 统一）
→ Core Visual Components（ProductCard/Hero/KPI/Surface/Badge）
→ Web P0 Pages（Home → Products → Search）
→ Admin P0 Pages（Login → Dashboard）
→ P1 Pages（Detail/Knowledge/Workspace/Admin List·Detail·Operation）
→ P2 Polish（Empty/Error/Pagination/Modal/Drawer）
→ Visual QA
→ Before/After Verification
→ Closeout（processor: Pull VT-1..VT-12 + Anti-Cosmetic Gate）
```

---

## 29. Architecture & State Constraint

- 保持等价：`Code State = Documentation State = Architecture State = Roadmap State = Progress Snapshot State = Verified Visual State`。
- 本任务为 **Design Contract State**：`Contract = Documentation State`，但 `Contract ≠ Implementation`。

---

## 30. Impact Verification（本任务应无业务代码变更）

| 项 | 状态 |
|---|---|
| Schema | UNCHANGED |
| Migration | NONE |
| Backend | UNCHANGED |
| API | UNCHANGED |
| Matching | UNCHANGED |
| Search Logic | UNCHANGED |
| AI | UNCHANGED |
| Runtime Dependency | UNCHANGED |
| UI Library | UNCHANGED |

如发现意外修改 → **STOP**，不改企业自行修复。

---

## 31. Project Documentation Synchronization

- 上游：`docs/design-system/`、`docs/_review/719-725`、M33 roadmap/planning。
- 本任务新增：`docs/_review/726_*.md`（对应审查报告）+ 同步 PROJECT_STATUS / PROJECT_ROADMAP / MODULE_COMPLETION_MATRIX。
- 关系不变量：`725 Audit → 726 Contract → Future M33 Implementation`；726 不得重定义 725 审计事实。

---

## 32. Contract 交付物检查清单

- [x] 1 Executive Design Goal
- [x] 2 Baseline
- [x] 3 Brand Direction
- [x] 4 Visual Personality
- [x] 5 Typography Contract
- [x] 6 Color Contract
- [x] 7 Surface Contract
- [x] 8 Spacing Contract
- [x] 9 Layout Contract
- [x] 10 Icon Contract
- [x] 11 Motion Contract
- [x] 12 Component Contract
- [x] 13 Web Page Contract
- [x] 14 Admin Page Contract
- [x] 15 Responsive Contract
- [x] 16 Accessibility Contract
- [x] 17 Before/After Contract
- [x] 18 Visual Transformation Gate
- [x] 19 Page Redesign Matrix
- [x] 20 Component Redesign Matrix
- [x] 21 Token Gap Register
- [x] 22 Scope Boundary
- [x] 23 Implementation Order
- [x] 24 Acceptance Criteria（VT-1..VT-12 + Anti-Cosmetic）
- [x] 25 Future Candidate Register

### Future Candidate Register（继承，未新增未实现）
Admin Bundle 分包 / Dark Mode / Advanced Animation / Advanced Accessibility / Advanced Recommendation / Advanced CMS / Search V2 / AI / RAG / Vector / Supplier Search / Supplier Self-Service / Buyer Inquiry Ownership / ProductForm DTO expansion（14 项）。

---

## 33. Final Acceptance Criteria 自评（726 判 PASS 依据）

- [x] A. 725 已完整读取
- [x] B. M32 = CLOSED
- [x] C. M33 = PLANNING
- [x] D. Visual Direction(725) → Executable Visual Contract(726)
- [x] E. P0/P1/P2 页面范围明确
- [x] F. 核心组件视觉契约明确
- [x] G. Typography/Color/Surface/Spacing/Layout/Icon/Motion 契约明确
- [x] H. Before/After 验收标准明确
- [x] I. Visual Transformation Gate 明确
- [x] J. Anti-Cosmetic Gate 明确
- [x] K. Token Gap 单独登记，未擅自修改
- [x] L. Backend/Schema/API/Matching/Search/AI 全冻结
- [x] M. 无新增依赖
- [x] N. 未进入 M33 Implementation
- [x] O. `docs/_review/726_*.md` 已生成

---

## 34. STOP Condition

本 Contract 完成后 **STOP**。禁止：开始修改 Home/Products/Admin Dashboard、替换组件、修改 CSS、安装 icon/UI library、新增 design-system package、修改 Token。这些全属后续 Implementation Task。

---

> 终稿声明：本文件为 **M33.0 Visual Design Contract（Formal Specification）**，自 `docs/_review/726_*.md` 审查报告与 PROJECT_* 文档同步后生效，作为 **M33 Visual Redesign Implementation — P0 Foundation** 的输入。