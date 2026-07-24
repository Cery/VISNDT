import { organizationService } from '../api';
import { OrganizationForm } from '../components/organization';
import type { OrganizationFormData } from '../types';

export default function OrganizationCreate() {
  const handleSubmit = async (data: OrganizationFormData) => {
    await organizationService.create({
      name: data.name,
      type: data.type,
    });
  };

  return <OrganizationForm mode="create" onSubmit={handleSubmit} />;
}