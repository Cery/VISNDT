# 646_Three_Role_Functional_Test_Report

> Project: **VISNDT Industrial Inspection Capability Discovery Platform**
>
> Date: **2026-08-22**
>
> Scope: **Buyer / Supplier / Admin 三角色全流程功能测试**
>
> Repo Root: `F:\Desktop\VISNDT`
>
> Code Root: `F:\Desktop\VISNDT\VISNDT`
>
> 测试方式：**服务运行时核验 + 演示数据核验 + API 层认证/权限核验 + 浏览器自动化（受限） + 前端路由/页面代码静态核验**

---

## 1. 测试环境与数据基线

### 1.1 服务运行状态

| Service | Port | 状态 |
| --- | --- | --- |
| PostgreSQL | 5432 | ✅ AVAILABLE |
| API (NestJS) | 4000 | ✅ LISTENING |
| Web (Next.js) | 3000 | ✅ LISTENING |
| Admin (Vite) | 3001 | ✅ LISTENING（本轮启动） |

### 1.2 演示账号（密码均 `demo123456`）

| 角色 | 邮箱 | 姓名 | 组织 | workspaceRole（API 实测） |
| --- | --- | --- | --- | --- |
| Buyer | demo.buyer.01@visndt.local | 张检测 | 江南航空检测技术中心（BUYER） | **BUYER** ✅ |
| Supplier | demo.supplier.01@visndt.local | 王明视 | 明视工业检测设备有限公司（SUPPLIER） | **SUPPLIER** ✅ |
| Admin | demo.admin@visndt.local | Demo Admin | VISNDT 平台运营中心（ADMIN） | null（设计行为，走 3001 管理端）✅ |

> **说明**：Admin 组织类型 `ADMIN` 不映射到 Buy/Supplier 工作台角色（`resolveWorkspaceRole` 仅映射 SUPPLIER/MANUFACTURER/DISTRIBUTOR → SUPPLIER、BUYER → BUYER），因此 admin 账号在 Web 端 `/dashboard` 显示“未配置”属**预期设计**，其管理能力在 3001 Admin 后台。

### 1.3 数据库演示数据基线（实测）

| 数据域 | 数量 | 说明 |
| --- | --- | --- |
| Demo 用户 | 6 | admin×1 / buyer×2 / supplier×3 |
| 组织 | 5 | 1 ADMIN + 1 BUYER + 3 SUPPLIER |
| Product | 6 | slug 非 demo- 前缀（计数需注意） |
| Offer | 6 | 供应方案 |
| Demand | 5 | 采购需求 |
| **DemandMatch** | **0** | 匹配数据为空 |
| RFQ | 11 | 询价单 |
| RFQResponse | 12 | 询价响应 |
| Content | 7 | 内容 |
| **FileAsset** | **0** | 媒体资产为空 |
| **ContentTag** | **0** | 内容标签为空 |
| ProductCategory | 12 | 产品分类 |
| KnowledgeEntry / Category | 6 / 6 | 知识库 |
| Notification | 26 | 通知 |
| ConversionEvent / WorkflowEvent | 183 / 53 | 转化与工作流事件 |

> **数据空态提示**：Match、FileAsset、ContentTag 为空数据，相关页面应展示合理空态（这本身是待验证点，见 §6 风险）。

---

## 2. API 层认证核验（VERIFIED）

通过 API 直连 `http://localhost:4000/api/v1` 完成三角色登录 + `/auth/me` 核验：

| 角色 | POST /auth/login | GET /auth/me 返回 | workspaceRole |
| --- | --- | --- | --- |
| Buyer | 201 ✅ | organization.type=BUYER、organizationMember.role=BUYER | **BUYER** ✅ |
| Supplier | 201 ✅ | organization.type=SUPPLIER、organizationMember.role=SUPPLIER | **SUPPLIER** ✅ |
| Admin | 201 ✅ | organization.type=ADMIN、organizationMember.role=ADMIN | **null**（设计行为）✅ |

**结论：后端认证链路正常，工作台角色解析逻辑正确。**

---

## 3. Buyer 全流程测试结果

