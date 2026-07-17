import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthRequest } from './interfaces/auth-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @SwaggerResponse({ status: 201, description: 'Registration successful', type: AuthResponseDto })
  @SwaggerResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return ApiResponse.ok(result, 'Registration successful');
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @SwaggerResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @SwaggerResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return ApiResponse.ok(result, 'Login successful');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @SwaggerResponse({ status: 200, description: 'Current user info' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: AuthRequest['user']) {
    return ApiResponse.ok(user);
  }
}