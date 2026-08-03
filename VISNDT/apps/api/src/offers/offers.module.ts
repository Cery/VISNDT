import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WorkflowEventsModule } from '../workflow-events/workflow-events.module';

@Module({
  imports: [AuthModule, NotificationsModule, WorkflowEventsModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}