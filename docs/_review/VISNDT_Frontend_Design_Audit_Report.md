# VISNDT 全站前端设计审计报告

> 审计范围：Web（Next.js）+ Admin（Vite/React）全站页面
> 审计维度：色彩体系、排版字体、布局间距、组件一致性、交互动效、响应式、视觉层次、可访问性、品牌表达、跨端一致性
> 审计日期：2026-08-26
> 审计方式：源码级静态分析（不动后端数据）

---

## 执行摘要

| 维度 | Web 评分 | Admin 评分 | 跨端一致性 |
|------|---------|-----------|-----------|
| 色彩体系 | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ | ❌ 完全不统一 |
| 排版字体 | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ❌ 字体栈不同 |
| 布局间距 | ⭐⭐⭐☆☆ | ⭐⭐⭐☆☆ | ❌ 系统不同 |
| 组件一致性 | ⭐⭐⭐⭐☆ | ⭐⭐⭐☆☆ | ❌ 组件库不同 |
| 交互动效 | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ | ❌ 无统一规范 |
| 响应式 | ⭐⭐⭐⭐☆ | ⭐⭐☆☆☆ | ❌ Admin 几乎无响应式 |
| 视觉层次 | ⭐⭐⭐☆☆ | ⭐⭐⭐☆☆ | ❌ 风格迥异 |
| 可访问性 | ⭐⭐⭐☆☆ | ⭐⭐⭐☆☆ | ⚠️ 基础达标 |
| 品牌表达 | ⭐⭐⭐☆☆ | ⭐⭐☆☆☆ | ❌ 品牌色未贯通 Admin |
| **综合** | **6.5/10** | **5.0/10** | **严重分裂** |

> **外部评估参考**：经 ChatGPT 交叉评审，本审计总体质量 8.2/10，前端问题发现与跨端分析准确，但实施方案合理性（3/5）和架构影响评估（3/5）需修正。核心修正点：① Primary 应保持 Blue 而非改为 Cyan；② Design Token 应文档先行、代码后行；③ Admin 与 Web 是"同一 Design System + 不同 Application Theme"而非完全统一。

**核心结论**：Web 端达到"工业 SaaS 及格线"，Admin 端停留在"功能性后台"水平，**两端设计语言完全分裂**，用户从 Web 进入 Admin 会产生强烈的"跳转到另一个产品"的割裂感。

---

## 一、Web 端设计审计（Next.js / Tailwind）

### 1.1 色彩体系

#### 现状
- **Primary**：HSL 221° 83% 53%（标准蓝）
- **Industrial Cyan**：HSL 190° 85% 45%（工业青）
- **Industrial Amber**：HSL 32° 95% 50%（琥珀橙）
- **语义色**：Emerald/Red/Blue/Amber

#### 问题

**P1 — 品牌色双头并立**
- Primary（蓝）与 Industrial Cyan（青）色相差距仅 31°，在渐变按钮中几乎不可区分
- 用户无法建立"这就是 VISNDT 品牌色"的认知锚点
- **影响位置**：`HeroBanner` CTA、`EmptyState` 按钮、`LoginPage` 提交按钮、`RegisterPage` 提交按钮

**P2 — 辅助文字对比度不足**
- `text-slate-400`（#94a3b8）在白色背景对比度 2.6:1，低于 WCAG AA 4.5:1 标准
- **影响位置**：ProductCard 描述、DemandDetail 更新时间、知识中心条目元信息

**P2 — `themeColor` 与页面背景不一致**
- `themeColor: '#0f172a'`（深色）与默认浅色背景并存，移动端状态栏与页面顶部视觉断裂
- 建议将 `themeColor` 同步为浅色（`#ffffff` 或 `#f8fafc`），修复移动端状态栏跳变
- > **备注**：深色模式不是当前核心需求（工业检测主场景为白底工程图/参数表），延期至 M35+ 再评估

### 1.2 排版与字体

#### 现状
- **Sans**：Inter（400–800）
- **Mono**：JetBrains Mono（400–600）

#### 问题

