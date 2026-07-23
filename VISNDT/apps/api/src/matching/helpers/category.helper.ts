import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * CategoryHelper
 *
 * 封装读取 Demand.categoryId 的逻辑。
 * 使用 Prisma 原生类型化查询（替换原先的 raw SQL）。
 *
 * M8.4-TD02: 将 $queryRawUnsafe 替换为 Prisma.findUnique + select，
 * 移除对数据库字段可能不存在的兼容逻辑。
 */
@Injectable()
export class CategoryHelper {
  private readonly logger = new Logger(CategoryHelper.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 读取 Demand 的 categoryId。
   *
   * @param demandId - Demand UUID
   * @returns categoryId 字符串，如果不存在或异常则返回 undefined
   */
  async getDemandCategoryId(demandId: string): Promise<string | undefined> {
    try {
      const demand = await this.prisma.demand.findUnique({
        where: { id: demandId },
        select: { categoryId: true },
      });

      return demand?.categoryId ?? undefined;
    } catch (err) {
      this.logger.warn(
        `Failed to read categoryId for Demand ${demandId}: ${(err as Error).message}`,
      );
      return undefined;
    }
  }
}