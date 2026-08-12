import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentSchedulerService } from './content.scheduler';
import { AuthModule } from '../auth/auth.module';
import { WorkflowEventsModule } from '../workflow-events/workflow-events.module';
import { ContentRevisionModule } from '../content-revision/content-revision.module';

@Module({
  imports: [AuthModule, WorkflowEventsModule, ContentRevisionModule],
  controllers: [ContentController],
  providers: [ContentService, ContentSchedulerService],
  exports: [ContentService],
})
export class ContentModule {}