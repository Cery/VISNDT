# VISNDT 前端（Web + Admin）规划实施方案

**基准日期：2026-09-10 | 依据：直接读取仓库真实路由配置
（`apps/web/src/app` 全部 `page.tsx` + `apps/admin/src/router/index.tsx`），
不是重新设想一套页面，是给已经存在的真实页面结构补一份系统化设计文档。**

> **关于设计权威性的说明（2026-09-10 更新）**：你已明确本文档的设计
> 判断为准，现有实现仅作参考，不是必须原样保留的基准。因此本文档
> 里的决策类表述（如第七节、第十节）是**确定性设计结论**，不是
> "建议你确认"的开放问题——除非另有明确保留原样的说明。

---

# 第一部分：设计系统规范（最终版，两端通用原则+各自专属令牌）

## 一、通用原则（Web/Admin 共享）

- 字体：Noto Sans SC（正文）+ JetBrains Mono（参数数值/编号/时间戳）
- 圆角：2px（呼应"工程图纸/精密测量"语感，不用大圆角的"友好"风格）
- 禁止事项：不用图标卡片网格作为主要信息呈现方式（除非确有导航
  必要）；不用无意义的渐变/阴影堆叠；数据类内容一律走表格/列表，
  不用图表卡片充数

## 二、Web 端令牌（`blueprint-*`，已落地部分为准，此处补全未覆盖场景的规范）

```
--blueprint-graphite: 石墨灰，深色锚点区域（Header/Footer/Hero）
--blueprint-paper: 暖纸色，页面主背景
--blueprint-amber: 琥珀，主强调色/CTA
--blueprint-verdigris: 靛青绿，次要强调/成功语义
```
**新增应用范围**（目前只覆盖 8 个文件，第二部分会详细规划扩展到
全部 56 页面的应用规则）。

## 三、Admin 端令牌（此前设计稿版本，正式确认为规范）

```
--ink: #20242A（主操作按钮/文字）
--amber: #CE8A2E（警示/品牌强调，与 Web 端琥珀色同源）
--verdigris: #4F7A6E（成功）
--rust: #B54B3F（错误）
--slateblue: #5B7C99（处理中/信息）
--neutral: #8B8578（草稿/未激活）
```

---

# 第二部分：Web 端（apps/web）——56 页面完整规划

## 四、信息架构总图

```
DISCOVER（公开发现层，无需登录，SEO/AI 抓取目标）
├── 首页 /
├── 产品 /products, /products/[slug], /products/compare
├── 分类 /categories
├── 搜索 /search
├── 供应商 /supplier-models, /suppliers/[id]
├── 解决方案 /solutions, /solutions/[slug]
├── 知识 /knowledge, /knowledge/[slug], /knowledge-base,
│         /knowledge-base/[slug], /knowledge-base/domains/[slug]
├── 内容 /articles, /articles/[slug], /insights, /insights/[slug],
│         /tags/[slug]
├── 关于 /about, /business
└── 基础 /foundation（如为内部展示页，建议确认是否应对外可见）

ACCOUNT（账户入口）
├── /login, /register
└── /dashboard, /dashboard/buyer, /dashboard/supplier（登录后落地页，
     区分角色）

WORKSPACE-BUYER（买方工作台，需登录+BUYER角色）
├── /workspace, /workspace/dashboard
├── 需求 /workspace/demands(+[id], [id]/edit, create)
├── 匹配 /workspace/matches(+[matchId])
├── RFQ /workspace/rfqs(+[id], create)
├── 评估 /workspace/evaluations
├── 通知 /workspace/notifications
└── 设置 /workspace/settings

WORKSPACE-SUPPLIER（供应商工作台，需登录+SUPPLIER角色）
├── /workspace/supplier
├── 型号 /workspace/supplier/products(+[id])
├── 报价 /workspace/supplier/offers(+new, [id]/edit)
├── 询价 /workspace/supplier/inquiries(+[id])
├── RFQ /workspace/supplier/rfqs(+[id])
├── 响应 /workspace/supplier/responses
├── 商机 /workspace/supplier/opportunities
├── 成员 /workspace/supplier/members
├── 资料 /workspace/supplier/profile
├── 展示 /workspace/supplier/display
└── 运行时 /workspace/supplier/runtime(+products/[id]/inquiry-context)

SYSTEM
└── /offline（PWA 离线兜底页）
```

