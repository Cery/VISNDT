# VISNDT Canonical Field Semantics（字段级语义映射表）

- **Task**: 851_全站字段级语义与中文表述统一治理
- **Status**: CANONICAL REFERENCE
- **语义来源**: 依据当前 Prisma/API 枚举、DTO 注释与前端组件实测，非推断。

本表每字段标注：
- 内部字段/枚举值（Internal）
- 页面上下文（Context）
- 用户可见分类：`PUBLIC`（普通用户）/ `AUTH`（登录用户）/ `ADMIN`（后台）/ `INTERNAL`（仅技术）
- 规范显示（Recommended Display）
- 语义解释（Semantics）

---

## 1. Product
| Internal | Context | 权限 | 显示 | 语义 |
| --- | --- | --- | --- | --- |
| pageId/name | 列表/详情 | PUBLIC | 产品名称 | |
| status=DRAFT | 任意 | PUBLIC | 草稿 | |
| status=ACTIVE | 任意 | PUBLIC | 已发布 | 平台产品对外发布 |
| status=INACTIVE | 任意 | PUBLIC | 已下架 | |
| slug | URL | INTERNAL | （路由，不显示） | |
| id | 详情/内部 | INTERNAL | 不直接显示 | 需展示用「产品编号」 |

## 2. SupplierProduct
| Internal | Context | 权限 | 显示 | 语义 |
| --- | --- | --- | --- | --- |
| (对象整体) | 列表/详情/工作台 | PUBLIC/AUTH | 产品型号 | 供应商具体型号 |
| modelNumber | 详情/表格 | PUBLIC | 型号 | |
| organization | 详情 | PUBLIC | 供应商 / 企业 | 若身份有据可「制造商」等 |
| status | 工作台/审核 | AUTH/ADMIN | 草稿/已发布/已下架 | 同 Product 状态 |
| platformProduct | 详情 | PUBLIC | 所属产品 | |

## 3. Organization
| Internal | Context | 权限 | 显示 | 语义 |
| --- | --- | --- | --- | --- |
| type / organization_type | 详情/列表 | PUBLIC | 供应商 / 企业 | 仅 ADMIN/SUPPLIER；供应商不妄断制造商 |
| name | 详情 | PUBLIC | 企业名称 | |
| id | 内部 | INTERNAL | 不显示 | 需显示用「企业编号」 |

## 4. Demand
| Internal | Context | 权限 | 显示 | 语义 |
| --- | --- | --- | --- | --- |
| status=DRAFT | 工作台 | AUTH | 草稿 | |
| status=PUBLISHED | 工作台 | AUTH | 已发布 | |
| status=SUBMITTED | 工作台 | AUTH | 已提交 | |
| status=PROCESSING | 工作台 | AUTH | 处理中 | |
| status=CLOSED | 工作台 | AUTH | 已关闭 | |
| status=CANCELLED | 工作台 | AUTH | 已取消 | |
| organizationId | 内部 | INTERNAL | 所属企业 | 不显示 DB 字段名 |

## 5. RFQ
| Internal | 显示 |
| --- | --- |
| DRAFT | 草稿 |
| OPEN | 开放中 |
| RESPONDING | 响应中 |
| CLOSED | 已关闭 |
| CANCELLED | 已取消 |

## 6. RFQResponse
| Internal | 显示 |
| --- | --- |
| SUBMITTED | 已提交 |
| REJECTED | 已拒绝 |

## 7. Offer
| Internal | 显示 |
| --- | --- |
| ACTIVE | 有效（非「活跃」）|
| SUBMITTED | 已提交 |
| CANCELLED | 已取消 |

## 8. Match
| Internal | 显示 |
| --- | --- |
| PENDING | 待处理 |
| MATCHED | 已匹配 |
| ACCEPTED | 已接受 |
| REJECTED | 已拒绝 |

## 9. Knowledge / Solution（Content）
| Internal | 显示 |
| --- | --- |
| DRAFT | 草稿 |
| REVIEW | 审核中 |
| PUBLISHED | 已发布 |
| ARCHIVED | 已归档 |
| author | 作者 |

## 10. Role（User）
| Internal | 显示 |
| --- | --- |
| ADMIN | 管理员 |
| SUPPLIER | 供应商用户 |
| BUYER | 采购用户 |
| MEMBER | 成员 |

## 11. User / Invitation
| Internal | 显示 |
| --- | --- |
| ACTIVE | 已启用 / 正常 |
| PENDING | 待生效 |
| DISABLED | 已停用 |

## 12. 参数相关（Parameter）
| Internal | 显示 |
| --- | --- |
| parameterGroup | 参数组 |
| parameterDefinition | 参数定义（Admin） |
| valueNumber/valueUnit/valueText | 数值 / 单位 / 规格（不显示 valueX 字段名） |
| dataType=BOOLEAN | 是/否 |

## 13. 通用字段
| Internal | 显示 |
| --- | --- |
| createdAt | 创建时间 / 提交时间 |
| updatedAt | 更新时间 |
| publishedAt | 发布时间 |
| 布尔 | 是/已/支持/开启 · 否/未/不支持/关闭 |
| null | 暂无数据 / 暂未提供 / 未设置 |

---

## 三级分类说明
- `PUBLIC`：普通用户可见，纯业务中文。
- `AUTH`：登录（Buyer/Supplier Workspace）可见。
- `ADMIN`：Admin 后台，可用专业后台术语，但不得直接显示 DB 字段名/枚举原值。
- `INTERNAL`：仅代码/调试/结构化数据（Schema、API、type、JSON-LD、sitemap、audit raw value），不进入普通用户文案。

**强制**：同一枚举值在不同对象下必须用不同中文（如 `ACTIVE`：Product=已发布，User=已启用，Organization=正常，Offer/Content=有效/已发布）。