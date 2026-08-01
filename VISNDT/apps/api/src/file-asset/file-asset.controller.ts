import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { FileAssetService } from './file-asset.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiResponse } from '../common/dto/api-response.dto';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';
import { CleanupOrphansDto } from './dto/cleanup-orphans.dto';

@ApiTags('Files')
@Controller('files')
export class FileAssetController {
  constructor(private readonly service: FileAssetService) {}

  /**
   * Upload a file to S3/MinIO and create a FileAsset record.
   * ADMIN only.
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file (ADMIN only, max 10MB)' })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    const fileAsset = await this.service.upload(file, req.user.id);
    return ApiResponse.ok(fileAsset, 'File uploaded');
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