## 五、页面模板设计规范（每类模板详细设计一次，下表映射到具体页面）

### 模板 W1：发现型列表页（对应 /products, /categories, /search,
/supplier-models, /solutions, /knowledge-base, /articles, /insights）

```
结构：
┌─────────────────────────────────────┐
│ 面包屑 + 页面标题 + 一句话说明        │
├─────────────────────────────────────┤
│ 筛选栏（左侧固定筛选面板 + 顶部搜索框）│
├─────────────────────────────────────┤
│ 结果计数 + 排序方式                   │
├─────────────────────────────────────┤
│ 卡片/列表结果区（无限滚动或分页二选一，│
│  产品类用卡片带关键参数摘要，          │
│  文章类用列表带摘要+标签）             │
└─────────────────────────────────────┘
设计要求：卡片上直接展示 2-4 个关键参数（不是笼统的图片+标题），
延续第一部分"工程图纸"语言；每个结果项的参数名如涉及专业术语，
挂载ⓘ释义（详见《重新设计工程方案》11节设计）
```

### 模板 W2：详情页（对应 /products/[slug], /suppliers/[id],
/solutions/[slug], /knowledge/[slug], /knowledge-base/[slug],
/articles/[slug], /insights/[slug]）

```
结构：
┌─────────────────────────────────────┐
│ 面包屑                                │
├───────────────┬─────────────────────┤
│ 主图/媒体展示   │ 标题+关键信息摘要卡    │
│               │ （产品：核心参数速览；  │
│               │  供应商：认证标识+简介）│
│               │ 主行动按钮（询价/联系） │
├───────────────┴─────────────────────┤
│ 详细参数表（产品类，ⓘ 释义挂载点）     │
├─────────────────────────────────────┤
│ 关联内容（同分类其他产品/相关知识文章/ │
│  应用场景内容——双向关联，见重新设计    │
│  方案12.3节）                         │
└─────────────────────────────────────┘
```

### 模板 W3：工作台列表页（对应 workspace 下所有 demands/matches/
rfqs/offers/inquiries/responses 等列表）

```
结构：延续模板 W1 但去掉营销性元素，强调状态和操作：
┌─────────────────────────────────────┐
│ 页面标题 + "创建"主按钮（如适用）       │
├─────────────────────────────────────┤
│ 状态筛选 tab/pill（对应各自状态机）     │
├─────────────────────────────────────┤
│ 表格（非卡片）：编号/标题/状态/时间/操作│
└─────────────────────────────────────┘
设计要求：状态色与 Admin 端保持同一套语义色（第一部分三），
买卖双方看到的同一实体状态标签视觉必须一致，不能各画一套
```

### 模板 W4：工作台表单页（对应 create/edit 系列）

```
结构：
┌─────────────────────────────────────┐
│ 面包屑 + 标题                          │
├─────────────────────────────────────┤
│ 分步或分区表单（按参数组分区，呼应       │
│  ParameterGroup 结构，不要把所有字段    │
│  堆在一个长表单里）                     │
├─────────────────────────────────────┤
│ 底部：保存草稿 / 提交 双按钮（如状态机   │
│  支持草稿态）                          │
└─────────────────────────────────────┘
```

### 模板 W5：工作台概览页（对应 /workspace/dashboard,
/workspace/supplier, /dashboard/buyer, /dashboard/supplier）

```
结构：延续 Admin 端"待办优先"理念（不是 KPI 图表墙）：
┌─────────────────────────────────────┐
│ 欢迎语 + 关键待办数（我的待处理需求/    │
│  待回复询价/待确认报价等，真实数字，    │
│  不是装饰性 KPI）                      │
├─────────────────────────────────────┤
│ 待办队列（类似 Admin 治理队列的设计，   │
│  但内容是"我自己需要处理的事"）         │
├─────────────────────────────────────┤
│ 快捷入口（发布需求/查看匹配/管理型号等）│
└─────────────────────────────────────┘
```

