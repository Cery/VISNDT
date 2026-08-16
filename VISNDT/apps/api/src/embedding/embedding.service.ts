import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

// ============================================
// Embedding Provider Interface
// ============================================

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

// ============================================
// OpenAI Embedding Provider
// Only activated when OPENAI_API_KEY is configured
// ============================================

@Injectable()
export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('OPENAI_BASE_URL') || 'https://api.openai.com/v1/embeddings';
    this.model = this.configService.get<string>('OPENAI_EMBEDDING_MODEL') || 'text-embedding-3-small';
  }

  private get isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.isAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.map((item: { embedding: number[] }) => item.embedding);
  }
}

// ============================================
// Embedding Service
// ============================================

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private provider: EmbeddingProvider;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly openAIProvider: OpenAIEmbeddingProvider,
  ) {
    this.provider = openAIProvider;
  }

  get isProviderAvailable(): boolean {
    return !!this.configService.get<string>('OPENAI_API_KEY');
  }

  /**
   * Generate embedding vector for a given text query.
   * Used by Semantic Module for query-time embedding generation (M21.4.4+).
   *
   * @param text - query text to embed
   * @returns 1536-dim embedding vector
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }
    return this.provider.generateEmbedding(text);
  }

  // ============================================
  // Content Embedding
  // ============================================

  async getContentEmbeddingStats(): Promise<{
    total: number;
    withEmbedding: number;
    withoutEmbedding: number;
  }> {
    const [total, withEmbedding] = await Promise.all([
      this.prisma.content.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*)::int as count FROM content WHERE status = 'PUBLISHED' AND embedding IS NOT NULL`,
      ).then((r) => Number(r[0].count)),
    ]);

    return {
      total,
      withEmbedding,
      withoutEmbedding: total - withEmbedding,
    };
  }

  async generateContentEmbedding(contentId: string): Promise<void> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { id: true, title: true, summary: true, content: true },
    });

    if (!content) {
      throw new Error(`Content ${contentId} not found`);
    }

    const text = [content.title, content.summary, content.content]
      .filter(Boolean)
      .join('\n')
      .slice(0, 8000);

    const embedding = await this.provider.generateEmbedding(text);
    const vectorStr = `[${embedding.join(',')}]`;

    await this.prisma.$executeRawUnsafe(
      `UPDATE content SET embedding = $1::vector WHERE id = $2::uuid`,
      vectorStr,
      contentId,
    );

    this.logger.log(`Generated embedding for content ${contentId}`);
  }

  async generateAllContentEmbeddings(): Promise<{ total: number; generated: number }> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const contents = await this.prisma.content.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, title: true, summary: true, content: true },
    });

    // Filter out already embedded
    const embedded = await this.prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM content WHERE status = 'PUBLISHED' AND embedding IS NOT NULL`,
    );
    const embeddedIds = new Set(embedded.map((r) => r.id));
    const pending = contents.filter((c) => !embeddedIds.has(c.id));

    let generated = 0;
    for (const content of pending) {
      try {
        const text = [content.title, content.summary, content.content]
          .filter(Boolean)
          .join('\n')
          .slice(0, 8000);

        const embedding = await this.provider.generateEmbedding(text);
        const vectorStr = `[${embedding.join(',')}]`;

        await this.prisma.$executeRawUnsafe(
          `UPDATE content SET embedding = $1::vector WHERE id = $2::uuid`,
          vectorStr,
          content.id,
        );

        generated++;
        this.logger.log(`Generated embedding for content ${content.id} (${generated}/${pending.length})`);
      } catch (error) {
        this.logger.error(`Failed to generate embedding for content ${content.id}: ${error}`);
      }
    }

    return { total: pending.length, generated };
  }

  // ============================================
  // Product Embedding
  // ============================================

  async getProductEmbeddingStats(): Promise<{
    total: number;
    withEmbedding: number;
    withoutEmbedding: number;
  }> {
    const [total, withEmbedding] = await Promise.all([
      this.prisma.product.count({ where: { status: { not: 'ARCHIVED' } } }),
      this.prisma.$queryRawUnsafe<{ count: bigint }[]>(
        `SELECT COUNT(*)::int as count FROM product WHERE status != 'ARCHIVED' AND embedding IS NOT NULL`,
      ).then((r) => Number(r[0].count)),
    ]);

    return {
      total,
      withEmbedding,
      withoutEmbedding: total - withEmbedding,
    };
  }

  async generateProductEmbedding(productId: string): Promise<void> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        parameterValues: {
          include: {
            parameterDefinition: {
              select: { name: true, unit: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    const paramText = product.parameterValues
      .map((pv) => `${pv.parameterDefinition.name}: ${pv.value}${pv.parameterDefinition.unit ? ' ' + pv.parameterDefinition.unit : ''}`)
      .join('; ');

    const text = [product.name, product.model, product.description, paramText]
      .filter(Boolean)
      .join('\n')
      .slice(0, 8000);

    const embedding = await this.provider.generateEmbedding(text);
    const vectorStr = `[${embedding.join(',')}]`;

    await this.prisma.$executeRawUnsafe(
      `UPDATE product SET embedding = $1::vector WHERE id = $2::uuid`,
      vectorStr,
      productId,
    );

    this.logger.log(`Generated embedding for product ${productId}`);
  }

  async generateAllProductEmbeddings(): Promise<{ total: number; generated: number }> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const products = await this.prisma.product.findMany({
      where: { status: { not: 'ARCHIVED' } },
      include: {
        parameterValues: {
          include: {
            parameterDefinition: {
              select: { name: true, unit: true },
            },
          },
        },
      },
    });

    const embedded = await this.prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM product WHERE status != 'ARCHIVED' AND embedding IS NOT NULL`,
    );
    const embeddedIds = new Set(embedded.map((r) => r.id));
    const pending = products.filter((p) => !embeddedIds.has(p.id));

    let generated = 0;
    for (const product of pending) {
      try {
        const paramText = product.parameterValues
          .map((pv) => `${pv.parameterDefinition.name}: ${pv.value}${pv.parameterDefinition.unit ? ' ' + pv.parameterDefinition.unit : ''}`)
          .join('; ');

        const text = [product.name, product.model, product.description, paramText]
          .filter(Boolean)
          .join('\n')
          .slice(0, 8000);

        const embedding = await this.provider.generateEmbedding(text);
        const vectorStr = `[${embedding.join(',')}]`;

        await this.prisma.$executeRawUnsafe(
          `UPDATE product SET embedding = $1::vector WHERE id = $2::uuid`,
          vectorStr,
          product.id,
        );

        generated++;
        this.logger.log(`Generated embedding for product ${product.id} (${generated}/${pending.length})`);
      } catch (error) {
        this.logger.error(`Failed to generate embedding for product ${product.id}: ${error}`);
      }
    }

    return { total: pending.length, generated };
  }

  // ============================================
  // Content Chunking
  // ============================================

  async getChunkStats(): Promise<{
    totalContent: number;
    totalChunks: number;
    contentWithChunks: number;
  }> {
    const [totalContent, totalChunks, contentWithChunks] = await Promise.all([
      this.prisma.content.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.contentChunk.count(),
      this.prisma.contentChunk.groupBy({
        by: ['contentId'],
      }),
    ]);

    return {
      totalContent,
      totalChunks,
      contentWithChunks: contentWithChunks.length,
    };
  }

  async generateContentChunks(contentId: string): Promise<{ chunkCount: number }> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { id: true, content: true },
    });

    if (!content) {
      throw new Error(`Content ${contentId} not found`);
    }

    // Remove existing chunks
    await this.prisma.contentChunk.deleteMany({
      where: { contentId },
    });

    // Simple chunking: split by paragraphs, merge short ones
    const paragraphs = content.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const maxChunkSize = 1000;
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph;
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // Generate embeddings for chunks
    const texts = chunks.map((c) => c.slice(0, 8000));
    const embeddings = await this.provider.generateEmbeddings(texts);

    // Save chunks (embedding via raw SQL since it's Unsupported type)
    for (let i = 0; i < chunks.length; i++) {
      const vectorStr = `[${embeddings[i].join(',')}]`;
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO content_chunk (id, content_id, chunk_index, text, embedding, created_at, updated_at)
         VALUES (gen_random_uuid(), $1::uuid, $2::int, $3::text, $4::vector, NOW(), NOW())`,
        contentId,
        i,
        texts[i],
        vectorStr,
      );
    }

    this.logger.log(`Generated ${chunks.length} chunks for content ${contentId}`);
    return { chunkCount: chunks.length };
  }

  async generateAllContentChunks(): Promise<{ total: number; chunked: number }> {
    if (!this.isProviderAvailable) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const contents = await this.prisma.content.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true },
    });

    // Filter out already chunked
    const chunked = await this.prisma.contentChunk.groupBy({
      by: ['contentId'],
    });
    const chunkedIds = new Set(chunked.map((c) => c.contentId));
    const pending = contents.filter((c) => !chunkedIds.has(c.id));

    let processed = 0;
    for (const content of pending) {
      try {
        await this.generateContentChunks(content.id);
        processed++;
      } catch (error) {
        this.logger.error(`Failed to chunk content ${content.id}: ${error}`);
      }
    }

    return { total: pending.length, chunked: processed };
  }

  // ============================================
  // Status
  // ============================================

  async getStatus(): Promise<{
    providerAvailable: boolean;
    providerName: string;
    contentStats: Awaited<ReturnType<typeof this.getContentEmbeddingStats>>;
    productStats: Awaited<ReturnType<typeof this.getProductEmbeddingStats>>;
    chunkStats: Awaited<ReturnType<typeof this.getChunkStats>>;
  }> {
    const [contentStats, productStats, chunkStats] = await Promise.all([
      this.getContentEmbeddingStats(),
      this.getProductEmbeddingStats(),
      this.getChunkStats(),
    ]);

    return {
      providerAvailable: this.isProviderAvailable,
      providerName: this.isProviderAvailable ? 'OpenAI text-embedding-3-small' : 'Not Configured',
      contentStats,
      productStats,
      chunkStats,
    };
  }
}