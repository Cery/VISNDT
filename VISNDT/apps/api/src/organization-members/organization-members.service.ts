import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';

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
      include: { user: true },
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
}