**P2 — 标题层级跳跃过大**
- `h1` = `text-4xl/5xl`（36–48px）→ `h2` section title = `text-sm`（14px）
- 缺少 18px/20px/24px 的中等标题尺寸
- **影响位置**：`DemandDetail` section titles、`ProductDetailContent` tab content headings

**P2 — 中文字体未优化**
- Inter 中文回退 system-ui，Windows 下显示为 Microsoft YaHei，字重和字距与 Inter 差异明显

**P3 — 行高偏紧**
- `text-lg` 描述默认行高约 1.5，中文长句中略显紧凑

### 1.3 布局与间距

#### 问题

**P1 — Header 信息过载**
- 7 个导航项 + Logo + 搜索框 + 用户菜单
- 在 1024–1280px 区间已拥挤（`gap-1`、`px-2`）
- 移动端折叠前视觉密度过高

**P1 — ProductCard 信息密度过高**
- 单卡包含：图片、对比复选框、分类徽章、名称、型号、应用场景、参数列表、能力标签、描述、供应商链接
- `xl:grid-cols-4` 下每卡仅约 270px，参数值被截断

**P2 — DemandDetail 信息网格密集**
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` 在 lg 下每格约 280px
- `gap-px bg-slate-100` 网格线视觉效果偏"表格化"，与卡片风格不统一

### 1.4 组件一致性

#### 问题

**P1 — CTA 按钮两种视觉语言**
- 纯色 `bg-primary`（HeroBanner"发现能力"）
- 渐变 `bg-gradient-to-r from-primary to-industrial-cyan`（注册、EmptyState）
- 用户无法判断哪种是"最高优先级"操作

**P2 — 徽章/标签风格不统一**
- `CapabilityBadge`：`rounded-full` + tone 系统
- `DemandStatusBadge`：独立逻辑
- `MatchStatusBadge`：独立逻辑
- 圆角、padding、字体大小存在微小差异

**P2 — 表单输入框圆角不一致**
- 登录页：`rounded-lg`（8px）
- 工作区搜索：`rounded-md`（6px）
- 无统一规范

### 1.5 交互与动效

#### 问题

**P2 — 动效保守，缺乏记忆点**
- 仅 fadeIn、slideUp 两个入场动画
- 无 stagger（交错）效果
- SearchHero 光晕（`blur-[120px]`）是静态的，无"呼吸感"

**P3 — MatchScore 过于简陋**
- 仅 `w-16 h-1.5` 细条，无"仪表盘"工业感

### 1.6 响应式

#### 问题

**P1 — ProductCard 4 列下内容截断**
- `xl:grid-cols-4` 在 1280px 下每格约 290px
- `line-clamp-2` 中文标题仅显示 8–10 字

**P2 — Header 1024–1280px 拥挤**
- `lg:flex` 显示全部导航 + 搜索框 + 用户区
- 可用宽度约 1050px，已接近极限

### 1.7 视觉层次

#### 问题

**P1 — 首页 HeroBanner 视觉平淡**
- `bg-gradient-to-br from-primary/10 via-background to-primary/5` 几乎看不出色彩倾向
- 无插画、无产品示意图、无动态元素
- "工业检测平台"专业感不足

**P2 — 深浅切换突兀**
- 首页浅色 → 搜索页 `bg-industrial-dark` 深色
- 进入搜索页时产生强烈明暗跳变

**P2 — Workspace 区域缺乏视觉锚点**
- `BuyerWorkspaceEntry`/`SupplierWorkspaceEntry` 更像普通列表页
- 缺少"仪表盘"认知（统计卡片已有但未充分使用）

### 1.8 可访问性

#### 问题

**P2 — 色彩对比度**
- `text-slate-400` 在白色上 2.6:1，低于 AA 标准
- `text-slate-500` 4.0:1，勉强达标

**P3 — 表单标签关联**
- 登录页有 `htmlFor` 绑定（良好）
- 工作区表单需验证是否全部具备正确 `label` + `input` 关联

### 1.9 品牌表达

#### 问题

**P2 — 工业属性视觉化不足**
- 除命名和等宽字体外，无直观"工业检测"视觉元素
- 无超声波波形、检测设备轮廓、NDT 符号

**P3 — Logo 视觉张力弱**
- `VIS` + `NDT` 文字 Logo 过于常见
- `font-mono` 中文环境下字距偏紧

---

## 二、Admin 端设计审计（Vite / Ant Design）

### 2.1 色彩体系

#### 问题

**P0 — 与 Web 端完全分裂**
- Web：HSL CSS 变量 + Tailwind 工具类
- Admin：Ant Design 默认色板 + 硬编码 hex
- 两端用户无法感知是"同一产品"

**P1 — 硬编码颜色泛滥**
- `#52c41a`（成功绿）、`#faad14`（警告黄）直接写死在代码中
- `VISNDT_COLORS` 常量虽有定义但未全面替代硬编码
- **影响位置**：`ProductList.tsx` 统计卡片、`Home.tsx` 健康状态指示器

