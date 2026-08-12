import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ContentMediaService } from './content-media.service';
import { CreateContentMediaDto } from './dto/create-content-media.dto';
import { UpdateContentMediaDto } from './dto/update-content-media.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Content Media')
@Controller('content/:contentId/media')
export class ContentMediaController {
  constructor(private readonly service: ContentMediaService) {}

  @Get()
  @ApiOperation({ summary: 'List media for a content (public, excludes storageKey)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  async findByContent(@Param('contentId') contentId: string) {
    return ApiResponse.ok(await this.service.findByContent(contentId, true));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media detail (public, excludes storageKey)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  async findOne(
    @Param('contentId') contentId: string,
    @Param('id') id: string,
  ) {
    return ApiResponse.ok(await this.service.findOne(contentId, id, true));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add media to a content (ADMIN only)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  async create(
    @Param('contentId') contentId: string,
    @Body() dto: CreateContentMediaDto,
  ) {
    return ApiResponse.ok(await this.service.create(contentId, dto), '媒体已添加');
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file and create media in one step (ADMIN only)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  @UseInterceptors(FileInterceptor('file'))
  async createWithUpload(
    @Param('contentId') contentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateContentMediaDto,
    @Req() req: AuthRequest,
  ) {
    return ApiResponse.ok(
      await this.service.createWithUpload(contentId, file, dto, req.user.id),
      '媒体已上传并添加',
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update media info (ADMIN only)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  async update(
    @Param('contentId') contentId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContentMediaDto,
  ) {
    return ApiResponse.ok(
      await this.service.update(contentId, id, dto),
      '媒体已更新',
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove media from content (ADMIN only)' })
  @ApiParam({ name: 'contentId', description: 'Content UUID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  async remove(
    @Param('contentId') contentId: string,
    @Param('id') id: string,
  ) {
    await this.service.remove(contentId, id);
    return ApiResponse.ok(null, '媒体已删除');
  }
}