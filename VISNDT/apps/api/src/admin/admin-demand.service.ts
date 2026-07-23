import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDemandDto } from '../demands/dto/update-demand.dto';

@Injectable()
export class AdminDemandService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Admin bypasses owner check — can update any demand.
   */
  async updateDemand(id: string, dto: UpdateDemandDto) {
    const demand = await this.prisma.demand.findUnique({ where: { id } });
    if (!demand) {
      throw new NotFoundException(`Demand ${id} not found`);
    }

    return this.prisma.demand.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.budgetRange !== undefined && { budgetRange: dto.budgetRange }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.quantityUnit !== undefined && { quantityUnit: dto.quantityUnit }),
        ...(dto.expectedDeliveryDate !== undefined && { expectedDeliveryDate: dto.expectedDeliveryDate }),
        ...(dto.contactName !== undefined && { contactName: dto.contactName }),
        ...(dto.contactPhone !== undefined && { contactPhone: dto.contactPhone }),
        ...(dto.contactEmail !== undefined && { contactEmail: dto.contactEmail }),
        ...(dto.contactVisible !== undefined && { contactVisible: dto.contactVisible }),
      },
    });
  }
}