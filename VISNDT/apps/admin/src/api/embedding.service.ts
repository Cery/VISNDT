import { apiClient } from './client';

export interface EmbeddingStatus {
  providerAvailable: boolean;
  providerName: string;
  contentStats: {
    total: number;
    withEmbedding: number;
    withoutEmbedding: number;
  };
  productStats: {
    total: number;
    withEmbedding: number;
    withoutEmbedding: number;
  };
  chunkStats: {
    totalContent: number;
    totalChunks: number;
    contentWithChunks: number;
  };
}

export const embeddingService = {
  async getStatus(): Promise<EmbeddingStatus> {
    return (await apiClient.get('/embedding/status')) as unknown as EmbeddingStatus;
  },

  async generateContentEmbedding(contentId: string): Promise<void> {
    await apiClient.post(`/embedding/content/${contentId}`);
  },

  async generateAllContentEmbeddings(): Promise<{ total: number; generated: number }> {
    return (await apiClient.post('/embedding/content')) as unknown as { total: number; generated: number };
  },

  async generateProductEmbedding(productId: string): Promise<void> {
    await apiClient.post(`/embedding/product/${productId}`);
  },

  async generateAllProductEmbeddings(): Promise<{ total: number; generated: number }> {
    return (await apiClient.post('/embedding/product')) as unknown as { total: number; generated: number };
  },

  async generateContentChunks(contentId: string): Promise<{ chunkCount: number }> {
    return (await apiClient.post(`/embedding/chunk/${contentId}`)) as unknown as { chunkCount: number };
  },

  async generateAllContentChunks(): Promise<{ total: number; chunked: number }> {
    return (await apiClient.post('/embedding/chunk')) as unknown as { total: number; chunked: number };
  },
};