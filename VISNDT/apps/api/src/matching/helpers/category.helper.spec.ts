import { Test, TestingModule } from '@nestjs/testing';
import { CategoryHelper } from './category.helper';
import { PrismaService } from '../../prisma/prisma.service';

describe('CategoryHelper', () => {
  let helper: CategoryHelper;
  let prisma: PrismaService;

  const TEST_DEMAND_ID = '00000000-0000-0000-0000-000000000001';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryHelper,
        {
          provide: PrismaService,
          useValue: {
            demand: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    helper = module.get<CategoryHelper>(CategoryHelper);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getDemandCategoryId', () => {
    it('should return UUID when categoryId exists', async () => {
      const categoryId = 'aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
      jest.spyOn(prisma.demand, 'findUnique').mockResolvedValue({
        categoryId,
      } as any);

      const result = await helper.getDemandCategoryId(TEST_DEMAND_ID);

      expect(result).toBe(categoryId);
      expect(prisma.demand.findUnique).toHaveBeenCalledWith({
        where: { id: TEST_DEMAND_ID },
        select: { categoryId: true },
      });
    });

    it('should return undefined when categoryId is null', async () => {
      jest.spyOn(prisma.demand, 'findUnique').mockResolvedValue({
        categoryId: null,
      } as any);

      const result = await helper.getDemandCategoryId(TEST_DEMAND_ID);

      expect(result).toBeUndefined();
    });

    it('should return undefined when demand not found', async () => {
      jest.spyOn(prisma.demand, 'findUnique').mockResolvedValue(null);

      const result = await helper.getDemandCategoryId(TEST_DEMAND_ID);

      expect(result).toBeUndefined();
    });

    it('should return undefined when Prisma throws', async () => {
      jest.spyOn(prisma.demand, 'findUnique').mockRejectedValue(
        new Error('Database connection error'),
      );

      const result = await helper.getDemandCategoryId(TEST_DEMAND_ID);

      expect(result).toBeUndefined();
    });

    it('should use Prisma typed select query (not raw SQL)', async () => {
      const categoryId = '11111111-1111-1111-1111-111111111111';
      jest.spyOn(prisma.demand, 'findUnique').mockResolvedValue({
        categoryId,
      } as any);

      await helper.getDemandCategoryId(TEST_DEMAND_ID);

      const callArgs = (prisma.demand.findUnique as jest.Mock).mock.calls[0][0];
      // Verify it uses Prisma typed query (not $queryRawUnsafe)
      expect(callArgs.where).toEqual({ id: TEST_DEMAND_ID });
      expect(callArgs.select).toEqual({ categoryId: true });
    });
  });
});