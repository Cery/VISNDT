# VISNDT 工业平台 UI 重设计方案

## 背景

当前 UI 过于朴素：纯白背景、简单边框、shadcn/ui 默认配色、无自定义字体、无工业感设计元素。用户反馈"全页面通栏设计特别丑，没有达到工业品平台的设计风格"。

## 设计目标

对标 Keyence / Zeiss Industrial / Fluke 等工业平台，建立**精密、专业、技术感**的视觉语言，仅修改 CSS 和 Tailwind 类名，不改变任何代码逻辑。

---

## 实施计划

### 布局约定
- **顶栏/页头/页脚**：通栏（100%宽度）
- **内容区**：`max-w-[1200px] mx-auto`（统一1200px居中）

### 第一阶段：设计基础（globals.css + tailwind.config.ts + layout.tsx）

**1.1 引入字体**
- 在 `layout.tsx` 中通过 `<link>` 引入 Google Fonts：
  - **Inter**（400/500/600/700/800）— 正文字体
  - **JetBrains Mono**（400/500/600）— 型号/技术规格用等宽字体
- `<html>` 添加 `className="font-sans"` 启用 Inter

**1.2 扩展 CSS 变量（globals.css `:root`）**
在保留所有 shadcn/ui 变量基础上新增：

```css
/* 电光蓝 — 技术指标、链接 */
--industrial-cyan: 190 85% 45%;
--industrial-cyan-foreground: 0 0% 100%;

/* 工业橙 — CTA、高亮 */
--industrial-amber: 32 95% 50%;
--industrial-amber-foreground: 0 0% 100%;

/* 精密灰 — 卡片背景 */
--industrial-slate: 220 14% 96%;
--industrial-slate-foreground: 220 10% 20%;

/* 深空背景 — Hero/CTA */
--industrial-dark: 220 25% 8%;
--industrial-dark-foreground: 210 20% 98%;

/* 增强阴影 */
--shadow-industrial-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-industrial-md: 0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);
--shadow-industrial-lg: 0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
```

**1.3 扩展 tailwind.config.ts**
- `colors.industrial`: cyan, amber, dark 及对应 foreground
- `fontFamily`: sans → Inter, mono → JetBrains Mono
- `boxShadow`: industrial-sm/md/lg
- `backgroundImage`: grid-pattern, dot-pattern
- `backgroundSize`: grid-sm/md, dot-sm/md

---

### 第二阶段：全局布局组件

**2.1 PublicHeader.tsx**
- 背景：`bg-white/95 backdrop-blur-sm` 毛玻璃效果
- 底部：`shadow-industrial-sm` 替代纯 border
- 高度：`h-16` → `h-18`
- Logo：添加 `font-mono` + 渐变文字效果
- 导航激活态：底部指示条 `after:absolute after:h-0.5 after:bg-primary`
- 注册按钮：`bg-gradient-to-r from-primary to-industrial-cyan`

**2.2 PublicFooter.tsx**
- 背景：`bg-industrial-dark` 深色页脚
- 文字：`text-slate-400` / 标题 `text-white`
- 顶部添加品牌区：Logo + 描述
- 底部栏：`border-t border-white/10`
- 链接：`hover:text-white`

---

### 第三阶段：首页重设计

**3.1 HeroSection.tsx**
- 背景多层叠加：`bg-industrial-dark` + `bg-grid-pattern bg-grid-md` + 光晕渐变
- 标签：`border-l-2 border-industrial-cyan pl-3` 工业风格
- 关键词：`text-industrial-cyan`
- 主按钮：`bg-gradient-to-r from-industrial-cyan to-primary text-white shadow-industrial-lg`
- 次按钮：`backdrop-blur-sm bg-white/10 border-white/20`

**3.2 CategorySection.tsx**
- 卡片：`shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1`
- 图标区：`bg-gradient-to-br from-primary/10 to-industrial-cyan/10`
- 图标色：`text-primary`

**3.3 FeaturedProductsSection.tsx**
- 背景：`bg-industrial-slate`（替代 `bg-slate-50`）
- 间距：`py-16` → `py-20`