## 六、Web 端 56 页面到模板的完整映射表

| 页面路径 | 模板 | 备注 |
|---|---|---|
| `/` | 专属（首页，已落地不变） | — |
| `/products` | W1 | — |
| `/products/[slug]` | W2 | — |
| `/products/compare` | 专属（已有 407 行真实实现） | 建议挂载ⓘ释义，见第七节 |
| `/categories` | W1（简化版，多为导航非详细筛选） | — |
| `/search` | W1 | 统一发现层，跨 Product/SupplierProduct/Knowledge/Content |
| `/supplier-models` | **建议下线** | 独立供应商浏览入口，与第七节决策冲突；`PublicFooter.tsx` 对应链接需一并移除 |
| `/suppliers/[id]` | **建议下线** | 独立供应商详情页，与第七节决策冲突；`SupplierInfo.tsx` 的跳转链接需一并移除 |
| `/solutions`, `/solutions/[slug]` | W1 / W2 | — |
| `/knowledge`, `/knowledge/[slug]` | W1 / W2 | — |
| `/knowledge-base`, `/knowledge-base/[slug]`, `/knowledge-base/domains/[slug]` | W1 / W2 | 与 `/knowledge` 路由重叠，建议核实是否为同一功能的新旧两套实现（见第八节问题清单） |
| `/articles`, `/articles/[slug]` | W1 / W2 | — |
| `/insights`, `/insights/[slug]` | W1 / W2 | — |
| `/tags/[slug]` | W1（按标签聚合） | — |
| `/about`, `/business` | 专属（纯内容页） | — |
| `/foundation` | 待确认用途 | 见第八节 |
| `/login`, `/register` | 专属（表单，已有实现） | — |
| `/dashboard`, `/dashboard/buyer`, `/dashboard/supplier` | W5 | — |
| `/workspace`, `/workspace/dashboard` | W5 | — |
| `/workspace/demands`(list) | W3 | — |
| `/workspace/demands/[id]` | W2（工作台版详情） | — |
| `/workspace/demands/[id]/edit`, `/create` | W4 | — |
| `/workspace/matches`, `/workspace/matches/[matchId]` | W3 / W2 | — |
| `/workspace/rfqs`(+[id]/create) | W3 / W2 / W4 | — |
| `/workspace/evaluations` | W3 | — |
| `/workspace/notifications` | W3（简化） | — |
| `/workspace/settings` | W4（配置表单） | — |
| `/workspace/supplier`(概览) | W5 | — |
| `/workspace/supplier/products`(+[id]) | W3 / W2 | — |
| `/workspace/supplier/offers`(+new,[id]/edit) | W3 / W4 | — |
| `/workspace/supplier/inquiries`(+[id]) | W3 / W2 | — |
| `/workspace/supplier/rfqs`(+[id]) | W3 / W2 | — |
| `/workspace/supplier/responses` | W3 | — |
| `/workspace/supplier/opportunities` | W3 | 建议明确与 responses/rfqs 的区分定义，见第八节 |
| `/workspace/supplier/members` | W3+W4 | 组织成员管理 |
| `/workspace/supplier/profile` | W4 | — |
| `/workspace/supplier/display` | 专属（供应商公开展示页预览） | — |
| `/workspace/supplier/runtime`(+products/[id]/inquiry-context) | 专属，需求不明确 | 见第八节 |
| `/offline` | 专属（PWA兜底） | 不需要设计投入 |

## 七、供应商信息展示原则——重要设计决策（已确认，非开放问题）

**决策**：平台不做独立可浏览的供应商详情页/供应商列表页，供应商信息
仅作为产品信息的一部分嵌入展示，不给"人找供应商"这条路径投入设计。

**理由**：
1. 防止平台被绕过——独立供应商店铺页会让买家在第一次触达后就能
   直接绕开平台联系供应商，产品为中心的信息架构能延长平台在每次
   采购决策里的必要性
