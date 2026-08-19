# 584 — Supplier Capability Exposure & Opportunity Governance Architecture Audit Report

## 文档类型

Architecture Audit / Architecture Design Validation / Test Data Planning（基于本地 Repository 实际代码）

## 审计日期

2026-08-17

## 审计范围

基于 VISNDT M23.0 完成状态及 580/581/582/583 架构决策链，对供应商能力曝光治理与商机分配治理进行全量架构设计验证：

- Supplier Capability Exposure Governance Model
- Contact Distribution Model（多联系人/多业务员）
- Opportunity Routing Priority & Fairness
- Same Company Same Department Rule
- Capability Entry Quota Strategy
- Test Data Scenario Design
- Future Implementation Compatibility

---

# 1. Repository 状态验证

## 1.1 基础信息

| 项目 | 状态 |
|-|-|
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Current Branch | `main` |
| Latest Commit | `c54ef89 M23（终止）` |
| Current M Stage | M23.0（CLOSED）→ M23.1 |
| Build Status | 三端 build 全部 exit 0（M23.0 最终验证） |

## 1.2 前置架构链验证

| 报告 | 状态 | 关键结论 |
|-|-|-|
| 580_Search_Discovery_Architecture_Finalization_V2 | FROZEN | UnifiedSearchService 5 适配器，架构兼容扩展 |
| 581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit | PASS | 15 项需求 12 PASS，架构兼容 |
| 582_Supplier_Capability_Service_Contact_Distribution_Architecture | FROZEN | 6 路由机制 A-F，5 优先级，Future Candidate |
| 583_Capability_Discovery_Supplier_Exposure_Governance_Audit | PASS | 4 架构锁全 PASS，6 治理边界全 PASS |

---

# 2. 当前模型兼容性审计

## 2.1 核心模型验证

### Product（`schema.prisma` 行 334-364）

```
Product
├── id, categoryId, name, model, description, status
├── createdById (FK → User)
├── category → ProductCategory
├── parameterAssociations → ProductParameterDefinition[]
├── parameterValues → ProductParameterValue[]
├── offers → Offer[]
├── inquiries → Inquiry[]
└── demandMatches → DemandMatch[]
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Product.organizationId | 禁止 | 不存在 | ✅ PASS |
| Product.supplierId | 禁止 | 不存在 | ✅ PASS |
| Product.storeId | 禁止 | 不存在 | ✅ PASS |
| Product 作为平台能力资产 | 是 | 是（仅 categoryId 关联分类体系） | ✅ PASS |

### Offer（`schema.prisma` 行 481-505）

```
Offer
├── id, organizationId (FK → Organization), productId (FK → Product)
├── createdBy (FK → User), title, description, price, currency, status
├── @@unique([organizationId, productId])
└── organization → Organization, product → Product
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Offer 作为供应商能力关联 | 是 | 是（organizationId + productId + @@unique） | ✅ PASS |
| Offer 独立展示 | 禁止 | 不存在 | ✅ PASS |
| @@unique([organizationId, productId]) | 存在 | 存在（行 501） | ✅ PASS |

### Organization（`schema.prisma` 行 251-271）

```
Organization
├── id, name, type, status
├── members → OrganizationMember[]
├── offers → Offer[]
├── inquiries → Inquiry[]
├── targetedRfqs → RFQ[]
├── rfqResponses → RFQResponse[]
└── invitations → UserInvitation[]
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Organization 作为能力提供者 | 是 | 是（通过 offers 关联能力） | ✅ PASS |
| Supplier Store 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Shop 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Mall 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Ranking 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Rating 字段 | 禁止 | 不存在 | ✅ PASS |
| Supplier Follow 字段 | 禁止 | 不存在 | ✅ PASS |

### OrganizationMember（`schema.prisma` 行 295-310）

```
OrganizationMember
├── id, organizationId (FK → Organization), userId (FK → User)
├── role (default: "MEMBER")
├── @@unique([organizationId, userId])
└── organization → Organization, user → User
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| 成员关系模型 | 存在 | 存在（organizationId + userId + @@unique） | ✅ PASS |
| 可扩展为 SupplierCapabilityContact 基础 | 是 | 是（独立扩展，不影响现有模型） | ✅ PASS |

### Inquiry（`schema.prisma` 行 750-774）

