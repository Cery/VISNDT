import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (ADMIN only)' })
  async findAll(@Query() pagination: PaginationDto) {
    const result = await this.usersService.findAll(pagination);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (self or ADMIN)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.usersService.findOne(id, user);
    return ApiResponse.ok(result);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (ADMIN only)' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return ApiResponse.ok(user, 'User created');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (self or ADMIN)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthRequest['user'],
  ) {
    const result = await this.usersService.update(id, dto, user);
    return ApiResponse.ok(result, 'User updated');
  }
}