**P1 — 登录页紫蓝渐变**
- `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- 与 Web 端的 `bg-industrial-slate` + 工业青风格完全不搭
- 用户从 Web 登录页（浅灰+青渐变顶条）跳转到 Admin（紫蓝渐变），认知断裂

### 2.2 排版与字体

#### 问题

**P2 — 无自定义字体栈**
- 使用 Ant Design 默认字体（-apple-system、BlinkMacSystemFont、Segoe UI）
- 无 Inter、无 JetBrains Mono、无中文字体优化
- 技术数据（型号、ID）未使用等宽字体

### 2.3 布局与间距

#### 问题

**P1 — 内联样式泛滥**
- 几乎不用 CSS 类，全部 `style={{...}}`
- 无法复用、无法主题化、无法响应式
- **影响位置**：`Home.tsx`（整个文件）、`ProductList.tsx`、`ProductDetail.tsx`

**P2 — 仪表盘信息过载**
- `Home.tsx` 单页包含：健康横幅、能力总览 6 卡、业务流转 6 卡、匹配引擎 4 卡、待处理 5 卡、图表区、活动区、系统状态区、快捷操作区
- 缺乏视觉分区，用户难以快速定位信息

**P2 — 缺乏响应式设计**
- Admin 主要使用固定像素值
- `Row gutter={16}` 在移动端无自适应
- 表格 `scroll={{ x: 'max-content' }}` 在窄屏需横向滚动

### 2.4 组件一致性

#### 问题

**P1 — Ant Design 默认样式无品牌定制**
- Card、Table、Button、Tag 等全部使用 AntD 默认样式
- 无圆角定制（AntD 默认 2–6px，Web 端 `rounded-xl`=12px）
- 无阴影定制（AntD 默认阴影与 `shadow-industrial-sm` 差异大）

**P2 — 面包屑与 Web 不统一**
- Web：`/` 分隔符 + `text-muted-foreground` 样式
- Admin：`Breadcrumb` 组件默认样式

### 2.5 交互与动效

#### 问题

**P3 — 动效缺失**
- 仅依赖 Ant Design 默认过渡
- 无品牌定制的入场/退场动画
- 卡片悬停无浮起效果（Web 端有 `hover:-translate-y-1`）

### 2.6 品牌表达

#### 问题

**P1 — 无品牌视觉元素**
- 无 grid-pattern/dot-pattern 背景
- 无工业青/琥珀品牌色强调
- 无 NDT 相关图形符号

---

## 三、跨端一致性审计

| 维度 | Web（Tailwind） | Admin（AntD） | 一致性 |
|------|----------------|--------------|--------|
| 组件库 | Tailwind + 自定义 | Ant Design | ❌ 完全不同 |
| 颜色系统 | HSL CSS 变量 | 硬编码 hex + AntD 色板 | ❌ 不统一 |
| 字体栈 | Inter + JetBrains Mono | AntD 默认 | ❌ 不统一 |
| 圆角 | `rounded-xl`（12px）级联 | AntD 默认（2–6px） | ❌ 不统一 |
| 阴影 | `shadow-industrial-sm/md/lg` | AntD 默认 | ❌ 不统一 |
| 间距 | `px-6 py-12` 工具类 | 内联 `padding: 24` | ❌ 不统一 |
| 登录页 | 浅灰+卡片+青渐变顶条 | 紫蓝渐变+AntD Card | ❌ 完全不同 |
| 按钮风格 | 纯色/渐变混合 | AntD 主按钮 | ❌ 不统一 |
| 表格风格 | 自定义卡片包裹 | AntD Table 默认 | ❌ 不统一 |
| 空状态 | `EmptyState` 组件 | AntD Empty | ❌ 不统一 |
| 加载状态 | Skeleton 卡片 | AntD Spin | ❌ 不统一 |
| 徽章/标签 | 自定义 Badge 家族 | AntD Tag | ❌ 不统一 |

**结论**：Web 与 Admin 是两个完全独立的设计系统，用户认知成本极高。

---

## 四、问题分级汇总

### P0（严重 — 必须立即修复）

| 编号 | 问题 | 影响 | 位置 |
|------|------|------|------|
| P0-1 | Admin 与 Web 设计系统完全分裂 | 用户认知断裂，像两个产品 | 全站 |
| P0-2 | Admin 登录页紫蓝渐变与 Web 风格完全不搭 | 品牌一致性崩坏 | Admin/Login.tsx |

### P1（重要 — 近期修复）

| 编号 | 问题 | 影响 | 位置 |
|------|------|------|------|
| P1-1 | Primary 与 Industrial Cyan 品牌色边界模糊 | 品牌色不聚焦 | 全站 CTA |
| P1-2 | Header 7 项导航 + 搜索框拥挤 | 1024–1280px 体验差 | PublicHeader |
| P1-3 | ProductCard 信息密度过高，4 列截断 | 内容不可读 | ProductGrid |
| P1-4 | CTA 按钮两种视觉语言（纯色/渐变） | 用户无法判断优先级 | 全站 |
| P1-5 | Admin 硬编码颜色泛滥 | 维护困难，无主题化 | Admin 多文件 |
| P1-6 | Admin 内联样式泛滥 | 无法复用/响应式/主题化 | Admin 全站 |
| P1-7 | 首页 HeroBanner 视觉平淡 | 首屏转化率低 | Home/HeroBanner |
| P1-8 | 搜索页深色与首页浅色切换突兀 | 视觉跳变 | SearchHero |

### P2（中等 — 排期优化）

| 编号 | 问题 | 影响 | 位置 |
|------|------|------|------|
| P2-1 | 标题层级跳跃（36px→14px） | 阅读层级断裂 | DemandDetail 等 |
| P2-2 | 中文字体未优化 | Windows 下显示差异 | 全站 |
| P2-3 | 徽章/标签风格不统一 | 组件家族感弱 | CapabilityBadge 等 |
| P2-4 | 表单输入框圆角不一致 | 细节粗糙 | Login/Workspace |
| P2-5 | `text-slate-400` 对比度不足 | 可访问性不达标 | ProductCard 等 |
| P2-6 | 动效保守，缺乏记忆点 | 品牌个性不足 | 全站 |
| P2-7 | Workspace 缺乏仪表盘认知 | 工作台感弱 | Buyer/Supplier Entry |
| P2-8 | DemandDetail 网格线"表格化" | 与卡片风格冲突 | DemandDetail |
| P2-9 | Admin 仪表盘信息过载 | 信息难以定位 | Admin/Home.tsx |
| P2-10 | Admin 缺乏响应式 | 移动端不可用 | Admin 全站 |
| P2-11 | Footer Logo 深色背景对比度不足 | 品牌不可见 | PublicFooter |

### P3（低优 — 长期打磨）

| 编号 | 问题 | 影响 | 位置 |
|------|------|------|------|
| P3-1 | MatchScore 进度条过于简陋 | 无工业仪表盘感 | MatchScore |
| P3-2 | 空状态引导不够主动 | 转化率损失 | EmptyState |
| P3-3 | 工业属性视觉化不足 | 品牌辨识度低 | 全站 |
| P3-4 | Logo 视觉张力弱 | 辨识度不足 | Header/Footer |
| P3-5 | 深色模式未启用 | 功能缺失 | 全局配置 |
| P3-6 | Admin 动效缺失 | 体验单调 | Admin 全站 |

---

## 五、改进优化方案

### 5.1 核心原则

1. **不动后端**：所有优化纯前端样式/布局/组件，不涉及 API/Schema/数据
2. **统一设计系统**：建立跨 Web+Admin 的统一 Design Token 系统
3. **分阶段实施**：P0→P1→P2→P3，每阶段可独立交付
4. **向后兼容**：不破坏现有业务功能，增量优化

### 5.2 第一阶段：设计系统统一（P0 + 关键 P1）

#### 5.2.1 建立统一 Design Token 系统（文档先行）

> **架构修正**：经交叉评审，当前阶段不建议抽取 `packages/design-system` 共享包（引入 workspace 配置、build pipeline、version 管理成本过高）。采用"文档先行、两端分别消费"的轻量策略。

创建 Design System 文档：

```
docs/design-system/
├── VISNDT_COLOR_SYSTEM.md      // 品牌色 + 语义色 + 中性色阶
├── VISNDT_TYPOGRAPHY.md        // 字体栈 + 字号阶梯 + 行高
├── VISNDT_SPACING.md           // 间距规范
├── VISNDT_COMPONENT_RULE.md    // Button / Badge / Card / Form 规范
└── VISNDT_UI_GUIDE.md          // Web Theme vs Admin Theme 差异说明
```

**品牌色冻结**（经评审修正：Blue 保持 Primary，Cyan 降为 Accent）：

| 角色 | 色值 | 语义 |
|------|------|------|
| **Primary** | `#2563EB` | Engineering Blue — 信任、专业、工程软件感 |
| **Secondary** | `#0EA5E9` | Industrial Cyan — 技术高亮、检测信号、操作反馈 |
| **Accent** | `#F59E0B` | Industrial Amber — 警告、待处理、关键行动 |
| **Success** | `#10B981` | 成功、通过、正常运行 |
| **Error** | `#EF4444` | 错误、失败、阻断 |

