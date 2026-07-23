import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { ScoringService } from './scoring/scoring.service';
import { CategoryHelper } from './helpers/category.helper';

@Module({
  providers: [MatchingService, ScoringService, CategoryHelper],
  exports: [MatchingService],
})
export class MatchingModule {}