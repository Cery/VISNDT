import { Module } from '@nestjs/common';
import { WorkflowEventsController } from './workflow-events.controller';
import { WorkflowEventsService } from './workflow-events.service';

@Module({
  controllers: [WorkflowEventsController],
  providers: [WorkflowEventsService],
})
export class WorkflowEventsModule {}