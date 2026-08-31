# VISNDT Component Rule（M32 Design Token Freeze — v1.0）

> 状态：**FROZEN**（720_M32.0）
> 适用：Web + Admin 组件层
> 原则：**Semantic-first、状态一致、CTA 分级、跨端同语义不同组件库**

---

## 1. CTA Hierarchy（冻结）

| 层级 | 语义 | Visual 规则 |
| --- | --- | --- |
| Primary CTA | 主操作（搜索能力 / 提交需求 / 创建 RFQ / 查看匹配） | Primary 实底按钮，最高视觉权重 |
| Secondary | 次操作（查看产品 / 比较 / 查看供应商） | 描边 / Secondary 色，次权重 |
| Tertiary | 低风险（了解更多 / 查看知识） | Link / Text，低权重 |
| Danger | 破坏性操作（删除 / 拒绝 / 取消） | Error 色，明确告警 |
| Disabled | 不可操作 | neutral-300 底 + neutral-400 文字 |

> 禁止用 Marketing CTA（Get Started / Learn More / Contact Us）作为主操作，除非上下文确为营销内容。

---

## 2. Status Component（冻结）

状态必须同时表达三层信息：

- Status Badge（颜色 + 文案）
- Action（可执行操作）
- Context / Timeline（所在阶段）

| 状态 | Badge 语义色 |
| --- | --- |
| 草稿 / 归档 | neutral |
| 提交 / 进行中 | info |
| 待处理 / 待审 / 关注 | warning（Accent） |
| 通过 / 已发布 / 完成 | success |
| 拒绝 / 失败 / 阻断 | error |

> 只显示 `Status = OPEN` 不足够；须给下一步动作与上下文。未知状态回退 neutral。

---

## 3. Cross-App（Web vs Admin）

- **同语义（Same Semantic Language）**：Success/Warning/Error/状态色一致；CTA 优先级一致；状态表达方式一致。
- **不同组件（Different Application Theme）**：允许 Web Card 不等于 AntD Card，允许 Tailwind 原子 vs AntD 组件。
- 禁止把「统一品牌」扩大解释为「统一组件库」。

---

## 4. 组件开发原则

- 动效 CSS First + Native React；禁止新增 UI/Icon/Chart 库。
- 空白状态必须有引导（建议下一步动作）。
- 加载 / 成功 / 错误必须有即时反馈。
- 无障碍：语义化 heading、键盘可聚焦、Focus 可见。