> **修正说明**：原报告建议将 Primary 改为 Cyan（#0ea5e9），经评审存在品牌偏移风险。Cyan 容易偏向 IoT Dashboard / AI 工具 / 消费电子感，而 VISNDT 的核心关键词是 Precision / Engineering / Trust / Inspection，Blue 更符合工程软件（如 SolidWorks、AutoCAD、Siemens）的品牌认知。Cyan 保留作为 Secondary/Accent，用于技术高亮和检测信号。

**两端分别消费**：

```typescript
// Web: tailwind.config.ts
const tokens = {
  colors: {
    primary: { DEFAULT: '#2563EB', foreground: '#ffffff' },
    secondary: { DEFAULT: '#0EA5E9', foreground: '#ffffff' },
    accent: { DEFAULT: '#F59E0B', foreground: '#ffffff' },
    // ...
  },
  fontFamily: {
    sans: ['Inter', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
    mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
  },
};

// Admin: theme.ts（Ant Design ConfigProvider 定制）
export const adminTheme = {
  token: {
    colorPrimary: '#2563EB',
    colorInfo: '#0EA5E9',
    colorWarning: '#F59E0B',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    borderRadius: 8,
    fontFamily: 'Inter, "Noto Sans SC", system-ui, sans-serif',
  },
};
```

