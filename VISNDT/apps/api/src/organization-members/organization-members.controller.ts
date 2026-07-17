import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

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
  @ApiOperation({ summary: 'Add a member to an organization' })
  @ApiParam({ name: 'id', description: 'Organization UUID' })
  async add(@Param('id') id: string, @Body() dto: AddMemberDto) {
    const member = await this.membersService.add(id, dto);
    return ApiResponse.ok(member, 'Member added');
  }
}