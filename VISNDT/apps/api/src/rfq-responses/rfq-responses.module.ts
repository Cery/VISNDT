import { Module } from '@nestjs/common';
import { RfqResponsesController } from './rfq-responses.controller';
import { RfqResponsesService } from './rfq-responses.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [RfqResponsesController],
  providers: [RfqResponsesService],
})
export class RfqResponsesModule {}