2. 防止供应商资源被竞品收割——完整可浏览的供应商目录等于把"平台
   招募到了哪些供应商"直接暴露给任何访问者，包括竞品
3. 与已确认的架构方向一致——`Product` 是平台权威资产，`Offer`/
   供应商关系不该被前端设计成同等地位的"一等公民"

**直接读代码确认的现状与需要改动的具体点**（这三处已经是真实存在
的代码，不是假设）：
- `/suppliers/[id]`——**独立供应商详情页，建议下线**，不作为可
  到达的公开路由保留
- `/supplier-models`——**独立供应商型号列表页，建议下线**，
  `PublicFooter.tsx` 第 19 行当前有链接指向它（"供应型号"），需要
  一并移除
- `apps/api/src/search/search.service.ts`——**统一搜索把 `Supplier`
  作为独立可检索、可返回的实体类型之一**（第 499 行附近，来源是
  `PUBLISHED SupplierProduct → Organization`），需要从统一搜索的
  返回类型里移除，不让"供应商"作为搜索结果的一等公民出现
- `components/products/SupplierInfo.tsx` 第 63 行——**产品详情页里
  嵌入的供应商信息组件，当前有一个链接跳转到 `/suppliers/${id}`**，
  这是一个具体的"泄漏点"：即使做了①②的下线，这个链接不删，用户
  还是能从产品页点进已经不该存在的供应商页——需要一并移除这个
  跳转链接

**替代设计**（正面方案，不只是"删掉什么"）：产品详情页保留供应商
信息**嵌入区块**（复用已经存在的 `SupplierInfo.tsx`/
`SupplierModelsSection.tsx`/`SupplierCompareTable.tsx` 这套组件，
它们的"多个供应商型号并排比较"这个模式本身没有问题，问题只在于
不该有单独跳出去的详情页链接），展示范围限定为：公司名 + 认证徽章
（呼应代码库整理方案里的信任标识设计）+ 地区，**不展示**完整产品
目录入口和直接联系方式；联系方式的完整暴露延后到买家已经发起
实际询价动作（RFQ 建立）之后。

---

# 第三部分：Admin 端（apps/admin）——30 功能区完整规划

## 八、信息架构总图（基于真实路由配置，含此前确认的 Home.tsx 死代码修正）

```
运营指挥台 /home（真实组件：OperationCenter，"待办优先"模式；
                  Home.tsx 从未被路由引用，是死代码，建议删除，见十节）

产品治理
├── /products(+create,[id],[id]/edit)
├── /products/[productId]/media(+create,[id]/edit)
├── /product-categories(+create,[id]/edit)
├── /parameter-groups(+create,[id],[id]/edit)
├── /parameter-definitions(+create,[id],[id]/edit)
└── /supplier-products(+create,[id])   ← 治理审核核心

组织与用户
├── /organizations(+create,[id],[id]/edit)
└── /users(+create,[id],[id]/edit)

商务流程
├── /demands(+[id],[id]/edit)
├── /demands/[demandId]/matches/[matchId]
├── /matching（监控页）
├── /rfqs(+create,[id])
├── /rfq-responses/[id]
├── /offers(+[id])
└── /inquiries(+[id])

内容与知识库
├── /content(+create,[id])
├── /content/tags(+create,[id]/edit)
├── /knowledge/domains(+create,[id]/edit)
├── /knowledge/categories(+create,[id]/edit)
├── /knowledge/entries(+create,[id]/edit)
├── /media
└── /product-category-knowledge-mappings(+create,[id]/edit)

平台运营
├── /analytics, /business-analytics
├── /monitoring, /audit-intelligence, /audit-logs
├── /embedding
├── /notifications(+[id])
└── /files/orphans

其他
├── /foundation（设计系统验证页，非业务功能，建议确认是否应保留在
│    生产路由里，还是应该只在开发环境可访问）
└── /login
```

## 九、Admin 页面模板设计规范