```
Inquiry
├── id, productId (FK → Product), organizationId (FK → Organization)
├── createdById (FK → User)
├── contactName, contactEmail, contactPhone, message, status
└── product → Product, organization → Organization, createdBy → User
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Inquiry 可扩展 assignedContactId | 是 | 当前无此字段，可独立扩展 | ✅ PASS |
| Inquiry 已关联 organizationId | 是 | 行 753（FK → Organization） | ✅ PASS |

### RFQ（`schema.prisma` 行 598-622）

```
RFQ
├── id, demandId (FK → Demand), sourceMatchId (FK → DemandMatch)
├── targetOrganizationId (FK → Organization), createdBy (FK → User)
├── status, publishedAt, closedAt
└── demand → Demand, targetOrganization → Organization, responses → RFQResponse[]
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| RFQ 可扩展 assignedContactId | 是 | 当前无此字段，可独立扩展 | ✅ PASS |
| RFQ 已关联 targetOrganizationId | 是 | 行 602（FK → Organization） | ✅ PASS |

### Notification（`schema.prisma` 行 676-698）

```
Notification
├── id, userId (FK → User), type, title, message, read, link
└── user → User
```

| 检查项 | 预期 | 实际 | 判定 |
|-|-|-|-|
| Notification 可扩展为商机分配通知 | 是 | 现有 type 字段可扩展 "OPPORTUNITY_ASSIGNED" | ✅ PASS |

## 2.2 模型兼容性总结

| 模型 | 需要修改 | 扩展方式 | 判定 |
|-|-|-|-|
| Product | 否 | 无需修改 | ✅ PASS |
| ProductCategory | 否 | 无需修改 | ✅ PASS |
| Offer | 否 | 无需修改 | ✅ PASS |
| Organization | 否 | 无需修改 | ✅ PASS |
| OrganizationMember | 否 | 作为 SupplierCapabilityContact 的基础 | ✅ PASS |
| Inquiry | 否 | 可选扩展 assignedContactId | ✅ PASS |
| RFQ | 否 | 可选扩展 assignedContactId | ✅ PASS |
| RFQResponse | 否 | 无需修改 | ✅ PASS |
| Notification | 否 | 可选扩展 type 枚举 | ✅ PASS |
| SearchService | 否 | 583 已验证扩展性 | ✅ PASS |
| Parameter System | 否 | 583 已验证（CONDITIONAL PASS） | ✅ PASS |

**判定: 全部 11 个核心模型无需修改，扩展仅需新增独立表 — PASS**

---

# 3. Architecture Decision Records

## 584-001: Product remains Capability Asset

**Decision**: 保持 Product 作为平台能力资产，不关联任何供应商维度。

**Rationale**: Product 代表平台标准化能力定义（如"6mm 便携式工业内窥镜"），不同供应商通过 Offer 关联该能力。这确保：
- 一个能力入口 → 多个供应商 Offer
- 供应商无法"拥有"平台能力
- 用户以能力为中心发现供应商

**Status**: FROZEN / CONFIRMED

---

## 584-002: Supplier remains Capability Provider

**Decision**: 保持 Organization 作为能力提供者，通过 Offer 关联能力，不扩展为独立店铺。

**Rationale**: 供应商通过 Offer 展示其对该平台能力的实现（型号/价格/服务），但不拥有独立的产品列表页面。供应商公开资料页（`/suppliers/[id]`）仅展示 Profile + Offer 列表，非商城入口。

**Status**: FROZEN / CONFIRMED

---

## 584-003: Contact is Service Layer

**Decision**: SupplierCapabilityContact 作为独立服务层，在 Organization 和 Offer 之上构建，不侵入 Product 或 Offer 模型。

**Rationale**: 联系人管理是供应商运营需求，不应影响平台能力模型。SupplierCapabilityContact 通过 organizationId 关联 Organization，通过 capabilityScope 关联能力范围，完全独立于核心模型。

**Status**: DESIGNED / FROZEN

---

## 584-004: Opportunity Routing uses Deterministic Rules

**Decision**: 商机路由采用确定性规则引擎，优先级从高到低：管理员手动分配 → 行业匹配 → 区域匹配 → 能力主题匹配 → 负载均衡 → 轮询 → 管理员兜底。

**Rationale**: 确定性规则确保：
- 可解释性：每次分配都有明确原因
- 可审计性：分配记录可追溯
- 可调整性：供应商管理员可覆盖自动分配
- 公平性：同条件下轮询均等分配

**Status**: DESIGNED / FROZEN

---

## 584-005: Exposure Control is Governance not Ranking

**Decision**: Capability Score 作为内部治理工具，用于展示机会分配权重，不作为公开排名。

**Rationale**: 公开排名会导致：
- 供应商竞争流量而非提升服务质量
- 新供应商难以进入平台
- 用户体验劣化（排名而非能力驱动）

内部 Score 用于：
- 展示机会分配权重
- 供应商健康度监控
- 平台运营决策参考

**Status**: DESIGNED / FROZEN

