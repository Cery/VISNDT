export type ParameterDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ENUM';

export interface ParameterDefinition {
  id: string;
  name: string;
  code: string;
  dataType: ParameterDataType;
  parameterGroupId?: string;
  unit?: string;
  required: boolean;
  createdAt: string;
  updatedAt: string;
  group?: {
    id: string;
    name: string;
    code: string;
  };
  options?: ParameterOption[];
}

export interface ParameterOption {
  id: string;
  parameterDefinitionId: string;
  value: string;
  label: string;
  sortOrder: number;
}

export interface CreateParameterDefinitionDto {
  name: string;
  code: string;
  dataType: ParameterDataType;
  parameterGroupId?: string;
  unit?: string;
  required?: boolean;
}

export interface UpdateParameterDefinitionDto {
  name?: string;
  code?: string;
  dataType?: ParameterDataType;
  parameterGroupId?: string;
  unit?: string;
  required?: boolean;
}

export interface ParameterDefinitionListResponse {
  data: ParameterDefinition[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}