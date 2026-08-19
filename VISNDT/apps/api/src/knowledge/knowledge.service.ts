import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KnowledgeEntryStatus, KnowledgeReferenceType, KnowledgeRelationType } from '@prisma/client';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // KnowledgeDomain CRUD
  // ============================================

  async findAllDomains() {
    return this.prisma.knowledgeDomain.findMany({
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true }, orderBy: { sortOrder: 'asc' } },
        _count: { select: { categories: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findDomainById(id: string) {
    const domain = await this.prisma.knowledgeDomain.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true }, orderBy: { sortOrder: 'asc' } },
        categories: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!domain) throw new NotFoundException('知识领域不存在');
    return domain;
  }

  async createDomain(data: { name: string; slug: string; description?: string; parentId?: string; sortOrder?: number }) {
    const existing = await this.prisma.knowledgeDomain.findUnique({ where: { slug: data.slug } });
    if (existing) throw new BadRequestException('Slug 已存在');

    if (data.parentId) {
      const parent = await this.prisma.knowledgeDomain.findUnique({ where: { id: data.parentId } });
      if (!parent) throw new BadRequestException('父领域不存在');
    }

    return this.prisma.knowledgeDomain.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId ?? null,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateDomain(id: string, data: { name?: string; slug?: string; description?: string; parentId?: string | null; sortOrder?: number }) {
    const domain = await this.prisma.knowledgeDomain.findUnique({ where: { id } });
    if (!domain) throw new NotFoundException('知识领域不存在');

    if (data.slug && data.slug !== domain.slug) {
      const existing = await this.prisma.knowledgeDomain.findUnique({ where: { slug: data.slug } });
      if (existing) throw new BadRequestException('Slug 已存在');
    }

    if (data.parentId && data.parentId === id) {
      throw new BadRequestException('不能将自己设为父领域');
    }

    return this.prisma.knowledgeDomain.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
  }

  async deleteDomain(id: string) {
    const domain = await this.prisma.knowledgeDomain.findUnique({
      where: { id },
      include: { _count: { select: { children: true, categories: true } } },
    });
    if (!domain) throw new NotFoundException('知识领域不存在');
    if (domain._count.children > 0) throw new BadRequestException('无法删除包含子领域的领域');
    if (domain._count.categories > 0) throw new BadRequestException('无法删除包含分类的领域');

    return this.prisma.knowledgeDomain.delete({ where: { id } });
  }

  // ============================================
  // KnowledgeCategory CRUD
  // ============================================

  async findAllCategories(domainId?: string) {
    const where = domainId ? { domainId } : {};
    return this.prisma.knowledgeCategory.findMany({
      where,
      include: {
        domain: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.knowledgeCategory.findUnique({
      where: { id },
      include: {
        domain: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!category) throw new NotFoundException('知识分类不存在');
    return category;
  }

  async createCategory(data: { domainId: string; name: string; slug: string; description?: string; sortOrder?: number }) {
    const domain = await this.prisma.knowledgeDomain.findUnique({ where: { id: data.domainId } });
    if (!domain) throw new BadRequestException('知识领域不存在');

    const existing = await this.prisma.knowledgeCategory.findUnique({
      where: { domainId_slug: { domainId: data.domainId, slug: data.slug } },
    });
    if (existing) throw new BadRequestException('该领域下 Slug 已存在');

    return this.prisma.knowledgeCategory.create({
      data: {
        domainId: data.domainId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { domain: { select: { id: true, name: true, slug: true } } },
    });
  }

  async updateCategory(id: string, data: { name?: string; slug?: string; description?: string; domainId?: string; sortOrder?: number }) {
    const category = await this.prisma.knowledgeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('知识分类不存在');

    const domainId = data.domainId ?? category.domainId;
    const slug = data.slug ?? category.slug;

    if (data.slug || data.domainId) {
      const existing = await this.prisma.knowledgeCategory.findUnique({
        where: { domainId_slug: { domainId, slug } },
      });
      if (existing && existing.id !== id) throw new BadRequestException('该领域下 Slug 已存在');
    }

    if (data.domainId) {
      const domain = await this.prisma.knowledgeDomain.findUnique({ where: { id: data.domainId } });
      if (!domain) throw new BadRequestException('知识领域不存在');
    }

    return this.prisma.knowledgeCategory.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.domainId !== undefined && { domainId: data.domainId }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      include: { domain: { select: { id: true, name: true, slug: true } } },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.knowledgeCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('知识分类不存在');
    return this.prisma.knowledgeCategory.delete({ where: { id } });
  }

  // ============================================
  // KnowledgeEntry CRUD
  // ============================================

  async findAllEntries(params: {
    domainId?: string;
    categoryId?: string;
    status?: KnowledgeEntryStatus;
    search?: string;
  }) {
    const where: any = {};
    if (params.domainId) where.domainId = params.domainId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { summary: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.knowledgeEntry.findMany({
      where,
      include: {
        domain: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
        _count: { select: { contentRefs: true, sourceRelations: true, targetRelations: true } },
      },
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  async findEntryById(id: string) {
    const entry = await this.prisma.knowledgeEntry.findUnique({
      where: { id },
      include: {
        domain: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
        contentRefs: {
          include: {
            content: { select: { id: true, title: true, slug: true, type: true, status: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
        sourceRelations: {
          include: {
            target: { select: { id: true, title: true, slug: true, status: true } },
          },
        },
        targetRelations: {
          include: {
            source: { select: { id: true, title: true, slug: true, status: true } },
          },
        },
      },
    });
    if (!entry) throw new NotFoundException('知识条目不存在');
    return entry;
  }

  async createEntry(data: {
    domainId: string;
    categoryId: string;
    title: string;
    slug: string;
    summary?: string;
    structuredBody: any;
    authorId: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }) {
    const existing = await this.prisma.knowledgeEntry.findUnique({ where: { slug: data.slug } });
    if (existing) throw new BadRequestException('Slug 已存在');

    const domain = await this.prisma.knowledgeDomain.findUnique({ where: { id: data.domainId } });
    if (!domain) throw new BadRequestException('知识领域不存在');

    const category = await this.prisma.knowledgeCategory.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new BadRequestException('知识分类不存在');

    return this.prisma.knowledgeEntry.create({
      data: {
        domainId: data.domainId,
        categoryId: data.categoryId,
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        structuredBody: data.structuredBody,
        authorId: data.authorId,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
      },
    });
  }

  async updateEntry(id: string, data: {
    domainId?: string;
    categoryId?: string;
    title?: string;
    slug?: string;
    summary?: string;
    structuredBody?: any;
    status?: KnowledgeEntryStatus;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }) {
    const entry = await this.prisma.knowledgeEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('知识条目不存在');

    if (data.slug && data.slug !== entry.slug) {
      const existing = await this.prisma.knowledgeEntry.findUnique({ where: { slug: data.slug } });
      if (existing) throw new BadRequestException('Slug 已存在');
    }

    if (data.domainId) {
      const domain = await this.prisma.knowledgeDomain.findUnique({ where: { id: data.domainId } });
      if (!domain) throw new BadRequestException('知识领域不存在');
    }

    if (data.categoryId) {
      const category = await this.prisma.knowledgeCategory.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new BadRequestException('知识分类不存在');
    }

    const updateData: any = {};
    if (data.domainId !== undefined) updateData.domainId = data.domainId;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.structuredBody !== undefined) updateData.structuredBody = data.structuredBody;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'PUBLISHED') updateData.publishedAt = new Date();
    }
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords;

    return this.prisma.knowledgeEntry.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteEntry(id: string) {
    const entry = await this.prisma.knowledgeEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('知识条目不存在');
    return this.prisma.knowledgeEntry.delete({ where: { id } });
  }

  // ============================================
  // KnowledgeContentRef CRUD
  // ============================================

  async findAllContentRefs(knowledgeId?: string) {
    const where = knowledgeId ? { knowledgeId } : {};
    return this.prisma.knowledgeContentRef.findMany({
      where,
      include: {
        content: { select: { id: true, title: true, slug: true, type: true, status: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createContentRef(data: {
    knowledgeId: string;
    contentId: string;
    referenceType?: KnowledgeReferenceType;
    sortOrder?: number;
  }) {
    const entry = await this.prisma.knowledgeEntry.findUnique({ where: { id: data.knowledgeId } });
    if (!entry) throw new BadRequestException('知识条目不存在');

    const content = await this.prisma.content.findUnique({ where: { id: data.contentId } });
    if (!content) throw new BadRequestException('内容不存在');

    const existing = await this.prisma.knowledgeContentRef.findUnique({
      where: { knowledgeId_contentId: { knowledgeId: data.knowledgeId, contentId: data.contentId } },
    });
    if (existing) throw new BadRequestException('该内容引用已存在');

    return this.prisma.knowledgeContentRef.create({
      data: {
        knowledgeId: data.knowledgeId,
        contentId: data.contentId,
        referenceType: data.referenceType ?? 'SOURCE',
        sortOrder: data.sortOrder ?? 0,
      },
      include: {
        content: { select: { id: true, title: true, slug: true, type: true, status: true } },
      },
    });
  }

  async updateContentRef(id: string, data: { referenceType?: KnowledgeReferenceType; sortOrder?: number }) {
    const ref = await this.prisma.knowledgeContentRef.findUnique({ where: { id } });
    if (!ref) throw new NotFoundException('内容引用不存在');

    return this.prisma.knowledgeContentRef.update({
      where: { id },
      data: {
        ...(data.referenceType !== undefined && { referenceType: data.referenceType }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      include: {
        content: { select: { id: true, title: true, slug: true, type: true, status: true } },
      },
    });
  }

  async deleteContentRef(id: string) {
    const ref = await this.prisma.knowledgeContentRef.findUnique({ where: { id } });
    if (!ref) throw new NotFoundException('内容引用不存在');
    return this.prisma.knowledgeContentRef.delete({ where: { id } });
  }

  // ============================================
  // KnowledgeRelation CRUD
  // ============================================

  async findAllRelations(knowledgeId?: string) {
    if (knowledgeId) {
      return this.prisma.knowledgeRelation.findMany({
        where: {
          OR: [{ sourceId: knowledgeId }, { targetId: knowledgeId }],
        },
        include: {
          source: { select: { id: true, title: true, slug: true, status: true } },
          target: { select: { id: true, title: true, slug: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.knowledgeRelation.findMany({
      include: {
        source: { select: { id: true, title: true, slug: true, status: true } },
        target: { select: { id: true, title: true, slug: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRelation(data: {
    sourceId: string;
    targetId: string;
    relationType: KnowledgeRelationType;
    description?: string;
  }) {
    if (data.sourceId === data.targetId) {
      throw new BadRequestException('不能关联自身');
    }

    const source = await this.prisma.knowledgeEntry.findUnique({ where: { id: data.sourceId } });
    if (!source) throw new BadRequestException('源知识条目不存在');

    const target = await this.prisma.knowledgeEntry.findUnique({ where: { id: data.targetId } });
    if (!target) throw new BadRequestException('目标知识条目不存在');

    const existing = await this.prisma.knowledgeRelation.findUnique({
      where: {
        sourceId_targetId_relationType: {
          sourceId: data.sourceId,
          targetId: data.targetId,
          relationType: data.relationType,
        },
      },
    });
    if (existing) throw new BadRequestException('该关联已存在');

    return this.prisma.knowledgeRelation.create({
      data: {
        sourceId: data.sourceId,
        targetId: data.targetId,
        relationType: data.relationType,
        description: data.description,
      },
      include: {
        source: { select: { id: true, title: true, slug: true, status: true } },
        target: { select: { id: true, title: true, slug: true, status: true } },
      },
    });
  }

  async deleteRelation(id: string) {
    const relation = await this.prisma.knowledgeRelation.findUnique({ where: { id } });
    if (!relation) throw new NotFoundException('知识关联不存在');
    return this.prisma.knowledgeRelation.delete({ where: { id } });
  }

  // ============================================
  // Public Knowledge Query Methods
  // ============================================

  async findPublicDomains() {
    return this.prisma.knowledgeDomain.findMany({
      include: {
        _count: { select: { categories: true, entries: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findPublicDomainBySlug(slug: string) {
    const domain = await this.prisma.knowledgeDomain.findUnique({
      where: { slug },
      include: {
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: { _count: { select: { entries: true } } },
        },
        _count: { select: { entries: true } },
      },
    });
    if (!domain) throw new NotFoundException('知识领域不存在');
    return domain;
  }

  async findPublicCategories(domainId?: string) {
    const where: any = {};
    if (domainId) where.domainId = domainId;
    return this.prisma.knowledgeCategory.findMany({
      where,
      include: {
        domain: { select: { id: true, name: true, slug: true } },
        _count: { select: { entries: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findPublicEntries(params: {
    domainId?: string;
    categoryId?: string;
    domainSlug?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const where: any = { status: 'PUBLISHED' };
    if (params.domainId) where.domainId = params.domainId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.domainSlug) {
      const domain = await this.prisma.knowledgeDomain.findUnique({ where: { slug: params.domainSlug } });
      if (domain) where.domainId = domain.id;
    }
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { summary: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 12;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.knowledgeEntry.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          domain: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true } },
          _count: { select: { contentRefs: true } },
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: pageSize,
      }),
      this.prisma.knowledgeEntry.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findPublicEntryBySlug(slug: string) {
    const entry = await this.prisma.knowledgeEntry.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        domain: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
        contentRefs: {
          include: {
            content: { select: { id: true, title: true, slug: true, type: true, summary: true, coverImage: { select: { id: true, fileName: true } } } },
          },
          orderBy: { sortOrder: 'asc' },
        },
        sourceRelations: {
          include: {
            target: { select: { id: true, title: true, slug: true, summary: true } },
          },
          where: { target: { status: 'PUBLISHED' } },
        },
        targetRelations: {
          include: {
            source: { select: { id: true, title: true, slug: true, summary: true } },
          },
          where: { source: { status: 'PUBLISHED' } },
        },
      },
    });
    if (!entry) throw new NotFoundException('知识条目不存在');
    return entry;
  }

  /**
   * Knowledge → Related Products resolution (M24.1.7)
   *
   * Deterministic reverse mapping, no AI / keyword / random / similarity
   * recommendation:
   *   KnowledgeEntry → KnowledgeCategory → ProductCategoryKnowledgeMapping
   *                   (isActive) → ProductCategory → Product (ACTIVE)
   *
   * The authoritative source of association is ProductCategoryKnowledgeMapping
   * exclusively (ADR-M24-008 / 009 / 010). Knowledge Domain continues to be
   * derived from KnowledgeCategory → KnowledgeDomain and is NOT stored in the
   * mapping. Product visibility follows the repository-wide convention
   * `status: 'ACTIVE'` (no new product state model is introduced).
   */
  async findRelatedProducts(slug: string) {
    const entry = await this.prisma.knowledgeEntry.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: { id: true, categoryId: true },
    });
    if (!entry) throw new NotFoundException('知识条目不存在');

    // 1. Resolve active product-category mappings for the entry's single
    //    knowledge category, ordered by mapping sortOrder (stable ordering).
    const mappings = await this.prisma.productCategoryKnowledgeMapping.findMany({
      where: { knowledgeCategoryId: entry.categoryId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { productCategoryId: true, sortOrder: true },
    });

    if (mappings.length === 0) {
      return [];
    }

    const categoryOrder = new Map<string, number>(
      mappings.map((m) => [m.productCategoryId, m.sortOrder]),
    );

    // 2. Retrieve ACTIVE products across the mapped product categories.
    //    Lightweight select only (no parameter values / full media / internal data).
    const products = await this.prisma.product.findMany({
      where: {
        categoryId: { in: [...categoryOrder.keys()] },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        model: true,
        description: true,
        categoryId: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        media: {
          where: { isPrimary: true },
          orderBy: { displayOrder: 'asc' },
          take: 1,
          select: { id: true, mediaType: true, title: true },
        },
      },
    });

    // 3. Deduplicate by Product.id (defensive; a product belongs to exactly one
    //    category) and order deterministically:
    //    mapping sortOrder (category) asc → createdAt desc → id asc.
    const deduped = new Map<string, (typeof products)[number]>();
    for (const product of products) {
      if (!deduped.has(product.id)) {
        deduped.set(product.id, product);
      }
    }

    return [...deduped.values()]
      .sort((a, b) => {
        const ao = categoryOrder.get(a.categoryId) ?? 0;
        const bo = categoryOrder.get(b.categoryId) ?? 0;
        if (ao !== bo) return ao - bo;
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        if (ta !== tb) return tb - ta;
        return a.id.localeCompare(b.id);
      })
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        model: p.model,
        description: p.description,
        category: p.category,
        primaryMedia: p.media[0] ?? null,
      }));
  }
}