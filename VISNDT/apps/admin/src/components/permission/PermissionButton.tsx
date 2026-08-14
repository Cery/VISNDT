import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import { usePermission } from '../../hooks/usePermission';

interface PermissionButtonProps extends ButtonProps {
  /** 需要的权限 key */
  permission?: string;
  /** 无权限时的提示文本 */
  permissionTip?: string;
}

/**
 * 权限按钮组件
 * 无权限时禁用按钮并显示提示
 */
export default function PermissionButton({
  permission,
  permissionTip,
  disabled,
  children,
  ...buttonProps
}: PermissionButtonProps) {
  const { hasPermission, isAuthenticated } = usePermission();

  const hasAccess = !permission || (isAuthenticated && hasPermission(permission));

  if (!hasAccess) {
    return (
      <Tooltip title={permissionTip || '当前角色无此操作权限'}>
        <Button disabled {...buttonProps}>
          {children}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button disabled={disabled} {...buttonProps}>
      {children}
    </Button>
  );
}