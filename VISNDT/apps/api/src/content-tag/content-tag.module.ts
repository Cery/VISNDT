import { Module } from '@nestjs/common';
import { ContentTagController } from './content-tag.controller';
import { ContentTagService } from './content-tag.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContentTagController],
  providers: [ContentTagService],
  exports: [ContentTagService],
})
export class ContentTagModule {}