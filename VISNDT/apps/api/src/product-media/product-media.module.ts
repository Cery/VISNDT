import { Module } from '@nestjs/common';
import { ProductMediaController } from './product-media.controller';
import { ProductMediaService } from './product-media.service';
import { AuthModule } from '../auth/auth.module';
import { FileAssetModule } from '../file-asset/file-asset.module';

@Module({
  imports: [AuthModule, FileAssetModule],
  controllers: [ProductMediaController],
  providers: [ProductMediaService],
})
export class ProductMediaModule {}