# 447_M16_Precheck_Supplier_Product_Lifecycle_Audit_复核_20260812

## 0. 报告说明

- **任务编号**：M16_Precheck_Business_Flow_Audit_001
- **任务名称**：Supplier Product Lifecycle Reality Audit
- **执行模式**：ONLY READ ANALYSIS + REPORT GENERATION（未修改任何代码）
- **复核编号说明**：任务指令指定 `425`，但该编号已被 `425_Project_Global_Status_Calibration_Report.md` 占用，经确认改用 `447`，报告名加「复核」与日期。
- **审计基准**：全部结论基于真实代码/Schema/API/页面路由，禁止基于规划文档猜测。

## 1. 前置校验

| 项目 | 结果 |
| --- | --- |
| Repository Root | `F:\Desktop\VISNDT` ✅ |
| Code Root | `F:\Desktop\VISNDT\VISNDT` ✅ |
| Branch | `main` ✅ |
| Workspace | 非 clean（78 行变更，含 M18.2/446 相关，未提交，本次审计未触碰） |
| 代码改动 | 无 |

## 2. 当前产品生命周期真实状态

| 环节 | 真实实现 | 证据 |
| --- | --- | --- |
| 创建 | `POST /products`，**JwtAuthGuard + RolesGuard + Roles(ADMIN)**，仅管理员 | [products.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.controller.ts#L52-L59) |
| 存储 | `Product` 模型：`categoryId/name/model/description/status/createdById`，**无 organizationId** | [schema.prisma](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L311-L338) |
| 管理 | Admin `ProductList`：keyword/status/排序/分页 + 批量上架/下架/草稿 | [ProductList.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/ProductList.tsx#L52-L79) |
| 审核 | **无独立审核工作流**。仅 `status` 字段（DRAFT/ACTIVE/INACTIVE）+ Admin 批量状态变更（`PATCH /products/batch-status`，ADMIN） | [products.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.controller.ts#L36-L43) |
| 展示 | `GET /products` 公开搜索；`GET /products/:id` 公开详情。详情 include category/parameterValues/media/createdBy.organization/offers.organization | [products.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.service.ts#L117-L133) |
| 更新 | `PATCH /products/:id`，**ADMIN only** | [products.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.controller.ts#L61-L69) |
| 删除 | `DELETE /products/:id`，**ADMIN only**（有 offers/inquiries/demandMatches 时阻断，`force=true` 级联删除） | [products.service.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.service.ts#L145-L229) |
| 运营维护 | Admin 批量删除/状态变更 + 参数管理（`parameter/` 页面）+ 媒体管理（`product-media/` 页面） | [admin pages](file:///f:/Desktop/VISNDT/VISNDT/apps/admin/src/pages) |

**结论**：产品全生命周期（创建→存储→管理→展示→更新→删除→运营）均由 **Admin 主导**完成。

## 3. Product 数据归属模型

**当前产品属于：A. 平台统一管理产品库。**

代码证据：
1. `Product` 模型无 `organizationId`，仅 `createdById`（`Product → User`），归属由创建者 User 决定（[schema.prisma L311-338](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L311-L338)）。
2. 创建/更新/删除接口全部 `Roles(ADMIN)`（[products.controller.ts](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.controller.ts)）。
3. Product 与 Organization 仅**间接关联**：`Product.createdBy → User → Organization`（`findAll/findOne` include `createdBy.organization`，[products.service.ts L109/L124](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/products/products.service.ts#L109-L124)）。
4. `Offer` 是组织级关联实体的载体：`Offer.organizationId + productId + price/currency`，`@@unique([organizationId, productId])`（[schema.prisma L455-478](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L455-L478)）——供应商表达供货能力靠 Offer 而非产品归属。

**Product 是否属于供应商资产：否。** Product 是平台统一库资产；供应商（Organization）通过 `Offer` 关联产品表达供货。

## 4. Supplier 能力矩阵

| 能力 | 是否存在 | 证据 |
| --- | --- | --- |
| 创建产品 | ❌ 不存在 | 后端 ADMIN only；Supplier 工作台无产品入口 |
| 修改产品 | ❌ 不存在 | 后端 ADMIN only |
| 上传产品图片 | ❌ 不存在 | 媒体管理仅在 Admin `product-media/` 页面 |
| 删除产品 | ❌ 不存在 | 后端 ADMIN only |
| 管理自己的产品 | ❌ 不存在 | Supplier 无产品归属概念 |
| RFQ 机会跟进 | ✅ | `/workspace/supplier/rfqs` |
| RFQ 响应提交/跟踪 | ✅ | `/workspace/supplier/responses`、`POST /rfq-responses` |
| 创建 Offer（组织级报价） | ✅ | `POST /offers`（组织成员，需 organizationId） |

Supplier 工作台导航仅含：RFQ机会 / 我的响应 / 通知中心（[dashboard/supplier/page.tsx L52-70](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/dashboard/supplier/page.tsx#L52-L70)）。**Supplier 无任何产品自助维护能力。**

## 5. Admin 管理能力矩阵

| 功能 | 是否存在 | 证据 |
| --- | --- | --- |
| 创建产品 | ✅ | `ProductCreate.tsx` |
| 编辑产品 | ✅ | `ProductEdit.tsx` |
| 删除产品 | ✅ | `ProductList.tsx` + 后端 `DELETE` |
| 审核产品 | ⚠️ 部分 | 仅 status（上架/草稿/下架）+ `batch-status`，**无独立审核工作流** |
| 管理供应商产品 | N/A | 产品为平台统一库，无「供应商产品」概念 |
| 管理产品参数 | ✅ | `parameter/`（ParameterGroup/ParameterDefinition 全套） |
| 管理媒体图片 | ✅ | `product-media/`（List/Create/Edit） |

## 6. Offer 生命周期分析

**真实用途：B 供应商报价单 + C 撮合过程中的响应对象（混合）。**

- **模型**：`Offer` = `organizationId`（组织报价）+ `productId` + `price/currency/status`，`@@unique([organizationId, productId])`；被 `RFQResponse`、`DemandMatch` 引用（[schema.prisma L455-478](file:///f:/Desktop/VISNDT/VISNDT/database/prisma/schema.prisma#L455-L478)）。
- **谁创建**：`POST /offers`，`JwtAuthGuard`（任何属于组织的登录用户，组织成员均可，含 Supplier）。**非 Admin 专属**（[offers.controller.ts L55-64](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/offers/offers.controller.ts#L55-L64)）。
- **谁管理**：更新/提交/接受/拒绝/撤回为 **org-scoped**（组织成员，`organizationId` 匹配校验）；删除/批量为 **ADMIN only**（[offers.service.ts L98-118](file:///f:/Desktop/VISNDT/VISNDT/apps/api/src/offers/offers.service.ts#L98-L118)）。
- **是否公开展示**：Offer **无公开列表页**；在产品详情页仅用于推导询价对象（`inquirateOffer`，取 ACTIVE/SUBMITTED Offer），驱动公开询价链路（[products/[slug]/page.tsx L53-56](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/products/[slug]/page.tsx#L53-L56)）。

**结论**：Offer 是「组织级报价单」，既是供应商对产品的报价，也是撮合（DemandMatch）与询价（Inquiry）的响应/目标对象。

## 7. 前端公开展示分析

- **展示来源**：`Product` 表（平台统一库，Admin 录入）。Web `/products` 调 `getProducts`（[products/page.tsx](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/products/page.tsx)）。
- **是否展示供应商信息**：**否**。产品详情页 `ManufacturerInfo` 收到 `organization={null}`，渲染"此产品的制造商信息暂未公开"（[ManufacturerInfo.tsx L12-21](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/components/products/ManufacturerInfo.tsx#L12-L21)）。虽 API 返回 `createdBy.organization` 与 `offers.organization`，前端未绑定展示。
- **是否存在供应商主页**：**否**。无 `/supplier`、`/suppliers`、`/vendor`；仅登录后的工作台 `/workspace/supplier` 与 `/dashboard/supplier`（[workspace 路由](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/workspace)、[dashboard 路由](file:///f:/Desktop/VISNDT/VISNDT/apps/web/src/app/dashboard)）。

## 8. AI 运营可扩展性分析

基于结构化参数体系（`ParameterDefinition/ParameterGroup/ProductParameterValue`）与统一 `Product` 库，AI 辅助优先级：

| 优先级 | 场景 | 现状基础 |
| --- | --- | --- |
| P0 | 产品资料整理、参数补全（根据 category/group 推断） | 结构化参数 + 分类层级已就绪 |
| P0 | SEO 生成（title/description/meta） | 内容 SEO 字段已建立（M16.3/M18） |
| P0 | 匹配推荐（Demand↔Product 加权评分） | `ScoringService weighted_v1` 已实现 |
| P0 | RFQ 推荐（定向 RFQ 到供应商） | 定向 RFQ 机制已存在 |
| P1 | 供应商资料审核、产品去重/质量校验 | 平台统一库，数据质量可控 |
| P2 | Offer 整理、价格分析、市场洞察 | Offer 含 price/currency，可聚合 |

## 9. Business Model Alignment Check

**定位**：工业检测设备信息平台 + 需求撮合平台。

**对齐检查**：
- ✅ 无 Supplier 商城化（Supplier 无产品自助发布/店铺）
- ✅ 无 Supplier 独立店铺（无公开供应商主页）
- ✅ 无公开价格体系（`price` 在 Offer 内，不公开；产品详情页 `ManufacturerInfo` 不展示组织/价格）
- ✅ 无在线交易（撮合+询价链路，无支付/B2B 在线交易）

**风险**：
1. **产品依赖 Admin 录入**，Supplier 无法自助维护产品，规模扩展受限（产品库增长瓶颈）。
2. **公开展示不显示供应商信息**（`organization={null}`），削弱撮合信任与转化，与"信息平台"定位存在落差。
3. Product 无 `organizationId` 直接归属，产品与供应商的关联依赖 `Offer`，语义上产品是"平台资产"，供应商供货能力表达较间接。

## 10. 输出结论

**最终状态：PASS WITH RISKS**

架构符合「工业检测设备信息平台 + 需求撮合平台」定位（无商城化/独立店铺/公开价格/在线交易风险），产品生命周期（创建→存储→管理→展示→更新→删除→运营）实现完整且权限边界清晰（Admin 主导，公开只读）。主要风险为 **Supplier 产品自助能力缺失** 与 **公开展示不展示供应商信息**。

## 11. 后续 M16/M17 建议

1. **（可选）供应商产品自助能力**：若朝"供应商自助维护产品"演进，需在 `Product` 增加 `organizationId` 归属 + Supplier 产品 CRUD 端点（当前为纯 Admin 模式，此项为能力扩展，非修复）。
2. **公开展示供应商信息**：将 `findOne` 已返回的 `createdBy.organization`/`offers.organization` 绑定到 `ManufacturerInfo`，可在不扩开发范围前提下提升撮合信任。
3. **产品审核工作流**：当前仅 status 无审核流，M16/M17 若需运营审核可引入（需评估是否扩大范围）。
4. 保持 `Code State = Documentation State`，本报告结论均来自真实代码。

---

## 执行原则符合性

1. 只读分析，未修改任何代码 ✅
2. 基于真实代码/Schema/API/页面提供证据 ✅
3. 未依据规划文档猜测当前能力 ✅
4. 报告编号冲突经确认改用 447 ✅