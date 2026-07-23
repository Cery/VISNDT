import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** 匹配执行结果 */
export class MatchResultDto {
  @ApiProperty({ description: 'Number of products matched' })
  matched: number;

  @ApiProperty({ description: 'Number of products skipped (below threshold)' })
  skipped: number;

  @ApiProperty({ description: 'Total candidate products evaluated' })
  totalCandidates: number;

  @ApiProperty({ description: 'Execution time in milliseconds' })
  elapsedMs: number;
}