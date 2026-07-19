import { Module } from '@nestjs/common';
import { ProductMediaController } from './product-media.controller';
import { ProductMediaService } from './product-media.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductMediaController],
  providers: [ProductMediaService],
})
export class ProductMediaModule {}