#### 5.2.2 Admin 登录页重新设计

将 Admin `Login.tsx` 从紫蓝渐变改为与 Web 一致的工业风格：

```
背景：bg-industrial-slate（#f1f5f9 级浅灰）
卡片：白色 + rounded-xl + shadow-lg + 顶部 3px primary 色条
表单：统一圆角 md（8px）+ focus:ring-primary/30
按钮：bg-primary 纯色（去除渐变，统一品牌）
```

#### 5.2.3 统一品牌色（Primary = Blue 保持，Cyan = Accent）

- Web：`tailwind.config.ts` 保持 `primary` = Blue（#2563EB），新增 `secondary` = Cyan（#0EA5E9）
- Admin：`VISNDT_COLORS.primary` 同步为 #2563EB，`VISNDT_COLORS.info` = #0EA5E9
- CTA 按钮统一使用 `bg-primary` 纯色，去除渐变（消除两种视觉语言）

#### 5.2.4 Admin 内联样式迁移

- 将 `Home.tsx`、`ProductList.tsx`、`ProductDetail.tsx` 中的内联 `style={{...}}` 提取为 CSS Modules 或 styled-components
- 建立 Admin 专用的 `AdminDesignProvider`，消费共享 Token

### 5.3 第二阶段：Web 体验优化（P1 + P2）