---

## 584-006: No Supplier Marketplace Expansion

**Decision**: 永久禁止供应商聚合商城、供应商店铺、供应商排名、供应商关注、供应商评分。

**Rationale**: VISNDT 定位为能力发现平台，非供应商电商平台。供应商展示的唯一入口是 Product Detail 页的 Supplier Capability List，用户通过能力发现供应商，而非通过供应商发现产品。

**Status**: FROZEN / PERMANENT

---

# 4. Supplier Exposure Governance Model

## 4.1 曝光架构

```
用户搜索/浏览
  │
  ├── Keyword Search
  │     └── UnifiedSearchService (5 adapters)
  │           └── SupplierDiscoveryItem (organizationName + offerCount + productNames)
  │
  ├── Product Category Browse
  │     └── Product List (按 categoryId 过滤)
  │           └── 每个 Product 卡片不直接展示供应商
  │
  └── Product Detail
        └── Supplier Capability List (SupplierCapabilityList)
              └── 展示该产品的所有 Offer
                    └── 每个 Offer 卡片：organization name + type + title + status
```

## 4.2 曝光层级

| 层级 | 组件 | 曝光内容 | 排序依据 |
|-|-|-|-|
| 搜索结果 | SupplierDiscoveryItem | organizationName + offerCount + productNames | 搜索相关性 |
| 产品列表 | — | 不展示供应商 | — |
| 产品详情 | SupplierCapabilityList | 所有关联 Offer（organization + title + status） | Offer.createdAt（默认） |
| 供应商资料 | /suppliers/[id] | Profile + Offer 列表 | Offer.createdAt（默认） |

## 4.3 曝光控制维度

| 维度 | 控制方式 | 用户可见 | 用途 |
|-|-|-|-|
| Capability Count | 供应商关联 Offer 数量 | 间接（通过搜索结果 offerCount） | 内部权重 |
| Data Quality | 联系人信息完整度（0-100） | 否 | 内部权重 |
| Response Speed | 平均响应时间 | 否 | 内部权重 |
| Cooperation Status | ACTIVE / INACTIVE / SUSPENDED | 是（ACTIVE 才展示） | 曝光开关 |
| Certification Level | 0-3（未认证/基础/高级/专家） | 是（认证标识） | 曝光权重 |
| Capability Quota | 供应商能力入口数量上限 | 否 | 内部治理 |

## 4.4 曝光治理判定

| 检查项 | 判定 |
|-|-|
| 无公开排名 | ✅ PASS |
| 无公开评分 | ✅ PASS |
| 无流量竞争榜 | ✅ PASS |
| 曝光控制为内部治理 | ✅ PASS |
| Capability Score 不暴露给用户 | ✅ PASS |

---

# 5. Contact Distribution Model

## 5.1 联系人架构

```
Organization（现有）
  │
  ├── OrganizationMember（现有）── 组织成员关系
  │     └── User（现有）
  │
  ├── Offer（现有）── 供应商能力关联
  │     └── Product（现有）
  │
  └── SupplierCapabilityContact（未来新增）── 服务联系人
        ├── contactName
        ├── role (SALES / TECH_SUPPORT / MANAGER)
        ├── department
        ├── region
        ├── industry
        ├── capabilityScope
        ├── contactPhone / contactEmail
        ├── status (ACTIVE / INACTIVE)
        └── sortOrder
```

## 5.2 联系人角色定义

| 角色 | 说明 | 路由优先级影响 |
|-|-|-|
| MANAGER | 供应商管理员 | 可手动分配商机，覆盖自动路由 |
| SALES | 销售联系人 | 参与自动路由匹配 |
| TECH_SUPPORT | 技术支持 | 仅在能力主题匹配时参与路由 |

## 5.3 联系人能力范围

```
SupplierCapabilityContact.capabilityScope = JSON String[]

示例：
["product-uuid-001", "product-uuid-002"]  // 该联系人负责的产品能力
["航空检测", "小径内窥镜"]                 // 或主题标签
```

## 5.4 多联系人展示模型

**用户视角**（产品详情页）：

```
6mm 便携式工业内窥镜（平台能力）
  │
  └── 供应商能力
      ├── 深圳微视光电科技有限公司
      │   ├── 型号：WS-P60
      │   ├── 价格：¥15,000
      │   └── [立即咨询] → 后台路由分配联系人
      │
      └── XX 检测科技
          ├── 型号：X-6000
          ├── 价格：¥14,500
          └── [立即咨询] → 后台路由分配联系人
```

**后台视角**（供应商管理员）：

