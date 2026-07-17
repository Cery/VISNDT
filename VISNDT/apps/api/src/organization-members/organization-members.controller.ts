import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

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
  async add(@Param('id') id: string, @Body() dto: AddMemberDto) {
    const member = await this.membersService.add(id, dto);
    return ApiResponse.ok(member, 'Member added');
  }
}