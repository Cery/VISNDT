import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { ScoringService } from './scoring/scoring.service';
import { CategoryHelper } from './helpers/category.helper';
import { KnowledgeContextAdapter } from './knowledge-context/knowledge-context-adapter.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { WorkflowEventsModule } from '../workflow-events/workflow-events.module';

@Module({
  imports: [NotificationsModule, WorkflowEventsModule],
  controllers: [MatchingController],
  providers: [
    MatchingService,
    ScoringService,
    CategoryHelper,
    KnowledgeContextAdapter,
  ],
  exports: [MatchingService, KnowledgeContextAdapter],
})
export class MatchingModule {}