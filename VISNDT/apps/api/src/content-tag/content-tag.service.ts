import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentTagDto } from './dto/create-content-tag.dto';
import { UpdateContentTagDto } from './dto/update-content-tag.dto';

@Injectable()
export class ContentTagService {
  private readonly logger = new Logger(ContentTagService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contentTag.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const tag = await this.prisma.contentTag.findUnique({
      where: { slug },
    });
    if (!tag) {
      throw new NotFoundException(`ContentTag with slug "${slug}" not found`);
    }
    return tag;
  }

  async findById(id: string) {
    const tag = await this.prisma.contentTag.findUnique({
      where: { id },
    });
    if (!tag) {
      throw new NotFoundException(`ContentTag ${id} not found`);
    }
    return tag;
  }

  async create(dto: CreateContentTagDto) {
    const existing = await this.prisma.contentTag.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`ContentTag with slug "${dto.slug}" already exists`);
    }
    return this.prisma.contentTag.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        type: dto.type,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateContentTagDto) {
    await this.findById(id);

    if (dto.slug) {
      const existing = await this.prisma.contentTag.findUnique({
        where: { slug: dto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`ContentTag with slug "${dto.slug}" already exists`);
      }
    }

    return this.prisma.contentTag.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        type: dto.type,
        description: dto.description,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await this.prisma.contentTag.delete({ where: { id } });
  }

  async assignTag(contentId: string, tagId: string) {
    await this.ensureContentExists(contentId);
    await this.findById(tagId);

    return this.prisma.contentTagRelation.upsert({
      where: {
        contentId_tagId: {
          contentId,
          tagId,
        },
      },
      create: { contentId, tagId },
      update: {},
    });
  }

  async removeTag(contentId: string, tagId: string) {
    await this.ensureContentExists(contentId);
    await this.findById(tagId);

    const relation = await this.prisma.contentTagRelation.findUnique({
      where: {
        contentId_tagId: {
          contentId,
          tagId,
        },
      },
    });
    if (!relation) {
      throw new NotFoundException(
        `ContentTagRelation for content ${contentId} and tag ${tagId} not found`,
      );
    }

    await this.prisma.contentTagRelation.delete({
      where: { id: relation.id },
    });
  }

  async getContentTags(contentId: string) {
    await this.ensureContentExists(contentId);

    return this.prisma.contentTagRelation.findMany({
      where: { contentId },
      include: { tag: true },
    });
  }

  private async ensureContentExists(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
      select: { id: true },
    });
    if (!content) {
      throw new NotFoundException(`Content ${contentId} not found`);
    }
  }
}