import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

interface RequestUser {
  id: string;
  email: string;
  organizationId?: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if the requesting user is the target user or an admin.
   * Returns the user's organization member record for role check.
   */
  private async checkOwnershipOrAdmin(
    targetUserId: string,
    requestUser: RequestUser,
  ): Promise<void> {
    // User accessing own data
    if (requestUser.id === targetUserId) return;

    // Check if request user is ADMIN
    const member = await this.prisma.organizationMember.findFirst({
      where: { userId: requestUser.id, role: 'ADMIN' },
    });
    if (member) return;

    throw new ForbiddenException('You can only access your own user data');
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20, keyword, status } = pagination as any;
    const skip = (page - 1) * pageSize;

    const userSelect = {
      id: true,
      email: true,
      name: true,
      status: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
    };

    const where: any = {};
    if (keyword) {
      where.OR = [
        { email: { contains: keyword, mode: 'insensitive' } },
        { name: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: userSelect,
        where,
      }),
      this.prisma.user.count({ where }),
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
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.checkOwnershipOrAdmin(id, requestUser);
    return user;
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.passwordHash, 10);
    return this.prisma.user.create({
      data: { ...dto, passwordHash },
    });
  }

  async update(id: string, dto: UpdateUserDto, requestUser: RequestUser) {
    await this.findOne(id, requestUser);

    // Hash password if provided
    let updateData = { ...dto };
    if (updateData.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, 10);
    }

    // Non-admin users cannot change status or organizationId
    if (requestUser.id === id) {
      const member = await this.prisma.organizationMember.findFirst({
        where: { userId: requestUser.id, role: 'ADMIN' },
      });
      if (!member) {
        // Self-update: remove admin-only fields
        const { status, organizationId, ...allowedFields } = updateData;
        return this.prisma.user.update({
          where: { id },
          data: allowedFields,
        });
      }
    }

    return this.prisma.user.update({ where: { id }, data: updateData });
  }

  async remove(id: string, requestUser: RequestUser) {
    if (requestUser.id === id) {
      throw new BadRequestException('Cannot delete your own account.');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.prisma.$transaction([
      this.prisma.organizationMember.deleteMany({ where: { userId: id } }),
      this.prisma.notification.deleteMany({ where: { userId: id } }),
      this.prisma.refreshToken.deleteMany({ where: { userId: id } }),
      this.prisma.user.delete({ where: { id } }),
    ]);

    return { id };
  }

  async batchDelete(ids: string[], requestUser: RequestUser): Promise<{ count: number }> {
    const results = await Promise.allSettled(
      ids.map((id) => this.remove(id, requestUser)),
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    return { count: succeeded };
  }

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const result = await this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { status: status as any },
    });
    return { count: result.count };
  }
}