```
深圳微视光电科技有限公司
  │
  └── 6mm 便携式工业内窥镜
      ├── 联系人：张三（SALES，华南，航空）
      ├── 联系人：李四（SALES，华东，汽车）
      └── 联系人：王五（TECH_SUPPORT，全国）
```

## 5.5 判定

| 检查项 | 判定 |
|-|-|
| 一个能力入口对应多个联系人 | ✅ 设计完成 |
| 无重复能力入口 | ✅ PASS |
| 联系人独立于 Product/Offer | ✅ PASS |
| 不侵入核心模型 | ✅ PASS |

---

# 6. Opportunity Routing Priority & Validation

## 6.1 路由优先级（最终版）

基于 582 Mechanism A-F 设计，结合 584 治理要求，最终路由优先级：

```
优先级 1: Supplier Admin Manual Assignment
  └── 供应商管理员手动指定联系人
  └── 覆盖所有自动路由规则
  └── 适用场景：管理员明确知道该商机应由谁处理

优先级 2: Industry Match
  └── Inquiry.industry === Contact.industry
  └── 精确匹配优先，无匹配降级
  └── 适用场景：用户需求明确包含行业信息

优先级 3: Region Match
  └── Inquiry.region === Contact.region
  └── 精确匹配优先，Contact.region === "全国" 为兜底
  └── 适用场景：用户询价携带区域信息

优先级 4: Capability Topic Match
  └── Contact.capabilityScope 包含目标产品/主题
  └── 多匹配时按 sortOrder 排序
  └── 适用场景：联系人声明了特定能力主题

优先级 5: Contact Load Balance
  └── 计算当前联系人负载（未完成商机数量）
  └── 负载最低的联系人优先
  └── 适用场景：同优先级规则下多个匹配

优先级 6: Round Robin
  └── 维护 lastAssignedIndex，每次 +1 取模
  └── 保证均等分配
  └── 适用场景：无明确匹配规则时兜底

优先级 7: Supplier Admin Fallback
  └── 通知供应商管理员手动分配
  └── 适用场景：所有自动规则均无法匹配
```

## 6.2 路由引擎接口设计

```typescript
interface RoutingRuleEngine {
  // 主入口：根据询价信息路由到联系人
  route(inquiry: InquiryContext): Promise<RoutingResult>;

  // 加载联系人池
  loadContactPool(organizationId: string): Promise<SupplierCapabilityContact[]>;

  // 行业匹配
  matchByIndustry(inquiry: InquiryContext, contacts: SupplierCapabilityContact[]): SupplierCapabilityContact | null;

  // 区域匹配
  matchByRegion(inquiry: InquiryContext, contacts: SupplierCapabilityContact[]): SupplierCapabilityContact | null;

  // 能力主题匹配
  matchByCapability(inquiry: InquiryContext, contacts: SupplierCapabilityContact[]): SupplierCapabilityContact | null;

  // 负载均衡
  selectByLoadBalance(contacts: SupplierCapabilityContact[]): SupplierCapabilityContact;

  // 轮询
  roundRobin(organizationId: string, contacts: SupplierCapabilityContact[]): SupplierCapabilityContact;

  // 记录分配
  recordAssignment(inquiry: InquiryContext, contact: SupplierCapabilityContact): Promise<void>;
}

interface InquiryContext {
  productId: string;
  organizationId: string;
  industry?: string;
  region?: string;
  capabilityTopic?: string;
  buyerId: string;
}

interface RoutingResult {
  contact: SupplierCapabilityContact;
  rule: RoutingRule;  // 命中的路由规则
  reason: string;     // 分配原因（可审计）
}
```

## 6.3 判定

| 检查项 | 判定 |
|-|-|
| 路由优先级清晰 | ✅ 7 级优先级，从最高（人工）到最低（兜底） |
| 规则可组合 | ✅ 每级独立判断，逐级降级 |
| 规则可审计 | ✅ RoutingResult.reason 记录分配原因 |
| 确定性规则 | ✅ 非 AI/ML，纯规则引擎 |
| 无公开排名影响 | ✅ 路由仅内部使用 |

---

# 7. Same Company Same Department Multi-Salesperson Validation

## 7.1 场景定义

```
Organization: 深圳微视光电科技有限公司
  Department: 销售部
    Contact A: 张三（SALES，华南，航空）
    Contact B: 李四（SALES，华东，汽车）
```

**条件**：同产品、同区域、同能力、同部门。

## 7.2 路由行为

### 场景 1：有明确区域

```
Input: 广东客户（华南）→ 6mm 工业内窥镜

路由：
  优先级 3（Region Match）命中
  → 张三（华南）← 选定

Output: 张三
```

### 场景 2：有明确行业

