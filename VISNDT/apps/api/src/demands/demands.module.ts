import { Module } from '@nestjs/common';
import { DemandsController } from './demands.controller';
import { DemandsService } from './demands.service';
import { AuthModule } from '../auth/auth.module';
import { WorkflowEventsModule } from '../workflow-events/workflow-events.module';

@Module({
  imports: [AuthModule, WorkflowEventsModule],
  controllers: [DemandsController],
  providers: [DemandsService],
})
export class DemandsModule {}