import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
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
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    await this.checkOwnershipOrAdmin(id, requestUser);
    return user;
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  async update(id: string, dto: UpdateUserDto, requestUser: RequestUser) {
    await this.findOne(id, requestUser);

    // Non-admin users cannot change status or organizationId
    if (requestUser.id === id) {
      const member = await this.prisma.organizationMember.findFirst({
        where: { userId: requestUser.id, role: 'ADMIN' },
      });
      if (!member) {
        // Self-update: remove admin-only fields
        const { status, organizationId, ...allowedFields } = dto;
        return this.prisma.user.update({
          where: { id },
          data: allowedFields,
        });
      }
    }

    return this.prisma.user.update({ where: { id }, data: dto });
  }
}