# apps/web 用户端设计方案

**日期：** 2026-08-01
**依据：** ① `docs/VISNDT-Blueprint/600_Frontend/`（601-610，共 10 份、约 1.8 万行的前端蓝图文档，已冻结）② 对 `apps/api` 全部相关 controller 的逐文件核实 ③ `database/prisma/schema.prisma` 实际 22 个模型 ④ 上一版审校报告（M13.4_Web_Frontend_最优设计_审校版.md）里已确认的修正点

**先说结论：** 你其实不缺设计——`docs/VISNDT-Blueprint/600_Frontend/` 下已经有一套非常完整、且已经"冻结（FINAL）"的用户端信息架构、组件体系、状态管理和部署方案，比 Trae 那份 M13.4.0 报告详细得多。问题是 Trae 在做架构评审时**没有读这套文档**，只是从后端 API 反推了一套自己的信息架构，结果既遗漏了 Blueprint 里已经规划好的营销/内容页面，也在状态管理、部署这些点上给出了跟 Blueprint 冲突的建议（我在上一份报告里指出的 Vercel、next-auth 问题）。

这份方案做的事：把 Blueprint 的既有设计、后端真实能力、我的修正意见，合成一份可以直接排期的建设方案。

---

## 1. 信息架构总表（路由 × 数据来源 × 就绪度）

来自 Blueprint 602/608/610 号文档的既定路由规划，逐条核对了对应的后端数据支撑情况：

### 1.1 公共营销区（Public Site）

| 路由 | 页面 | 数据来源 | API 就绪度 |
|---|---|---|---|
| `/` | 首页 | Product 精选 + ProductCategory | ✅ 就绪 |
| `/products` | 产品列表（设备查询中心） | `GET /products`（公开） | ✅ 就绪 |
| `/products/[slug]` | 产品详情 | `GET /products/:id` + `GET /products/:id/media`（均公开） | ✅ 就绪 |
| `/products/categories/[slug]` | 分类页 | `GET /product-categories`（公开） | ✅ 就绪 |
| `/solutions` `/solutions/[slug]` | 解决方案 | Blueprint 规划的内容页 | ❌ **数据库无对应模型**（见第 3.1 节） |
| `/applications` `/applications/[slug]` | 应用场景 | 同上 | ❌ 同上 |
| `/knowledge` `/knowledge/[slug]` | 知识中心（SEO 内容） | 同上 | ❌ 同上 |
| `/about` | 关于我们 | 静态内容 | ✅ 无需后端 |
| `/contact` | 联系我们 | 静态 + 表单提交 | 🟡 需要一个轻量的表单提交端点（或直接用邮件服务，不经后端） |

### 1.2 需求撮合区（Demand Center）

| 路由 | 页面 | 数据来源 | API 就绪度 |
|---|---|---|---|
| `/demands` | 需求列表（公开，联系方式脱敏） | `GET /demands` | ✅ 就绪 |
| `/demands/[id]` | 需求详情 | `GET /demands/:id` | ✅ 就绪 |
| `/demands/new` | 发布需求（多步表单） | `POST /demands` + 参数录入端点 | ✅ 就绪（含 `parameters` 子端点） |
| `/account/demands` | 我的需求 | `GET /demands/my`（机构级过滤） | ✅ 就绪 |
| `/demands/[id]/matches` | 匹配结果 | `GET /demands/:id/matches` | ✅ 就绪 |

### 1.3 用户中心（Account）

| 路由 | 页面 | 数据来源 | API 就绪度 |
|---|---|---|---|
| `/account/profile` | 个人资料 | `GET/PATCH /users/:id`（本人） | ✅ 就绪 |
| `/account/favorites` | 收藏夹 | Blueprint 规划 | ❌ **数据库无 Favorite 模型**（见第 3.2 节） |
| `/account/demands` | 我的需求 | 同 1.2 | ✅ 就绪 |
| `/account/messages` | 消息中心 | `GET /notifications`（认证即用户态） | ✅ 就绪 |
| `/login` `/register` | 登录注册 | `POST /auth/login` `/auth/register` | ✅ 就绪 |

