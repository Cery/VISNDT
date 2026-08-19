import { apiClient } from './client';

export interface ProductCategoryKnowledgeMapping {
  id: string;
  productCategoryId: string;
  knowledgeCategoryId: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCategory: {
    id: string;
    name: string;
    slug: string;
  };
  knowledgeCategory: {
    id: string;
    name: string;
    slug: string;
    domain: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface CreateMappingDto {
  productCategoryId: string;
  knowledgeCategoryId: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateMappingDto {
  sortOrder?: number;
  isActive?: boolean;
}

export const productCategoryKnowledgeMappingService = {
  async getList(): Promise<ProductCategoryKnowledgeMapping[]> {
    const res = await apiClient.get('/admin/product-category-knowledge-mappings');
    return res.data.data;
  },

  async getById(id: string): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.get(`/admin/product-category-knowledge-mappings/${id}`);
    return res.data.data;
  },

  async create(dto: CreateMappingDto): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.post('/admin/product-category-knowledge-mappings', dto);
    return res.data.data;
  },

  async update(id: string, dto: UpdateMappingDto): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.patch(`/admin/product-category-knowledge-mappings/${id}`, dto);
    return res.data.data;
  },

  async updateStatus(id: string, isActive: boolean): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.patch(`/admin/product-category-knowledge-mappings/${id}/status`, { isActive });
    return res.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/product-category-knowledge-mappings/${id}`);
  },
};