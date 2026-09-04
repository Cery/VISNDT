import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { OrganizationStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';

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

  async findAll(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.OrganizationWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { type: { contains: keyword } },
      ];
    }
    if (status) {
      where.status = status as OrganizationStatus;
    }

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { members: true } },
        },
      }),
      this.prisma.organization.count({ where }),
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
      include: { members: { include: { user: { select: { id: true, email: true, name: true } } } } },
    });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);

    await this.checkOrganizationAccess(id, requestUser);
    return org;
  }

  async findOnePublic(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);
    return org;
  }

  async create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({ data: dto });
  }

  async update(id: string, dto: UpdateOrganizationDto, requestUser: RequestUser) {
    await this.prisma.organization.findUnique({ where: { id } });
    await this.checkOrganizationAccess(id, requestUser);
    return this.prisma.organization.update({ where: { id }, data: dto });
  }

  /**
   * Self-service update for organization members.
   * Only allows name, type — explicitly excludes status and admin fields.
   */
  async updateSelf(
    id: string,
    dto: { name?: string; type?: string },
    requestUser: RequestUser,
  ) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);

    // Verify the user belongs to this organization
    if (requestUser.organizationId !== id) {
      throw new ForbiddenException('You can only update your own organization');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.type !== undefined) updateData.type = dto.type;

    return this.prisma.organization.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, offers: true, demands: true, inquiries: true },
        },
      },
    });
    if (!org) throw new NotFoundException(`Organization ${id} not found`);

    const { users, offers, demands, inquiries } = org._count;
    if (users > 0 || offers > 0 || demands > 0 || inquiries > 0) {
      const reasons: string[] = [];
      if (users > 0) reasons.push(`${users} user(s)`);
      if (offers > 0) reasons.push(`${offers} offer(s)`);
      if (demands > 0) reasons.push(`${demands} demand(s)`);
      if (inquiries > 0) reasons.push(`${inquiries} inquiry/inquiries`);
      throw new BadRequestException(
        `Cannot delete organization with existing dependencies: ${reasons.join(', ')}. Clean up dependencies first.`,
      );
    }

    await this.prisma.organization.delete({ where: { id } });
    return { id };
  }

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const results = await Promise.allSettled(
      ids.map((id) => this.remove(id)),
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    return { count: succeeded };
  }

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const result = await this.prisma.organization.updateMany({
      where: { id: { in: ids } },
      data: { status: status as any },
    });
    return { count: result.count };
  }

  /**
   * 819 Permission Foundation — Admin enables / disables SupplierProduct
   * self-service for a target organization (opt-in, default false).
   * Only gates the SUPPLIER self-service surface; does NOT gate Admin
   * attach/governance nor Platform Product authority.
   */
  async setSupplierProductEnablement(id: string, enabled: boolean) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) {
      throw new NotFoundException(`Organization ${id} not found`);
    }
    return this.prisma.organization.update({
      where: { id },
      data: { supplierProductManagementEnabled: enabled },
      select: {
        id: true,
        name: true,
        type: true,
        supplierProductManagementEnabled: true,
      },
    });
  }
}
