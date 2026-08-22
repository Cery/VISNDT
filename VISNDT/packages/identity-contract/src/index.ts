/**
 * @visndt/identity-contract
 * VISNDT Business Identity Number System Contract v0.1
 *
 * 三层身份模型：
 *   Database ID（UUID，已有，业务主键）
 *     + Business Identity Number（本层，人类可读业务编号）
 *     + Human Readable Reference（展示层，BusinessIdentityBadge 等）
 *
 * 编码规范：VIS-{TYPE}-{YYYYMMDD}-{SEQUENCE}
 *   示例：VIS-RFQ-20260821-00001
 *
 * 重要约束（v0.1，DB Schema FROZEN）：当前未新增 SEQUENCE 列，也不做一次性历史迁移。
 * 故 SEQUENCE 采用「确定性派生」：由现有稳定字段（记录 UUID）稳定、可逆地推导，
 * 保证同记录恒等、跨记录唯一、无需存储即可展示。
 * 契约同时支持显式传入 sequence（供未来规范化分配）。
 *
 * Business Identity Number 不替代数据库 ID，不承载业务状态，不承载业务逻辑判断。
 */

/** 支持业务身份的平台对象类型 */
export type BusinessEntityType =
  | 'PRODUCT'
  | 'DEMAND'
  | 'RFQ'
  | 'RFQ_RESPONSE'
  | 'OFFER'
  | 'ORGANIZATION'
  | 'USER'
  | 'ASSET'
  | 'CONTENT';

/** 实体类型 → 编码前缀 */
export const IDENTITY_PREFIX: Record<BusinessEntityType, string> = {
  PRODUCT: 'PROD',
  DEMAND: 'DEM',
  RFQ: 'RFQ',
  RFQ_RESPONSE: 'RESP',
  OFFER: 'OFF',
  ORGANIZATION: 'ORG',
  USER: 'USR',
  ASSET: 'AST',
  CONTENT: 'CNT',
};

/** 实体类型 → 中文展示名（供 Badge / 管理视图使用） */
export const ENTITY_LABEL: Record<BusinessEntityType, string> = {
  PRODUCT: '产品',
  DEMAND: '需求',
  RFQ: '询价请求',
  RFQ_RESPONSE: '响应',
  OFFER: '报价',
  ORGANIZATION: '组织',
  USER: '用户',
  ASSET: '文件资产',
  CONTENT: '知识内容',
};

/** 系统品牌码（编码前缀第 1 段） */
export const BRAND_CODE = 'VIS';

/** 反查：由前缀得到实体类型（无匹配返回 null） */
export function typeFromPrefix(prefix: string): BusinessEntityType | null {
  const norm = prefix.toUpperCase();
  for (const t of Object.keys(IDENTITY_PREFIX) as BusinessEntityType[]) {
    if (IDENTITY_PREFIX[t] === norm) return t;
  }
  return null;
}

/** 是否合法的实体类型字符串（兼容任意字符串入参） */
export function isEntityType(value: string): value is BusinessEntityType {
  return value in IDENTITY_PREFIX;
}

export interface BusinessIdentityParts {
  /** 品牌码，恒为 'VIS' */
  brand: string;
  /** 实体类型 */
  type: BusinessEntityType;
  /** 编码前缀（不含品牌码） */
  prefix: string;
  /** 日期段 YYYYMMDD */
  date: string;
  /** 序列段 */
  sequence: string;
  /** 完整业务身份编号 */
  identity: string;
}

export interface FormatIdentityOptions {
  /** SEQUENCE 段最小宽度（不足补零，超出不截断），默认 8 */
  width?: number;
  /** 日期（缺省取当天） */
  date?: Date | string;
  /** 显式 SEQUENCE（缺省由 uuid 派生） */
  sequence?: string;
}

const DEFAULT_WIDTH = 8;
const INVALID_DATE = '00000000';

