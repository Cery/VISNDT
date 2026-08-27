# VISNDT 内容页（文章/方案/知识）设计缺陷深度分析

> 分析范围：`/articles/*`、`/solutions/*`、`/knowledge-base/*` 列表页 + 详情页
> 分析方式：源码级静态审计，逐组件逐行排查
> 不动后端数据，纯前端样式/布局问题

---

## 一、执行摘要

当前内容页的设计水准处于 **"博客模板级"**，距离 **"工业平台专业级"** 差距明显。核心问题不是"没有设计"，而是 **"每一处细节都用了最省事的默认实现"**。

| 页面 | 当前水准 | 目标水准 | 差距 |
|------|---------|---------|------|
| 文章详情页 | Medium 博客风格 | Siemens/GE 工业方案页 | 大 |
| 方案详情页 | 同上 | McKinsey/BCG 行业方案页 | 大 |
| 知识详情页 | 结构化数据直出 | 技术文档/维基专业页 | 大 |
| 列表页 | 卡片网格 | 行业门户内容列表 | 中 |

---

## 二、文章/方案详情页具体缺陷（`articles/[slug]`、`solutions/[slug]`）

### 缺陷 1：布局是博客窄栏，不是工业平台

**现状代码**：
```tsx
<div className="max-w-[820px] mx-auto px-6 py-10">
```

**问题**：
- 820px 是典型博客阅读宽度（Medium、知乎、公众号）
- 工业平台方案页通常使用 **全宽 Hero + 双栏布局**（主内容 70% + 侧边栏 30%）
- 无侧边栏 = 无目录导航（TOC）、无"相关方案"固定推荐、无"快速联系"CTA

**对标参考**：
- Siemens Digital Industries 方案页：全宽封面 + 左侧内容 + 右侧 sticky CTA
- GE Aviation 方案页：全宽视频 Hero + 下方网格化内容区块

**改进方向**：
```tsx
// 改为双栏布局
<div className="max-w-[1200px] mx-auto px-6 py-10">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
    <main>{/* 主内容 */}</main>
    <aside className="hidden lg:block">
      {/* TOC 目录导航（sticky） */}
      {/* 相关方案推荐 */}
      {/* 快速联系 CTA */}
    </aside>
  </div>
</div>
```

---

### 缺陷 2：封面图处理像个人博客

**现状代码**：
```tsx
<div className="mb-6 sm:mb-8 rounded-xl overflow-hidden">
  <img src="..." className="w-full object-cover max-h-[400px]" />
</div>
```

**问题**：
- 无渐变遮罩叠加（Gradient Overlay）
- 无标题叠加在图上（Headline Overlay）
- 无全宽出血设计（Full-bleed）
- `max-h-[400px]` 粗暴裁切，可能裁掉关键视觉元素
- 圆角 `rounded-xl` 在工业平台中显得过于"柔和"

**改进方向**：
```tsx
<div className="relative w-full h-[400px] md:h-[520px] mb-10">
  <img src="..." className="w-full h-full object-cover" />
  {/* 底部渐变遮罩，确保标题可读 */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
  {/* 标题叠加在图上 */}
  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
    <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-medium rounded mb-3">
      解决方案
    </span>
    <h1 className="text-3xl md:text-4xl font-bold text-white max-w-3xl">
      {title}
    </h1>
  </div>
</div>
```

---

### 缺陷 3：作者/元信息区域极其简陋

**现状代码**：
```tsx
<div className="flex items-center gap-3 text-sm text-slate-400 mb-8">
  {solution.author?.name && <span>{solution.author.name}</span>}
  {solution.publishedAt && <span>发布于 {formatDate(solution.publishedAt)}</span>}
</div>
```

**问题**：
- 无头像（Avatar）
- 无分隔符（圆点或竖线）
- 无"阅读量"、"预计阅读时间"、"更新时间"等元信息
- 无"分享到"按钮组
- `text-slate-400` 对比度不足
- 发布日期用 `toLocaleDateString` 无统一格式化，不同浏览器显示不同

