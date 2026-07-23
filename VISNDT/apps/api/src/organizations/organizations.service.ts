import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

interface RequestUser {
  id: string;
  email: string;
  organizationId?: string | null;
}

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify that the requesting user belongs to the target organization or is an ADMIN.
   */
  private async checkOrganizationAccess(
    targetOrgId: string,
    requestUser: RequestUser,
  ): Promise<void> {
    // User belongs to the target organization
    if (requestUser.organizationId === targetOrgId) return;

    // Check if request user is ADMIN in any organization
    const adminMember = await this.prisma.organizationMember.findFirst({
      where: { userId: requestUser.id, role: 'ADMIN' },
    });
    if (adminMember) return;

    throw new ForbiddenException('You can only access your own organization');
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organization.count(),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string, requestUser: RequestUser) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);

    await this.checkOrganizationAccess(id, requestUser);
    return org;
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: dto });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.prisma.organization.findUnique({ where: { id } });
    return this.prisma.organization.update({ where: { id }, data: dto });
  }
}