| # | 功能点 | 结果 | 证据/说明 |
| --- | --- | --- | --- |
| B1 | 登录 → dashboard | ⚠️ 受限 | API 层 workspaceRole=BUYER 已确认；浏览器自动会话中登录成功跳转 `/dashboard`，但自动化会话显示“工作区角色未配置”（与 API 结果矛盾，判定为自动化会话问题，需人工复核一次） |
| B2 | 公共首页 /（hero/分类网格/精选产品/平台流程） | ⚠️ 受限 | 未完成浏览器渲染验证（自动化会话中断） |
| B3 | 产品列表 /products + 筛选/排序 | ⚠️ 受限 | 同上 |
| B4 | 产品详情 /products/[slug] + tabs | ⚠️ 受限 | 页面路由/组件存在（代码静态核验通过） |
| B5 | 搜索 /search + 类型切换 + facets | ⚠️ 受限 | 组件齐全（GlobalSearchBar/SearchTypeTabs/ParameterFacet 等） |
| B6 | 分类页 /categories | ⚠️ 受限 | 路由存在 |
| B7 | 新建需求 /workspace/demands/create → 列表/详情 | ⚠️ 受限 | 表单与页面代码存在 |
| B8 | 匹配页 /workspace/matches | ⚠️ 受限 | 数据为空，应展示空态（待验证） |
| B9 | 产品询价表单提交 | ⚠️ 受限 | InquiryForm/InquirySection 组件存在 |
| B10 | RFQ 列表 /workspace/rfqs | ⚠️ 受限 | 页面存在，数据 11 条 |
| B11 | 通知 /workspace/notifications | ⚠️ 受限 | 页面存在，数据 26 条 |
| B12 | 控制台报错 | ⚠️ 部分 | 自动化会话记录到 SSR/客户端属性不匹配及 ERR_ABORTED，需人工复核是否真实 |

---

## 4. Supplier 全流程测试结果

