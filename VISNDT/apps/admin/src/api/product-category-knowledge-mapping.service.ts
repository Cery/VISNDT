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

// 797: apiClient 响应拦截器已解包 response.data（返回 API body {success,data,...}），
// 此处再取 res.data.data 属双重解包，导致 undefined.length 崩溃（页面进入 retry 态）。
// 修正为单层解包，与 user.service 等既有正确写法对齐。
export const productCategoryKnowledgeMappingService = {
  async getList(): Promise<ProductCategoryKnowledgeMapping[]> {
    const res = await apiClient.get('/admin/product-category-knowledge-mappings');
    return res.data;
  },

  async getById(id: string): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.get(`/admin/product-category-knowledge-mappings/${id}`);
    return res.data;
  },

  async create(dto: CreateMappingDto): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.post('/admin/product-category-knowledge-mappings', dto);
    return res.data;
  },

  async update(id: string, dto: UpdateMappingDto): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.patch(`/admin/product-category-knowledge-mappings/${id}`, dto);
    return res.data;
  },

  async updateStatus(id: string, isActive: boolean): Promise<ProductCategoryKnowledgeMapping> {
    const res = await apiClient.patch(`/admin/product-category-knowledge-mappings/${id}/status`, { isActive });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/admin/product-category-knowledge-mappings/${id}`);
  },
};