**改进方向**：
```tsx
<div className="flex items-center gap-4 mb-8 py-4 border-y border-slate-100">
  {author?.avatar && (
    <img src={author.avatar} className="w-10 h-10 rounded-full object-cover" />
  )}
  <div className="flex-1">
    <div className="font-medium text-foreground">{author.name}</div>
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span>发布于 2024年3月15日</span>
      <span className="w-1 h-1 rounded-full bg-slate-300" />
      <span>8 分钟阅读</span>
      <span className="w-1 h-1 rounded-full bg-slate-300" />
      <span>1,234 次浏览</span>
    </div>
  </div>
  {/* 分享按钮组 */}
  <div className="flex items-center gap-2">
    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
      <ShareIcon className="w-4 h-4 text-slate-500" />
    </button>
    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
      <BookmarkIcon className="w-4 h-4 text-slate-500" />
    </button>
  </div>
</div>
```

---

### 缺陷 4：摘要用了 Markdown 引用块样式

**现状代码**：
```tsx
<p className="text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-primary/30 pl-4">
  {solution.summary}
</p>
```

**问题**：
- `border-l-4 border-primary/30 pl-4` 是标准 `<blockquote>` 样式
- 摘要是"内容摘要"，不是"引用"，视觉语义错误
- 无背景色区分、无独立容器、无 "摘要" 标签

**改进方向**：
```tsx
<div className="mb-10 p-6 bg-slate-50 rounded-xl border border-slate-100">
  <div className="flex items-center gap-2 mb-3">
    <InfoIcon className="w-4 h-4 text-primary" />
    <span className="text-xs font-semibold text-primary uppercase tracking-wider">摘要</span>
  </div>
  <p className="text-base text-slate-700 leading-relaxed">
    {solution.summary}
  </p>
</div>
```

---

### 缺陷 5：标签像普通博客标签

**现状代码**：
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
  bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
  {tag.name}
</span>
```

**问题**：
- `bg-slate-100` + `rounded-full` = 最典型的通用博客标签
- 无品牌色、无图标前缀、无分类层级
- 与工业平台的"技术标签"认知不符

**改进方向**：
```tsx
<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
  bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors">
  <TagIcon className="w-3 h-3" />
  {tag.name}
</span>
```

---

### 缺陷 6：Markdown 渲染完全无品牌定制

**现状代码**：
```tsx
<div className="prose prose-slate prose-headings:font-bold max-w-none text-slate-700 leading-relaxed">
  <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
    {content}
  </ReactMarkdown>
