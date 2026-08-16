import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsEventDto } from './dto/create-analytics-events.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 批量写入转化事件。
   * 事件写入失败不阻塞请求，静默丢弃
   */
  async createMany(events: AnalyticsEventDto[]): Promise<{ accepted: number; rejected: number }> {
    let accepted = 0;
    let rejected = 0;

    for (const evt of events) {
      try {
        await this.prisma.conversionEvent.create({
          data: {
            event: evt.event,
            ...(evt.userId ? { userId: evt.userId } : {}),
            ...(evt.organizationId ? { organizationId: evt.organizationId } : {}),
            ...(evt.sessionId ? { sessionId: evt.sessionId } : {}),
            ...(evt.entityType ? { entityType: evt.entityType } : {}),
            ...(evt.entityId ? { entityId: evt.entityId } : {}),
            ...(evt.source ? { source: evt.source } : {}),
            ...(evt.metadata ? { metadata: evt.metadata as Prisma.InputJsonValue } : {}),
          },
        });
        accepted++;
      } catch (error) {
        this.logger.warn(`Failed to persist event ${evt.event}: ${(error as Error).message}`);
        rejected++;
      }
    }

    return { accepted, rejected };
  }
}