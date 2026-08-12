import { Module } from '@nestjs/common';
import { ContentMediaController } from './content-media.controller';
import { ContentMediaService } from './content-media.service';
import { AuthModule } from '../auth/auth.module';
import { FileAssetModule } from '../file-asset/file-asset.module';

@Module({
  imports: [AuthModule, FileAssetModule],
  controllers: [ContentMediaController],
  providers: [ContentMediaService],
  exports: [ContentMediaService],
})
export class ContentMediaModule {}