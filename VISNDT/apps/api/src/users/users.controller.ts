import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  async findAll(@Query() pagination: PaginationDto) {
    const result = await this.usersService.findAll(pagination);
    return ApiResponse.ok(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return ApiResponse.ok(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return ApiResponse.ok(user, 'User created');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return ApiResponse.ok(user, 'User updated');
  }
}