### 1.4 供应侧工作台（Organization Dashboard，对应 Blueprint 610 号文档）

| 路由 | 页面 | 数据来源 | API 就绪度 |
|---|---|---|---|
| `/dashboard` | 工作台首页（聚合统计） | 组合多个端点 | ✅ 就绪 |
| `/dashboard/profile` | 机构资料 | `GET/PATCH /organizations/:id` | 🟡 详情端点目前要求登录，需公开化改造（见上一份报告第 4 节） |
| `/dashboard/offers` | Offer 管理 | `GET/POST/PATCH /offers` | ✅ 就绪 |
| `/dashboard/rfqs` | RFQ Inbox | `GET /rfqs`、`GET /rfqs/:id` | ✅ 就绪（公开列表，前端按机构过滤展示） |
| `/dashboard/rfqs/[id]/respond` | 响应处理 | `POST/GET rfqs/:id/responses` | ✅ 就绪 |
| `/dashboard/notifications` | 通知中心 | `GET /notifications` | ✅ 就绪 |

**统计：** Blueprint 规划的核心业务闭环页面（产品、需求、供应侧工作台、用户中心）**19 个路由里 16 个后端已就绪**，只有机构详情公开化 1 处需要改（已排进上一份报告的 M13.4.1），另外 3 个是营销内容页面缺数据模型（不是 bug，是产品决策，见第 3 节）。

---

## 2. 技术栈：以 Blueprint 冻结版为准，同时修正它没考虑到的点

Blueprint 每份文档末尾都有一段 "Current Implementation Target"（Next.js 对齐版本，区别于文档前半段的历史 Vue3 方案）。这部分是**已经写清楚、可以直接抄的**：

| 决策项 | Blueprint 冻结方案（604/605/609 号文档） | 我的修正 |
|---|---|---|
| 客户端状态 | **Zustand**（appStore / userStore / productStore / searchStore / requirementStore） | 沿用，无需改 |
| 服务端数据缓存 | **TanStack Query**（产品列表、详情、需求状态、参数字典、搜索结果全部走它） | 沿用——这一点比 Trae 报告里"纯 Context"的方案更成熟，直接按 Blueprint 来 |
| Token 存储 | **localStorage + Zustand persist middleware** | 沿用，理由见下 |
| 部署 | **Docker（推荐），Provider 无关性** | 沿用——这跟我在上一份报告里给的修正结论完全一致，说明 Vercel 那条路从一开始就不该走 |
| 组件体系 | Next.js + React + TypeScript，明确划分 Server/Client Component 边界 | 沿用 |

**关于 Token 存储的说明（修正我自己上一版报告的一个疏漏）：** 我在上一份报告里建议改用 httpOnly cookie 存 JWT，理由是"担心 SSR 页面读不到 localStorage"。这次读了 Blueprint 610 号文档才确认：供应侧工作台（Dashboard/Offers/RFQ Inbox）在 Blueprint 里的定位本来就是**认证后的客户端渲染场景**，公开的 SSR/ISR 页面（产品、需求列表）本来就不需要个人化数据。也就是说"SSR 页面需要服务端读 token"这个场景在当前信息架构里并不存在，localStorage + Zustand 这套方案是够用的，而且和 Admin 前端现有的做法一致，两端体验统一。**上一份报告里"改用 next-auth 的替代方案"这一条可以简化——不需要 next-auth，也不需要额外做 cookie 代理层，直接照抄 Admin 现成的 JWT 拦截器模式即可。**

---

## 3. Blueprint 规划了、但数据库目前不支持的三处内容

这三处不是后端遗漏，是**产品范围问题**，需要你决定怎么处理，而不是直接排进开发任务。

### 3.1 Solutions / Applications / Knowledge Center（营销内容页）

