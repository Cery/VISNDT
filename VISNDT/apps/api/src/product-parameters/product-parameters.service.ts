import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SetProductParameterDto } from './dto/set-product-parameter.dto';

@Injectable()
export class ProductParametersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);

    return this.prisma.productParameterValue.findMany({
      where: { productId },
      include: { parameterDefinition: true },
    });
  }

  async set(productId: string, dto: SetProductParameterDto) {
    await this.prisma.product.findUniqueOrThrow({ where: { id: productId } });
    await this.prisma.parameterDefinition.findUniqueOrThrow({
      where: { id: dto.parameterDefinitionId },
    });

    return this.prisma.productParameterValue.upsert({
      where: {
        productId_parameterDefinitionId: {
          productId,
          parameterDefinitionId: dto.parameterDefinitionId,
        },
      },
      create: {
        productId,
        parameterDefinitionId: dto.parameterDefinitionId,
        value: dto.value,
      },
      update: {
        value: dto.value,
      },
    });
  }
}