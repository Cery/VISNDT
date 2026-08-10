import { Module } from '@nestjs/common';
import { RfqResponsesController } from './rfq-responses.controller';
import { RfqResponsesService } from './rfq-responses.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WorkflowEventsModule } from '../workflow-events/workflow-events.module';

@Module({
  imports: [AuthModule, NotificationsModule, WorkflowEventsModule],
  controllers: [RfqResponsesController],
  providers: [RfqResponsesService],
})
export class RfqResponsesModule {}
