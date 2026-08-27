import { Controller, Post, Get, Body, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CsrfService } from '../common/security/csrf/csrf.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiResponse as ApiResponseClass } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthRequest } from './interfaces/auth-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly csrfService: CsrfService,
  ) {}

  /**
   * Set cookie options — shared between login, register, and refresh.
   */
  private getCookieOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: parseInt(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '604800',
        10,
      ) * 1000,
    };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const cookieOpts = this.getCookieOptions();
    res.cookie('access_token', accessToken, {
      ...cookieOpts,
      maxAge: parseInt(
        this.configService.get<string>('JWT_EXPIRES_IN') ?? '86400',
        10,
      ) * 1000,
    });
    res.cookie('refresh_token', refreshToken, cookieOpts);
  }

  private clearAuthCookies(res: Response) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    };

    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
  }

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerResponse({ status: 201, description: 'Registration successful', type: AuthResponseDto })
  @SwaggerResponse({ status: 409, description: 'Email already registered' })
  @SwaggerResponse({ status: 429, description: 'Too many requests' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return ApiResponseClass.ok(
      { accessToken: result.accessToken, user: result.user },
      'Registration successful',
    );
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @SwaggerResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @SwaggerResponse({ status: 401, description: 'Invalid email or password' })
  @SwaggerResponse({ status: 429, description: 'Too many requests' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return ApiResponseClass.ok(
      { accessToken: result.accessToken, user: result.user },
      'Login successful',
    );
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @SwaggerResponse({ status: 200, description: 'Token refreshed successfully' })
  @SwaggerResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @SwaggerResponse({ status: 429, description: 'Too many requests' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const result = await this.authService.refreshTokens(refreshToken);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return ApiResponseClass.ok(
      { accessToken: result.accessToken, user: result.user },
      'Token refreshed successfully',
    );
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @SwaggerResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    await this.authService.logout(refreshToken);
    this.clearAuthCookies(res);
    return ApiResponseClass.ok(null, 'Logged out successfully');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @SwaggerResponse({ status: 200, description: 'Current user info' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponseClass.ok(user);
  }

  @Get('csrf')
  @ApiOperation({ summary: 'Get CSRF token for double submit cookie pattern' })
  @SwaggerResponse({ status: 200, description: 'CSRF token generated' })
  getCsrfToken(@Res({ passthrough: true }) res: Response) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const csrfToken = this.csrfService.generateToken();

    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, // Frontend must read to set X-CSRF-Token header
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    });

    return ApiResponseClass.ok({ csrfToken });
  }
}