```
Input: 航空发动机检测需求

路由：
  优先级 2（Industry Match）命中
  → 张三（航空）← 选定

Output: 张三
```

### 场景 3：无区域无行业

```
Input: 普通咨询 → 6mm 工业内窥镜

路由：
  优先级 2（Industry Match）→ 无匹配
  优先级 3（Region Match）→ 无匹配
  优先级 4（Capability Topic Match）→ 无匹配
  优先级 5（Load Balance）→ 张三 5 个商机，李四 5 个商机 → 均等
  优先级 6（Round Robin）→ 张三（lastIndex=0）→ 李四（lastIndex=1）→ ...

Output: 100 次询价 → 张三 ≈ 50，李四 ≈ 50
```

## 7.3 公平性验证

| 机制 | 说明 | 判定 |
|-|-|-|
| Round Robin | 无明确匹配时均等分配 | ✅ PASS |
| Load Balance | 负载不均时自动调整权重 | ✅ PASS |
| 分配记录 | 每次分配可审计 | ✅ PASS |
| 管理员调整 | 供应商管理员可手动覆盖 | ✅ PASS |
| 能力范围约束 | 每个联系人声明能力范围，避免重复 | ✅ PASS |

## 7.4 禁止行为验证

| 检查项 | 判定 |
|-|-|
| 两个独立供应商页面 | ✅ 禁止（一个 Organization 一个入口） |
| 两个重复能力入口 | ✅ 禁止（一个 Product + Offer 一个入口） |
| 两个产品展示 | ✅ 禁止（一个 Product 一个展示） |
| 张三独立页面 | ✅ 禁止 |
| 李四独立页面 | ✅ 禁止 |

**判定: 同公司同部门多业务员公平分配 — PASS**

---

# 8. Capability Exposure Quota Strategy

## 8.1 配额设计

| 供应商等级 | 能力入口数量上限 | 说明 |
|-|-|-|
| Basic Supplier | 5 | 默认等级，新注册供应商 |
| Advanced Supplier | 20 | 完成资料认证 + 活跃合作 |
| Certified Supplier | Unlimited | 平台认证专家级供应商，需审核 |

## 8.2 配额治理维度

| 维度 | 计算方式 | 用途 |
|-|-|-|
| 能力入口数量 | 该供应商 ACTIVE 状态的 Offer 数量 | 配额上限判断 |
| 联系人数量 | 该供应商 ACTIVE 状态的 SupplierCapabilityContact 数量 | 每个能力入口最多关联 N 个联系人 |
| 展示优先级 | sortOrder 字段 | 同能力入口下多联系人排序 |
| 合作等级 | Cooperation Status | 配额升级/降级依据 |

## 8.3 配额升级条件

```
Basic → Advanced：
  ✅ 资料完整度 ≥ 80%
  ✅ 至少 1 个 ACTIVE Offer
  ✅ 至少 1 个 ACTIVE 联系人
  ✅ 注册时间 ≥ 30 天

Advanced → Certified：
  ✅ 资料完整度 ≥ 95%
  ✅ 至少 3 个 ACTIVE Offer
  ✅ 响应速度排名前 50%
  ✅ 平台认证审核通过
```

## 8.4 配额降级触发

| 触发条件 | 动作 |
|-|-|
| 连续 30 天无响应 | Certified → Advanced |
| 资料完整度 < 50% | Advanced → Basic |
| 平台违规 | 冻结所有能力入口 |

## 8.5 判定

| 检查项 | 判定 |
|-|-|
| 配额用于平台治理 | ✅ PASS |
| 非业务员竞争机制 | ✅ PASS |
| 非公开排名 | ✅ PASS |
| 支持渐进升级 | ✅ PASS |

---

# 9. Test Data Design

## 9.1 Supplier A: 深圳微视光电科技有限公司

### Organization

```
name: 深圳微视光电科技有限公司
type: SUPPLIER
status: ACTIVE
```

### Capabilities（Offers）

| ID | 产品能力 | 供应商型号 | 状态 |
|-|-|-|-|
| offer-a1 | 6mm 便携式工业内窥镜 | WS-P60 | ACTIVE |
| offer-a2 | 8英寸分体式工业内窥镜 | WS-F800 | ACTIVE |
| offer-a3 | 航空发动机检测解决方案 | WS-AE-KIT | ACTIVE |

### Contacts

| ID | 姓名 | 角色 | 部门 | 区域 | 行业 | 能力范围 |
|-|-|-|-|-|-|-|
| contact-a1 | 张三 | SALES | 销售部 | 华南 | 航空 | offer-a1, offer-a3 |
| contact-a2 | 李四 | SALES | 销售部 | 华东 | 汽车 | offer-a1, offer-a2 |
| contact-a3 | 王五 | TECH_SUPPORT | 技术支持 | 全国 | — | offer-a1, offer-a2, offer-a3 |

