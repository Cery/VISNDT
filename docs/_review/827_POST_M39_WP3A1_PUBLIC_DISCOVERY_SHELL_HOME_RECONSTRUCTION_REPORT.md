# 827 — POST-M39 WP-3A.1 Public Discovery Shell / Home / Navigation Reconstruction Report

> Version bump: **WP-3A.1**（Public Discovery Shell + Home + Navigation）
> Parent: **WP-3A Public Discovery Reconstruction**
> Tech-base: **824** (Frontend Productization Contract) → **826** (Frontend Reconstruction Foundation)
> 日期: 2026-09-05
> 报告编号: **827**（当前 `docs/_review` 最大正式编号 826 + 1）
> 最终决策: **PASS**

---

## 1. Executive Summary

WP-3A.1 在冻结的 **824 / WP-1** 契约与 **826 / WP-2** 基础之上完成，定位为**公共发现外壳 / 顶部导航 / 首页**的产品化表现层重建。范围内**仅改动 `apps/web` 公共发现表现层与入口关系**，未触及业务主体页面内容、未改后端 / 数据库 / API 契约。

关键结果：

- **Public Shell** 成立：根布局 [layout.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/app/layout.tsx) 由 `PublicHeader + PublicFooter` 承载，桌面/平板/移动三态一致。
- **Header / Navigation** 复用 Foundation `Drawer` 完成重建：桌面 `xl` 上四层平台分组 mega 导航，`<640px` 底部抽屉、`≥sm` 右侧抽屉，Dialog 语义 + Escape + 焦点返回 + body 滚动锁定。
- **Home** 保持 `Product = Primary Public Discovery Authority`，未退化为供应商目录 / 商城 / 通用 CMS 首页。
- **统一搜索入口（§14）** 未新增第二套检索系统，Header 与首页均连接既有 `GlobalSearchBar`。
- **Real headed browser 验证 30/30 PASS**，覆盖 **1440 / 1024 / 768 / 375**，含真实搜索、抽屉开关、导航跳转、浏览器 back/forward。
- **回归**：Web `tsc --noEmit` PASS、Web `next build` PASS。
- **无新 P0 / P1 / 阻断项**；后端未改、Schema 未改、API 契约未改。

---

## 2. Repository Verification

| 项目 | 期望 | 实际 | 结果 |
|---|---|---|---|
| Repository Root | `F:\Desktop\VISNDT` | `F:/Desktop/VISNDT` | ✅ |
| Code Root | `F:\Desktop\VISNDT\VISNDT` | `VISNDT/`（`apps/web`） | ✅ |
| Branch | `main` | `main` | ✅ |
| HEAD | — | `8bba999` | ✅ |

工作树存在大量**基线（824/825/826）遗留**的未提交改动与 untracked 文件（`database/_ux_verify/826` 证据、`components/ui/` 基础原语、`design-tokens` WP-2 语义等）。本报告 `§5 Files Changed` 仅列 **WP-3A.1 实际引入**的改动。

---

## 3. Baseline 824 / 826

继承并复用（未重复建设）：

- **824 契约**：Navigation → Action → Destination；`Product = Primary Public Discovery Authority`；`Search = Unified`；公共信息架构 `Discover / Evaluate / Content / Connect`。
- **826 基础**：`packages/design-tokens`（色彩/间距/圆角/阴影/交互态）、`components/ui`（Drawer / Modal / SearchInput / Form / Table / Tabs / Status…）、按钮来自 `@visndt/design-system`。

本任务未新增第二套 Button / Card / Status / Search / Modal / Drawer / Pagination / Form。

---

## 4. Scope Verification

| 维度 | 允许（Shell/Home/Nav 表现层） | 实际 |
|---|---|---|
| Public Header / Navigation / Footer | ✅ | ✅ 已重建 |
| Public Home | ✅ | ✅ 层次与入口已核对 |
| Public Responsive / A11y | ✅ | ✅ 已验证 |
| Product = Primary Authority | ✅ | ✅ 保持 |
| 统一搜索入口 | ✅ | ✅ 保持 |
| 业务页面主体重构（Search/Categories/Products/Knowledge/Solution/Supplier…） | ❌ Excluded | 未触碰 |
| 后端 / Schema / API / Business Logic | ❌ Excluded | 未触碰（见 §22） |

