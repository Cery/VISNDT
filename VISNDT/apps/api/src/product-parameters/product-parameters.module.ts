import { Module } from '@nestjs/common';
import { ProductParametersController } from './product-parameters.controller';
import { ProductParametersService } from './product-parameters.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductParametersController],
  providers: [ProductParametersService],
})
export class ProductParametersModule {}