# VISNDT 工业平台 UI 重设计方案 v2.0

## 背景

VISNDT Web 前端工业风 UI 重设计已按 v1.0 计划完成 Phase 1-8，覆盖了设计基础、全局布局、首页、卡片系统、产品列表、内容页、认证页和全局动画。当前版本对标 Keyence / Zeiss Industrial / Fluke 等工业平台，建立了**精密、专业、技术感**的视觉语言。

本 v2.0 方案基于项目实际完成度，将重点转向**工作区/仪表盘、详情页、边缘页面和移动端适配**的工业风打磨。

## 设计目标

- 仅修改 CSS 和 Tailwind 类名，不改变任何代码逻辑
- 保持首页 HeroSection 完全不变（已确认的最终设计）
- 统一全站工业设计语言，消除"通栏不协调""工作区风格分裂"等问题
- 建立移动端响应式审查机制

---

## 已完成阶段（Phase 1-8，保留作为参考）

### Phase 1: 设计基础 ✅
- `globals.css`：工业色变量（`--industrial-cyan/amber/slate/dark`）、增强阴影、fade-in/slide-up 动画
- `tailwind.config.ts`：`industrial` 色板、Inter + JetBrains Mono 字体、industrial-sm/md/lg 阴影、grid-pattern/dot-pattern 背景
- `layout.tsx`：Google Fonts 引入、`<html className="font-sans">`

### Phase 2: 全局布局 ✅
- `PublicHeader.tsx`：毛玻璃效果 `bg-white/95 backdrop-blur-sm`、`shadow-industrial-sm`、渐变文字 Logo、`h-18` 高度、激活态底部指示条、渐变注册按钮
- `PublicFooter.tsx`：`bg-industrial-dark` 深色页脚、品牌区、`border-t border-white/10`

### Phase 3: 首页重设计 ✅
- `HeroSection.tsx`：**保持不变（最终设计）** — 深色背景 + 网格图案 + 光晕 + 渐变按钮 + 角色入口
- `CategorySection.tsx`：`shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1`、渐变图标区
- `FeaturedProductsSection.tsx`：`bg-industrial-slate` 背景、`py-20` 间距
- `SolutionsSection.tsx`：卡片 hover 效果、渐变图标
- `PlatformFlowSection.tsx`：步骤编号徽章、箭头连接器
- `InquiryCTA.tsx`：`bg-dot-pattern` 点阵、渐变按钮

### Phase 4: 卡片系统统一 ✅
- `ProductCard`（两个文件）：`shadow-industrial-sm hover:shadow-industrial-lg hover:-translate-y-1`、`font-mono` 型号、`bg-primary/10` 分类标签
- `ContentCard`：统一阴影和 hover 效果
- `business/page.tsx`：`bg-emerald-100 text-emerald-700` 圆角徽章

### Phase 5: 产品列表页 ✅
- `SearchBar`：渐变搜索按钮、`focus:ring-2 focus:ring-primary/30`
- `ProductFilter`：选中态 `border-l-2 border-primary`
- `Pagination`：当前页 `bg-gradient-to-r from-primary to-industrial-cyan`
- `ProductGrid`：骨架屏匹配新卡片样式

### Phase 6: Section 交替模式 ✅
- 所有内容页（solutions/knowledge/business/about）Hero 区：`bg-industrial-dark` + `bg-grid-pattern` + 光晕

### Phase 7: 认证页面 ✅
- `login/page.tsx` + `register/page.tsx`：`bg-industrial-slate` 外层、`shadow-industrial-lg` 卡片、`h-1 bg-gradient-to-r` 顶部装饰、渐变提交按钮

### Phase 8: 全局动画 ✅
- `animate-fade-in`、`animate-slide-up` 已应用于各 section 标题区域

---

## 新增阶段（Phase 9-18）

### Phase 9: 工作区与仪表盘工业风打磨

**当前问题：**
- 工作区页面使用 `shadow-sm`（非工业阴影）、`border-slate-200`（无工业感）
- 仪表盘使用 emoji 图标（📋📄🔗），与工业平台定位不符
- 缺少渐变背景、光晕效果等工业元素

**9.1 Buyer Dashboard (`dashboard/buyer/page.tsx`)**
- 页面顶部：添加 `bg-gradient-to-r from-industrial-dark to-slate-900` 仪表盘横幅
- 统计卡片：`shadow-industrial-sm hover:shadow-industrial-md`、图标改为 SVG 工业图标
- 业务导航卡片：`hover:border-primary/30` 改为 `hover:border-industrial-cyan/30`
- 左侧彩色指示条：`w-1 h-5 bg-primary` 改为 `bg-gradient-to-b from-primary to-industrial-cyan`