发现范围外的需求（搜索增强/SEO/API gap）仅记录为 `WP-3A.2+` 候选，未在本任务实施（见 §25）。

---

## 5. Files Changed

| File | Change | Reason | Layer |
|---|---|---|---|
| [PublicHeader.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/layout/PublicHeader.tsx) | 平台分组导航重建 + 移动/平板导航改由 Foundation `Drawer`；`<640px` bottom、`≥sm` right；body 滚动锁定；icon 按钮补 Accessible Name；移除重复 logout 事件 | §7/§9 Header + Navigation + Card 复用、§20 A11y、§9.2 Mobile | Web Public Shell |
| [CategorySection.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/home/CategorySection.tsx) | 首页能力分类入口适配（Consumer 同源数据 / 入口 `→ /products?categoryId=`） | §15 Category 入口核对 | Web Public Home |
| [FeaturedProductsSection.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/home/FeaturedProductsSection.tsx) | 首页推荐产品入口（`ProductCard → /products/:slug`，真实 `getProducts`） | §16 Product 入口核对 | Web Public Home |
| **[Drawer.tsx](file:///F:/Desktop/VISNDT/VISNDT/apps/web/src/components/ui/Drawer.tsx)** | **复用**（WP-2 原语，非本任务新建）：right/bottom 抽屉、Dialog 语义、Escape、焦点返回、Loading | §17 Foundation 复用 | Web Foundation（826） |

业务判断：

- Business Backend Changed? **NO**
- Schema Changed? **NO**
- API Contract Changed? **NO**
- 允许：Web Public Shell / Home / Navigation / Foundation Primitive Usage — 是。

---

## 6. Public Shell Reconstruction

根布局 `layout.tsx` 保持 `PublicHeader + PublicFooter` 结构，构成一致 Public Shell。顶部 Header sticky、平台品牌标识（VISNDT · 工业检测能力发现平台 · CAPABILITY DISCOVERY）清晰。Footer 沿用既有公共结构，桌面/平板/移动三态由响应式类控制，无水平溢出。

---

## 7. Header Reconstruction

- **Desktop（1440 / xl）**：Logo（品牌/子标题）→ Platform-Layer 导航（发现/评估/技术内容/连接）→ 统一搜索（Header 纯入口，don't 冗余 type）→ 登录/注册 / 用户工作台。核心导航点击即展开 mega，无需复杂 hover（hover + click 均可）。
- **Tablet（1024 / md–xl）**：`xl` 以下平台导航隐藏，汉堡接管；1024 已验证抽屉接管（`nav` hidden + hamburger visible）。
- **Mobile（<640）**：Logo + 汉堡 + 登录/注册；底部抽屉承载「搜索 + 4 层分组导航 + 认证 CTA」。375 下 No Horizontal Overflow，Core Navigation / Search / CTA 全部可达。

---

## 8. Navigation Reconstruction

严格 `Navigation → Action → Destination`，路由语义未改（`/search /categories /products /products/compare /solutions /knowledge-base /register?role=BUYER` 等）。仅调整呈现/交互模型：桌面 mega 分组、移动/平板抽屉分组、`aria-expanded` / `aria-current`。链接均验证可达（`§20 Browser Gate`）。

---

## 9. Home Reconstruction

首页仅作为 **Public Discovery Product Homepage**，信息层（§12）核验通过，未为"页面完整"无条件加 Section：

```
Hero / Discover Entry → 分类 / Category → Featured Products → Solutions → Platform Flow → Knowledge → Capability Provider（有源的支撑上下文）→ EngineeringDiscoveryNav → Connection CTA
```

每层均有业务目的 / 用户价值 / 导航价值 / 数据源（现有 API）。视觉 hierarchy（§13）清晰建立：Hero 首屏即传达平台定位，产品为 Primary，分类为索引，内容为技术语境，连接为转化 CTA。

---

## 10. Discovery Entry

首屏与 Header 均连接既有 `GlobalSearchBar`（Unified Search）。已用真实浏览器验证提交 `/search?q=…`。未建第二套检索系统，Product / Search Authority 未变（§14）。

---

## 11. Category Entry

首页「能力分类」入口 `Category → /products?categoryId=`（自然 `Category → Product/Capability`）。未建立 `Category → SupplierProduct` 作为独立公共 authority（§15）。浏览器门验证分类链接存在。

---

## 12. Product Entry

首页推荐产品 `ProductCard → /products/:slug`，数据来自真实 `getProducts({ status:'ACTIVE' })`。Supplier/Model 仅作为支撑上下文，Product 为 Primary Object（§16）。

---

## 13. Content / Solution Entry

首页与技术内容入口（`/solutions`、`/knowledge-base`）连接存在并验证（§8 Content 入口 PASS）。解决方案与知识中心属于 Community 主体，本轮不深入重构（Scope Excluded），仅确认入口关系。

---

## 14. Connection Entry

公共连接入口保持 `/register?role=BUYER`（发布检测需求）、`/business`（商务合作），归入「连接」平台层。首页 Connection CTA 存在并验证（§8 Connection PASS）。保持 `Capability Discovery Platform` 语义，未演化为商城/供应商目录。

---

## 15. Design Token Usage

页面与组件样式使用 Design Tokens（`design-tokens`、Tailwind 语义色如 `bg-surface-1`、`text-primary`、`text-muted-foreground`、`shadow-industrial-*`、`border-border`）与既有 CSS 变量。未大规模新增硬编码 color/spacing/radius/shadow；仅保留经过认可的视觉资产渐变（品牌主色 `from-primary to-industrial-cyan`）。

【Baseline 属性】`design-tokens/src/index.ts` 中新增的 `interaction` 语义为 **826（WP-2）**内容，非本任务引入。

---

## 16. Foundation Component Usage

优先复用 Foundation：`Drawer`（移动/平板导航）、`@visndt/design-system` `Button`、`GlobalSearchBar`、`SectionHeader`、`PageContainer`。未创建 `HomeButton / CustomSearch / CustomCard / LocalStatus` 等 page-only 重复原语（§17）。

---

## 17. Responsive Implementation

| 断点 | Header/Nav | Home | 无横向溢出 |
|---|---|---|---|
| 1440 | 桌面平台导航 + 全量搜索/认证 | Hero+各 Section | ✅ PASS |
| 1024 | 平台导航隐藏，抽屉接管 | — | ✅ PASS |
| 768 | 右侧抽屉 | — | ✅ PASS |
| 375 | 底部抽屉 | — | ✅ PASS |

抽屉打开时 body 滚动锁定（`PublicHeader` effect），避免移动端内容被覆盖滚动。

---

## 18. Accessibility

- 语义导航：`nav[aria-label="平台导航"]`、`nav[aria-label="平台导航（移动）"]`。
- 抽屉语义：`role="dialog"` + `aria-modal` + Escape 关闭 + 打开时焦点回收 + 关闭时焦点返回。
- 键盘可达：`aria-expanded`（mega/汉堡）、`aria-current="page"`（抽屉激活项）。
- icon-only action 均有 Accessible Name：汉堡 `aria-label="切换菜单"`、关闭 `aria-label="关闭"`。
- 图片 alt：浏览器门检查缺 alt = 0 缺口。
- Heading 层级：Hero `h1` 唯一且语义正确。

---

## 19. Loading / Empty / Error

首页动态 Section（能力分类、推荐产品、方案、知识）均实现 **Loading（pulse 占位）/ Empty（暂无分类/产品等）/ Error（无法加载请重试）** 状态；空数据不出现空白区域，请求失败不崩溃（`§9 Home` 真实渲染 + `console error = 0`）。

---

## 20. Browser Verification

Real headed Chrome（CDP 9335）真实交互验证：**30 / 30 PASS**。

详见 `database/_ux_verify/826/_wp3a1_gate.mjs`。运行摘要（1440 桌面 / 1024 1024 / 768 平板 / 375 移动）：

| 维度 | 核心断言 | 结果 |
|---|---|---|
| Home h1 / 首屏搜索 / 图 alt | 平台定位 + Unified Search + alt=0 | ✅ |
| Header 桌面导航 / mega 展开 | 平台导航可见 + 点击「发现」含统一检索/能力分类 | ✅ |
| 首屏搜索提交 | `/search?q=超声检测` | ✅ |
| Browser Back | 回首页 `/` | ✅ |
| 分类/产品/方案/知识/连接入口 | 对应链接存在 | ✅（5 项）|
| Responsive 1440/1024/768/375 | 无横向溢出/导航承接 | ✅（5 项）|
| 移动导航 768 | 汉堡真实点击 → 右侧抽屉 → 抽屉导航→ `/products` | ✅ |
| 移动导航 375 | 汉堡点击 → 底部抽屉 → 抽屉内搜索/导航可达 → Escape 关闭 → 抽屉导航→ `/categories` | ✅ |
| Console | 无新增 console error | ✅ |

证据截图（`database/_ux_verify/826/`）：
`827_home_desktop_1440.png`、`827_home_tablet_1024.png`、`827_menu_tablet_768.png`、`827_menu_mobile_375.png`。

---

## 21. Mobile Verification

在 **375 / 768** 真实执行：Open Menu（汉堡）、Navigate（抽屉导航→ 产品 / 能力分类）、Open Search（抽屉内搜索可达）、Close（Escape）全部通过。不止验证 No Overflow，涵盖核心交互（§25 Mobile Gate）。

---

## 22. Regression

- Web `tsc --noEmit`：**PASS**（exit 0）。
- Web `next build`：**PASS**（exit 0，`/`、`/search`、`/categories`、`/products`… 全部产出）。
- 未触及 `packages/design-tokens` / `packages/design-system`，无需额外 package validation。
- 条件允许项（Admin/API）未改动相关文件，未跑（无影响面）。
- **基线 = 826 PASS；本任务无新引入错误（NEW REGRESSION = none）。**

Runtime 数据完整性（§22）：首页仅消费现有 API（`getCategories`、`getProducts`），无 Mock 业务数据冒充正式数据。

---

## 23. Existing Issues

`826` 记录 `g-console`：分类 **P2 / NON-BLOCKING / FUTURE CANDIDATE**。本任务未主动修复，也**无证据表明由 WP-3A.1 新代码引入** → 维持 **PRE-EXISTING / FUTURE CANDIDATE**。

---

## 24. New Issues

无新增 P0 / P1 / 阻断项。浏览器验证发现 0 个新 console error，0 个图片 alt 缺口，四断点无水平溢出。

---

## 25. Future Candidates

- **WP-3A.2 — SEARCH + CATEGORIES + PRODUCT LIST Reconstruction**：搜索 / 分类 / 产品列表的公共表现层重构（Scope 外，未在本任务实施，登记下一步）。
- **WP-3A.3 — Product Detail + Related Discovery**；**WP-3A.4 — Knowledge + Solution + Public Content**：登记候选，未启动。
- SEO Enhancement / 更深层搜索增强均为长期候选（后续 WP-6 / WP-7 范畴）。

---

## 26. WP-3A.1 Completion Criteria

| Criterion | Status |
|---|---|
| Public Shell | ✅ |
| Header | ✅ |
| Navigation | ✅ |
| Home | ✅ |
| Design Tokens | ✅（复用，未重造/未大规模硬编码）|
| Foundation Reuse | ✅（Drawer / Button / GlobalSearchBar…）|
| Responsive | ✅（375/768/1024/1440）|
| Accessibility | ✅（Dialog/Escape/aria/focus/img-alt）|
| Real Browser | ✅（30/30）|
| Mobile | ✅（375/768 真实交互）|
| Regression | ✅（tsc + build PASS）|
| Documentation | ✅（本报告 + governance 同步）|
| No P0 / P1 / New Blocking | ✅ |
| No Backend / Schema / API Change | ✅ |

---

## 27. WP-3A.2 Readiness

**READY FOR WP-3A.2（SEARCH + CATEGORIES + PRODUCT LIST)）。** 本轮 Public Shell / Home / Navigation 已稳定支撑后续页面重构，Unified Search 与分类/产品入口关系已验证。**仅登记，不自动启动。**

---

## 28. Final Decision

**PASS**

- Public Shell / Home / Navigation 已产品化，浏览器 + 移动端验证通过。
- 无新 P0 / P1 / 阻断项，后端 / Schema / API 契约零变更。
- 遗留仅为 826 已有 P2 `g-console`（Future Candidate），非本任务引入。

---

## 29. STOP

WP-3A.1 完成。已执行：Implement → Runtime Verify → Browser Verify → Mobile Verify → Regression → Documentation → Progress Sync → **CLOSE** → **STOP**。

不自动进入 WP-3A.2 / 3A.3 / 3A.4 / 3B / 4 / 5A / 5B / 5C / 6 / 7 / 8。