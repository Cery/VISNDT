import { useMemo } from 'react';
import { authStore } from '../stores/auth.store';
import { AdminRole, PERMISSIONS, ROLE_CAPABILITIES, ROLE_LABEL_MAP } from '../auth/roles';
import type { PermissionDef } from '../auth/roles';

/** 权限检查 Hook */
export function usePermission() {
  const user = authStore((s) => s.user);
  const isAuthenticated = authStore((s) => s.isAuthenticated);

  const currentRole = (user?.role as AdminRole) || null;

  /** 检查当前用户是否拥有指定权限 */
  const hasPermission = useMemo(() => {
    return (permissionKey: string): boolean => {
      if (!isAuthenticated || !currentRole) return false;
      const perm = PERMISSIONS[permissionKey];
      if (!perm) return false;
      return perm.roles.includes(currentRole);
    };
  }, [isAuthenticated, currentRole]);

  /** 检查当前用户是否拥有任一权限 */
  const hasAnyPermission = useMemo(() => {
    return (...permissionKeys: string[]): boolean => {
      return permissionKeys.some((key) => hasPermission(key));
    };
  }, [hasPermission]);

  /** 检查当前用户是否拥有所有权限 */
  const hasAllPermissions = useMemo(() => {
    return (...permissionKeys: string[]): boolean => {
      return permissionKeys.every((key) => hasPermission(key));
    };
  }, [hasPermission]);

  /** 获取当前角色的能力列表 */
  const capabilities = useMemo(() => {
    if (!currentRole) return [];
    return ROLE_CAPABILITIES[currentRole] || [];
  }, [currentRole]);

  /** 获取当前角色标签 */
  const roleLabel = useMemo(() => {
    if (!currentRole) return '';
    return ROLE_LABEL_MAP[currentRole] || currentRole;
  }, [currentRole]);

  return {
    isAuthenticated,
    currentRole,
    roleLabel,
    capabilities,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: PERMISSIONS,
  };
}

/** 独立权限检查函数（非 Hook） */
export function checkPermission(
  role: string | null | undefined,
  permissionKey: string,
): boolean {
  if (!role) return false;
  const perm = PERMISSIONS[permissionKey] as PermissionDef | undefined;
  if (!perm) return false;
  return perm.roles.includes(role as AdminRole);
}