**9.2 Supplier Dashboard (`dashboard/supplier/page.tsx`)**
- 同上，统一工业风统计卡片和导航
- 快捷操作区：emoji 图标替换为 SVG 工业图标
- 响应跟踪区：StatCard 使用工业阴影

**9.3 Workspace Entry (`workspace/page.tsx`)**
- 卡片：`shadow-sm` → `shadow-industrial-sm`
- 链接：`hover:border-slate-300` → `hover:border-industrial-cyan/30 hover:shadow-industrial-md`

**9.4 WorkspaceLayout (`components/layout/WorkspaceLayout.tsx`)**
- 主内容区：`bg-slate-50` → `bg-industrial-slate`
- 已含 `max-w-[1200px]`，保持不变

**9.5 Workspace Sidebar & Header**
- 侧边栏选中态：`bg-primary/10` → `bg-gradient-to-r from-primary/10 to-industrial-cyan/5`
- 用户头像：`bg-slate-200` → `bg-gradient-to-r from-primary to-industrial-cyan`

---

### Phase 10: 产品详情页工业风提升

**10.1 ProductDetailContent (`components/products/ProductDetailContent.tsx`)**
- 产品图片区：`bg-slate-100` → `bg-gradient-to-br from-slate-100 to-industrial-slate`
- 参数表格：`border-slate-200` → `border-slate-200/80`，表头 `bg-slate-50` → `bg-industrial-slate`
- 型号文字：`font-mono` 已使用，确认生效
- 询价按钮：渐变 `bg-gradient-to-r from-primary to-industrial-cyan`

**10.2 ProductDetailNav (`components/products/ProductDetailNav.tsx`)**
- 导航项选中态：`bg-primary/10 text-primary` → 添加 `border-l-2 border-primary`
- 添加 `sticky top-20` 滚动吸附

---

### Phase 11: 边缘页面工业风覆盖

**11.1 Not Found (`not-found.tsx`)**
- 当前：纯白背景 + 简单文字
- 改造：`bg-industrial-dark` 深色背景 + 网格图案 + `text-8xl font-mono text-industrial-cyan` 404 数字

**11.2 Offline (`offline/page.tsx`)**
- 当前：基本样式
- 改造：`bg-industrial-slate` 背景 + 工业图标 + 渐变按钮

**11.3 Error Pages (`error.tsx`)**
- 全局 error.tsx：添加 `bg-industrial-slate` 背景 + `shadow-industrial-lg` 卡片

**11.4 Loading States**
- `Loading.tsx`：spinner 颜色 `border-primary` → `border-industrial-cyan`
- 骨架屏：已使用 `shadow-industrial-sm`，确认一致性

---

### Phase 12: 搜索与发现页面

**12.1 Search Results (`search/page.tsx` + `SearchPageContent.tsx`)**
- 搜索框：渐变按钮 `bg-gradient-to-r from-primary to-industrial-cyan`
- 结果卡片：`shadow-industrial-sm hover:shadow-industrial-md`
- 空状态：工业图标 + 渐变按钮

**12.2 Categories (`categories/page.tsx`)**
- 分类卡片：`shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1`
- 图标区：`bg-gradient-to-br from-primary/10 to-industrial-cyan/10`

**12.3 Tags (`tags/[slug]/page.tsx`)**
- 标签页 Hero：`bg-industrial-dark` + `bg-grid-pattern`
- 内容卡片：统一工业阴影

---

### Phase 13: 内容详情页

**13.1 Articles Detail (`articles/[slug]/page.tsx`)**
- 文章阅读区：`max-w-[820px] mx-auto`（保持）
- 文章头部：添加 `border-l-4 border-primary/30` 摘要装饰
- 图片：`rounded-xl shadow-industrial-sm`

**13.2 Knowledge Detail (`knowledge/[slug]/page.tsx`)**
- 同上，统一内容详情页风格

**13.3 Insights Detail (`insights/[slug]/page.tsx`)**
- 同上

**13.4 Solutions Detail (`solutions/[slug]/page.tsx`)**
- 同上

---

### Phase 14: 供应商与组织页面

**14.1 Suppliers (`suppliers/[id]/page.tsx`)**
- 供应商 Hero：`bg-industrial-dark` + `bg-grid-pattern`
- 信息卡片：`shadow-industrial-sm` + `border-slate-200/80`

**14.2 Knowledge Base (`knowledge-base/[slug]/page.tsx` + `knowledge-base/page.tsx`)**
- Hero：`bg-industrial-dark` + `bg-grid-pattern`
- 列表卡片：统一工业阴影

---

### Phase 15: 工作区子页面

