import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PUBLIC_USER_SELECT } from '../common/projection/user.projection';
import { AddMemberDto } from './dto/add-member.dto';

const MEMBER_ROLES = ['ADMIN', 'MEMBER'] as const;

@Injectable()
export class OrganizationMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) throw new NotFoundException(`Organization ${organizationId} not found`);

    return this.prisma.organizationMember.findMany({
      where: { organizationId },
      include: { user: { select: PUBLIC_USER_SELECT } },
    });
  }

  async add(organizationId: string, dto: AddMemberDto) {
    await this.prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
    });
    await this.prisma.user.findUniqueOrThrow({
      where: { id: dto.userId },
    });

    return this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId: dto.userId,
        role: dto.role ?? 'MEMBER',
      },
    });
  }

  /**
   * Change an existing member's role within an organization.
   * M35 Basic Role Management — 复用 OrganizationMember 现有 role 语义。
   * 组织作用域由 controller 强制（path id === 调用者 JWT 组织）；此处补充：
   *   - 成员必须属于该组织；
   *   - 不允许降级最后一个 ADMIN（防止组织失去管理权限）。
   */
  async updateRole(organizationId: string, memberId: string, role: string) {
    const member = await this.prisma.organizationMember.findFirst({
      where: { id: memberId, organizationId },
    });
    if (!member) {
      throw new NotFoundException('Member not found in this organization');
    }

    if (role === 'ADMIN') {
      return this.prisma.organizationMember.update({
        where: { id: member.id },
        data: { role },
        include: { user: { select: PUBLIC_USER_SELECT } },
      });
    }

    // Demoting to MEMBER — prevent removing the last ADMIN (avoid org lockout).
    if (member.role === 'ADMIN') {
      const adminCount = await this.prisma.organizationMember.count({
        where: { organizationId, role: 'ADMIN' },
      });
      if (adminCount <= 1) {
        throw new BadRequestException('Cannot demote the last administrator');
      }
    }

    return this.prisma.organizationMember.update({
      where: { id: member.id },
      data: { role },
      include: { user: { select: PUBLIC_USER_SELECT } },
    });
  }
}