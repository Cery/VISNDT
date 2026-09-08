# 首页 + 全局 Header/Footer 重构方案（工业蓝图设计语言 / 真实数据驱动）

## Context（背景）
用户提供静态设计稿 `f:\Desktop\VISNDT\VISNDT\visndt_home_redesign.html`（一套「工业工程蓝图」视觉语言：paper/graphite/amber/verdigris、Noto Sans SC + JetBrains Mono、2px 圆角、坐标原标记）。目标是把该设计**一比一复刻到 Next.js 首页，并让全局 Header/Footer 采用同一设计语言**。

已与用户确认的决策：
- **真实数据驱动**：视觉/布局 1:1 复刻；内容（分类、产品、方案、知识、指标）一律接真实 API，不伪造数据。
- **作用域**：首页 + 全局 Header/Footer 换新设计语言；内页内容区块沿用原有 `industrial` 体系。
- **Hero 右侧「内窥镜工作原理」工程示意图 SVG 原样保留**。
- 保留用户此前要求的**两行粘性 Header**（上：Logo+搜索+登录/注册；下：导航行）+ 移动端抽屉同步。
- **无源数据不省略，一律用「真实替补」并在落地后单独写入补漏报告**（见 Phase 7）。

## 关键数据约束（已核实）
- 无任何公开「供应商数量」或「平均询价响应时长」统计接口。
- `ProductCategory` 只有 `id/name/slug/parentId/children`，**无 description** → 分类注册表「描述」需要真实替补。
- 真实可用数据源：`getProducts`（含 total）、`getProduct(id)`（含 offers[].organization = 制造方、parameterValues[]）、`getCategories`、`getContentList({type:SOLUTION|KNOWLEDGE})`、全局搜索 supplier-discovery（可能含供应商 total，实施时验证，若无则降级）。
- 无源数据的三处真实替补口径（写入报告 854-01~03）：
  - **供应商数** → `supplier-discovery` 搜索 `total`（真实聚合公开已发布供应商）；不可用时降级为「近 N 款上架型号覆盖 M 家供应组织」（基于所取产品的 offers[].organization 去重，诚实不夸大）。
  - **平均询价响应时长** → 无统计源：槽位保留，显示「询价闭环实测」标签 + 数值位放「—」，不伪造数字；后续由询价数据补 → 记入报告为待补指标。
  - **分类描述** → 真实替补 = 该分类旗下产品数（`getProducts({categoryId,pageSize:1})` → total），展示为「N 款检测产品」；不可用时回退 `slug`。

---

## Phase 1 — 设计令牌与字体（两套并存）

### tailwind.config.ts `theme.extend` 新增 `blueprint.*` 命名空间（不触碰现有 `industrial`/`primary`）
```ts
colors: {
  blueprint: {
    paper: '#ECE8DE', 'paper-2': '#E1DCCE',
    graphite: '#1B1F24', 'graphite-2': '#262C33', steel: '#3D4A56',
    ink: '#20242A', 'ink-soft': '#565F68',
    line: '#C9C2B0', 'line-dark': '#3A4149',
    amber: '#CE8A2E', 'amber-deep': '#A96F1F',
    verdigris: '#4F7A6E', 'verdigris-soft': '#DDE6E1',
  },
},
borderRadius: { blueprint: '2px' },
screens: { xm: '860px' },            // 对齐设计稿断点
fontFamily: { sans: ['var(--font-noto-sans-sc)','var(--font-inter)','system-ui','sans-serif'] },
```
页脚 `#161A1E` 不在令牌内 → 用 `bg-[#161A1E]`。

### globals.css `@layer utilities` 增加坐标原标记 `.reg`
照搬设计稿 `.reg::before/::after` 四角标记（9px、currentColor、opacity .55、pointer-events:none）。

### src/app/layout.tsx 加载 Noto Sans SC（保留 Inter）
`Noto_Sans_SC`（`next/font/google`，`variable:'--font-noto-sans-sc'`），加入 `<html>` className。中文走 Noto、内页回退 Inter；`mono` 已是 JetBrains Mono，符合设计稿。

## Phase 2 — Header 换肤（PublicHeader.tsx）· 仅换色不动逻辑
保留：两行 sticky、NAV_ENTRIES 扁平导航（7 项）、role-aware 路由、登录/注册/工作台/退出、移动抽屉、搜索。
改动：
- 外层 `bg-white/95 … shadow` → `bg-blueprint-paper/95 backdrop-blur-sm border-b border-blueprint-line`；所有 `border-slate-100` 分隔线 → `border-blueprint-line`。
- Logo 替换为设计稿 mark（30×30：rect `#20242A` + circle `#CE8A2E` + 十字线），文字 `VIS<NDT>`，`NDT` 用 `text-blueprint-amber-deep`。
- 按钮统一扁平：实心 `rounded-blueprint bg-blueprint-graphite text-blueprint-paper`、幽灵 `rounded-blueprint bg-transparent text-blueprint-ink border border-blueprint-line`、主 CTA/头像用 `bg-blueprint-amber`。
- **导航行**（现 `bg-slate-900`）→ `bg-blueprint-graphite text-blueprint-paper`；激活下划线 `bg-blueprint-amber`。
- 抽屉文案色 → `text-blueprint-ink` / 激活 `bg-blueprint-amber/10 text-blueprint-amber-deep`。

