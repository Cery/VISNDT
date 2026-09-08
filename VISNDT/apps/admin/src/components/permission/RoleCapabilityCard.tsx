import { Card, Tag, Typography, Descriptions } from 'antd';
import { usePermission } from '../../hooks/usePermission';

const { Text } = Typography;

/**
 * 角色能力卡片
 * 展示当前用户的角色和权限能力
 */
export default function RoleCapabilityCard() {
  const { currentRole, roleLabel, capabilities, isAuthenticated } = usePermission();

  if (!isAuthenticated || !currentRole) {
    return null;
  }

  return (
    <Card
      size="small"
      title={
        <span>
          当前角色：<Tag color="blue">{roleLabel}</Tag>
        </span>
      }
      style={{ marginBottom: 16 }}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="角色标识">
          <Text code>{currentRole}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="能力范围">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {capabilities.map((cap) => (
              <Tag key={cap} color="green" style={{ margin: 0 }}>
                {cap}
              </Tag>
            ))}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}