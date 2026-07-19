import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';

@Injectable()
export class ProductMediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string) {
    await this.ensureProductExists(productId);
    return this.prisma.productMedia.findMany({
      where: { productId },
      orderBy: { displayOrder: 'asc' },
      include: { fileAsset: true },
    });
  }

  async findOne(productId: string, id: string) {
    const media = await this.prisma.productMedia.findFirst({
      where: { id, productId },
      include: { fileAsset: true },
    });
    if (!media) throw new NotFoundException(`ProductMedia ${id} not found`);
    return media;
  }

  async create(productId: string, dto: CreateProductMediaDto) {
    await this.ensureProductExists(productId);

    return this.prisma.productMedia.create({
      data: {
        productId,
        fileAssetId: dto.fileAssetId,
        mediaType: dto.mediaType,
        title: dto.title,
        description: dto.description,
        isPrimary: dto.isPrimary,
        displayOrder: dto.displayOrder,
      },
      include: { fileAsset: true },
    });
  }

  async update(productId: string, id: string, dto: UpdateProductMediaDto) {
    const media = await this.findOne(productId, id);

    return this.prisma.productMedia.update({
      where: { id: media.id },
      data: {
        fileAssetId: dto.fileAssetId,
        mediaType: dto.mediaType,
        title: dto.title,
        description: dto.description,
        isPrimary: dto.isPrimary,
        displayOrder: dto.displayOrder,
      },
      include: { fileAsset: true },
    });
  }

  async remove(productId: string, id: string) {
    const media = await this.findOne(productId, id);
    return this.prisma.productMedia.delete({ where: { id: media.id } });
  }

  private async ensureProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
  }
}