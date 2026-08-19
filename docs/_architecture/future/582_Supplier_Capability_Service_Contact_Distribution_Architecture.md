# 582 — Supplier Capability Service Contact Distribution Architecture

## Document Type

Future Architecture Design Candidate (FROZEN / NOT FOR DEVELOPMENT)

## Status

**Candidate (Frozen / Not For Development)**

## Date

2026-08-17

## Based On

- 481_Supplier_Product_Model_Architecture_Record_Report
- 580_M22.4_Search_Discovery_Architecture_Finalization_V2_Report
- 581_Product_Supplier_Capability_Model_Architecture_Feasibility_Audit_Report

---

# 1. Architecture Objective

## 1.1 Problem Statement

当前 VISNDT 架构中，供应商通过 Organization + Offer 关联平台产品能力，供应商展示通过 Product Detail "供应商"Tab 完成。但存在以下未来场景未覆盖：

1. **同一供应商多个服务联系人**：一个供应商可能有区域销售、行业销售、技术支持等多个联系人
2. **商机分配机制**：当用户发起询价时，如何公平地将商机分配给供应商的多个联系人
3. **同公司同部门多业务员**：同一销售部门两个业务员如何公平获得商机
4. **供应商内部协作**：供应商如何管理不同联系人的能力范围和服务区域

## 1.2 Design Goal

设计一个**供应商服务联系人分发架构**，在不改变当前 Product / Offer / Organization 架构的前提下，解决供应商多联系人管理和商机公平分配问题。

## 1.3 Core Constraints

```
禁止：
  ❌ Supplier Store / Supplier Shop
  ❌ Supplier Product Mall
  ❌ Supplier Ranking Marketplace
  ❌ Supplier Follow System
  ❌ Supplier Rating System
  ❌ Product.organizationId / Product.supplierId
  ❌ Supplier 独立聚合列表页

保持：
  ✅ Product = Platform Capability Asset
  ✅ Offer = Supplier Capability Association
  ✅ Organization = Capability Provider
  ✅ 用户先看到能力 → 再看到供应商型号
```

---

# 2. Architecture Design

## 2.1 Core Model

### 2.1.1 SupplierCapabilityContact（未来新增）

```prisma
model SupplierCapabilityContact {
  id             String   @id @default(uuid()) @db.Uuid
  organizationId String   @map("organization_id") @db.Uuid
  userId         String   @map("user_id") @db.Uuid      // 关联的登录用户（可选）
  contactName    String                                   // 联系人姓名
  role           String                                   // 角色：SALES / TECH_SUPPORT / MANAGER
  department     String?                                  // 部门：销售部 / 技术支持部
  region         String?                                  // 负责区域：华南 / 华东 / 全国
  industry       String?                                  // 负责行业：航空 / 汽车 / 能源
  serviceScope   String?                                  // 服务范围描述
  capabilityScope String?                                 // 能力范围（产品ID列表，JSON）
  contactPhone   String?   @map("contact_phone")
  contactEmail   String?   @map("contact_email")
  status         String    @default("ACTIVE")             // ACTIVE / INACTIVE
  sortOrder      Int       @default(0) @map("sort_order") // 展示排序

  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  organization   Organization @relation(fields: [organizationId], references: [id])
  user           User?        @relation(fields: [userId], references: [id])

  @@index([organizationId])
  @@index([userId])
  @@index([region])
  @@index([industry])
  @@map("supplier_capability_contact")
}
```

### 2.1.2 与现有模型的关系

```
Organization (现有)
  │
  ├── OrganizationMember (现有) ── 组织成员关系
  │     └── User (现有)
  │
  ├── Offer (现有) ── 供应商能力关联
  │     └── Product (现有)
  │
  └── SupplierCapabilityContact (未来新增) ── 服务联系人
        ├── contactName
        ├── role
        ├── region
        ├── industry
        └── capabilityScope
```

### 2.1.3 现有模型兼容性

| 模型 | 需要修改 | 说明 |
|------|:---:|------|
| Organization | 否 | 现有字段已足够 |
| OrganizationMember | 否 | 成员关系已存在 |
| User | 否 | 联系人可关联 User |
| Offer | 否 | 能力关联机制不变 |
| Product | 否 | 平台能力资产不变 |
| Inquiry | 否 | 询价流程不变 |
| Notification | 否 | 通知机制不变 |

---

## 2.2 Opportunity Routing Mechanisms

### 2.2.1 路由架构总览

