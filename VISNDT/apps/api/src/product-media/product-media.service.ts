import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { FileAssetService } from '../file-asset/file-asset.service';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { UpdateProductMediaDto } from './dto/update-product-media.dto';
import { Express } from 'express';

@Injectable()
export class ProductMediaService {
  private readonly logger = new Logger(ProductMediaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly fileAssetService: FileAssetService,
  ) {}

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

    try {
      const productMedia = await this.prisma.productMedia.create({
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

      // Update FileAsset entityId to point to this ProductMedia
      if (dto.fileAssetId) {
        try {
          await this.prisma.fileAsset.update({
            where: { id: dto.fileAssetId },
            data: { entityId: productMedia.id },
          });
          this.logger.log(
            `FileAsset ${dto.fileAssetId} entityId updated to ${productMedia.id}`,
          );
        } catch (err) {
          this.logger.warn(
            `Failed to update FileAsset ${dto.fileAssetId} entityId: ${(err as Error).message}`,
          );
        }
      }

      return productMedia;
    } catch (err) {
      // Rollback: delete orphan FileAsset if create failed
      if (dto.fileAssetId) {
        try {
          await this.fileAssetService.delete(dto.fileAssetId);
          this.logger.log(
            `Rolled back orphan FileAsset ${dto.fileAssetId} (DB + S3)`,
          );
        } catch (cleanupErr) {
          this.logger.error(
            `Failed to cleanup orphan FileAsset ${dto.fileAssetId}: ${(cleanupErr as Error).message}`,
          );
        }
      }
      throw err; // Re-throw original error
    }
  }

  /**
   * Atomic upload-create: upload file + create ProductMedia in one operation.
   * Eliminates the orphan window between upload and create.
   *
   * @param productId - Product UUID
   * @param file - Multer file from request
   * @param dto - Media metadata (mediaType, title, description, etc.)
   * @param userId - Current authenticated user ID
   * @returns ProductMedia with populated fileAsset
   */
  async createWithUpload(
    productId: string,
    file: Express.Multer.File,
    dto: CreateProductMediaDto,
    userId: string,
  ) {
    await this.ensureProductExists(productId);

    // Step 1: Upload file → create FileAsset
    const fileAsset = await this.fileAssetService.upload(file, userId);
    this.logger.log(
      `FileAsset ${fileAsset.id} created for atomic upload-create`,
    );

    try {
      // Step 2: Create ProductMedia with the fileAssetId
      const productMedia = await this.prisma.productMedia.create({
        data: {
          productId,
          fileAssetId: fileAsset.id,
          mediaType: dto.mediaType,
          title: dto.title,
          description: dto.description,
          isPrimary: dto.isPrimary,
          displayOrder: dto.displayOrder,
        },
        include: { fileAsset: true },
      });

      // Step 3: Update FileAsset entityId to point to this ProductMedia
      try {
        await this.prisma.fileAsset.update({
          where: { id: fileAsset.id },
          data: { entityId: productMedia.id },
        });
        this.logger.log(
          `FileAsset ${fileAsset.id} entityId updated to ${productMedia.id}`,
        );
      } catch (err) {
        this.logger.warn(
          `Failed to update FileAsset ${fileAsset.id} entityId: ${(err as Error).message}`,
        );
      }

      return productMedia;
    } catch (err) {
      // Step 4: Rollback — delete orphan FileAsset (DB + S3)
      try {
        await this.fileAssetService.delete(fileAsset.id);
        this.logger.log(
          `Rolled back orphan FileAsset ${fileAsset.id} (DB + S3)`,
        );
      } catch (cleanupErr) {
        this.logger.error(
          `Failed to cleanup orphan FileAsset ${fileAsset.id}: ${(cleanupErr as Error).message}`,
        );
      }
      throw err; // Re-throw original error
    }
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

    // Save FileAsset info before deleting ProductMedia
    const fileAsset = media.fileAsset;
    const storageKey = fileAsset?.storageKey ?? null;
    const fileAssetId = fileAsset?.id ?? null;

    // Delete ProductMedia first (FK constraint is on ProductMedia side)
    await this.prisma.productMedia.delete({ where: { id: media.id } });

    // Delete FileAsset DB record if it exists
    if (fileAssetId) {
      try {
        await this.prisma.fileAsset.delete({ where: { id: fileAssetId } });
        this.logger.log(`FileAsset deleted: ${fileAssetId}`);
      } catch (err) {
        this.logger.error(
          `Failed to delete FileAsset ${fileAssetId}: ${(err as Error).message}`,
        );
      }
    }

    // Delete file from S3/MinIO — best-effort, after DB consistency
    if (storageKey) {
      try {
        await this.storage.deleteObject(storageKey);
        this.logger.log(`Storage object deleted: ${storageKey}`);
      } catch (err) {
        this.logger.error(
          `Failed to delete storage object ${storageKey}: ${(err as Error).message}`,
        );
      }
    }
  }

  private async ensureProductExists(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
  }
}