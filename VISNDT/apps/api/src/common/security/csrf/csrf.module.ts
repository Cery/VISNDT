import { Module } from '@nestjs/common';
import { CsrfService } from './csrf.service';
import { CsrfMiddleware } from './csrf.middleware';

@Module({
  providers: [CsrfService, CsrfMiddleware],
  exports: [CsrfService, CsrfMiddleware],
})
export class CsrfModule {}