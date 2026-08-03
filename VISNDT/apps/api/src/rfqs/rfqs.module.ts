import { Module } from '@nestjs/common';
import { RfqsController } from './rfqs.controller';
import { RfqsService } from './rfqs.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WorkflowEventsModule } from '../workflow-events/workflow-events.module';

@Module({
  imports: [AuthModule, NotificationsModule, WorkflowEventsModule],
  controllers: [RfqsController],
  providers: [RfqsService],
})
export class RfqsModule {}