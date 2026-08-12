import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContentRevisionService } from './content-revision.service';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Content Revision')
@Controller('content/:contentId/revisions')
export class ContentRevisionController {
  constructor(private readonly service: ContentRevisionService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List content revision history (ADMIN only)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  async list(@Param('contentId') contentId: string) {
    return ApiResponse.ok(await this.service.list(contentId));
  }

  @Get(':version')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a revision snapshot by version (ADMIN only)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  @ApiParam({ name: 'version', description: 'Revision version number' })
  async findOne(
    @Param('contentId') contentId: string,
    @Param('version', ParseIntPipe) version: number,
  ) {
    return ApiResponse.ok(await this.service.findOne(contentId, version));
  }
}