沿用此前设计稿（`admin_unified_design_system.html`）里已经定型的三套
模板，正式确认为规范：

- **模板 A1：治理首页**（`/home`）——待办队列为主体，见设计稿
- **模板 A2：列表页**——统一页头（第一部分二的令牌）+ 筛选栏 +
  状态 pill + 表格，替代现有 15+ 处内联重复页头写法
- **模板 A3：详情/审核页**——身份信息卡 + 审核工作流时间轴（呼应
  `supplier-products` 真实状态机）+ 参数值表

**映射规则**：30 个功能区里，凡是"列表+create+detail+edit"四件套
齐全的（products/organizations/users/rfqs/offers/supplier-products/
content/knowledge三级/parameter-groups/parameter-definitions/
product-categories/product-category-knowledge-mappings），统一走
A2（列表）+A3（详情）+A4（表单，此前设计稿未单独展示，规范同
Web端模板W4的分区表单原则）三件套；`analytics`/`business-analytics`/
`monitoring`/`audit-intelligence` 这几个是数据分析类页面，不套用
A1-A4 模板，维持现有 recharts 图表呈现方式，但页头统一成 A2 的
页头组件样式。

---

# 第十、设计决策记录（已确认，替代此前的"待确认问题清单"）

以下五项此前列为开放问题，本轮已逐一核实代码并给出确定性结论：

1. **`Home.tsx` 死代码**——确认从未被 `router/index.tsx` 引用，
   `/home` 实际路由指向 `OperationCenter`。**决策：删除 `Home.tsx`
   及其 barrel 导出**，零风险。

2. **`/knowledge` 与 `/knowledge-base` 并存**——核实代码量与导航
   实际链接：`PublicHeader.tsx` 顶部导航"知识中心"链接的是
   `/knowledge-base`（762 行完整实现，含三级页面），`/knowledge`
   （479 行）没有被主导航引用，是更早期或并行的实现。**决策：
   `/knowledge-base` 为唯一权威路由，`/knowledge` 下线或做 301
   重定向到对应的 `/knowledge-base` 路径，不维护两套**。

3. **`opportunities`/`responses`/`rfqs`（供应商工作台）语义边界**——
   核实代码确认 `opportunities` 页面内部有 `available`/`targeted`/
   `matches` 三个 tab，是"**可响应的 RFQ 发现入口**"（公开可见的+
   定向发给我的+系统匹配到我的），跟 `responses`（**我已提交的
   响应记录**，结果导向）、`rfqs`（**我在跟进的 RFQ 列表**，更偏
   全量视图）在语义上并不真的重复，是一个三段式漏斗：**发现
   （opportunities）→ 响应（提交）→ 追踪（rfqs/responses）**。
   **决策：三个页面保留，但导航文案需要明确体现这个漏斗关系**
   （比如 opportunities 命名为"询价机会"、responses 命名为"我的
   响应记录"），避免用户看名字混淆。

4. **`/workspace/supplier/runtime`**——核实代码注释确认这是"M28.0
   Supplier Runtime"，明确写"**NOT a Marketplace/Seller Center —
   read-only**"，实际功能是供应商浏览平台产品目录、为自己"认领"
   （`attachSupplierProduct`）某个平台产品作为自己可供应的型号
   起点，跟 `/workspace/supplier/products`（管理**已认领**的型号）
   是两个不同阶段。**决策：保留，但建议改名为更直观的"产品认领"
   或"能力接入"，`runtime`这个命名对用户不友好，属于开发内部术语
   泄漏到了路由/功能命名上**。

5. **`/foundation`（两端同名路由）**——确认 Admin 端的
   `FoundationShowcase.tsx` 是设计系统验证页（非业务功能）。
   **决策：两端的 `/foundation` 均不应出现在正式导航里，也不应该
   被搜索引擎索引**（加入 `robots.txt` 排除或改为仅开发环境可访问），
   属于开发工具性质的页面，不需要设计投入。

**加上本轮新确认的供应商信息展示决策（见第七节），本文档不再有
开放问题，全部转为可执行的设计决策。**