#### 5.3.1 Header 信息架构重组

- 导航项从 7 个缩减为 5 个核心入口：
  - 保留：首页、能力中心（合并产品+分类）、知识中心、解决方案、商务合作
  - 移除/合并：关于我们（移入 Footer）、供应商入驻（移入商务合作）
- 搜索框在 `lg` 以下收缩为图标按钮

#### 5.3.2 ProductCard 信息减负

- 参数列表仅保留 1–2 个核心参数（其余移入详情页 Tooltip）
- `xl:grid-cols-4` 改为 `xl:grid-cols-3`
- 描述文字从 `line-clamp-2` 改为 `line-clamp-1`，释放空间

#### 5.3.3 统一徽章体系

建立 `Badge` 组件家族：

```typescript
interface BadgeProps {
  variant: 'solid' | 'soft' | 'outline';
  size: 'sm' | 'md' | 'lg';
  tone: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  children: React.ReactNode;
}
```

- 替换 CapabilityBadge / DemandStatusBadge / MatchStatusBadge
- Web 和 Admin 共用同一套 Badge（Admin 用 AntD Tag 包装实现）

#### 5.3.4 对比度修复

- 全局将 `text-slate-400` 替换为 `text-slate-500`
- Admin 同步调整 `type="secondary"` 的对比度

#### 5.3.5 HeroBanner 视觉升级

```
背景：工业青 5% 透明度 + 动态网格线（CSS animation 缓慢漂移）
右侧/底部：抽象 NDT 设备轮廓 SVG（线稿风格，opacity 10%）
CTA：统一 bg-primary 纯色（去除渐变）
```

#### 5.3.6 搜索页深色区改造

将 `SearchHero` 从 `bg-industrial-dark` 改为浅色主题：

```
背景：白色 + bg-grid-pattern（opacity 5%）
标题：text-foreground（深色文字）
搜索框：白色背景 + shadow-lg + border-primary/20
保留：眉标（IndustrialBadge）+ 渐变文字（但改为 primary→secondary 渐变）
```

### 5.4 第三阶段：Admin 体验升级（P1 + P2）

#### 5.4.1 Admin 引入品牌定制（同一 Design System + 不同 Application Theme）

> **修正说明**：Admin 不应完全追随 Web 的视觉风格。Web 是 Marketing + Discovery 场景，Admin 是 Enterprise Console 场景。两者使用同一套 Design Token，但呈现不同的 Application Theme：
> - Web Theme：更开放、营销导向、信息密度中等、视觉元素丰富
> - Admin Theme：更紧凑、效率导向、信息密度高、视觉元素克制

具体定制：
- Card 组件：统一 `borderRadius: 12px`、`boxShadow: shadow.md`
- Table 组件：表头 `background: neutral-50`、行 hover `background: primary/5`
- Button 主按钮：`background: primary`、`borderRadius: 8px`
- Badge/Tag：用 AntD Tag 包装实现 Web 同款风格，而非完全替换组件库

#### 5.4.2 仪表盘信息分区

将 `Home.tsx` 的密集卡片分组为可折叠的 Panel：