</div>
```

**问题**：
- `prose-slate` 使用 Tailwind 默认的 Slate 灰色系
- 标题无品牌色（应该是 primary 或 industrial-dark）
- 链接无品牌色（默认蓝色，不是 primary）
- 代码块无品牌背景（默认 slate-100）
- 表格表头无品牌背景
- 引用块无品牌左边框
- `max-w-none` 虽去除了宽度限制，但行宽仍受父容器 820px 限制

**改进方向**：
```css
/* 自定义 prose 品牌样式 */
.prose-visndt h1, .prose-visndt h2, .prose-visndt h3 {
  color: #1e293b; /* industrial-dark */
  font-weight: 700;
}
.prose-visndt h2 {
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}
.prose-visndt a {
  color: #2563eb; /* primary */
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}
.prose-visndt a:hover {
  border-bottom-color: #2563eb;
}
.prose-visndt code {
  background: #f1f5f9;
  color: #334155;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}
.prose-visndt pre {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
}
.prose-visndt blockquote {
  border-left-color: #2563eb;
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
}
.prose-visndt table thead {
  background: #f1f5f9;
}
.prose-visndt table th {
  color: #1e293b;
  font-weight: 600;
}
```

---

### 缺陷 7：相关区块堆叠无层次

**现状代码**：
```tsx
<RelatedProducts items={relatedProducts} className="mt-12" />
<RelatedKnowledge items={relatedKnowledge} className="mt-2" />
<RelatedSolutions items={otherSolutions} className="mt-2" />
```

**问题**：
- 三个相关区块之间只有 `mt-12` / `mt-2` 的间距差异
- 无视觉容器包裹（无背景色、无边框、无阴影）
- 每个区块内部只有 `border-t border-slate-200` 分隔
- 标题 `text-2xl font-extrabold` 与正文 h1 冲突
- 无"为什么推荐这些"的说明

**改进方向**：
```tsx
{/* 相关产品区块 */}
<section className="mt-16 p-8 bg-slate-50 rounded-xl">
  <div className="flex items-center gap-3 mb-6">
    <WrenchIcon className="w-5 h-5 text-primary" />
    <div>
      <h2 className="text-xl font-bold text-foreground">相关产品能力</h2>
      <p className="text-sm text-slate-500">该方案涉及的检测设备与能力</p>
    </div>
  </div>
  <RelatedProducts items={relatedProducts} />
</section>

{/* 相关知识区块 */}
<section className="mt-8 p-8 bg-slate-50 rounded-xl">
  <div className="flex items-center gap-3 mb-6">
    <BookOpenIcon className="w-5 h-5 text-primary" />
    <div>
      <h2 className="text-xl font-bold text-foreground">延伸阅读</h2>
      <p className="text-sm text-slate-500">该领域的检测原理与技术知识</p>
    </div>
  </div>
  <RelatedKnowledge items={relatedKnowledge} />
</section>
```

---

### 缺陷 8：CTA 区块像临时拼凑

**现状代码**：
```tsx
<div className="mt-12 mb-8 space-y-4">
  <ContentProductCTA contextType="solution" />
  <DemandCTA contextType="solution" targetLabel={solution.title} />
</div>
```

**问题**：
- 无容器包裹
- 无背景色、无品牌色强调
- `space-y-4` 简单堆叠
- 无视觉层次（两个 CTA 平级，用户不知道先点哪个）

**改进方向**：
```tsx
<div className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
  <h3 className="text-xl font-bold text-foreground mb-2">需要类似的检测方案？</h3>
  <p className="text-slate-600 mb-6">
    我们的工程师可以为您定制专属的无损检测方案，匹配您的具体应用场景。
  </p>
  <div className="flex flex-col sm:flex-row gap-3">
    <DemandCTA contextType="solution" targetLabel={solution.title} />
    <ContentProductCTA contextType="solution" variant="secondary" />
  </div>
</div>
```

---

## 三、知识中心详情页具体缺陷（`knowledge-base/[slug]`）

### 缺陷 9：结构化内容渲染像原始数据直出

**现状代码**（section 渲染）：
```tsx
<section key={idx}>
  {section.title && (
    <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
      {section.title}
    </h2>
  )}
  {section.content && (
    <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
      {section.content}
    </div>
  )}
  {section.items && (
    <ul className="list-disc list-inside space-y-1 text-base text-slate-700 pl-2">
      {section.items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )}
</section>
```

**问题**：
- `text-lg sm:text-xl` 的 h2 与正文 `text-base` 差距仅 2–4px，层级不清晰
- `whitespace-pre-wrap` 直接输出原始文本，无 Markdown 渲染
- 列表 `list-disc list-inside` 是浏览器默认样式
- 无 section 编号（如 "1. 检测原理"）
- 无 section 间的视觉分隔（无分割线、无背景色交替）

**改进方向**：
```tsx
<section key={idx} className="pb-8 mb-8 border-b border-slate-100 last:border-0">
  {section.title && (
    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold">
        {idx + 1}
      </span>
      {section.title}
    </h2>
  )}
  {section.content && (
    <div className="prose prose-visndt max-w-none text-slate-700 leading-relaxed">
      <MarkdownRenderer content={section.content} />
    </div>
  )}
  {section.items && (
    <ul className="space-y-3 mt-4">
      {section.items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <span className="text-slate-700">{item}</span>
        </li>
      ))}
    </ul>
  )}
</section>
```

---

### 缺陷 10：表格像 Excel 粘贴

**现状代码**：
```tsx
<table className="w-full text-sm border border-slate-200 rounded-lg">
  <thead>
    <tr className="bg-slate-50">
      <th className="px-3 py-2 text-left font-medium text-slate-600 border-b border-slate-200">{h}</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-3 py-2 text-slate-700">{cell}</td>
    </tr>
  </tbody>