**3.4 SolutionsSection.tsx**
- 卡片：左侧强调色条 `border-l-2 border-primary`
- 图标：圆形渐变背景

**3.5 InquiryCTA.tsx**
- 添加 `bg-dot-pattern bg-dot-md` 点阵图案
- 按钮：渐变 + 阴影

---

### 第四阶段：卡片系统统一

**4.1 ProductCard（两个文件）**
- 边框：`border-slate-200/80` + `shadow-industrial-sm`
- 悬浮：`hover:shadow-industrial-lg hover:-translate-y-1`
- 型号：`font-mono text-xs`（JetBrains Mono）
- 分类标签：`bg-primary/10 text-primary text-xs`

**4.2 内容页卡片（solutions/knowledge/business/about）**
- 统一替换：`border-slate-200/80 shadow-industrial-sm`
- 标题：添加下划线装饰 `after:block after:w-12 after:h-0.5 after:bg-primary after:mt-2`
- Business 页面 `✓`：改为 `bg-emerald-100 text-emerald-700` 圆角徽章

---

### 第五阶段：产品列表页

**5.1 SearchBar.tsx**
- 搜索按钮：`bg-gradient-to-r from-primary to-industrial-cyan`
- 输入框：`focus:ring-2 focus:ring-primary/30`

**5.2 ProductFilter.tsx**
- 选中状态：`bg-primary/10 text-primary border-l-2 border-primary`

**5.3 Pagination.tsx**
- 当前页按钮：`bg-gradient-to-r from-primary to-industrial-cyan text-white`

**5.4 ProductGrid.tsx**
- 骨架屏：匹配新卡片样式

---

### 第六阶段：Section 交替模式（全站统一）

| 位置 | 背景 |
|------|------|
| 内容页 Hero 区 | `bg-industrial-dark` |
| 内容区奇数段 | `bg-white` |
| 内容区偶数段 | `bg-industrial-slate` |
| 全站间距 | `py-16` → `py-20` |

---

### 第七阶段：认证页面

**7.1 login/page.tsx + register/page.tsx**
- 外层：`min-h-screen bg-industrial-slate`
- 卡片：`max-w-md mx-auto rounded-xl border-slate-200/80 shadow-industrial-lg p-8`
- 顶部装饰：`h-1 bg-gradient-to-r from-primary to-industrial-cyan rounded-t-xl`
- 提交按钮：`bg-gradient-to-r from-primary to-industrial-cyan`
- 输入框：`focus:ring-2 focus:ring-primary/30`

---

### 第八阶段：全局动画

在 `globals.css` 添加：
- `.animate-fade-in`：淡入动画
- `.animate-slide-up`：上滑淡入动画
- 为各 section 标题区域添加 `animate-slide-up`

---

## 涉及文件清单

| 类别 | 文件 |
|------|------|
| **基础** | `globals.css`, `tailwind.config.ts`, `layout.tsx` |
| **布局** | `PublicHeader.tsx`, `PublicFooter.tsx` |
| **首页** | `HeroSection.tsx`, `CategorySection.tsx`, `FeaturedProductsSection.tsx`, `SolutionsSection.tsx`, `InquiryCTA.tsx` |
| **卡片** | `product/ProductCard.tsx`, `products/ProductCard.tsx`, `CategoryGrid.tsx` |
| **产品列表** | `SearchBar.tsx`, `ProductFilter.tsx`, `ProductGrid.tsx`, `Pagination.tsx` |
| **内容页** | `solutions/page.tsx`, `knowledge/page.tsx`, `business/page.tsx`, `about/page.tsx` |
| **认证** | `login/page.tsx`, `register/page.tsx` |
| **通用** | `Loading.tsx`, `EmptyState.tsx`, `ErrorState.tsx` |

## 不修改的文件

- `admin` 应用全部文件（独立样式系统）
- `api` 应用全部文件
- 任何 `.ts` 逻辑文件、类型定义、API 调用

## 验证

每完成一个阶段后运行 `pnpm build`（web 目录），确保编译通过。最终检查所有 20 条路由正常渲染。