`schema.prisma` 的 22 个模型里没有任何内容管理相关的表（没有 Article / Solution / Case / News 模型）。Blueprint 602/608 号文档把这三组页面设计成 SEO 流量入口，但没有配套的数据模型设计。

两个可行方向：

| 方案 | 说明 | 适合阶段 |
|---|---|---|
| **静态内容（推荐 MVP 阶段）** | 用 Next.js 的 MDX/本地 Markdown 文件维护内容，走 SSG，不依赖数据库，构建时打包进站点 | 内容量小（几十篇以内）、更新频率低的启动期 |
| **轻量 CMS 模型** | 在 Prisma 里加 `Article`/`Solution` 表，Admin 后台加内容管理页面 | 内容量起来之后，需要非技术人员自主发布时再做 |

建议先按方案一上线，把这三组路由做出来但内容走本地 MDX，不占用 M13.4 阶2 段的后端排期；等平台跑起来、确实需要频繁发内容时，再单独立一个 M1X 阶段做 CMS 模型。

### 3.2 Favorites（收藏夹）

`GET /account/favorites` 在 Blueprint 用户中心架构里有规划，但数据库没有 Favorite/Wishlist 表。这是一个独立的小功能，不在核心业务闭环（浏览→提需求→匹配→RFQ→响应）里，建议排到 Phase 2 之后，作为一个单独的小任务（1 张表 + 1 组端点 + 1 个页面）来做，不影响主线上线时间。

### 3.3 Contact 表单

`/contact` 页面需要一个提交入口。当前后端没有"询盘/联系"相关端点。两个选项：直接用第三方表单服务（如邮件转发），或者后端加一个轻量 `POST /inquiries` 端点落库到 Admin 可查看。给你留作决策项，不影响其他页面开发。

---

## 4. 目录结构（在 Trae 报告基础上，按 Blueprint 补齐 Store/Service 层）

```
apps/web/src/
├── app/
│   ├── (marketing)/              # 公共营销区 — SSG/ISR
│   │   ├── page.tsx                      # 首页
│   │   ├── products/
│   │   │   ├── page.tsx                  # 产品列表
│   │   │   ├── categories/[slug]/page.tsx
│   │   │   └── [slug]/page.tsx           # 产品详情
│   │   ├── solutions/[slug]/page.tsx     # MDX 驱动
│   │   ├── applications/[slug]/page.tsx  # MDX 驱动
│   │   ├── knowledge/[slug]/page.tsx     # MDX 驱动
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── (demand)/                 # 需求撮合区 — ISR + 部分 CSR
│   │   ├── demands/page.tsx
│   │   ├── demands/new/page.tsx          # 多步表单，对应 Blueprint 607 号文档
│   │   └── demands/[id]/page.tsx
│   ├── (account)/                # 用户中心 — CSR，认证后
│   │   ├── account/profile/page.tsx
│   │   ├── account/demands/page.tsx
│   │   └── account/messages/page.tsx
│   ├── (dashboard)/              # 供应侧工作台 — CSR，认证后，对应 Blueprint 610 号文档
│   │   ├── dashboard/page.tsx
│   │   ├── dashboard/profile/page.tsx
│   │   ├── dashboard/offers/page.tsx
│   │   ├── dashboard/rfqs/page.tsx
│   │   └── dashboard/rfqs/[id]/respond/page.tsx
│   └── (auth)/
│       ├── login/page.tsx
│       └── register/page.tsx
├── stores/                       # Zustand，按 Blueprint 604 号文档命名
│   ├── appStore.ts
│   ├── userStore.ts
│   ├── productStore.ts
│   ├── searchStore.ts
│   └── requirementStore.ts
├── hooks/                        # TanStack Query hooks
│   ├── useProducts.ts
│   ├── useDemands.ts
│   └── useOrganization.ts
├── services/                     # 对应 Blueprint 605 号文档 Service Layer
│   ├── api-client.ts             # fetch 封装 + Admin 同款拦截器逻辑
│   ├── product.service.ts
│   ├── demand.service.ts
│   ├── offer.service.ts
│   ├── rfq.service.ts
│   └── notification.service.ts
├── components/
│   ├── product/ (ProductCard, ProductGallery, ParameterFilter, ParameterTable)
│   ├── demand/ (RequirementForm, ParameterInput, RequirementStatus)
│   ├── dashboard/ (OrganizationProfile, OfferTable, RfqInboxList)
│   └── layout/ (Header, Footer)
└── types/
    └── index.ts                  # 从 @visndt/shared-types 引入（需先补全，见上一份报告第 2.1 节）
```

