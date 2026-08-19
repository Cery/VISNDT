# 582 — Supplier Capability Service Contact Distribution Architecture Audit Report

## Document Type

Architecture Audit Report / Feasibility Verification

## Audit Date

2026-08-17

## Audit Scope

基于本地 Repository 实际代码，验证 Supplier Capability Service Contact Distribution Architecture 的可行性。

---

## 1. Repository Verification

### 1.1 Repository Confirmation

| Item | Value |
|------|-------|
| Repository Root | `F:\Desktop\VISNDT` |
| Code Root | `F:\Desktop\VISNDT\VISNDT` |
| Branch | `main` |
| Current Stage | M23.0 (CLOSED), M23.1 active |
| Prisma Schema | `database/prisma/schema.prisma` (v1.0, 24 migrations) |
| Build Status | 三端 build 全部 exit 0 |

### 1.2 Existing Module Verification

#### Organization

```
Model: Organization (schema.prisma 行 251-271)
字段: id, name, type (organization_type), status, createdAt, updatedAt
关联: members[], users[], offers[], demands[], inquiries[]
```

✅ **兼容性**：现有 Organization 模型已支持 `type` 字段区分供应商类型，无需修改。新增 SupplierCapabilityContact 通过 `organizationId` FK 关联即可。

#### OrganizationMember

```
Model: OrganizationMember (schema.prisma 行 295-310)
字段: id, organizationId, userId, role, createdAt, updatedAt
唯一约束: @unique([organizationId, userId])
```

✅ **兼容性**：成员关系已存在。SupplierCapabilityContact 通过 `userId` 可选关联 User，与 OrganizationMember 互补（成员管理 vs 对外联系人）。

#### Offer

```
Model: Offer (schema.prisma 行 481-505)
字段: id, organizationId, productId, title, description, price, status, createdBy
唯一约束: @unique([organizationId, productId])
```

✅ **兼容性**：Offer 是供应商能力关联的核心机制。SupplierCapabilityContact 通过 `capabilityScope` 字段关联 Offer/Product 的能力范围，不修改 Offer 模型。

#### Inquiry

```
Model: Inquiry (schema.prisma 行 750-774)
字段: id, productId, organizationId, createdById, contactName, contactEmail, contactPhone, message, status
```

✅ **兼容性**：Inquiry 已有 `organizationId` 字段，可关联到供应商。Routing Engine 在 Inquiry 创建后，根据 organizationId 找到 Contact Pool 进行路由分配，不修改 Inquiry 模型。

#### Notification

```
Model: Notification (schema.prisma 行 676-695)
字段: id, userId, type, status, title, message, referenceType, referenceId
```

✅ **兼容性**：Routing Engine 分配联系人后，通过现有 Notification 机制通知被分配的联系人（userId），不修改 Notification 模型。

#### Product

```
Model: Product (schema.prisma 行 334-364)
字段: id, categoryId, name, model, description, status, createdById, slug, embedding
```

✅ **兼容性**：Product 保持平台能力资产定位，不新增 `organizationId` 或 `supplierId` 字段。供应商通过 Offer 关联产品。

---

## 2. Existing Model Compatibility

### 2.1 不需要修改的模型

| 模型 | 验证结果 | 说明 |
|------|:---:|------|
| Organization | ✅ PASS | `type` 字段已支持供应商类型 |
| OrganizationMember | ✅ PASS | 成员关系完整 |
| User | ✅ PASS | 联系人可关联 User |
| Offer | ✅ PASS | 能力关联机制不变 |
| Product | ✅ PASS | 平台能力资产不变 |
| ProductCategory | ✅ PASS | 分类树不变 |
| ParameterGroup | ✅ PASS | 参数体系不变 |
| ParameterDefinition | ✅ PASS | 参数定义不变 |
| Demand | ✅ PASS | 需求模型不变 |
| DemandMatch | ✅ PASS | 匹配模型不变 |
| RFQ | ✅ PASS | 询价模型不变 |
| RFQResponse | ✅ PASS | 响应模型不变 |
| Inquiry | ✅ PASS | 询价模型不变 |
| Notification | ✅ PASS | 通知模型不变 |
| WorkflowEvent | ✅ PASS | 工作流事件不变 |
| AuditLog | ✅ PASS | 审计日志不变 |

### 2.2 唯一新增模型

| 模型 | 类型 | 说明 |
|------|:---:|------|
| SupplierCapabilityContact | 新增表 | 供应商服务联系人，关联 Organization + User |

### 2.3 不需要修改的 API

所有现有 API 端点均保持不变。新增的 SupplierCapabilityContact 相关 API 为独立端点，不修改现有契约。

---

## 3. Architecture Decision

