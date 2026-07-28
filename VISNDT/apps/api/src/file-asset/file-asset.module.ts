import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FileAssetController } from './file-asset.controller';
import { FileAssetService } from './file-asset.service';

@Module({
  imports: [AuthModule],
  controllers: [FileAssetController],
  providers: [FileAssetService],
  exports: [FileAssetService],
})
export class FileAssetModule {}