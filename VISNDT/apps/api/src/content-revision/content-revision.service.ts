import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ContentRevision } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface RevisionSnapshotInput {
  title: string;
  summary?: string | null;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  coverImageId?: string | null;
  snapshot?: Prisma.InputJsonValue | null;
}

/**
 * ContentRevisionService manages the historical snapshots of Content.
 *
 * Responsibilities:
 * - Persist a snapshot of the content's mutable fields whenever they change.
 * - List revisions and read a specific version for the Admin UI.
 *
 * Boundary:
 * - Version history ONLY. Status / workflow / audit concerns belong to
 *   WorkflowEvent and AuditLog respectively.
 */
@Injectable()
export class ContentRevisionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Persist a revision snapshot. When `tx` is provided the snapshot is created
   * inside the caller's transaction so that a revision write failure rolls back
   * the content mutation (Data Integrity > Silent Success).
   *
   * Version strategy: first snapshot is version 1, later snapshots are
   * max(version) + 1.
   */
  async createSnapshot(
    contentId: string,
    data: RevisionSnapshotInput,
    createdBy: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const last = await client.contentRevision.findFirst({
      where: { contentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    const version = (last?.version ?? 0) + 1;

    return client.contentRevision.create({
      data: {
        contentId,
        version,
        title: data.title,
        summary: data.summary ?? null,
        content: data.content,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        seoKeywords: data.seoKeywords ?? null,
        coverImageId: data.coverImageId ?? null,
        snapshot: (data.snapshot ?? undefined) as Prisma.InputJsonValue | undefined,
        createdBy,
      },
    });
  }

  /**
   * List revision meta (id, version, createdAt, createdBy) for a content,
   * newest first. Used by the Admin revision history UI.
   */
  async list(contentId: string): Promise<Partial<ContentRevision>[]> {
    await this.ensureContentExists(contentId);
    return this.prisma.contentRevision.findMany({
      where: { contentId },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        createdAt: true,
        createdBy: true,
      },
    });
  }

  /**
   * Read a full revision snapshot by contentId + version.
   */
  async findOne(contentId: string, version: number): Promise<ContentRevision> {
    await this.ensureContentExists(contentId);
    const revision = await this.prisma.contentRevision.findFirst({
      where: { contentId, version },
    });
    if (!revision) {
      throw new NotFoundException(
        `内容 ${contentId} 的版本 ${version} 不存在`,
      );
    }
    return revision;
  }

  private async ensureContentExists(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { id: true },
    });
    if (!content) throw new NotFoundException(`内容 ${contentId} 未找到`);
  }
}