## 9.2 Supplier B: XX 检测科技（北京）有限公司

### Organization

```
name: XX 检测科技（北京）有限公司
type: SUPPLIER
status: ACTIVE
```

### Capabilities（Offers）

| ID | 产品能力 | 供应商型号 | 状态 |
|-|-|-|-|
| offer-b1 | 6mm 便携式工业内窥镜 | X-6000 | ACTIVE |
| offer-b2 | 超声波探伤仪 | X-UT300 | ACTIVE |

### Contacts

| ID | 姓名 | 角色 | 部门 | 区域 | 行业 | 能力范围 |
|-|-|-|-|-|-|-|
| contact-b1 | 赵强 | SALES | 销售部 | 华北 | 航空 | offer-b1, offer-b2 |
| contact-b2 | 刘工 | TECH_SUPPORT | 技术支持 | 全国 | — | offer-b1, offer-b2 |

## 9.3 Routing Test Cases

### Case 1: 同公司同部门公平分配

```
输入：
  产品：6mm 便携式工业内窥镜
  供应商：深圳微视
  无区域、无行业

模拟 100 次询价：
  预期：
    张三 ≈ 50 次
    李四 ≈ 50 次
    王五 ≈ 0 次（TECH_SUPPORT 不参与自动路由）

验证：
  ✅ 两个 SALES 均等分配
  ✅ TECH_SUPPORT 不参与销售路由
  ✅ 无重复能力入口
```

### Case 2: 区域匹配

```
输入：
  产品：6mm 便携式工业内窥镜
  区域：广东（华南）

路由：
  优先级 3（Region Match）→ 张三（华南）命中

预期：
  张三 ← 分配

验证：
  ✅ 区域精确匹配
  ✅ 非区域联系人被排除
```

### Case 3: 行业匹配

```
输入：
  产品：航空发动机检测解决方案
  行业：航空

路由：
  优先级 2（Industry Match）→ 张三（航空）命中

预期：
  张三 ← 分配

验证：
  ✅ 行业精确匹配
  ✅ 行业匹配优先级高于区域匹配
```

### Case 4: 负载保护

```
前提：
  张三：20 个未完成商机
  李四：5 个未完成商机

输入：
  产品：6mm 便携式工业内窥镜
  无区域、无行业

路由：
  优先级 5（Load Balance）→ 李四（负载更低）优先

预期：
  李四 ← 分配

验证：
  ✅ 负载均衡降低高负载联系人权重
  ✅ 新联系人获得更多商机
```

### Case 5: 多供应商能力竞争

```
输入：
  产品：6mm 便携式工业内窥镜

展示：
  供应商能力列表：
    深圳微视（WS-P60，¥15,000）
    XX 检测（X-6000，¥14,500）

路由：
  用户选择深圳微视 → 按深圳微视联系人池路由
  用户选择 XX 检测 → 按 XX 检测联系人池路由

验证：
  ✅ 非供应商排名
  ✅ 用户主动选择供应商
  ✅ 每个供应商独立路由
```

### Case 6: 管理员手动分配

```
前提：
  供应商管理员登录 Supplier Workspace

输入：
  商机 ID：inq-001
  手动分配：张三

路由：
  优先级 1（Manual Assignment）→ 跳过所有自动规则

预期：
  张三 ← 分配
  分配原因：MANUAL_ASSIGNMENT

验证：
  ✅ 管理员覆盖自动路由
  ✅ 分配记录可审计
```

### Case 7: 全规则兜底

```
前提：
  深圳微视仅有 1 个联系人（张三，无区域/行业/能力范围声明）

输入：
  无区域、无行业、无能力主题

路由：
  优先级 2-5 全部无匹配
  优先级 6（Round Robin）→ 张三
  （只有 1 个联系人，轮询无意义）

验证：
  ✅ 所有规则正确降级
  ✅ 兜底机制不抛异常
```

### Case 8: Capability Quota 限制

```
前提：
  Basic Supplier 配额上限：5 个能力入口

场景：
  供应商已有 5 个 ACTIVE Offer
  尝试创建第 6 个 Offer

预期：
  ❌ 超出配额，拒绝创建
  提示：升级至 Advanced Supplier 可扩展至 20 个

验证：
  ✅ 配额限制生效
  ✅ 升级路径清晰
```

## 9.4 测试数据覆盖矩阵

