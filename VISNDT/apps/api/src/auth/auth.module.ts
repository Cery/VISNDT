import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CsrfModule } from '../common/security/csrf/csrf.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(config.get<string>('JWT_EXPIRES_IN') ?? '86400', 10),
        },
      }),
    }),
    CsrfModule,
    PrismaModule,
  ],
  controllers: [AuthController, InvitationController],
  providers: [AuthService, RefreshTokenService, InvitationService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, RefreshTokenService, InvitationService, JwtModule, PassportModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}