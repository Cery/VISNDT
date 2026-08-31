# VISNDT Typography（M32 Design Token Freeze — v1.0）

> 状态：**FROZEN**（720_M32.0）
> 适用：Web（Next.js）+ Admin（Vite + AntD）
> 原则：**System-first typography**、中文优先可读、层级一致

---

## 1. Font Family（冻结）

| 用途 | 字体栈 | 说明 |
| --- | --- | --- |
| Sans（界面） | Inter + system-ui + 中文系统栈 | 西文 Inter，中文系统回退 |
| Mono（代码/参数） | JetBrains Mono + Consolas + monospace | 参数、代码、数值强调 |

---

## 2. Type Scale（冻结）

| 级别 | 大小 | 行高 | 字重 | 用途 |
| --- | --- | --- | --- | --- |
| Display | 48px | 1.1 | Bold 700 | 首页 H1 视觉主标题 |
| H1 | 36px | 1.15 | Bold 700 | 页面主标题 |
| H2 | 30px | 1.2 | Semibold 600 | 区块标题 |
| H3 | 24px | 1.25 | Semibold 600 | 小节标题 / Card 标题 |
| H4 | 20px | 1.3 | Medium 500 | 卡片内强调 |
| Body XL | 18px | 1.6 | Regular 400 | 导语 / 摘要 |
| Body | 16px | 1.6 | Regular 400 | 正文默认 |
| Body SM | 14px | 1.5 | Regular 400 | 次要正文 / 表正文 |
| Caption | 12px | 1.4 | Regular 400 | 脚注 / 元数据 / 徽标文字 |

---

## 3. Hierarchy Rules（冻结）

- 标题层级不跳跃：H1 -> H2 -> H3 按语义递减，禁止从 H1 直接跳到 H4。
- 中文正文默认 16px 起；表单正文 14px；表格正文 14px。
- 数字/参数场景建议 Mono 保证对齐。

---

## 4. Cross-App

Web 与 Admin 的层级语义必须一致（同一字段同一层级大小相近），允许组件实现细节不同。