| 场景 | 覆盖目标 | 判定 |
|-|-|-|
| Case 1 | 同公司同部门公平分配（100次轮询 50:50） | ✅ |
| Case 2 | 区域匹配 | ✅ |
| Case 3 | 行业匹配（优先级高于区域） | ✅ |
| Case 4 | 负载保护 | ✅ |
| Case 5 | 多供应商非排名 | ✅ |
| Case 6 | 管理员手动分配 | ✅ |
| Case 7 | 全规则兜底 | ✅ |
| Case 8 | Capability Quota 限制 | ✅ |

---

# 10. Future Data Model Compatibility

## 10.1 未来新增表

| 表 | 关联方式 | 对现有表影响 |
|-|-|-|
| SupplierCapabilityContact | FK → Organization, FK → User (optional) | 无 |
| CapabilityExposurePolicy | FK → Organization | 无 |
| RoutingRule | 独立配置表 | 无 |
| OpportunityAssignment | FK → Inquiry, FK → SupplierCapabilityContact | 可选扩展 Inquiry |
| ContactLoadSnapshot | FK → SupplierCapabilityContact | 无 |

## 10.2 可选扩展字段

| 现有表 | 可选扩展字段 | 影响 |
|-|-|-|
| Inquiry | assignedContactId (FK → SupplierCapabilityContact) | 向后兼容 |
| RFQ | assignedContactId (FK → SupplierCapabilityContact) | 向后兼容 |
| Notification | type 新增 "OPPORTUNITY_ASSIGNED" | 向后兼容 |

**判定: 未来新增全部为独立表，可选扩展字段向后兼容 — PASS**

---

# 11. Future API Design（仅设计，不实现）

## 11.1 Supplier Workspace API

| 端点 | 方法 | 说明 |
|-|-|-|
| `/supplier/contacts` | GET | 获取联系人列表 |
| `/supplier/contacts` | POST | 创建联系人 |
| `/supplier/contacts/:id` | PUT | 更新联系人 |
| `/supplier/contacts/:id` | DELETE | 删除联系人 |
| `/supplier/contacts/:id/capabilities` | PUT | 设置联系人能力范围 |
| `/supplier/routing/rules` | GET | 获取路由规则 |
| `/supplier/routing/assign` | POST | 手动分配商机 |
| `/supplier/opportunity/distribution-log` | GET | 商机分配日志 |
| `/supplier/opportunity/stats` | GET | 分配统计 |

## 11.2 Admin API

| 端点 | 方法 | 说明 |
|-|-|-|
| `/admin/supplier/governance` | GET | 供应商治理列表 |
| `/admin/supplier/:id/exposure-policy` | GET/PUT | 曝光策略 |
| `/admin/supplier/:id/quota` | GET/PUT | 配额管理 |
| `/admin/opportunity/log` | GET | 商机分配日志 |

## 11.3 Future Frontend Pages

### Supplier Workspace

```
/workspace/supplier/contacts          → 联系人管理
/workspace/supplier/contacts/:id      → 联系人详情/编辑
/workspace/supplier/routing           → 商机分配规则
/workspace/supplier/opportunity-stats → 分配统计
```

### Admin

```
/admin/suppliers/governance           → 供应商治理
/admin/suppliers/:id/exposure         → 曝光管理
/admin/suppliers/:id/quota            → 配额管理
/admin/opportunities/log              → 商机日志
```

---

# 12. Impact Verification

## 12.1 Database Impact

| 当前 | 未来 |
|-|-|
| NO CHANGE | 新增 5 个独立表（Extension Only） |
| 无需 Migration | 未来实施时创建 Migration |

## 12.2 API Impact

| 当前 | 未来 |
|-|-|
| NO CHANGE | 新增 Supplier/Admin 端点（Extension Only） |
| 现有 Search/Product/Offer API 不变 | 新端点独立路由 |

## 12.3 Frontend Impact

| 当前 | 未来 |
|-|-|
| NO CHANGE | 新增 Supplier Workspace 页面 + Admin 治理页面 |
| 现有 Product Detail/SupplierInquirySection 不变 | 新页面独立路由 |

## 12.4 综合影响矩阵

| 维度 | 当前 | 未来 | 兼容性 |
|-|-|-|-|
| Product | No Change | No Change | ✅ |
| Offer | No Change | No Change | ✅ |
| Organization | No Change | No Change | ✅ |
| Search | No Change | No Change | ✅ |
| Matching | No Change | No Change | ✅ |
| AI | FROZEN | FROZEN | ✅ |
| Database | No Migration | Extension Only | ✅ |
| API | No Change | Extension Only | ✅ |
| Frontend | No Change | Extension Only | ✅ |

---

# 13. Risk Assessment

