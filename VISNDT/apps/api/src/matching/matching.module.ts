import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ScoringService } from './scoring/scoring.service';
import { CategoryHelper } from './helpers/category.helper';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [MatchingService, ScoringService, CategoryHelper],
  exports: [MatchingService],
})
export class MatchingModule {}