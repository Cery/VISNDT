import { userService } from '../api';
import { UserForm } from '../components/user';
import type { UserFormData } from '../types';

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

  return <UserForm mode="create" onSubmit={handleSubmit} />;
}