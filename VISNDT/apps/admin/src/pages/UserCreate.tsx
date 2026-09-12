import { Typography } from 'antd';
import { userService } from '../api';
import { UserForm } from '../components/user';
import type { UserFormData } from '../types';
import { VISNDT_COLORS } from '../components/design-system/tokens';
import { PageHeader } from '../components/common';

const { Text } = Typography;

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
      <PageHeader
        title="Register User"
        subtitle="Add a new user to the platform"
      />
      <UserForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}