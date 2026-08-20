import { Typography } from 'antd';
import { userService } from '../api';
import { UserForm } from '../components/user';
import type { UserFormData } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';

const { Title, Text } = Typography;

export default function UserCreate() {
  const handleSubmit = async (data: UserFormData) => {
    await userService.create({
      email: data.email,
      passwordHash: data.passwordHash,
      name: data.name || undefined,
      organizationId: data.organizationId || undefined,
      role: data.role || undefined,
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 2, background: VISNDT_COLORS.primary, flexShrink: 0 }} />
          <Title level={4} style={{ margin: 0 }}>Register User</Title>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 12, display: 'block', marginTop: 4 }}>
          Add a new user to the platform
        </Text>
      </div>
      <UserForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}