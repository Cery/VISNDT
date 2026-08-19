import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { ApiResponse } from '../common/dto/api-response.dto';

@ApiTags('Knowledge - Public')
@Controller('knowledge/public')
export class KnowledgePublicController {
  constructor(private readonly service: KnowledgeService) {}

  @Get('domains')
  @ApiOperation({ summary: 'List all knowledge domains (PUBLIC)' })
  async getDomains() {
    return ApiResponse.ok(await this.service.findPublicDomains());
  }

  @Get('domains/:slug')
  @ApiOperation({ summary: 'Get knowledge domain by slug (PUBLIC)' })
  @ApiParam({ name: 'slug', description: 'Domain slug' })
  async getDomainBySlug(@Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.findPublicDomainBySlug(slug));
  }

  @Get('categories')
  @ApiOperation({ summary: 'List knowledge categories (PUBLIC), optionally filtered by domain' })
  @ApiQuery({ name: 'domainId', required: false, description: 'Filter by domain UUID' })
  async getCategories(@Query('domainId') domainId?: string) {
    return ApiResponse.ok(await this.service.findPublicCategories(domainId));
  }

  @Get('entries')
  @ApiOperation({ summary: 'List published knowledge entries (PUBLIC)' })
  @ApiQuery({ name: 'domainId', required: false, description: 'Filter by domain UUID' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category UUID' })
  @ApiQuery({ name: 'domainSlug', required: false, description: 'Filter by domain slug' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title/summary' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size (default: 12)' })
  async getEntries(
    @Query('domainId') domainId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('domainSlug') domainSlug?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return ApiResponse.ok(await this.service.findPublicEntries({
      domainId,
      categoryId,
      domainSlug,
      search,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    }));
  }

  @Get('entries/:slug/related-products')
  @ApiOperation({ summary: 'Get related active products for a published knowledge entry (PUBLIC). Resolved via KnowledgeCategory → ProductCategoryKnowledgeMapping → ProductCategory → Product' })
  @ApiParam({ name: 'slug', description: 'Entry slug' })
  async getEntryRelatedProducts(@Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.findRelatedProducts(slug));
  }

  @Get('entries/:slug')
  @ApiOperation({ summary: 'Get published knowledge entry by slug (PUBLIC)' })
  @ApiParam({ name: 'slug', description: 'Entry slug' })
  async getEntryBySlug(@Param('slug') slug: string) {
    return ApiResponse.ok(await this.service.findPublicEntryBySlug(slug));
  }
}