```
Inquiry (用户询价)
  │
  ├── Step 1: Capability Match
  │     └── 匹配 Offer（基于 productId + organizationId）
  │
  ├── Step 2: Contact Pool
  │     └── 加载 SupplierCapabilityContact（该供应商所有活跃联系人）
  │
  ├── Step 3: Routing Rule Engine
  │     └── 按优先级依次匹配路由规则
  │
  └── Step 4: Assigned Contact
        └── 返回分配的联系人 + 通知
```

### 2.2.2 Mechanism A: 平台轮询（Round Robin）

**适用场景**：无明确区域/行业/能力匹配时

**流程**：
```
Inquiry → Capability Match → Contact Pool → Round Robin → Assigned Contact
```

**实现**：
- 维护每个供应商的 `last_assigned_contact_index`
- 每次分配时 counter +1，取模联系人总数
- 保证每个联系人获得均等的商机

**优先级**：最低（兜底机制）

### 2.2.3 Mechanism B: 区域分配

**适用场景**：用户询价时携带了区域信息

**流程**：
```
Inquiry (region: "华南") → Match region → Contact A (region: "华南")
```

**匹配规则**：
- 精确匹配优先：Contact.region === Inquiry.region
- 模糊匹配降级：Contact.region === "全国"（兜底）
- 无匹配时降级到 Mechanism A

**优先级**：高（仅次于明确行业匹配）

### 2.2.4 Mechanism C: 行业分配

**适用场景**：用户需求包含了明确的行业信息

**流程**：
```
Inquiry (industry: "航空") → Match industry → Contact B (industry: "航空")
```

**匹配规则**：
- 精确匹配优先：Contact.industry === Demand.industry
- 无匹配时降级到 Mechanism B

**优先级**：最高（与区域匹配同级，行业优先）

### 2.2.5 Mechanism D: 能力主题匹配

**适用场景**：联系人声明了特定的能力主题

**流程**：
```
Inquiry (product: "小径内窥镜") → Match capabilityScope → Contact C (capabilityScope: ["小径内窥镜", "航空检测"])
```

**匹配规则**：
- Contact.capabilityScope 包含目标产品ID
- 多个联系人匹配时，按 sortOrder 排序

**优先级**：中（区域/行业匹配之后）

### 2.2.6 Mechanism E: 供应商管理员分配

**适用场景**：供应商管理员手动管理联系人

**功能**：
- 创建/编辑/删除联系人
- 设置联系人负责能力
- 设置联系人负责区域
- 设置联系人负责行业
- 调整联系人排序

**优先级**：人工干预（最高，覆盖自动路由）

### 2.2.7 Mechanism F: 能力入口数量限制

**适用场景**：控制供应商在平台上的展示质量

**参数**：
- 每个供应商最多 N 个活跃联系人
- 每个能力入口最多 M 个关联联系人
- 展示优先级按 sortOrder 排序

**优先级**：系统级约束

---

## 2.3 Routing Priority Model

```
优先级从高到低：

1. 管理员人工调整（Mechanism E）
   └── 最高优先级，覆盖所有自动路由

2. 明确行业匹配（Mechanism C）
   └── Inquiry.industry === Contact.industry

3. 明确区域匹配（Mechanism B）
   └── Inquiry.region === Contact.region

4. 明确能力主题匹配（Mechanism D）
   └── Contact.capabilityScope 包含目标产品

5. 平台轮询（Mechanism A）
   └── Round Robin 兜底

6. 管理员人工分配（Mechanism E 兜底）
   └── 无规则匹配时，通知管理员手动分配
```

---

## 2.4 Same Company Same Department Multi-Salesperson Solution

### 2.4.1 场景

```
Organization: 深圳微视光电科技有限公司
  Department: 销售部
    Contact A: 张三（区域：华南）
    Contact B: 李四（区域：华东）
```

### 2.4.2 设计原则

```
禁止：
  ❌ 两个独立供应商页面
  ❌ 两个重复能力入口
  ❌ 两个产品展示

采用：
  ✅ 一个供应商能力入口
  ✅ 多个服务联系人
  ✅ 平台分配机制
```

### 2.4.3 展示模型

**用户视角**（产品详情页）：

```
6mm 便携式工业内窥镜
  └── 供应商能力
      └── 深圳微视光电科技有限公司
          ├── 型号：WS-P60
          └── [立即咨询] → 后台自动分配联系人
```

**后台分配**：

