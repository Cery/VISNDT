import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

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
  ],
  controllers: [AuthController, InvitationController],
  providers: [AuthService, InvitationService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, InvitationService, JwtModule, PassportModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}