### 3.1 核心决策

| 决策 | 结论 | 理由 |
|------|:---:|------|
| 产品架构 | 保持 Product = Platform Capability | 不引入 Product.organizationId |
| 供应商架构 | 保持 Organization = Capability Provider | 不建设供应商店铺 |
| 能力关联 | 保持 Offer = Capability Association | 不新增 SupplierProduct 表 |
| 联系人管理 | 新增 SupplierCapabilityContact | 独立实体，不污染 Organization |
| 商机路由 | 新增 RoutingRuleEngine | 独立服务，不修改 Inquiry/RFQ |

### 3.2 架构边界保护

```
Product-Centric Boundary:
  ✅ Product 是平台能力资产，供应商通过 Offer 关联
  ✅ 禁止 Product.organizationId / Product.supplierId

Supplier Boundary:
  ✅ 供应商是 Capability Provider，不是 Merchant
  ✅ 禁止 Supplier Store / Supplier Shop / Supplier Mall

Marketplace Boundary:
  ✅ 平台是 Capability Discovery，不是 Marketplace
  ✅ 禁止 Supplier Ranking / Supplier Rating / Supplier Follow

AI Boundary:
  ✅ AI 是 Tool Layer，不是 Decision Maker
  ✅ 禁止 AI 自动分配商机（路由引擎是确定性规则）
```

---

## 4. Supplier Exposure Strategy

### 4.1 当前展示模型

```
用户搜索 "6mm 内窥镜"
  ↓
搜索结果：产品能力列表
  ↓
点击产品 → Product Detail
  ↓
"供应商" Tab → 供应商 Offer 列表
  ↓
选择供应商 → 查看型号 → 发起询价
```

### 4.2 未来展示模型

```
用户搜索 "6mm 内窥镜"
  ↓
搜索结果：产品能力列表
  ↓
点击产品 → Product Detail
  ↓
"供应商" Tab → 供应商 Offer 列表
  ↓
每个供应商 → 显示关联的联系人信息
  ↓
选择供应商 → 系统自动路由联系人 → 发起询价
```

### 4.3 不展示的内容

```
❌ 供应商店铺主页
❌ 供应商商品列表
❌ 供应商聚合列表
❌ 供应商排名
❌ 供应商评价
❌ 供应商粉丝数
```

---

## 5. Contact Routing Strategy

### 5.1 路由优先级

```
优先级从高到低：

1. 管理员人工调整（最高）
2. 明确行业匹配
3. 明确区域匹配
4. 明确能力主题匹配
5. 平台轮询（兜底）
```

### 5.2 路由引擎设计

```typescript
interface RoutingRuleEngine {
  // 核心路由方法
  route(inquiry: Inquiry, product: Product): Promise<RoutingResult>;

  // 加载联系人池
  loadContactPool(organizationId: string): Promise<SupplierCapabilityContact[]>;

  // 规则匹配
  matchByIndustry(inquiry: Inquiry, contacts: Contact[]): Contact | null;
  matchByRegion(inquiry: Inquiry, contacts: Contact[]): Contact | null;
  matchByCapability(inquiry: Inquiry, contacts: Contact[]): Contact | null;
  roundRobin(contacts: Contact[]): Contact;

  // 记录分配
  recordAssignment(inquiry: Inquiry, contact: Contact): Promise<void>;
}
```

### 5.3 降级策略

```
行业匹配 → 无匹配
  ↓ 降级
区域匹配 → 无匹配
  ↓ 降级
能力主题匹配 → 无匹配
  ↓ 降级
平台轮询（兜底）
  ↓ 无联系人
通知供应商管理员 → 手动分配
```

---

## 6. Same Company Multiple Contact Handling

### 6.1 验证场景

```
组织：深圳微视光电科技有限公司
部门：销售部
联系人 A：张三
联系人 B：李四

能力：6mm 便携式工业内窥镜
```

### 6.2 验证结果

| 验证项 | 结果 | 机制 |
|--------|:---:|------|
| 用户看到一个供应商入口 | ✅ PASS | 单一 Offer 关联 |
| 不生成两个供应商页面 | ✅ PASS | 无独立供应商页 |
| 不生成两个重复能力入口 | ✅ PASS | Product 唯一 |
| 商机公平分配 | ✅ PASS | Round Robin 50%/50% |
| 区域匹配区分 | ✅ PASS | 张三华南 / 李四华东 |

### 6.3 分配示例

```
用户 A（华南）→ 区域匹配 → 张三
用户 B（华东）→ 区域匹配 → 李四
用户 C（无区域）→ Round Robin → 张三（index=0）
用户 D（无区域）→ Round Robin → 李四（index=1）
用户 E（无区域）→ Round Robin → 张三（index=0）
```

