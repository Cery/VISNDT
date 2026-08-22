/** Admin 角色定义 */
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

/** 角色标签映射 */
export const ROLE_LABEL_MAP: Record<string, string> = {
  [AdminRole.SUPER_ADMIN]: '超级管理员',
  [AdminRole.ADMIN]: '管理员',
  [AdminRole.OPERATOR]: '运营人员',
  [AdminRole.VIEWER]: '查看者',
};

/** 角色能力描述 */
export const ROLE_CAPABILITIES: Record<string, string[]> = {
  [AdminRole.SUPER_ADMIN]: [
    '全部产品管理',
    '全部内容管理',
    '用户与组织管理',
    '审计日志查看',
    '系统配置管理',
    'Dashboard 查看',
  ],
  [AdminRole.ADMIN]: [
    '产品管理',
    '内容管理',
    '用户与组织管理',
    '审计日志查看',
    'Dashboard 查看',
  ],
  [AdminRole.OPERATOR]: [
    '产品管理',
    '内容管理',
    '用户查看',
    '组织查看',
    'Dashboard 查看',
  ],
  [AdminRole.VIEWER]: [
    '产品查看',
    '内容查看',
    '用户查看',
    '组织查看',
    'Dashboard 查看',
  ],
};

/** 权限定义 */
export interface PermissionDef {
  key: string;
  label: string;
  description: string;
  roles: AdminRole[];
}

export const PERMISSIONS: Record<string, PermissionDef> = {
  'product:manage': {
    key: 'product:manage',
    label: '产品管理',
    description: '创建、编辑、删除产品',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
  'product:view': {
    key: 'product:view',
    label: '产品查看',
    description: '查看产品列表和详情',
    roles: [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.OPERATOR,
      AdminRole.VIEWER,
    ],
  },
  'content:manage': {
    key: 'content:manage',
    label: '内容管理',
    description: '创建、编辑、发布内容',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
  'content:view': {
    key: 'content:view',
    label: '内容查看',
    description: '查看内容列表和详情',
    roles: [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.OPERATOR,
      AdminRole.VIEWER,
    ],
  },
  'user:manage': {
    key: 'user:manage',
    label: '用户管理',
    description: '创建、编辑、删除用户',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  },
  'user:view': {
    key: 'user:view',
    label: '用户查看',
    description: '查看用户列表和详情',
    roles: [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.OPERATOR,
      AdminRole.VIEWER,
    ],
  },
  'organization:manage': {
    key: 'organization:manage',
    label: '组织管理',
    description: '创建、编辑、审核组织',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  },
  'organization:view': {
    key: 'organization:view',
    label: '组织查看',
    description: '查看组织列表和详情',
    roles: [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.OPERATOR,
      AdminRole.VIEWER,
    ],
  },
  'audit:view': {
    key: 'audit:view',
    label: '审计查看',
    description: '查看审计日志',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  },
  'dashboard:view': {
    key: 'dashboard:view',
    label: 'Dashboard 查看',
    description: '查看运营数据 Dashboard',
    roles: [
      AdminRole.SUPER_ADMIN,
      AdminRole.ADMIN,
      AdminRole.OPERATOR,
      AdminRole.VIEWER,
    ],
  },
  'system:manage': {
    key: 'system:manage',
    label: '系统管理',
    description: '系统配置和设置',
    roles: [AdminRole.SUPER_ADMIN],
  },
  'tag:manage': {
    key: 'tag:manage',
    label: '标签管理',
    description: '创建、编辑、删除标签',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
  'category:manage': {
    key: 'category:manage',
    label: '分类管理',
    description: '管理产品分类',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  },
  'file:manage': {
    key: 'file:manage',
    label: '文件管理',
    description: '管理文件资源',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  },
  'demand:manage': {
    key: 'demand:manage',
    label: '需求管理',
    description: '管理需求',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
  'inquiry:manage': {
    key: 'inquiry:manage',
    label: '产品询价',
    description: '管理产品询价',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
  'rfq:manage': {
    key: 'rfq:manage',
    label: 'RFQ 管理',
    description: '管理 RFQ',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
  'offer:manage': {
    key: 'offer:manage',
    label: '报价管理',
    description: '管理报价',
    roles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.OPERATOR],
  },
};