```
┌─ 平台健康横幅（保持）─┐
├─ 运营概览 Tab ────────┤
│  ├─ 能力总览（6卡，可折叠）
│  ├─ 业务流转（6卡，可折叠）
│  ├─ 匹配引擎（4卡，可折叠）
│  └─ 待处理（5卡，可折叠）
├─ 数据图表 Tab ────────┤
├─ 最近活动 Tab ────────┤
└─ 快捷操作 ────────────┘
```

#### 5.4.3 Admin 响应式基础

- 将固定像素值改为响应式断点：
  - `Row gutter={16}` → `gutter={[8, 16]}`（移动端缩小）
  - 统计卡片：`xs={12} sm={8} lg={4}` → 确保移动端 2 列
- 表格：`scroll={{ x: 'max-content' }}` 保持，但增加卡片化备选视图

### 5.5 第四阶段：品牌深化与动效（P2 + P3）

#### 5.5.1 工业视觉元素（克制使用）

> **修正说明**：工业 SaaS 很容易做成"AI 科技官网风"，VISNDT 应保持工程专业感，而非未来科技感。SVG 装饰需极度克制，仅在关键位置点缀。

允许范围：
- **Hero 区域**：背景增加 subtle 的抽象网格线（opacity 5%，CSS animation 缓慢漂移），不喧宾夺主
- **空状态**：简洁的几何图形（如放大镜轮廓、文件图标），不使用复杂插画
- **Loading**：保持现有 Skeleton 或 Spin，不做过度设计

禁止范围：
- 超声波波形动画、雷达扫描线、脉冲特效等"科技感"过强的元素
- 任何可能让用户联想到"AI 公司官网"的装饰

#### 5.5.2 动效升级

