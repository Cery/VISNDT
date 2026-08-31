# VISNDT Color System（M32 Design Token Freeze — v1.0）

> 状态：**FROZEN**（720_M32.0）
> 性质：**唯一规范源（Single Source of Truth）**
> 适用：Web（Next.js + Tailwind）+ Admin（Vite + React + AntD）
> 原则：**Same Design Tokens + Same Semantic Language + Different Application Theme**

---

## 1. 冻结目的

冻结 VISNDT 前端旗舰色板与语义映射，消除双端视觉语言割裂，同时为 M32 后续页面改造提供**唯一权威色值**。本文件为规范源；代码仅负责消费，不得在本文件之外自行定义新品牌色。

---

## 2. Brand Token（冻结）

| Token | Hex | 名称 | 语义定位 |
| --- | --- | --- | --- |
| **Primary** | `#2563EB` | Engineering Blue | 主 CTA / Active / Link / Focus / 关键身份 |
| **Secondary** | `#0EA5E9` | Industrial Cyan | 技术高亮 / 辅助交互 / 平台强调 |
| **Accent** | `#F59E0B` | Industrial Amber | Warning / Pending / Attention / 待处理 |

> 三个品牌色**不得同时作为主视觉竞争**。只能 Primary 作为主身份，Secondary 作为技术高亮，Accent 仅用于关注/待处理语义。

---

## 3. Semantic Color（冻结）

| Token | Hex | 语义 |
| --- | --- | --- |
| **Success** | `#10B981` | 成功 / 通过 / 已完成（PUBLISHED / ACCEPTED / COMPLETED 等） |
| **Warning** | `#F59E0B` | 警告 / 待处理 / 关注（与 Accent 同源） |
| **Error** | `#EF4444` | 错误 / 阻断 / 拒绝（REJECTED / CANCELLED / FAILED） |
| **Info** | `#0EA5E9` | 信息 / 进行中（与 Secondary 同源） |
| **Neutral** | 见下 | 主体文字 / 边框 / 背景 / 默认 UI |

> 语义色是**全局一致**的：Web 与 Admin 的同一种状态必须使用同一语义色，允许不同应用主题对「中性」做差异化处理。

---

## 4. Neutral Scale（冻结）

| 阶 | Hex | 用途 |
| --- | --- | --- |
| 50 | `#F8FAFC` | 页面浅背景 |
| 100 | `#F1F5F9` | 卡片底色 / 表头 |
| 200 | `#E2E8F0` | 默认边框 |
| 300 | `#CBD5E1` | 强调边框 |
| 400 | `#94A3B8` | 禁用文字 / 次要占位（慎用，需满足对比度） |
| 500 | `#64748B` | 次要文字 |
| 600 | `#475569` | 次级强调文字 |
| 700 | `#334155` | 正文文字 |
| 800 | `#1E293B` | 标题 / 强调 |
| 900 | `#0F172A` | 深色表面 / Footer 背景 |

---

## 5. Status Tone 确定性映射（冻结）

所有业务状态必须映射到语义色；未知状态回退 `neutral`。

| 语义 | 代表性状态 |
| --- | --- |
| success | ACTIVE / PUBLISHED / ACCEPTED / APPROVED / COMPLETED / ENABLED / ONLINE |
| info | OPEN / SUBMITTED / PROCESSING / IN_PROGRESS / REVIEWING / VIEWED |
| warning | PENDING / PENDING_REVIEW / UNREAD / ATTENTION / DUE / HARD_FAIL |
| error | REJECTED / CANCELLED / FAILED / ERROR / BLOCKED / SUSPENDED |
| neutral | DRAFT / CLOSED / DISABLED / INACTIVE / ARCHIVED / EXPIRED |

---

## 6. Usage Rules（禁止项）

- 禁止**全站染 Blue**：Primary 只用于 CTA / Active / Link / Focus / 关键身份，不作为普通 UI 大面积铺底。
- 禁止 **Primary + Cyan + Amber 同时充当主视觉**。
- 禁止在组件代码中硬编码与冻结值不一致的新色值；如需色值差异，先回到本文件评估。
- 对比度：正文（neutral-700/800）与背景差异需满足 WCAG AA；`neutral-400` 不得用于关键文字。

---

## 7. Cross-App Theme Boundary

| Aspect | Web | Admin |
| --- | --- | --- |
| 品牌色 / Primary | `#2563EB` | `#2563EB`（AntD primary） |
| 语义色（Success/Warning/Error） | 全局一致 | 全局一致 |
| 中性背景 | `#F8FAFC` 为主 | `#f5f7fa`（layout）、`#0f172a`（sider） |
| 组件表达 | Tailwind 原子 | AntD 组件 |
| 一致性要求 | 语义/状态/CTA 一致 | 语义/状态/CTA 一致 |

> **统一品牌 ≠ 统一组件库**：允许 `Web Card ≠ AntD Card`，但 Primary/Success/Warning/Error/Radius/状态语义/CTA 优先级/反馈行为必须一致。

---

## 8. 与代码包的已知差异（720 登记）

当前 `packages/design-tokens` 的语义色与本文档存在偏差，**已在 720 记为 Token 代码对齐项，交由 722（Brand System Landing）落地**，720 不修改代码：

| Token | 本文档（冻结） | design-tokens 现状 | 处理 |
| --- | --- | --- | --- |
| Success | `#10B981` | `#16a34a` | 722 对齐 |
| Warning | `#F59E0B` | `#d97706` | 722 对齐 |
| Error | `#EF4444` | `#dc2626` | 722 对齐 |

---

*注：本文件为 M32 Design Token 冻结基线。任何色值变更必须经 M32 变更评审，不得私自扩大。*