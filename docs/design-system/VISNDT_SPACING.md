# VISNDT Spacing（M32 Design Token Freeze — v1.0）

> 状态：**FROZEN**（720_M32.0）
> 适用：Web（Tailwind）+ Admin（AntD）
> 原则：**8px 网格体系、间距语义化、跨端一致**

---

## 1. Spacing Scale（冻结，单位 px）

| Token | px | 典型用途 |
| --- | --- | --- |
| space-1 | 4 | 图标与文字之间 / 紧凑间隙 |
| space-2 | 8 | 组内元素 / 徽标 padding |
| space-3 | 12 | 表单控件内边距（紧凑） |
| space-4 | 16 | 卡片内边距 / 组件间默认 |
| space-6 | 24 | 区块内边距 / Card 间距 |
| space-8 | 32 | 版面区块间距 |
| space-10 | 40 | 页面 Section 间距（紧凑） |
| space-12 | 48 | 页面 Section 间距（标准） |
| space-16 | 64 | 大版面分区 |

---

## 2. Radius（冻结，单位 px）

| Token | px | 用途 |
| --- | --- | --- |
| radius-sm | 6 | Tag / 小徽标 / Input |
| radius-md | 8 | Button / Card / 表单 |
| radius-lg | 12 | 大 Card / Modal / Emphasis 面板 |
| radius-xl | 16 | Hero / Featured 区块 |
| radius-full | 9999 | Avatar / Pill / Badge 圆形 |

---

## 3. Elevation（冻结）

| Token | Shadow |
| --- | --- |
| shadow-sm | 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04) |
| shadow-md | 0 4px 12px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04) |
| shadow-lg | 0 8px 24px rgba(0,0,0,.08), 0 4px 8px rgba(0,0,0,.04) |

Elevation 只用于提升层级（Card、Dropdown、Modal）；默认平面 UI 用边框而非阴影区分。

---

## 4. Border（冻结）

宽度：default 1px、emphasis 2px。
颜色：default #E2E8F0、strong #CBD5E1。

---

## 5. Layout Grid

- 页面内容最大宽 1280px 居中；Section 顶部间距 space-10 / space-12。
- 网格基准 8px；移动端所有间距至少 space-2 起。