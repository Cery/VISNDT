import { Module } from '@nestjs/common';
import { CsrfModule } from './csrf/csrf.module';

@Module({
  imports: [CsrfModule],
  exports: [CsrfModule],
})
export class SecurityModule {}