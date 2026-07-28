export interface ParameterGroup {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateParameterGroupDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateParameterGroupDto {
  name?: string;
  code?: string;
  description?: string;
}

export interface ParameterGroupListResponse {
  data: ParameterGroup[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}