/** 规范化日期 → YYYYMMDD */
function toDatePart(date?: Date | string): string {
  if (date == null) return INVALID_DATE;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return INVALID_DATE;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/**
 * 由记录 UUID 确定性派生 SEQUENCE 段：
 * 取 UUID 去分隔符后的前 8 位十六进制 → 无符号整数 → 补零。
 * 同 UUID 恒等；不同 UUID 冲突概率极低，满足平台规模唯一性。
 */
export function deriveSequence(uuid: string, width = DEFAULT_WIDTH): string {
  const hex = uuid.replace(/[^0-9a-fA-F]/g, '').slice(0, 8) || '0';
  const num = Number.parseInt(hex, 16);
  const padded = String(num).padStart(width, '0');
  return padded;
}

export interface IdentityInput {
  type: BusinessEntityType;
  /** 现有数据库 UUID（用于确定性派生 SEQUENCE） */
  id: string;
  /** 记录创建时间（决定日期段 YYYYMMDD），缺省取当天 */
  createdAt?: Date | string;
  /** 显式 SEQUENCE（可选，缺省由 id 派生） */
  sequence?: string;
  width?: number;
}

/** 格式化核心：由各段组装完整业务身份编号 */
export function formatIdentity(parts: {
  type: BusinessEntityType;
  date: string;
  sequence: string;
}): string {
  return `${BRAND_CODE}-${IDENTITY_PREFIX[parts.type]}-${parts.date}-${parts.sequence}`;
}

/**
 * 主入口：由 "类型 + 现有 UUID + 创建时间" 派生可展示的 Business Identity Number。
 * 例：deriveIdentity('RFQ', uuid, createdAt) → VIS-RFQ-20260821-00000001
 */
export function deriveIdentity(input: IdentityInput): BusinessIdentityParts {
  const type = isEntityType(input.type) ? input.type : input.type as BusinessEntityType;
  const date = toDatePart(input.createdAt);
  const sequence = input.sequence ?? deriveSequence(input.id, input.width ?? DEFAULT_WIDTH);
  const identity = formatIdentity({ type, date, sequence });
  return { brand: BRAND_CODE, type, prefix: IDENTITY_PREFIX[type], date, sequence, identity };
}

/** 便捷别名（等义） */
export const identityFor = deriveIdentity;

/**
 * 解析完整业务编号 → 结构化各段；格式非法返回 null。
 * 例：parseIdentity('VIS-RFQ-20260821-00000001') → BusinessIdentityParts
 */
export function parseIdentity(value: string): Omit<BusinessIdentityParts, 'identity'> | null {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim().toUpperCase();
  const seg = trimmed.split('-');
  if (seg[0] !== BRAND_CODE || seg.length !== 4) return null;
  const type = typeFromPrefix(seg[1]);
  if (!type) return null;
  if (!/^\d{8}$/.test(seg[2])) return null;
  if (!/^\d+$/.test(seg[3])) return null;
  return { brand: BRAND_CODE, type, prefix: IDENTITY_PREFIX[type], date: seg[2], sequence: seg[3] };
}

/** 校验完整业务编号是否合法 */
export function isValidIdentity(value: string): boolean {
  return parseIdentity(value) !== null;
}

/** 实体类型元数据（编码前缀 + 中文名），供展示层/Badge 使用 */
export function identityMeta(
  type: BusinessEntityType,
): { type: BusinessEntityType; prefix: string; label: string } {
  return { type, prefix: IDENTITY_PREFIX[type], label: ENTITY_LABEL[type] };
}

/** 相比「纯 UUID」更短的展示形式：VIS-{PREFIX}-{后 6 位}，用于紧凑布局/标题 */
export function shortIdentity(input: { type: BusinessEntityType; id: string }): string {
  const tail = input.id.replace(/[^0-9a-fA-F]/g, '').slice(-6).toUpperCase() || '000000';
  return `${BRAND_CODE}-${IDENTITY_PREFIX[input.type]}-${tail}`;
}