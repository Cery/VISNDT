/**
 * 853 Semantic Remediation — 用户可见枚举展示标签（显示层）。
 * 纯展示层映射：禁止将内部枚举原值直接展示给用户。未知值回退到中文占位符。
 */

/** 组织类型 */
export const ORG_TYPE_LABEL: Record<string, string> = {
  SUPPLIER: '供应商',
  BUYER: '采购方',
  ADMIN: '管理员',
  MEMBER: '成员',
};

/** 组织状态 */
export const ORG_STATUS_LABEL: Record<string, string> = {
  ACTIVE: '活跃',
  INACTIVE: '停用',
  PENDING: '待启用',
};

/** 产品状态 */
export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  ACTIVE: '已发布',
  INACTIVE: '已下架',
  DRAFT: '草稿',
  REVIEW: '审核中',
  ARCHIVED: '已归档',
};

/** 需求状态 */
export const DEMAND_STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  SUBMITTED: '已提交',
  PROCESSING: '处理中',
  MATCHED: '已匹配',
  CLOSED: '已关闭',
  CANCELLED: '已取消',
};

/** 产品型号状态 */
export const MODEL_STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  PUBLISHED: '已发布',
  INACTIVE: '已下架',
  ARCHIVED: '已归档',
  REJECTED: '已拒绝',
};