| ID | 风险 | 严重度 | 缓解措施 |
|-|-|-|-|
| R-01 | 联系人数据质量低导致路由失效 | P2 | 联系人创建时强制 region/industry 字段，提供默认值 |
| R-02 | 负载均衡算法在极端场景下不公 | P3 | 定期审计分配记录，发现偏差自动告警 |
| R-03 | 供应商管理员滥用手动分配 | P2 | 记录所有手动分配，Admin 可审计 |
| R-04 | Quota 限制导致供应商流失 | P2 | 升级路径清晰，Basic → Advanced 门槛低（30 天 + 1 个 Offer） |
| R-05 | 未来实施与原设计偏差 | P1 | 584 报告作为 FROZEN 设计参考，实施时严格对照 |

**总体风险评级: LOW**

---

# 14. Future Implementation Roadmap

## 14.1 实施阶段

```
Phase 1: Data Foundation
  ├── 创建 SupplierCapabilityContact 表
  ├── 创建 Migration
  └── 创建基础 CRUD API

Phase 2: Routing Engine
  ├── 实现 RoutingRuleEngine
  ├── 实现 7 级路由优先级
  └── 实现分配记录

Phase 3: Exposure Governance
  ├── 实现 Capability Quota
  ├── 实现 Exposure Policy
  └── 实现 Admin 治理面板

Phase 4: Supplier Workspace
  ├── 联系人管理页面
  ├── 商机分配规则页面
  └── 分配统计页面

Phase 5: Integration
  ├── Inquiry/RFQ 集成 assignedContactId
  ├── Notification 集成 OPPORTUNITY_ASSIGNED
  └── 搜索集成 SupplierContact 信息
```

## 14.2 前置条件

| 条件 | 状态 |
|-|-|
| 580-584 全部 PASS | ✅ 已完成 |
| M23.1 稳定化完成 | 待定 |
| 供应商需求确认 | 待定 |
| 产品决策确认 | 待定 |

---

# 15. Final Architecture Decision

## 15.1 总体判定

```
584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture

STATUS: PASS

Architecture Compatible: YES
No Immediate Development Required: YES
Building Supplier Marketplace: NO
Drifting from Product-Centric: NO
Exposure Governance Designed: YES
Opportunity Routing Designed: YES
Same Company Multi-Salesperson Validated: YES
Capability Quota Designed: YES
Test Data Designed: YES
```

## 15.2 详细判定

| 维度 | 判定 |
|-|-|
| Product = Platform Capability | ✅ PASS |
| Offer = Supplier Capability Association | ✅ PASS |
| Organization = Capability Provider | ✅ PASS |
| Contact = Service Layer | ✅ PASS |
| 7 级路由优先级 | ✅ DESIGNED |
| 同公司多业务员公平分配 | ✅ VALIDATED |
| Capability Quota 策略 | ✅ DESIGNED |
| 8 测试场景覆盖 | ✅ DESIGNED |
| 无 Supplier Store/Shop/Mall/Ranking | ✅ PASS |
| 零代码变更 | ✅ PASS |

## 15.3 架构链完整状态

```
580 Search Discovery Finalization          ✅ COMPLETED
        ↓
581 Product / Supplier Capability Audit   ✅ COMPLETED
        ↓
582 Contact Distribution Architecture     ✅ COMPLETED
        ↓
583 Capability Discovery & Exposure       ✅ COMPLETED
        ↓
584 Exposure & Opportunity Governance     ← 当前 PASS
        ↓
未来条件满足
        ↓
实施阶段:
  Phase 1: SupplierCapabilityContact
  Phase 2: Routing Engine
  Phase 3: Exposure Governance
  Phase 4: Supplier Workspace
  Phase 5: Integration
```

---

# 16. 最终执行输出

```
Task:
584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture

Status:
PASS

Code Change:
NONE

Database Change:
NONE

API Change:
NONE

Frontend Change:
NONE

Architecture Decision Records:
6 ADR (584-001 ~ 584-006)

Test Data:
8 场景，覆盖路由/公平性/配额/多供应商

Documentation:
docs/_review/584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture_Audit_Report.md

Next Step:
Architecture Frozen / Ready For Future Implementation
```

---

# 17. 文档同步

| 文件 | 操作 |
|-|-|
| `docs/_review/584_Supplier_Capability_Exposure_Opportunity_Governance_Architecture_Audit_Report.md` | 新增 |
| `docs/project-management/PROJECT_ROADMAP.md` | 待更新（纳入 584） |
| `docs/project-management/PROJECT_STATUS.md` | 待更新（纳入 584） |

---

**审计完成。架构兼容，治理边界清晰，商机路由设计完成，测试数据覆盖全面，无需立即开发。**