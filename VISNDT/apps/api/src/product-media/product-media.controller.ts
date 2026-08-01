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
import { ProductMediaService } from './product-media.service';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

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
  @UseInterceptors(FileInterceptor('file'))
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