**15.1 Demands (`workspace/demands/page.tsx`, `workspace/demands/[id]/page.tsx`)**
- 需求卡片：`shadow-industrial-sm hover:shadow-industrial-md`
- 状态标签：`bg-primary/10 text-primary`

**15.2 RFQs (`workspace/rfqs/page.tsx`, `workspace/rfqs/[id]/page.tsx`)**
- RFQ 卡片：`shadow-industrial-sm` + `border-l-2` 状态指示
- 创建按钮：渐变 `bg-gradient-to-r from-primary to-industrial-cyan`

**15.3 Matches (`workspace/matches/page.tsx`)**
- 匹配卡片：`shadow-industrial-sm` + 匹配分数使用 `text-industrial-cyan`

**15.4 Settings (`workspace/settings/page.tsx`)**
- 设置卡片：`shadow-industrial-sm` + `border-slate-200/80`

---

### Phase 16: 移动端响应式审查

**16.1 全站断点审查**
- 检查所有页面在 sm/md/lg/xl 断点下的布局
- 确保 `max-w-[1200px]` 在移动端正确降级为 `w-full`
- 检查 `px-4 sm:px-6` 内边距模式一致性

**16.2 移动端导航**
- PublicHeader 移动菜单：已实现，确认 `backdrop-blur-sm` 生效
- Workspace Sidebar 移动抽屉：已实现，确认 `max-w-[1200px]` 包裹

**16.3 产品列表移动端**
- 筛选侧边栏在移动端的折叠行为
- 产品网格列数：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`（已正确）

**16.4 仪表盘移动端**
- 统计卡片网格：`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`（已正确）
- 快捷操作网格：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-6`（确认正确）

---

### Phase 17: 微交互与可访问性

**17.1 焦点状态统一**
- 所有可交互元素：`focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2`
- 搜索框、输入框、按钮、链接统一

**17.2 过渡动画统一**
- 所有卡片：`transition-all duration-300`
- 按钮：`transition-all`
- 链接：`transition-colors`

**17.3 无障碍（A11y）**
- 图标按钮添加 `aria-label`
- 导航添加 `aria-expanded`、`aria-current`
- 检查 `role` 属性完整性

**17.4 暗色模式基础**
- `globals.css` 中 `.dark` 变量已定义
- 评估是否需要添加暗色模式切换按钮

---

### Phase 18: 打印样式与性能优化

**18.1 打印样式**
- 在 `globals.css` 添加 `@media print` 规则
- 隐藏导航、页脚、CTA 按钮
- 保留产品参数、技术规格等核心内容

**18.2 图片加载优化**
- 添加 `loading="lazy"` 到非首屏图片
- 骨架屏统一使用 `animate-pulse`

**18.3 字体加载优化**
- `font-display: swap` 确保文字在字体加载期间可见
- 确认 `layout.tsx` 中 `preconnect` 正确

---

## 涉及文件清单（v2.0 新增）

| 类别 | 文件 |
|------|------|
| **仪表盘** | `dashboard/buyer/page.tsx`, `dashboard/supplier/page.tsx`, `dashboard/page.tsx` |
| **工作区布局** | `components/layout/WorkspaceLayout.tsx`, `components/workspace/WorkspaceSidebar.tsx`, `components/workspace/WorkspaceHeader.tsx` |
| **工作区入口** | `workspace/page.tsx` |
| **产品详情** | `components/products/ProductDetailContent.tsx`, `components/products/ProductDetailNav.tsx` |
| **边缘页面** | `not-found.tsx`, `offline/page.tsx`, `error.tsx`, `components/common/Loading.tsx` |
| **搜索发现** | `search/page.tsx`, `search/SearchPageContent.tsx`, `categories/page.tsx`, `tags/[slug]/page.tsx` |
| **内容详情** | `articles/[slug]/page.tsx`, `knowledge/[slug]/page.tsx`, `insights/[slug]/page.tsx`, `solutions/[slug]/page.tsx` |
| **供应商** | `suppliers/[id]/page.tsx`, `knowledge-base/page.tsx`, `knowledge-base/[slug]/page.tsx` |
| **工作区子页** | `workspace/demands/`, `workspace/rfqs/`, `workspace/matches/`, `workspace/settings/` |

## 不修改的文件

- `HeroSection.tsx` — 首页 Hero 保持最终设计不变
- `admin` 应用全部文件（独立样式系统）
- `api` 应用全部文件
- 任何 `.ts` 逻辑文件、类型定义、API 调用

## 验证

每完成一个阶段后运行 `pnpm build`（web 目录），确保编译通过。最终检查所有路由正常渲染，移动端适配无溢出。