```css
/* 光晕漂移 */
@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -10px); }
}

/* 卡片交错入场 */
@keyframes staggerFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### 5.5.3 MatchScore 匹配因子解释（替代视觉装饰）

> **修正说明**：原报告建议将 MatchScore 改为环形仪表盘，经评审认为"业务能力解释比视觉装饰更有价值"。用户真正需要的是理解"为什么匹配"，而非看到一个漂亮的圆环。

优化方向：
- **保留线性进度条**（`w-16 h-1.5` 可优化为 `w-20 h-2` 加粗）
- **增加匹配因子明细**：
  ```
  镜头直径匹配     ★★★★★  (5/5)
  检测深度适配     ★★★★☆  (4/5)
  环境条件兼容     ★★★★★  (5/5)
  ```
- **点击展开**：MatchCard 可展开查看各参数的详细得分和解释
- **颜色编码**：满分 emerald、及格 blue、不及格 amber/red

#### 5.5.4 中文字体优化

- Web：引入 `Noto Sans SC`（Google Fonts CDN 或本地子集）
- Admin：在 Ant Design `ConfigProvider` 中配置 `theme.token.fontFamily`

---

## 六、实施路线图（修正版）

> **修正说明**：原报告建议"12–19 天 60–90 文件全面改造"，经评审认为过于激进，容易陷入"边改页面边重新定义设计语言"的循环。修正为先冻结 Design System，再分阶段实施。

### M32.0 — Design System Freeze（2–3 天）

**不改任何页面代码**，只做定义：

| 交付物 | 内容 |
|--------|------|
| `docs/design-system/VISNDT_COLOR_SYSTEM.md` | 品牌色冻结（Blue Primary / Cyan Secondary / Amber Accent） |
| `docs/design-system/VISNDT_TYPOGRAPHY.md` | 字体栈 + 字号阶梯 + 行高规范 |
| `docs/design-system/VISNDT_SPACING.md` | 间距 + 圆角 + 阴影规范 |
| `docs/design-system/VISNDT_COMPONENT_RULE.md` | Button / Badge / Card / Form 统一规范 |
| `docs/design-system/VISNDT_UI_GUIDE.md` | Web Theme vs Admin Theme 差异说明 |
| `tailwind.config.ts`（Web 更新 Token） | 同步新品牌色 |
| `theme.ts`（Admin 新建） | AntD ConfigProvider 定制 |

**涉及文件数**：5 个文档 + 2 个配置文件

### M32.1 — Design Foundation Implementation（3–5 天）

**目标**：两端视觉统一 60%

| 端 | 改造内容 |
|----|---------|
| **Admin** | Login 页重构（紫蓝渐变 → 工业风格）、Theme Token 接入、Card/Button/Table 品牌定制 |
| **Web** | Color Token 同步、Typography 统一、Button/Badge 风格统一 |

**涉及文件数**：Admin 8–12 文件 + Web 5–8 文件

### M32.2 — Core Experience Optimization（5–7 天）

| 端 | 改造内容 |
|----|---------|
| **Web** | Header 重组（7→5 项）、ProductCard 降密度（xl 4→3 列）、HeroBanner 视觉升级、SearchHero 浅色化 |
| **Admin** | Dashboard 信息分区（可折叠 Panel）、内联样式迁移 |

**涉及文件数**：Web 10–15 文件 + Admin 5–8 文件

### M32.3 — Brand Polish（5–7 天）

| 改造内容 |
|---------|
| Web：动效升级（Hero 光晕漂移、卡片交错入场） |
| Web：MatchScore 匹配因子解释（展开式参数得分） |
| Web/Admin：中文字体优化（Noto Sans SC） |
| Web：Footer Logo 对比度修复 |
| Admin：响应式基础（移动端 2 列、表格滚动优化） |

**涉及文件数**：Web 8–12 文件 + Admin 5–8 文件

### 总计

| 阶段 | 周期 | 交付物 | 涉及文件数 |
|------|------|--------|-----------|
| M32.0 | 2–3 天 | Design System v1.0 冻结 | 7 |
| M32.1 | 3–5 天 | 两端视觉统一 60% | 13–20 |
| M32.2 | 5–7 天 | 核心体验优化 | 15–23 |
| M32.3 | 5–7 天 | 品牌深化打磨 | 13–20 |
| **总计** | **15–22 天** | **全站设计统一 + 体验升级** | **48–70 文件** |

---

## 七、验证清单

每阶段完成后需验证：

- [ ] 生产构建通过（Web `next build` / Admin `tsc -b && vite build`）
- [ ] 核心页面无视觉回归（首页、搜索、产品详情、工作区、Admin 仪表盘）
- [ ] 移动端 375px/768px/1024px 无水平溢出
- [ ] 色彩对比度 ≥ 4.5:1（主要文字）
- [ ] Web→Admin 登录页切换无认知断裂
- [ ] 无障碍：Tab 导航、aria-label、focus ring 正常

---

## 八、结论

VISNDT 当前前端设计处于"功能可用但品牌弱、两端分裂"的状态。**最紧迫的问题是 Web 与 Admin 的设计系统分裂**（P0），这导致用户在使用中产生"这是两个不同产品"的认知。

经交叉评审修正后，推荐实施路径调整为：

```
M32.0  Design System Freeze（先定义，不改页面）
    ↓
M32.1  Design Foundation（Admin Login + Theme Token + 基础组件）
    ↓
M32.2  Core Experience（Header + ProductCard + Hero + Dashboard）
    ↓
M32.3  Brand Polish（动效 + 字体 + MatchScore 因子解释）
```

**关键修正点**（对比原报告）：
1. **品牌色**：Primary 保持 Blue（#2563EB），Cyan 降为 Secondary/Accent — 更符合 Engineering Software 认知
2. **Design Token**：文档先行、两端分别消费 — 避免过早抽取共享包的架构负担
3. **Admin/Web 关系**：同一 Design System + 不同 Application Theme — 不是完全统一，而是统一 Token、差异化表达
4. **范围控制**：深色模式延期 M35+、MatchScore 不做环形仪表盘（改做匹配因子解释）、SVG 工业装饰极度克制
5. **实施节奏**：从"12–19 天 60–90 文件激进改造"调整为"15–22 天 48–70 文件分阶段冻结+实施"

全程不动后端数据，纯前端改造，风险可控。

**预期效果**：统一后的 VISNDT 将具备"专业工业 SaaS 平台"的视觉质感，用户跨端体验无缝，品牌认知清晰，为 M32 及后续阶段提供坚实的视觉基础。