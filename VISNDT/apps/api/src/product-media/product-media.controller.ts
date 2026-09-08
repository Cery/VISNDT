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
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ProductMediaService } from './product-media.service';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

/** Per-file upload limit — must match FileAssetService MAX_FILE_SIZE (10MB). */
const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

@ApiTags('Product Media')
@Controller('products/:productId/media')
export class ProductMediaController {
  constructor(private readonly service: ProductMediaService) {}

  @Get()
  @ApiOperation({ summary: 'List media for a product (public)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  async findByProduct(@Param('productId') productId: string) {
    return ApiResponse.ok(await this.service.findByProduct(productId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media detail (public)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  async findOne(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    return ApiResponse.ok(await this.service.findOne(productId, id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add media to a product (ADMIN only)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  async create(
    @Param('productId') productId: string,
    @Body() dto: CreateProductMediaDto,
  ) {
    return ApiResponse.ok(
      await this.service.create(productId, dto),
      'Product media created',
    );
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file and create media in one step (ADMIN only)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: FILE_SIZE_LIMIT } }))
  async createWithUpload(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductMediaDto,
    @Req() req: AuthRequest,
  ) {
    return ApiResponse.ok(
      await this.service.createWithUpload(productId, file, dto, req.user.id),
      'Product media created with upload',
    );
  }

  /**
   * Batch upload-create product media (ADMIN only).
   * Max 10 files per request, 10MB per file. Multipart fields:
   * `files` (repeated), plus media metadata (mediaType required, skipped fields default).
   */
  @Post('batch-upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Batch upload files and create product media in one step (ADMIN only, max 10 files, 10MB each)',
  })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @UseInterceptors(
    FilesInterceptor('files', 10, { limits: { fileSize: FILE_SIZE_LIMIT } }),
  )
  async createWithUploadBatch(
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProductMediaDto,
    @Req() req: AuthRequest,
  ) {
    return ApiResponse.ok(
      await this.service.createWithUploadBatch(
        productId,
        files,
        dto,
        req.user.id,
      ),
      'Product media batch created with upload',
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update media info (ADMIN only)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  async update(
    @Param('productId') productId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductMediaDto,
  ) {
    return ApiResponse.ok(
      await this.service.update(productId, id, dto),
      'Product media updated',
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove media from product (ADMIN only)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiParam({ name: 'id', description: 'Media UUID' })
  async remove(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ) {
    await this.service.remove(productId, id);
    return ApiResponse.ok(null, 'Product media removed');
  }
}