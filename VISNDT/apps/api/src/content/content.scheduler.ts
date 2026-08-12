import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ContentStatus, UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ContentService } from './content.service';

/**
 * Lightweight minute-level scanner for scheduled publish.
 *
 * Design constraints (M18.4.3):
 * - No CMS scheduler / job model / message queue is introduced.
 * - Only reviews `status = REVIEW AND scheduledPublishAt <= now()`.
 * - Reuses ContentService.publish() (no duplicated publish logic).
 * - Idempotent: the atomic conditional transition in ContentService guarantees
 *   a single WORKFLOW / AUDIT emission per content even if ticks overlap.
 * - Failure isolation: one failing content does not block others; the next
 *   tick retries it.
 * - Traceability: operations run under a dedicated `system@visndt.com` identity.
 */
@Injectable()
export class ContentSchedulerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ContentSchedulerService.name);
  private readonly SYSTEM_EMAIL = 'system@visndt.com';
  private readonly SCAN_INTERVAL_MS = 60_000;
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly contentService: ContentService,
  ) {}

  async onModuleInit() {
    await this.ensureSystemUser();
    this.timer = setInterval(() => void this.scan(), this.SCAN_INTERVAL_MS);
    this.timer.unref?.();
    this.logger.log('Content scheduled publish scanner started (every 60s)');
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Idempotently creates (or reuses) the dedicated system identity used to
   * execute automatic publishes, so WorkflowEvent / AuditLog remain traceable.
   */
  private async ensureSystemUser() {
    const existing = await this.prisma.user.findUnique({
      where: { email: this.SYSTEM_EMAIL },
    });
    if (existing) return;

    await this.prisma.user.create({
      data: {
        email: this.SYSTEM_EMAIL,
        passwordHash: await bcrypt.hash(randomUUID(), 10),
        name: 'System Scheduler',
        status: UserStatus.ACTIVE,
        organizationId: null,
      },
    });
    this.logger.log(`System identity ${this.SYSTEM_EMAIL} created`);
  }

  /**
   * Scans for due content and publishes them. Overlapping runs are skipped.
   */
  async scan() {
    if (this.running) return;
    this.running = true;
    try {
      const system = await this.prisma.user.findUnique({
        where: { email: this.SYSTEM_EMAIL },
      });
      if (!system) {
        this.logger.error(`System identity ${this.SYSTEM_EMAIL} is missing, skipping scan`);
        return;
      }

      const due = await this.prisma.content.findMany({
        where: {
          status: ContentStatus.REVIEW,
          scheduledPublishAt: { lte: new Date() },
        },
        select: { id: true, title: true, scheduledPublishAt: true },
      });
      if (due.length === 0) return;

      this.logger.log(`Scheduled publish scan found ${due.length} due content(s)`);
      for (const item of due) {
        try {
          await this.contentService.publish(
            item.id,
            { id: system.id, organizationId: null },
            { scheduled: true, scheduledAt: item.scheduledPublishAt ?? undefined },
          );
          this.logger.log(`Scheduled publish executed for content ${item.id} (${item.title})`);
        } catch (error) {
          // Failure isolation: log and continue; the next tick will retry.
          this.logger.error(
            `Scheduled publish failed for content ${item.id}: ${(error as Error).message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Scheduled publish scan errored: ${(error as Error).message}`);
    } finally {
      this.running = false;
    }
  }
}