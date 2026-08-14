import type { ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';

interface PermissionGuardProps {
  /** 需要的权限 key */
  permission?: string;
  /** 需要任一权限 */
  anyPermission?: string[];
  /** 需要所有权限 */
  allPermissions?: string[];
  /** 无权限时显示的内容 */
  fallback?: ReactNode;
  /** 子组件 */
  children: ReactNode;
}

/**
 * 权限守卫组件
 * 根据当前用户角色控制子组件的渲染
 */
export default function PermissionGuard({
  permission,
  anyPermission,
  allPermissions,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAuthenticated } =
    usePermission();

  if (!isAuthenticated) return <>{fallback}</>;

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (anyPermission && anyPermission.length > 0 && !hasAnyPermission(...anyPermission)) {
    return <>{fallback}</>;
  }

  if (allPermissions && allPermissions.length > 0 && !hasAllPermissions(...allPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}