| # | 功能点 | 结果 | 证据/说明 |
| --- | --- | --- | --- |
| S1 | 登录 → dashboard | ✅ | 浏览器自动化登录成功，显示已登录账号信息 |
| S2 | 供应商工作台 /workspace/supplier（+dashboard） | ⚠️ 受限 | 自动化访问 /workspace/* 持续超时（环境问题） |
| S3 | 供应商展示 /workspace/supplier/display | ⚠️ 受限 | 页面存在（含“当前角色”展示） |
| S4 | 供应方资料 /workspace/supplier/profile | ⚠️ 受限 | 页面存在 |
| S5 | 方案列表 /workspace/supplier/offers | ⚠️ 受限 | 数据 6 条 |
| S6 | RFQ 响应 /workspace/supplier/responses | ⚠️ 受限 | 数据 12 条 |
| S7 | 收到的 RFQ /workspace/supplier/rfqs | ⚠️ 受限 | 页面存在 |
| S8 | 新建能力方案（Offer，带标识） | ⚠️ 受限 | 表单入口在 Admin 或工作台（需人工定位） |
| S9 | 对 RFQ 创建响应/报价 | ⚠️ 受限 | 未完成 |
| S10 | 接收匹配信息 | ⚠️ 受限 | Match 数据为空，应展示合理空态 |
| S11 | 控制台报错 | ✅ | 登录及 dashboard 无 error/warning（仅 React DevTools info） |

---

## 5. Admin 全流程测试结果（Admin 后台 :3001）

### 5.1 路由/菜单清单核验（代码静态核验 VERIFIED）

Admin 路由（`apps/admin/src/router/index.tsx`）共 **50+ 条**，覆盖用户列举的全部管理项：

| 管理域 | 路由 | 页面组件 |
| --- | --- | --- |
| 工作台总览 | /home、/operation-center | Home、OperationCenter |
| 分析 | /analytics、/business-analytics、/monitoring、/audit-intelligence | Analytics、BusinessAnalytics、Monitoring、AuditIntelligence |
| **产品** | /products（列表/新建/编辑/详情）、/products/:id/media（列表/新建/编辑） | ProductList/Create/Edit/Detail、ProductMedia* |
| **需求** | /demands（列表/详情/编辑） | DemandList/Detail/Edit |
| **匹配** | /matching、/demands/:id/matches/:matchId | MatchingMonitor、MatchDetail |
| **用户** | /users（列表/新建/编辑/详情） | UserList/Create/Edit/Detail |
| **组织** | /organizations（列表/新建/编辑/详情） | OrganizationList/Create/Edit/Detail |
| **通知** | /notifications（列表/详情） | NotificationList/Detail |
| **RFQ** | /rfqs（列表/新建/详情）、/rfq-responses/:id | RfqList/Create/Detail、RfqResponseDetail |
| **报价** | /offers（列表/详情） | OfferList/Detail |
| **询价** | /inquiries（列表/详情） | InquiryList/Detail |
| **参数** | /parameter-groups、/parameter-definitions（各列表/新建/编辑/详情） | ParameterGroup*、ParameterDefinition* |
| **分类** | /product-categories（列表/新建/编辑） | ProductCategory* |
| **内容** | /content（列表/新建/编辑）、/content/tags（列表/新建/编辑） | Content*、ContentTag* |
| **媒体** | /media、/files/orphans | MediaList、FileAssetOrphanList |
| **知识** | /knowledge/domains、/knowledge/categories、/knowledge/entries、/product-category-knowledge-mappings（各列表/新建/编辑） | Knowledge*、ProductCategoryKnowledgeMapping* |
| **嵌入/AI 治理** | /embedding | EmbeddingManagement |
| **审计** | /audit-logs | AuditLogList |

### 5.2 Admin 后台功能核验

| # | 功能点 | 结果 | 说明 |
| --- | --- | --- | --- |
| A1 | Admin 登录 | ⚠️ 受限 | Admin 登录凭据 API 已验证 201；浏览器自动化未在本轮完成 3001 后台遍历 |
| A2 | 产品 CRUD / 上下架 | ⚠️ 受限 | 组件 ProductForm 存在；需 UI 遍历 |
| A3 | 内容 / 标签管理 | ⚠️ 受限 | ContentForm/ContentSeoPanel/MarkdownEditor、ContentTag* 存在；标签数据为空 |
| A4 | 用户 / 组织管理 | ⚠️ 受限 | UserForm、OrganizationCreate/Edit 存在 |
| A5 | 参数组 / 参数定义管理 | ⚠️ 受限 | ParameterGroup*、ParameterDefinition* 存在 |
| A6 | 分类管理 | ⚠️ 受限 | ProductCategory* 存在，数据 12 |
| A7 | 媒体中心上传/管理/删除 | ⚠️ 受限 | MediaList（含治理视图）存在；FileAsset 数据为空 |
| A8 | 需求 / RFQ / 报价 / 询价管理 | ⚠️ 受限 | 页面组件存在，数据 5/11/6/… |
| A9 | 匹配监控 / 知识库 / 审计日志 / 分析 | ⚠️ 受限 | 页面组件存在 |

---

## 6. 缺陷与风险清单

### 6.1 已确认缺陷（CONFIRMED）

| ID | 严重度 | 缺陷 | 证据 |
| --- | --- | --- | --- |
| D1 | 中 | 前端 `AuthProvider.getMe()` 失败时**静默返回 null**，导致网络/会话瞬时异常时 dashboard 错误显示“工作区角色未配置”，而非错误重试或明确提示 | `apps/web/src/services/auth.service.ts` getMe catch → return null；`dashboard/page.tsx` 依此渲染“未配置” |
| D2 | 低 | Admin 账号 Web 端 `/dashboard` 显示“工作区角色未配置”（对最终用户无影响，因 Admin 走 3001 后台，但文案无引导到管理后台链接） | `resolveWorkspaceRole` 对 ADMIN 类型返回 null |

### 6.2 待人工复核项（UNVERIFIED / 受限）

| ID | 严重度 | 待复核项 | 原因 |
| --- | --- | --- | --- |
| U1 | 高 | Buyer/Supplier 浏览器会话登录后 dashboard 及 /workspace/* 全部页面实际渲染 | 浏览器自动化两次会话均因超时/会话问题中断；API 层已证明后端正常，但**端到端 UI 验证未完成** |
| U2 | 中 | /workspace/matches 空态展示是否合理 | DemandMatch=0 |
| U3 | 中 | 媒体中心（FileAsset=0）与内容标签（ContentTag=0）的空态与治理视图 | 无数据 |
| U4 | 中 | 新建需求/方案/询价/报价等写操作表单端到端提交 | 未完成浏览器提交 |
| U5 | 低 | 浏览器自动化记录的 SSR 属性不匹配 / ERR_ABORTED 是否为真实缺陷 | 未能在稳定会话中复现 |

---

## 7. 测试结论

```text
整体结论:
CONDITIONAL PASS（API 层 VERIFIED，UI 层因自动化会话受限待人工补测）

认证与权限:
BUYER / SUPPLIER / ADMIN 三角色 API 登录+workspaceRole 解析 VERIFIED

服务与数据基线:
PostgreSQL/API/Web/Admin 四端 AVAILABLE；演示数据齐全
（Match / FileAsset / ContentTag 为空，属当前数据基线）

缺陷:
D1 getMe 静默失败 → 误导性"角色未配置"（确认）
D2 Admin 角色文案无后台引导（确认，低）

未完成项:
Buyer / Supplier / Admin 三端 UI 全流程遍历（浏览器自动化受限，
需人工或稳定自动化环境补测：浏览/搜索/筛选/询价/报价/管理 CRUD 等）

Review Report:
docs/_review/646_Three_Role_Functional_Test_Report.md
```

---

## 8. 建议的后续动作

1. **优先人工复核 Buyer/Supplier 登录后 UI 流程**（U1），覆盖：首页/产品/搜索/筛选/详情 tabs、新建需求、询价、RFQ、通知、匹配空态。
2. **验证 D1 修复**：建议 `getMe()` 失败时区分“未登录”与“网络错误”，网络错误应显示重试而非“未配置”。
3. **补测 Admin 3001 后台**：重点媒体上传、产品上下架、内容标签、参数/分类 CRUD。
4. 若需全量自动化 E2E，可基于项目已有 17 个 Jest E2E（`apps/api/test/e2e/`）扩展 Playwright 浏览器层用例。