</table>
```

**问题**：
- `bg-slate-50` 表头 + `border-slate-200` 是最基础的表格样式
- 无品牌色表头
- 无 hover 效果
- 无 zebra striping
- `rounded-lg` 在 table 上无效（table 不响应圆角，需包裹 div + overflow-hidden）

**改进方向**：
```tsx
<div className="overflow-x-auto rounded-xl border border-slate-200">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-primary/5">
        <th className="px-4 py-3 text-left font-semibold text-foreground border-b border-primary/10">
          {h}
        </th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row, ri) => (
        <tr key={ri} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
          <td className="px-4 py-3 text-slate-700">{cell}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

### 缺陷 11：参考内容/知识关联区块像临时列表

**现状代码**（参考内容）：
```tsx
<section className="mb-10 p-4 sm:p-6 bg-slate-50 rounded-xl">
  <h2 className="text-lg font-bold text-foreground mb-4">参考内容</h2>
  <div className="space-y-3">
    {contentRefs.map((ref) => (
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
          bg-slate-200 text-slate-600 mt-0.5 shrink-0">
          {REFERENCE_TYPE_LABELS[ref.referenceType]}
        </span>
        <Link className="text-sm text-primary hover:text-primary/80 transition-colors line-clamp-1">
          {ref.content.title}
        </Link>
      </div>
    ))}
  </div>
</section>
```

**问题**：
- `bg-slate-50 rounded-xl p-4` = 最通用的"临时区块"样式
- 标签 `bg-slate-200 text-slate-600` 无品牌色
- 无图标、无视觉引导
- 链接只有 `text-sm`，点击区域过小
- 无卡片化（应像搜索结果一样卡片化展示）

**改进方向**：
```tsx
<section className="mb-10">
  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
    <LinkIcon className="w-5 h-5 text-primary" />
    参考内容
  </h2>
  <div className="space-y-3">
    {contentRefs.map((ref) => (
      <Link href={`/${ref.content.type.toLowerCase()}/${ref.content.slug}`}
        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white
          hover:border-primary/30 hover:shadow-sm transition-all group">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
          bg-primary/5 text-primary border border-primary/10 shrink-0">
          {REFERENCE_TYPE_LABELS[ref.referenceType]}
        </span>
        <span className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {ref.content.title}
        </span>
        <ArrowRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors ml-auto shrink-0" />
      </Link>
    ))}
  </div>
</section>
```

---

## 四、列表页具体缺陷（`ContentListLayout`）

### 缺陷 12：Hero → 内容区过渡生硬

**现状代码**：
```tsx
{/* Hero */}
<section className="bg-industrial-dark text-white py-16 ...">
  {/* ... */}
</section>

{/* Content List */}
<section className="max-w-[1100px] mx-auto px-4 py-10 ...">
```

**问题**：
- 深色 Hero 直接切到白色内容区，无过渡带
- 计数文案 `text-sm text-slate-500` 过于简陋，像临时注释

**改进方向**：
```tsx
{/* 过渡带 */}
<div className="h-16 bg-gradient-to-b from-industrial-dark to-white" />

{/* 内容区 */}
<section className="max-w-[1100px] mx-auto px-4 py-10">
  <div className="flex items-center justify-between mb-8">
    <div>
      <span className="text-sm text-slate-500">内容库</span>
      <h2 className="text-2xl font-bold text-foreground mt-1">
        共 {contents.length} 个解决方案
      </h2>
    </div>
    {/* 筛选/排序控件预留位 */}
  </div>
```

---

### 缺陷 13：ContentCard 卡片高度不统一

**现状代码**：
```tsx
<Link className="group rounded-xl border ... flex flex-col">
  <div className="aspect-[16/9] ...">{/* 封面图 */}</div>
  <div className="p-4 sm:p-6 flex flex-col flex-1">
    {/* ... */}
    <p className="text-sm text-slate-500 ... line-clamp-3 flex-1">{summary}</p>
    {/* Footer */}
  </div>
</Link>
```

**问题**：
- `flex-1` 试图让 summary 撑满剩余空间，但 `line-clamp-3` 限制了高度
- 当 summary 长度不同时，卡片高度不一致
- Footer `border-t border-slate-100` 极其细弱，几乎看不见
- 标签 `bg-slate-100 text-slate-600` 无品牌色

**改进方向**：
```tsx
<Link className="group rounded-xl border border-slate-200/80 shadow-industrial-sm 
  bg-white overflow-hidden hover:shadow-industrial-md hover:-translate-y-1 
  transition-all duration-300 flex flex-col h-full">
  <div className="aspect-[16/9] relative overflow-hidden">
    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    {/* 类型徽章叠加在图上 */}
    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-medium
      bg-primary text-white shadow-sm">
      {badge.label}
    </span>
  </div>
  <div className="p-5 flex flex-col flex-1">
    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary 
      transition-colors line-clamp-2 min-h-[3rem]">
      {item.title}
    </h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3 flex-1">
      {item.summary}
    </p>
    {/* 标签 */}
    <div className="flex flex-wrap gap-1.5 mb-4">
      {tags.slice(0, 3).map(tag => (
        <span className="text-xs px-2 py-0.5 rounded bg-primary/5 text-primary 
          border border-primary/10">{tag.name}</span>
      ))}
    </div>
    {/* Footer 加强 */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-auto">
      <span className="text-xs text-slate-400">{formatDate(item.publishedAt)}</span>
      <span className="text-xs text-primary font-medium group-hover:underline">
        阅读更多 →
      </span>
    </div>
  </div>
</Link>
```

---

## 五、根因总结

上述 13 个缺陷的共同根因：

| 根因 | 表现 | 影响 |
|------|------|------|
| **使用默认样式** | `prose-slate`、`bg-slate-50`、`border-slate-200`、`text-slate-400` 泛滥 | 无品牌辨识度 |
| **博客思维** | 820px 窄栏、封面图简单包裹、作者信息只有文字 | 不像工业平台 |
| **无视觉层级** | 所有区块平级堆叠、标题字号跳跃小、无背景色区分 | 信息难以定位 |
| **组件复用过度** | ContentCard 用于文章/方案/知识三种不同内容类型 | 内容特性被抹平 |
| **无品牌定制** | Markdown 渲染、表格、列表、标签全部使用默认样式 | 任何 CMS 都长这样 |

---

## 六、改进优先级

| 优先级 | 缺陷 | 涉及文件 | 预估工时 |
|--------|------|---------|---------|
| P0 | 缺陷 1（布局双栏化） | `articles/[slug]`, `solutions/[slug]` | 4h |
| P0 | 缺陷 2（封面图品牌化处理） | 同上 + CSS | 3h |
| P0 | 缺陷 6（Markdown 品牌定制） | `MarkdownRenderer.tsx` + CSS | 4h |
| P1 | 缺陷 3（作者信息区专业化为） | `articles/[slug]`, `solutions/[slug]` | 3h |
| P1 | 缺陷 4（摘要独立区块） | 同上 | 2h |
| P1 | 缺陷 7（相关区块容器化） | `RelatedProducts.tsx` 等 | 3h |
| P1 | 缺陷 9（知识结构化渲染） | `knowledge-base/[slug]` | 4h |
| P1 | 缺陷 13（ContentCard 统一高度） | `ContentCard.tsx` | 2h |
| P2 | 缺陷 5（标签品牌色） | 多文件 | 2h |
| P2 | 缺陷 8（CTA 容器化） | `solutions/[slug]` | 2h |
| P2 | 缺陷 10（表格品牌化） | `knowledge-base/[slug]` | 2h |
| P2 | 缺陷 11（参考内容卡片化） | `knowledge-base/[slug]` | 2h |
| P2 | 缺陷 12（过渡带） | `ContentListLayout.tsx` | 1h |

**总计**：15 项缺陷，约 34 工时（4–5 工作日）

---

## 七、结论

当前内容页的问题不是"没有设计师"，而是 **"每一处都用了最通用、最省事的默认实现"**。

- 820px 窄栏 → Medium 博客
- `prose-slate` → 任何 Tailwind 项目都长这样
- `bg-slate-50 rounded-xl p-4` → 最通用的临时区块
- `bg-slate-100 text-slate-600 rounded-full` → 最通用的标签

**改进的核心不是"加更多装饰"，而是"每一处默认样式都替换为品牌定制样式"**。

优先级最高的三项：
1. **布局双栏化**（加 TOC 侧边栏）
2. **封面图品牌化处理**（渐变遮罩 + 标题叠加）
3. **Markdown 渲染品牌定制**（prose-visndt）

这三项做完，页面气质会立刻从"个人博客"提升到"工业平台"。
