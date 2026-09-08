# VISNDT Canonical Terminology（全站规范对象语义与禁用词表）

- **Task**: 851_全站字段级语义与中文表述统一治理
- **Status**: CANONICAL REFERENCE（语义锚点，presentation-layer only）
- **原则**: 内部对象不改，用户表达必须改。Internal Domain Value ≠ User-facing Label。

---

## 一、核心对象用户语义（Canonical Object Semantics）

| 内部对象 | 用户端（Web/Workspace） | Admin | 语义解释 |
| --- | --- | --- | --- |
| `Product` | 产品 | 产品 | 平台层面「能检测什么」——WHAT。发现/展示单元。 |
| `SupplierProduct` | 产品型号 | 产品型号 | 供应商具体「哪个型号」——WHICH MODEL。属某供应商 + 平台产品。 |
| `Organization` | 企业 / 供应商企业 | 企业 / 供应组织 | 资产/数据所有者——OWNER。识别为制造/贸易/代理需真实业务字段支持，否则一律「供应商」。 |
| `Supplier`（接口约定） | 供应商 / 供应商用户 | 供应商用户 | 系统角色/运营用户，非商业身份标签。不得想当然译为「制造商」。 |
| `Demand` | 采购需求 / 检测需求 | 需求 | 买方发起的需求。 |
| `Match` | 匹配结果 | 匹配 | Demand 与供应能力的匹配结果。 |
| `RFQ` | 询价 / 询价单 | 询价 | 供应商报价邀请（询价）。 |
| `Offer` | 报价 / 商务回复 | 报价 | 供应商对询价的商务回复。 |
| `Knowledge` | 知识 / 技术知识 | 知识内容 | 技术知识内容。 |
| `Solution` | 方案 / 检测方案 | 方案内容 | 检测应用方案。 |
| `Capability` | 相关检测能力（发现/展示语义） | 产品治理 / 产品分类 | = Product 的发现/展示语义（既定结论，非独立实体）。 |

**Capability 边界**：用户端可用「检测能力 / 能力概览 / 相关检测能力」；Admin 用「产品 / 产品分类 / 产品型号审核」。**禁止** Capability ID / Capability Entity / 能力管理（作为对象）/ 能力型号 / 能力提供商。

---

## 二、禁用词表（Forbidden User-visible Terms）

> 以下词禁止在**普通用户/Admin 可见业务文案中原样出现**。不表示禁止代码中存在（类型/API/注释仍保留）。

| 禁止原样显示 | 代替 | 备注 |
| --- | --- | --- |
| `ACTIVE` / `DRAFT` / `PUBLISHED` / `PENDING` 等大写枚举 | 按对象语义（见下表） | 禁止泄漏内部枚举 |
| `Capability Entity / Capability ID / Capability Object` | 产品 / 检测能力 | Capability 非实体 |
| 能力对象 / 能力管理 / 能力型号 / 能力提供商 | 产品 / 产品分类 / 产品型号审核 / 供应商 | 避免将 Capability 当对象 |
| `SupplierProduct`（作为可见文案） | 产品型号 | 除非调试/表结构 |
| `Product Model`（英文残） | 产品型号 | |
| `Provide / Provider` | 供应商 / 服务商 / 制造商（取决于身份证据） | 不译「提供者」 |
| `WorkSpace`（作为业务入口称号） | 工作台 / 企业工作台 | |
| `Active`（泛指） | 已启用 / 正常 / 有效 / 已发布 / 进行中 | 见「活跃」限制 |
| `Model`（泛指） | 产品型号 | 不译「模型」 |
| `organizationId / productId / platformProductId / UUID` | 编号 / 型号编号 | 纯 DB 字段不得作普通用户字段名 |
| `ParameterDefinition` | 参数定义 | Admin 可用 |
| `Registry / Governance` | 避免在用户文案中出现 | |

---

## 三、状态语义 Canonical Mapping（按对象区分）

> 同一枚举值在不同对象下显示不同中文。禁止全局一套词。

### Product
| 内部 | 用户显示 |
| --- | --- |
| `DRAFT` | 草稿 |
| `ACTIVE` | 已发布 |
| `INACTIVE` | 已下架 / 停用 |

### Content（Knowledge / Solution）
| 内部 | 显示 |
| --- | --- |
| `DRAFT` | 草稿 |
| `REVIEW` | 审核中 |
| `PUBLISHED` | 已发布 |
| `ARCHIVED` | 已归档 |

### RFQ
| 内部 | 显示 |
| --- | --- |
| `DRAFT` | 草稿 |
| `OPEN` | 开放中 |
| `RESPONDING` | 响应中 / 征集中 |
| `CLOSED` | 已结束 / 已关闭 |
| `CANCELLED` | 已取消 |

### RFQResponse
| 内部 | 显示 |
| --- | --- |
| `SUBMITTED` | 已提交 |
| `REJECTED` | 已拒绝 |

### Demand
| 内部 | 显示 |
| --- | --- |
| `DRAFT` | 草稿 |
| `PUBLISHED` | 已发布 |
| `SUBMITTED` | 已提交 |
| `PROCESSING` | 处理中 |
| `CLOSED` | 已关闭 |
| `CANCELLED` | 已取消 |

### Match
| 内部 | 显示 |
| --- | --- |
| `PENDING` | 待处理 |
| `REJECTED` | 已拒绝 |
| `MATCHED` | 已匹配 |
| `ACCEPTED` | 已接受 |

### Offer
| 内部 | 显示 |
| --- | --- |
| `ACTIVE` | 有效 / 已启用（**非**「活跃」） |
| `SUBMITTED` | 已提交 |
| `CANCELLED` | 已取消 |

### Inquiry
| 内部 | 显示 |
| --- | --- |
| `CLOSED` | 已关闭 |

### User / Session / Invitation
| 内部 | 显示 |
| --- | --- |
| `ACTIVE` | 已启用 / 正常 |
| `PENDING` | 待生效 |
| `DISABLED` | 已停用 |

### 「活跃」使用限制
仅在表示用户/供应商/内容**活跃度**时用「活跃」；否则按对象语义用 已启用/正常/有效/已发布/进行中。Offer `ACTIVE` ≠ 活跃（应为 有效）。

---

## 四、角色语义 Canonical Mapping（系统角色 ≠ 业务身份）

| 内部 Role | 用户显示 | 说明 |
| --- | --- | --- |
| `ADMIN` | 管理员 / 平台管理员 | |
| `SUPPLIER` | 供应商用户 / 供应商账号 | 系统角色，非商业身份 |
| `BUYER` | 采购用户 / 采购方 | |
| `MEMBER` | 成员 | |

**企业商业身份**（制造商/贸易商/经销商/代理商/服务商/品牌方）：**仅当** `Organization` 有真实业务字段/硬证据才显示；当前 `organization_type ∈ {ADMIN, SUPPLIER}`，无该维度 → **一律「供应商」**，不得猜测。

---

## 五、通用字段 / 日期 / 布尔 / 空值

| 内部字段 | 用户显示 |
| --- | --- |
| `createdAt` | 创建时间 / 提交时间（按对象） |
| `updatedAt` | 更新时间 |
| `publishedAt` | 发布时间 |
| `organizationId` | 不显示 / 用「所属企业」 |
| `modelNumber` | 型号 |
| 布尔 true | 是 / 已 / 支持 / 开启（按语义） |
| 布尔 false | 否 / 未 / 不支持 / 关闭 |
| null（空值） | 暂无数据 / 暂未提供 / 未设置（按语义） |