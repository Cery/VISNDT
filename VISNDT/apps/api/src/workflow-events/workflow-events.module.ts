import { Module } from '@nestjs/common';
import { WorkflowEventsController } from './workflow-events.controller';
import { WorkflowEventsService } from './workflow-events.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkflowEventsController],
  providers: [WorkflowEventsService],
  exports: [WorkflowEventsService],
})
export class WorkflowEventsModule {}