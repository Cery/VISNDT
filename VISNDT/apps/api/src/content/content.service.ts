import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, ContentStatus, WorkflowAction, WorkflowEntityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ContentRevisionService } from '../content-revision/content-revision.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { QueryContentDto } from './dto/query-content.dto';

export interface ContentUser {
  id: string;
  organizationId?: string | null;
}

/**
 * Public-safe projection for the public Content API.
 * Only fields needed by the public web + SEO are exposed.
 * Excludes internal fields: status, authorId, archivedAt, author.email, storageKey.
 */
const publicContentSelect = {
  id: true,
  type: true,
  title: true,
  slug: true,
  summary: true,
  content: true,
  publishedAt: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true } },
  coverImage: { select: { id: true, fileName: true, mimeType: true } },
  media: {
    select: {
      id: true,
      type: true,
      caption: true,
      altText: true,
      sortOrder: true,
      fileAsset: {
        select: { id: true, fileName: true, mimeType: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  },
} satisfies Prisma.ContentSelect;

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowEventsService: WorkflowEventsService,
    private readonly auditLogService: AuditLogService,
    private readonly contentRevisionService: ContentRevisionService,
  ) {}

  async findAll(query: QueryContentDto) {
    const { page = 1, pageSize = 20, type, status } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ContentWhereInput = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, email: true, name: true } },
          coverImage: { select: { id: true, fileName: true, storageKey: true, mimeType: true } },
        },
      }),
      this.prisma.content.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /**
   * Public read: list published content with a public-safe projection.
   * Forces status = PUBLISHED at the DB level; only public fields are returned.
   */
  async findAllPublic(query: QueryContentDto) {
    const { page = 1, pageSize = 20, type } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ContentWhereInput = {
      status: ContentStatus.PUBLISHED,
      ...(type ? { type } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.content.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: publicContentSelect,
      }),
      this.prisma.content.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, email: true, name: true } },
        coverImage: { select: { id: true, fileName: true, storageKey: true, mimeType: true } },
      },
    });
    if (!content) throw new NotFoundException(`内容 ${id} 未找到`);
    return content;
  }

  async findBySlug(slug: string) {
    const content = await this.prisma.content.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, email: true, name: true } },
        coverImage: { select: { id: true, fileName: true, storageKey: true, mimeType: true } },
      },
    });
    if (!content) throw new NotFoundException(`内容 slug ${slug} 未找到`);
    return content;
  }

  /**
   * Public read: find a published content by slug.
   * Only PUBLISHED content is exposed, with a public-safe projection.
   */
  async findPublishedBySlug(slug: string) {
    const content = await this.prisma.content.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      select: publicContentSelect,
    });
    if (!content) throw new NotFoundException(`内容 slug ${slug} 未找到`);
    return content;
  }

  async create(dto: CreateContentDto, authorId: string) {
    const existing = await this.prisma.content.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new BadRequestException(`slug ${dto.slug} 已存在`);

    const data: Prisma.ContentCreateInput = {
      type: dto.type,
      title: dto.title,
      slug: dto.slug,
      summary: dto.summary,
      content: dto.content,
      coverImage: dto.coverImageId ? { connect: { id: dto.coverImageId } } : undefined,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      seoKeywords: dto.seoKeywords,
      status: ContentStatus.DRAFT,
      author: { connect: { id: authorId } },
    };

    // Create content + initial revision snapshot (v1) atomically so a revision
    // write failure rolls back the content creation (Data Integrity > Silent Success).
    const content = await this.prisma.$transaction(async (tx) => {
      const created = await tx.content.create({ data });
      await this.contentRevisionService.createSnapshot(
        created.id,
        this.revisionPayload(created),
        authorId,
        tx,
      );
      return created;
    });
    await this.emitEvent(content.id, authorId, WorkflowAction.CREATED, ContentStatus.DRAFT);
    await this.auditLogService.log({
      entityType: 'CONTENT',
      entityId: content.id,
      action: 'CREATE',
      operatorId: authorId,
      newValue: this.auditPayload(content),
    });
    return content;
  }

  async update(id: string, dto: UpdateContentDto, operatorId: string) {
    const existing = await this.findOne(id);
    if (existing.status !== ContentStatus.DRAFT && existing.status !== ContentStatus.REVIEW) {
      throw new BadRequestException(`仅草稿或审核中内容可编辑，当前状态 ${existing.status}`);
    }
    // Scheduled publish is only allowed while the content is under REVIEW.
    // DRAFT / PUBLISHED / ARCHIVED must not set or modify a scheduled publish time.
    if (dto.scheduledPublishAt !== undefined && existing.status !== ContentStatus.REVIEW) {
      throw new BadRequestException(
        `仅审核中(REVIEW)内容可设置定时发布时间，当前状态 ${existing.status}`,
      );
    }
    const data: Prisma.ContentUpdateInput = {
      type: dto.type,
      title: dto.title,
      slug: dto.slug,
      summary: dto.summary,
      content: dto.content,
      coverImage: dto.coverImageId
        ? { connect: { id: dto.coverImageId } }
        : dto.coverImageId === null
          ? { disconnect: true }
          : undefined,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      seoKeywords: dto.seoKeywords,
      scheduledPublishAt:
        dto.scheduledPublishAt === undefined
          ? undefined
          : dto.scheduledPublishAt === null
            ? null
            : new Date(dto.scheduledPublishAt),
    };
    // Update content + persist a new revision snapshot atomically so a revision
    // write failure rolls back the content update (Data Integrity > Silent Success).
    const updated = await this.prisma.$transaction(async (tx) => {
      const changed = await tx.content.update({ where: { id }, data });
      await this.contentRevisionService.createSnapshot(
        id,
        this.revisionPayload(changed),
        operatorId,
        tx,
      );
      return changed;
    });
    await this.auditLogService.log({
      entityType: 'CONTENT',
      entityId: id,
      action: 'UPDATE',
      operatorId,
      oldValue: this.auditPayload(existing),
      newValue: this.auditPayload(updated),
    });
    return updated;
  }

  async submit(id: string, user: ContentUser) {
    return this.transition(id, ContentStatus.DRAFT, ContentStatus.REVIEW, WorkflowAction.SUBMITTED, user);
  }

  async review(id: string, user: ContentUser) {
    return this.transition(id, ContentStatus.REVIEW, ContentStatus.PUBLISHED, WorkflowAction.REVIEWED, user);
  }

  async publish(
    id: string,
    user: ContentUser,
    opts?: { scheduled?: boolean; scheduledAt?: Date },
  ) {
    return this.transition(
      id,
      ContentStatus.REVIEW,
      ContentStatus.PUBLISHED,
      WorkflowAction.OPENED,
      user,
      opts,
    );
  }

  async archive(id: string, user: ContentUser) {
    return this.transition(id, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED, WorkflowAction.CLOSED, user);
  }

  private async transition(
    id: string,
    from: ContentStatus,
    to: ContentStatus,
    action: WorkflowAction,
    user: ContentUser,
    opts?: { scheduled?: boolean; scheduledAt?: Date },
  ) {
    const content = await this.findOne(id);
    if (content.status !== from) {
      throw new BadRequestException(`内容状态必须为 ${from} 才能执行该操作，当前状态 ${content.status}`);
    }

    const data: Prisma.ContentUpdateInput = { status: to };
    if (to === ContentStatus.PUBLISHED) {
      data.publishedAt = new Date();
      // A publish (manual or scheduled) clears any pending schedule.
      data.scheduledPublishAt = null;
    }
    if (to === ContentStatus.ARCHIVED) data.archivedAt = new Date();

    // Atomic conditional update guarantees idempotency: under concurrent scheduler
    // ticks, only one transition from `from` succeeds, so no duplicate
    // WorkflowEvent / AuditLog can be produced.
    const result = await this.prisma.content.updateMany({
      where: { id, status: from },
      data,
    });
    if (result.count === 0) {
      throw new BadRequestException(`内容状态已变化，请刷新后重试`);
    }
    const updated = await this.findOne(id);
    await this.emitEvent(id, user.id, action, to, opts);
    await this.auditLogService.log({
      entityType: 'CONTENT',
      entityId: id,
      action: 'STATUS_CHANGE',
      operatorId: user.id,
      oldValue: { status: from },
      newValue: opts?.scheduled ? { status: to, scheduled: true } : { status: to },
    });
    return updated;
  }

  private async emitEvent(
    entityId: string,
    operatorId: string,
    action: WorkflowAction,
    to: ContentStatus,
    opts?: { scheduled?: boolean; scheduledAt?: Date },
  ) {
    // WorkflowEvent must not be silently swallowed: if it fails, the caller
    // (content lifecycle) fails loudly so the timeline stays consistent.
    const metadata: Record<string, unknown> = { to };
    if (opts?.scheduled) {
      metadata.scheduled = true;
      metadata.scheduledAt = opts.scheduledAt?.toISOString() ?? null;
    }
    await this.workflowEventsService.create(
      {
        entityType: WorkflowEntityType.CONTENT,
        entityId,
        action,
        metadata,
      },
      { id: operatorId, organizationId: null },
    );
  }

  /**
   * Revision projection: content snapshot fields only. Status / workflow /
   * audit metadata are intentionally excluded (they belong to WorkflowEvent
   * and AuditLog respectively).
   */
  private revisionPayload(content: {
    title: string;
    summary?: string | null;
    content: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
    coverImageId?: string | null;
  }) {
    return {
      title: content.title,
      summary: content.summary ?? null,
      content: content.content,
      seoTitle: content.seoTitle ?? null,
      seoDescription: content.seoDescription ?? null,
      seoKeywords: content.seoKeywords ?? null,
      coverImageId: content.coverImageId ?? null,
    };
  }

  /**
   * Audit projection: only the fields required by the audit requirement
   * (title, status, SEO fields, coverImageId) are captured for old/new diffing.
   */
  private auditPayload(content: {
    title: string;
    status: ContentStatus;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
    coverImageId?: string | null;
  }) {
    return {
      title: content.title,
      status: content.status,
      seoTitle: content.seoTitle ?? null,
      seoDescription: content.seoDescription ?? null,
      seoKeywords: content.seoKeywords ?? null,
      coverImageId: content.coverImageId ?? null,
    };
  }
}