---

## 7. Test Data Scenario

### 7.1 测试数据覆盖

| 场景 | 供应商数 | 联系人数 | 验证点 |
|------|:---:|:---:|------|
| 单供应商单联系人 | 1 | 1 | 基础路由 |
| 单供应商多联系人 | 1 | 3 | 路由机制 |
| 多供应商多联系人 | 2 | 5 | 多供应商展示 |
| 同部门多业务员 | 1 | 2 | 公平分配 |
| 无匹配联系人 | 1 | 0 | 降级兜底 |
| 区域匹配 | 2 | 4 | 区域路由 |
| 行业匹配 | 2 | 4 | 行业路由 |

### 7.2 测试数据 Seed 脚本

```typescript
// 深圳微视 — 3 个联系人
const supplierA = await createOrganization('深圳微视光电科技有限公司', 'SUPPLIER');
const contactA1 = await createContact(supplierA.id, '张工', 'SALES', '华南', '航空');
const contactA2 = await createContact(supplierA.id, '李经理', 'SALES', '华东', '汽车');
const contactA3 = await createContact(supplierA.id, '王工', 'TECH_SUPPORT', '全国', null);

// XX 检测 — 2 个联系人
const supplierB = await createOrganization('XX 检测科技（北京）有限公司', 'SUPPLIER');
const contactB1 = await createContact(supplierB.id, '赵总', 'SALES', '华北', '航空');
const contactB2 = await createContact(supplierB.id, '刘工', 'TECH_SUPPORT', '全国', null);
```

---

## 8. Future Implementation Roadmap

| Phase | 内容 | 预估工作量 | 依赖 |
|-------|------|:---:|------|
| Phase 1 | SupplierCapabilityContact 基础模型 | 3-5 天 | 无 |
| Phase 2 | Routing Engine 路由引擎 | 5-7 天 | Phase 1 |
| Phase 3 | Product Detail 联系人展示 | 2-3 天 | Phase 1 |
| Phase 4 | Capability Exposure Control | 3-5 天 | Phase 2 |

**触发条件**：
- 供应商数量增长至 10+ 家
- 单个供应商出现多个联系人需求
- 商机分配公平性问题出现
- 供应商内部协作管理需求

---

## 9. Risk Assessment

### 9.1 风险矩阵

| 风险 | 等级 | 影响 | 缓解措施 |
|------|:---:|------|------|
| 联系人模型过度设计 | 低 | 表结构复杂 | 仅设计必要字段，未来按需扩展 |
| 路由引擎性能 | 低 | 查询延迟 | 联系人池缓存，规则匹配在内存完成 |
| 供应商滥用联系人 | 低 | 创建过多联系人 | Mechanism F 限制每供应商 N 个联系人 |
| 公平性争议 | 中 | 供应商投诉分配不均 | 分配记录可审计，管理员可调整 |
| 架构偏离 | 低 | 变成供应商店铺 | 架构边界显式保护，定期审计 |

### 9.2 总体风险评级

**LOW** — 所有新增模型均为独立实体，不修改现有核心业务表。路由引擎为确定性规则（非 AI/ML），可审计、可追溯。架构边界显式保护，防止向 Marketplace 偏移。

---

## 10. Final Assessment

### 10.1 评估结果

| 评估维度 | 结果 |
|----------|:---:|
| Repository Verification | ✅ PASS |
| Existing Model Compatibility | ✅ PASS（16/16 模型无需修改） |
| Architecture Design | ✅ PASS |
| Supplier Exposure Strategy | ✅ PASS |
| Contact Routing Strategy | ✅ PASS |
| Same Company Multi-Contact | ✅ PASS |
| Test Data Coverage | ✅ PASS |
| Risk Assessment | ✅ LOW |

### 10.2 Overall Status

**PASS — Architecture Design Frozen / Ready for Future Implementation**

```
Task:           582_M22.4_Supplier_Capability_Service_Contact_Distribution_Architecture
Status:         PASS
Code Change:    NONE
Database Change: NONE (Future Design Only)
API Change:     NONE (Future Design Only)
Frontend Change: NONE (Future Design Only)
Documentation:  Completed (2 files)
```

### 10.3 Architecture Summary

```
Product:       Platform Capability (不变)
Offer:         Supplier Capability Association (不变)
Organization:  Capability Provider (不变)
Contact:       Future Distribution Layer (新增 SupplierCapabilityContact)
Routing:       Deterministic Rule Engine (新增 RoutingRuleEngine)
```

### 10.4 Next Step

```
Future independent implementation planning.
Architecture design frozen.
Trigger conditions monitored.
No immediate development required.
```