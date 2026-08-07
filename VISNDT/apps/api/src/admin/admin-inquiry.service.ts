import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InquiryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';
import { BatchStatusDto } from '../common/dto/batch-status.dto';

const VALID_STATUSES: InquiryStatus[] = [
  'NEW',
  'PROCESSING',
  'REPLIED',
  'CLOSED',
];

@Injectable()
export class AdminInquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(page: number, pageSize: number, keyword?: string, status?: string) {
    const skip = (page - 1) * pageSize;

    const where: Prisma.InquiryWhereInput = {};
    if (keyword) {
      where.OR = [
        { contactName: { contains: keyword } },
        { contactEmail: { contains: keyword } },
        { message: { contains: keyword } },
      ];
    }
    if (status) {
      where.status = status as InquiryStatus;
    }

    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true } },
          organization: { select: { id: true, name: true } },
          createdBy: { select: { id: true, email: true, name: true } },
        },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      data: data.map((i) => this.mapInquiry(i)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true } },
        organization: { select: { id: true, name: true } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    return this.mapInquiry(inquiry);
  }

  async updateStatus(id: string, status: InquiryStatus) {
    if (!VALID_STATUSES.includes(status)) {
      throw new BadRequestException(
        `Invalid status "${status}". Allowed: ${VALID_STATUSES.join(', ')}`,
      );
    }

    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!inquiry) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    const updated = await this.prisma.inquiry.update({
      where: { id },
      data: { status },
      include: {
        product: { select: { id: true, name: true } },
        organization: { select: { id: true, name: true } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });

    return this.mapInquiry(updated);
  }

  async remove(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!inquiry) {
      throw new NotFoundException(`Inquiry ${id} not found`);
    }

    await this.prisma.inquiry.delete({ where: { id } });
    return { id };
  }

  async batchDelete(dto: BatchDeleteDto) {
    const { ids } = dto;
    await this.prisma.inquiry.deleteMany({ where: { id: { in: ids } } });
    return { deletedIds: ids };
  }

  async batchStatus(dto: BatchStatusDto) {
    const { ids, status } = dto;
    if (!VALID_STATUSES.includes(status as InquiryStatus)) {
      throw new BadRequestException(
        `Invalid status "${status}". Allowed: ${VALID_STATUSES.join(', ')}`,
      );
    }
    await this.prisma.inquiry.updateMany({
      where: { id: { in: ids } },
      data: { status: status as InquiryStatus },
    });
    return { updatedIds: ids, status };
  }

  private mapInquiry(i: any) {
    return {
      id: i.id,
      productId: i.productId,
      product: i.product,
      organizationId: i.organizationId,
      organization: i.organization,
      createdById: i.createdById,
      createdBy: i.createdBy,
      contactName: i.contactName,
      contactEmail: i.contactEmail,
      contactPhone: i.contactPhone,
      message: i.message,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    };
  }
}