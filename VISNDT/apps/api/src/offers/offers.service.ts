import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.offer.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { organization: true, product: true },
      }),
      this.prisma.offer.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { organization: true, product: true },
    });
    if (!offer) throw new NotFoundException(`Offer ${id} not found`);
    return offer;
  }

  async create(dto: CreateOfferDto) {
    return this.prisma.offer.create({ data: dto });
  }

  async update(id: string, dto: UpdateOfferDto) {
    await this.findOne(id);
    return this.prisma.offer.update({ where: { id }, data: dto });
  }
}