```
用户询价 → 路由引擎
  ├── 区域匹配：华南 → 张三
  ├── 区域匹配：华东 → 李四
  └── 无区域 → 轮询：张三 50% / 李四 50%
```

### 2.4.4 公平性保障

| 机制 | 说明 |
|------|------|
| Round Robin | 无明确匹配时均等分配 |
| 分配记录 | 记录每次分配，可审计 |
| 管理员调整 | 供应商管理员可手动调整 |
| 能力范围 | 每个联系人声明自己负责的能力，避免重复 |

---

## 2.5 Capability Exposure Control

### 2.5.1 Capability Score（内部使用，非公开排名）

```typescript
interface CapabilityScore {
  // 供应商能力数量
  capabilityCount: number;        // 该供应商关联的 Offer 数量

  // 资料完整度
  profileCompleteness: number;    // 0-100，联系人信息完整度

  // 响应速度
  responseSpeed: number;          // 平均响应时间（小时）

  // 合作状态
  cooperationStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  // 平台认证
  certificationLevel: 0 | 1 | 2 | 3; // 0=未认证, 1=基础, 2=高级, 3=专家

  // 综合得分
  totalScore: number;             // 0-100，内部展示机会分配权重
}
```

**使用场景**：
- 内部展示机会分配（非公开）
- 供应商健康度监控
- 平台运营决策参考

**不使用场景**：
- 公开排名
- 搜索结果排序
- 用户可见的评分

---

# 3. Test Data Design

## 3.1 Supplier A: 深圳微视光电科技有限公司

### Organization

```
name: 深圳微视光电科技有限公司
type: SUPPLIER
status: ACTIVE
```

### Capabilities (Offers)

| 产品能力 | 供应商型号 | 状态 |
|---------|----------|------|
| 6mm 便携式工业内窥镜 | WS-P60 | ACTIVE |
| 8英寸分体式工业内窥镜 | WS-F800 | ACTIVE |
| 航空发动机检测解决方案 | WS-AE-KIT | ACTIVE |

### Contacts

| 姓名 | 角色 | 部门 | 区域 | 行业 | 能力范围 |
|------|------|------|------|------|---------|
| 张工 | SALES | 销售部 | 华南 | 航空 | 便携式内窥镜、航空检测 |
| 李经理 | SALES | 销售部 | 华东 | 汽车 | 便携式内窥镜、分体式内窥镜 |
| 王工 | TECH_SUPPORT | 技术支持 | 全国 | — | 小径检测技术 |

---

## 3.2 Supplier B: XX 检测科技（北京）有限公司

### Organization

```
name: XX 检测科技（北京）有限公司
type: SUPPLIER
status: ACTIVE
```

### Capabilities

| 产品能力 | 供应商型号 | 状态 |
|---------|----------|------|
| 6mm 便携式工业内窥镜 | X-6000 | ACTIVE |
| 超声波探伤仪 | X-UT300 | ACTIVE |

### Contacts

| 姓名 | 角色 | 部门 | 区域 | 行业 |
|------|------|------|------|------|
| 赵总 | SALES | 销售部 | 华北 | 航空 |
| 刘工 | TECH_SUPPORT | 技术支持 | 全国 | — |

---

## 3.3 Routing Test Cases

### Case 1: 区域精确匹配

```
输入：
  用户搜索 "6mm 内窥镜"
  用户地区：广东（华南）

路由：
  匹配产品：6mm 便携式工业内窥镜
  匹配供应商：深圳微视（华南联系人：张工）/ XX 检测（华北联系人：赵总）
  区域匹配：张工（华南）← 优先

预期结果：
  分配联系人：张工（深圳微视，华南）
```

### Case 2: 行业精确匹配

```
输入：
  用户需求 "航空发动机检测需求"
  行业：航空

路由：
  匹配产品：航空发动机检测解决方案
  匹配供应商：深圳微视
  行业匹配：张工（航空）← 优先

预期结果：
  分配联系人：张工（深圳微视，航空）
```

### Case 3: 无区域/行业 — 轮询

```
输入：
  用户咨询 "6mm 内窥镜"
  无区域信息
  无行业信息

路由：
  匹配产品：6mm 便携式工业内窥镜
  匹配供应商：深圳微视
  联系人池：张工、李经理、王工
  轮询当前 index → 分配

预期结果：
  按 Round Robin 分配，下次轮询到下一个联系人
```

### Case 4: 同部门多业务员

