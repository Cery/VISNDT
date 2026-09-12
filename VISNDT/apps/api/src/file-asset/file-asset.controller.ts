import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { FileType } from '@prisma/client';
import { FileAssetService } from './file-asset.service';
import type { ListFilesQuery } from './file-asset.service';
import { BatchUploadDto } from './dto/batch-upload.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiResponse } from '../common/dto/api-response.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { CleanupOrphansDto } from './dto/cleanup-orphans.dto';
import { BatchDeleteDto } from '../common/dto/batch-delete.dto';

/** Per-file upload limit — must match FileAssetService MAX_FILE_SIZE (10MB). */
const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

@ApiTags('Files')
@Controller('files')
export class FileAssetController {
  constructor(private readonly service: FileAssetService) {}

  /**
   * List all FileAssets (read-only, ADMIN only) for the unified media center.
   * Supports: fileType / entityType / organizationId / search / page / pageSize.
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'List all file assets (ADMIN only). Supports fileType, entityType, organizationId, search, page, pageSize',
  })
  async findAll(@Query() query: ListFilesQuery) {
    return ApiResponse.ok(await this.service.findAll(query));
  }

  /**
   * Upload a file to S3/MinIO and create a FileAsset record.
   * ADMIN only.
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Upload a file (ADMIN only, max 10MB). Optional fileType: IMAGE/DOCUMENT/CERTIFICATE/SPEC_SHEET/ILLUSTRATION/OTHER',
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: FILE_SIZE_LIMIT } }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
    @Query('fileType') fileType?: string,
  ) {
    const fileAsset = await this.service.upload(
      file,
      req.user.id,
      undefined,
      this.resolveFileType(fileType),
    );
    return ApiResponse.ok(fileAsset, 'File uploaded');
  }

  private resolveFileType(fileType?: string): FileType | undefined {
    if (!fileType) return undefined;
    const upper = fileType.toUpperCase() as FileType;
    return Object.values(FileType).includes(upper) ? upper : undefined;
  }

  /**
   * List orphan FileAssets with no associated ProductMedia.
   * ADMIN only. Must be defined BEFORE :id routes to avoid route conflict.
   */
  @Get('orphans')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List orphan FileAssets (ADMIN only)' })
  async findOrphans() {
    const orphans = await this.service.findOrphans();
    return ApiResponse.ok(orphans, 'Orphan files retrieved');
  }

  /**
   * Clean up specified orphan FileAssets.
   * ADMIN only. Must be defined BEFORE :id routes to avoid route conflict.
   */
  @Post('orphans/cleanup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clean up orphan FileAssets (ADMIN only, max 100 per request)' })
  async cleanupOrphans(@Body() dto: CleanupOrphansDto) {
    const result = await this.service.cleanupOrphans(dto.ids);
    return ApiResponse.ok(result, 'Orphan cleanup completed');
  }

  /**
   * Get a single FileAsset metadata by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get file metadata by ID' })
  @ApiParam({ name: 'id', description: 'FileAsset UUID' })
  async findOne(@Param('id') id: string) {
    const fileAsset = await this.service.findOne(id);
    return ApiResponse.ok(fileAsset, 'File metadata retrieved');
  }

  /**
   * Download a file via pre-signed URL redirect.
   */
  @Get(':id/download')
  @ApiOperation({ summary: 'Download a file via signed URL' })
  @ApiParam({ name: 'id', description: 'FileAsset UUID' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const { url, fileName, mimeType } = await this.service.download(id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(fileName)}"`,
    );
    return res.redirect(HttpStatus.FOUND, url);
  }

  @Post('batch-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch delete files (ADMIN only)' })
  async batchDelete(@Body() dto: BatchDeleteDto) {
    const result = await this.service.batchDelete(dto.ids);
    return ApiResponse.ok(result, 'Files deleted');
  }

  /**
   * Batch upload files with ownership tags (ADMIN only).
   * Max 10 files per request, 10MB per file. Multipart fields:
   * `files` (repeated), plus optional `fileType` / `organizationId` / `entityType`.
   */
  @Post('batch-upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Batch upload files with ownership tags (ADMIN only, max 10 files, 10MB each).',
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, { limits: { fileSize: FILE_SIZE_LIMIT } }),
  )
  async batchUpload(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthRequest,
    @Body() dto: BatchUploadDto,
  ) {
    const result = await this.service.batchUploadWithOwnership(
      files,
      req.user.id,
      {
        fileType: dto.fileType,
        organizationId: dto.organizationId,
        entityType: dto.entityType,
      },
    );
    return ApiResponse.ok(result, 'Batch upload completed');
  }

  /**
   * Delete a file from S3/MinIO and remove the database record.
   * ADMIN only.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a file (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'FileAsset UUID' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return ApiResponse.ok(null, 'File deleted');
  }
}