import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Organization Members')
@Controller('organizations/:id/members')
export class OrganizationMembersController {
  constructor(private readonly membersService: OrganizationMembersService) {}

  @Get()
  @ApiOperation({ summary: 'List members of an organization' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async findByOrganization(@Param('id') id: string) {
    const members = await this.membersService.findByOrganization(id);
    return ApiResponse.ok(members);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a member to an organization (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async add(
    @Param('id') id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    // M35 Closeout security: 仅允许操作调用者自身的组织作用域，禁止 Supplier A 修改 Supplier B 成员。
    if (id !== user.organizationId) {
      throw new ForbiddenException('Insufficient permissions');
    }
    const member = await this.membersService.add(id, dto);
    return ApiResponse.ok(member, 'Member added');
  }

  @Patch(':memberId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change a member role (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  @ApiParam({ name: 'memberId', description: 'OrganizationMember UUID' })
  async updateRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    // 组织作用域强制：path id 必须等于调用者的 JWT 组织。
    if (id !== user.organizationId) {
      throw new ForbiddenException('Insufficient permissions');
    }
    const member = await this.membersService.updateRole(id, memberId, dto.role);
    return ApiResponse.ok(member, 'Member role updated');
  }
}