import { Module } from '@nestjs/common';
import { ContentRevisionController } from './content-revision.controller';
import { ContentRevisionService } from './content-revision.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContentRevisionController],
  providers: [ContentRevisionService],
  exports: [ContentRevisionService],
})
export class ContentRevisionModule {}