---

## 5. 分阶段建设方案

| 阶段 | 内容 | 前置条件 | 预估 |
|---|---|---|---|
| **Phase 0** | 后端补齐：organizations 公开化 + shared-types 补全类型 | 无 | ~2 天（已在上一份报告排定） |
| **Phase 1** | Web Foundation：Next.js 项目骨架、Tailwind/shadcn、Docker 化、Zustand+TanStack Query 接入、Service 层、Admin 同款 JWT 拦截器 | Phase 0 | 3-4 天 |
| **Phase 2** | 产品中心：首页 + 产品列表/详情/分类（对应 Blueprint 606 号文档） | Phase 1 | 4-5 天 |
| **Phase 3** | 需求中心：需求列表/详情/多步发布表单/我的需求（对应 Blueprint 607 号文档） | Phase 1 | 4-5 天 |
| **Phase 4** | 供应侧工作台：Dashboard/机构资料/Offer管理/RFQ Inbox/响应处理（对应 Blueprint 610 号文档） | Phase 1 | 5-6 天 |
| **Phase 5** | 用户中心 + 登录注册 | Phase 1 | 2-3 天 |
| **Phase 6**（可选，需你先决策第 3 节的内容策略） | 营销内容页：About/Contact/Solutions/Applications/Knowledge（MDX 静态内容） | Phase 1 | 2-3 天（不含内容撰写） |
| **Phase 7** | SEO 收尾：sitemap、结构化数据、Meta、性能验收（对应 Blueprint 602/608 号文档验收清单） | Phase 2-6 | 2 天 |

Phase 2、3、4、5 之间没有强依赖，可以并行推进（如果是单人 + AI 协作开发，建议还是按此顺序串行，先把核心业务闭环——产品到需求到匹配——跑通，再做供应侧）。

---

## 6. 仍需你拍板的决策项汇总

| # | 决策 | 建议 |
|---|---|---|
| 1 | Solutions/Applications/Knowledge 内容策略 | MVP 用 MDX 静态内容，暂不建 CMS 模型 |
| 2 | Favorites 是否纳入首期范围 | 建议排到核心闭环之后 |
| 3 | Contact 表单是否需要后端落库 | 如果只是获客表单，第三方邮件服务即可，不需要额外后端开发 |
| 4 | ORG_ADMIN 角色（上一份报告已提出） | 若 Phase 4 的机构资料/Offer 管理只做到"机构内所有成员权限相同"，可以先不做，等需要机构内分权时再补 |
| 5 | Canonical Naming（Supplier vs Organization+Offer）（上一份报告已提出） | 建议以实际代码命名为准，回头更新 Blueprint 文档，而不是现在为了对齐命名去改后端 |

---

## 7. 结论

不需要重新设计用户端——Blueprint 600 系列文档已经把信息架构、组件体系、状态管理方案都定好了，而且质量明显高于 Trae 那份现推的报告。真正要做的是：

1. 把 Trae 报告里跟 Blueprint 冲突的部分（Vercel、next-auth）按 Blueprint 冻结版纠正过来——这在上一份报告里已经处理；
2. 把 Blueprint 规划的路由跟后端真实能力对一遍表（本文档第 1 节），确认 19 个核心页面里 16 个可以直接开工；
3 个内容型页面需要你先决定内容策略，不是技术缺口；
3. 按第 5 节的阶段顺序排期，Phase 0（后端补齐）之后就可以进 Phase 1 起步骤开发，不需要再等额外的架构评审。