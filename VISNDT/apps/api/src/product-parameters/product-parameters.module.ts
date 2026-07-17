import { Module } from '@nestjs/common';
import { ProductParametersController } from './product-parameters.controller';
import { ProductParametersService } from './product-parameters.service';

@Module({
  controllers: [ProductParametersController],
  providers: [ProductParametersService],
})
export class ProductParametersModule {}