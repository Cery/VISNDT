export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name?: string;
  status: UserStatus;
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchUserParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}

export interface UserFormData {
  email: string;
  passwordHash: string;
  name?: string;
  status?: UserStatus;
  organizationId?: string;
  role?: string;
}