```
输入：
  多次咨询 "6mm 内窥镜"
  无区域/行业信息

路由：
  联系人池：张工（销售部）、李经理（销售部）
  轮询分配：50% 张工 / 50% 李经理

预期结果：
  两人均等获得商机，无重复能力入口
```

### Case 5: 无匹配联系人

```
输入：
  用户咨询 "三坐标测量仪"
  供应商有 Offer，但无联系人负责该产品

路由：
  降级到 Mechanism A（轮询）
  所有联系人进入轮询池

预期结果：
  通知供应商管理员：需要为该产品设置联系人
```

---

## 3.4 Same Company Same Department Test

```
组织：深圳微视光电科技有限公司
部门：销售部
联系人：张三、李四

能力：6mm 便携式工业内窥镜

验证点：
  ✅ 用户看到一个供应商入口（非两个）
  ✅ 后台分配：张三 50% / 李四 50%（Round Robin）
  ✅ 不生成两个供应商页面
  ✅ 不生成两个重复能力入口
```

---

## 3.5 Multiple Supplier Test

```
产品能力：6mm 便携式工业内窥镜

供应商 A：深圳微视（WS-P60）
供应商 B：XX 检测科技（X-6000）

验证点：
  ✅ 一个平台能力：6mm 便携式工业内窥镜
  ✅ 两个 Offer：深圳微视 + XX 检测
  ✅ 多个服务入口：每个供应商有各自联系人
  ✅ 不是供应商聚合列表
```

---

# 4. Impact Assessment

| Area | Impact | Change Type |
|------|:---:|------|
| Product | 无 | No Change |
| Offer | 无 | No Change |
| Organization | 无 | No Change |
| OrganizationMember | 无 | No Change |
| User | 无 | No Change |
| Inquiry | 无 | No Change |
| Notification | 无 | No Change |
| RFQ | 无 | No Change |
| Search | 无 | No Change |
| Matching | 无 | No Change |
| AI | 无 | Frozen |
| Database | 新增表 | Future Migration |
| API | 新增端点 | Future Implementation |
| Frontend | 新增组件 | Future Implementation |

---

# 5. Future Implementation Roadmap

## Phase 1: SupplierCapabilityContact 基础模型

**数据库**：
- Migration: 新增 `supplier_capability_contact` 表
- 与 Organization / User 关联

**API**：
- `POST /organizations/:id/contacts` — 创建联系人
- `GET /organizations/:id/contacts` — 联系人列表
- `PATCH /contacts/:id` — 编辑联系人
- `DELETE /contacts/:id` — 删除联系人

**前端**：
- Supplier Workspace "服务联系人" 页面
- 联系人 CRUD 表单

## Phase 2: Routing Engine

**API**：
- `POST /inquiries/:id/route` — 商机路由分配
- `GET /organizations/:id/routing-stats` — 路由统计

**后端**：
- RoutingRuleEngine 服务（Mechanism A-F）
- RoundRobinCounter 服务

**前端**：
- Admin "商机分配日志" 页面
- Supplier Workspace "商机分配统计" 面板

## Phase 3: Product Detail 联系人展示

**前端**：
- Product Detail "供应商"Tab 增强：显示联系人信息
- 询价表单自动关联分配的联系人

## Phase 4: Capability Exposure Control

**后端**：
- CapabilityScoreService（内部计算）
- 供应商健康度监控

**前端**：
- Admin "供应商健康度" 看板

---

# 6. Trigger Conditions

以下条件满足时，可从 Frozen 状态激活：

- 供应商数量增长至 10+ 家
- 单个供应商出现多个联系人需求
- 商机分配公平性问题出现
- 供应商内部协作管理需求
- 平台运营需要供应商健康度监控

---

# 7. Design Decisions

| ADR | Decision | Rationale |
|-----|----------|-----------|
| 582-001 | 新增 SupplierCapabilityContact 表，不修改 Organization | Organization 保持"能力提供者"角色，联系人作为独立实体管理 |
| 582-002 | 路由优先级：行业 > 区域 > 能力主题 > 轮询 > 人工 | 行业匹配最精准，区域次之，轮询兜底 |
| 582-003 | CapabilityScore 仅内部使用，不公开 | 避免公开排名偏离平台定位 |
| 582-004 | 同公司多业务员通过 Round Robin 分配 | 不创建重复能力入口，保证公平性 |
| 582-005 | 不建设供应商店铺/排名/评价系统 | 保持平台定位为 Capability Discovery，非 Marketplace |