## Phase 3 — Footer 换肤（PublicFooter.tsx）· 复用 FOOTER_SECTIONS
- 外层 `bg-industrial-dark` → `bg-[#161A1E]`；Logo `NDT`→`text-blueprint-amber`；标题 `text-[#D8D3C6]`；链接 `text-[#8B9198] hover:text-[#D8D3C6]`；分隔线 `border-[#2A3037]`。
- 保留现有 5 列（发现/产品/方案/连接/平台）以保住全部路由入口；`lg:grid-cols-[1.4fr_repeat(4,1fr)]` 收紧对齐设计稿。

## Phase 4 — 首页重建（src/components/home/ 新组件）
新增共用 `src/components/common/BlueprintContainer.tsx`：`max-w-[1180px] mx-auto px-7`（对齐设计稿 wrap）。
`src/app/page.tsx` 渲染新版顺序（6 组件）：

| 新版块 | 数据源（真实） | 关键实现 |
|---|---|---|
| `HomeHero.tsx`（石墨底） | 产品总数 `getProducts({status:'ACTIVE',page:1,pageSize:1})` → `total`；供应商数 `supplier-discovery` total（见约定）；响应时长真实替补 | h1/lede/检索(GlobalSearchBar)、**原样内嵌工程示意图 SVG**；**3 格指标条全保留**：①产品总数 `+`，②供应商数（supplier-discovery total，降级用 M 家组织），③「询价闭环实测 / —」——全为真实值或诚实标签，不伪造 |
| `CategoryRegisterSection.tsx`（纸底） | `getCategories(1,6)` + 每分类产品数 | 注册表行 CAT.0x/名称/**真实替补描述（N 款检测产品）**/箭头；`Promise.all` 对该 6 分类并发 `getProducts({categoryId,pageSize:1})` → total；链接 `/products?categoryId=<id>` |
| `RecentProductsSection.tsx`（纸二底） | `getProducts(ACTIVE,3)` + `getProduct(id)×3` | 数据表卡：名称 / 制造方(offers[].organization.name) / 参数表(parameterValues 前4) / 状态标签 / 查看详情 `/products/<id>`；视觉取 primaryMedia，缺图用 mono 标签兜底；**角标不虚构** |
| `SolutionFlowSection.tsx`（纸底） | STEP 01-04 静态品牌文案；场景卡 `getContentList({type:'SOLUTION',pageSize:3})` | flow 1:1；场景卡 title/desc/tags[].tag.name → chips，链接 `/solutions/<slug>` |
| `KnowledgeIndexSection.tsx`（纸二底） | `getContentList({type:'KNOWLEDGE',pageSize:5})` | 行：mono tag(KNW.0x 或 tags) / title / desc / 箭头 → `/knowledge-base/<slug>` |
| `CTASection.tsx`（石墨底） | 静态 | 左文案 + `btn-amber`提交(→`/workspace/demands/create`) + ghost 浏览(/products)；右 mini-form 为需求创建入口，提交同样引到创建页 |

## Phase 5 — 响应式（别名 `xm` = 860px）
- hero 网格 `grid-cols-1 xm:grid-cols-[1.05fr_0.95fr]`，图 <860px 时 `order-first`（对齐设计稿 `order:-1`）。
- 产品/场景网格 `grid-cols-1 xm:grid-cols-3`；CTA 网格 `xm:grid-cols-2` 否则 1 列；页脚移动 2 列。
- 两行 Header：`sticky top-0 z-50` 不变，导航行仍 `hidden xl:block`（移动进抽屉），抽屉用 paper 色系。

## Phase 6 — 验证
1. `tsc --noEmit`（在该 app 目录）。
2. 运行 `npm run dev`（或既有 dev 脚本），打开 http://localhost:3000。
3. 逐块核对视觉 + 数据：两行 header 粘性；hero 图 <860 置顶；注册表行→`/products?categoryId=…`；产品卡真实制造方/参数；场景卡真实方案→`/solutions/<slug>`；知识行→`/knowledge-base/<slug>`；CTA/mini-form；footer。
4. 回归：登录/注册/工作台/退出、role-aware 采购需求/供应能力、`/products`、`/categories`、`/solutions`、`/knowledge-base`、`/products/compare` 仍可用（内页视觉仍走 industrial）。

## 关键文件
- 改：`apps/web/tailwind.config.ts`、`src/app/layout.tsx`、`src/components/layout/PublicHeader.tsx`、`src/components/layout/PublicFooter.tsx`、`src/app/page.tsx`
- 新：`src/components/common/BlueprintContainer.tsx`、`src/components/home/{HomeHero,CategoryRegisterSection,RecentProductsSection,SolutionFlowSection,KnowledgeIndexSection,CTASection}.tsx`
- 参照源：`f:\Desktop\VISNDT\VISNDT\visndt_home_redesign.html`（所有 SVG/文案/结构照此复刻）