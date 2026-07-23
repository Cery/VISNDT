import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AdminDemandService } from './admin-demand.service';
import { UpdateDemandDto } from '../demands/dto/update-demand.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Admin Demands')
@Controller('admin/demands')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminDemandController {
  constructor(private readonly adminDemandService: AdminDemandService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Admin update any demand (ADMIN only, bypasses owner check)' })
  @ApiParam({ name: 'id', description: 'Demand UUID' })
  async updateDemand(
    @Param('id') id: string,
    @Body() dto: UpdateDemandDto,
  ) {
    const result = await this.adminDemandService.updateDemand(id, dto);
    return ApiResponse.ok(result, 'Demand updated by admin');
  }
}