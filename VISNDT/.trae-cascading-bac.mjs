import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'apps/api/src');

function apply(fileRel, replacements) {
  const full = path.join(root, fileRel);
  let src = fs.readFileSync(full, 'utf8');
  let changedCount = 0;
  for (const { oldText, newText } of replacements) {
    if (src.includes(newText)) { console.log('SKIP (already): ' + fileRel); continue; }
    if (!src.includes(oldText)) { throw new Error('NOT FOUND in ' + fileRel + ':\n' + oldText.slice(0, 200)); }
    src = src.split(oldText).join(newText);
    changedCount++;
  }
  if (changedCount > 0) { fs.writeFileSync(full, src, 'utf8'); console.log('UPDATED ' + fileRel + ' (' + changedCount + ' changes)'); }
  else { console.log('NO-OP ' + fileRel); }
}

apply('common/dto/search-params.dto.ts', [{
  oldText: "  @ApiPropertyOptional({ description: 'Filter by status', example: 'ACTIVE' })\n  @IsOptional()\n  @IsString()\n  status?: string;",
  newText: "  @ApiPropertyOptional({ description: 'Filter by status', example: 'ACTIVE' })\n  @IsOptional()\n  @IsString()\n  status?: string;\n\n  @ApiPropertyOptional({ description: 'Filter by product category ID', example: 'uuid' })\n  @IsOptional()\n  @IsString()\n  categoryId?: string;\n\n  @ApiPropertyOptional({ description: 'Filter by parameter group ID', example: 'uuid' })\n  @IsOptional()\n  @IsString()\n  parameterGroupId?: string;\n\n  @ApiPropertyOptional({ description: 'Include items from all descendant subcategories when categoryId is set', example: 'true' })\n  @IsOptional()\n  @Type(() => Boolean)\n  includeSubcategories?: boolean;",
}]);
apply('parameter-groups/dto/create-parameter-group.dto.ts', [{
  oldText: "  @ApiPropertyOptional({ description: 'Parameter group description' })\n  @IsOptional()\n  @IsString()\n  description?: string;\n}",
  newText: "  @ApiPropertyOptional({ description: 'Parameter group description' })\n  @IsOptional()\n  @IsString()\n  description?: string;\n\n  @ApiPropertyOptional({ description: 'Associated product category ID' })\n  @IsOptional()\n  @IsString()\n  categoryId?: string;\n}",
}]);
apply('parameter-groups/dto/update-parameter-group.dto.ts', [{
  oldText: "  @ApiPropertyOptional({ description: 'Parameter group description' })\n  @IsOptional()\n  @IsString()\n  description?: string;\n}",
  newText: "  @ApiPropertyOptional({ description: 'Parameter group description' })\n  @IsOptional()\n  @IsString()\n  description?: string;\n\n  @ApiPropertyOptional({ description: 'Associated product category ID' })\n  @IsOptional()\n  @IsString()\n  categoryId?: string;\n}",
}]);

const groupOld = "    const { page = 1, pageSize = 20, keyword } = params;\n    const skip = (page - 1) * pageSize;\n\n    const where: Prisma.ParameterGroupWhereInput = {};\n    if (keyword) {\n      where.OR = [\n        { name: { contains: keyword } },\n        { code: { contains: keyword } },\n      ];\n    }\n\n    const [data, total] = await Promise.all([\n      this.prisma.parameterGroup.findMany({\n        where,\n        skip,\n        take: pageSize,\n        orderBy: { createdAt: 'desc' },\n      }),\n      this.prisma.parameterGroup.count({ where }),\n    ]);";
const groupNew = "    const { page = 1, pageSize = 20, keyword, categoryId } = params;\n    const skip = (page - 1) * pageSize;\n\n    const where: Prisma.ParameterGroupWhereInput = {};\n    if (keyword) {\n      where.OR = [\n        { name: { contains: keyword } },\n        { code: { contains: keyword } },\n      ];\n    }\n    if (categoryId) {\n      where.categoryId = categoryId;\n    }\n\n    const [data, total] = await Promise.all([\n      this.prisma.parameterGroup.findMany({\n        where,\n        skip,\n        take: pageSize,\n        orderBy: { createdAt: 'desc' },\n        include: { category: true },\n      }),\n      this.prisma.parameterGroup.count({ where }),\n    ]);";
apply('parameter-groups/parameter-groups.service.ts', [{ oldText: groupOld, newText: groupNew }, {
  oldText: "      include: { definitions: true },", newText: "      include: { definitions: true, category: true },",
}]);

const defOld = "    const { page = 1, pageSize = 20, keyword } = params;\n    const skip = (page - 1) * pageSize;\n\n    const where: Prisma.ParameterDefinitionWhereInput = {};\n    if (keyword) {\n      where.OR = [\n        { name: { contains: keyword } },\n        { code: { contains: keyword } },\n      ];\n    }\n\n    const [data, total] = await Promise.all([\n      this.prisma.parameterDefinition.findMany({\n        where,\n        skip,\n        take: pageSize,\n        orderBy: { createdAt: 'desc' },\n        include: { group: true },\n      }),\n      this.prisma.parameterDefinition.count({ where }),\n    ]);";
const defNew = "    const { page = 1, pageSize = 20, keyword, categoryId, parameterGroupId } = params;\n    const skip = (page - 1) * pageSize;\n\n    const where: Prisma.ParameterDefinitionWhereInput = {};\n    if (keyword) {\n      where.OR = [\n        { name: { contains: keyword } },\n        { code: { contains: keyword } },\n      ];\n    }\n    if (parameterGroupId) {\n      where.parameterGroupId = parameterGroupId;\n    }\n    if (categoryId) {\n      where.group = { categoryId };\n    }\n\n    const [data, total] = await Promise.all([\n      this.prisma.parameterDefinition.findMany({\n        where,\n        skip,\n        take: pageSize,\n        orderBy: { createdAt: 'desc' },\n        include: { group: { include: { category: true } }, options: { orderBy: { sortOrder: 'asc' } } },\n      }),\n      this.prisma.parameterDefinition.count({ where }),\n    ]);";
apply('parameter-definitions/parameter-definitions.service.ts', [{ oldText: defOld, newText: defNew }]);

apply('products/dto/search-product.dto.ts', [{
  oldText: "  @ApiPropertyOptional({ description: 'Filter by category ID', example: 'uuid' })\n  @IsOptional()\n  @IsString()\n  categoryId?: string;",
  newText: "  @ApiPropertyOptional({ description: 'Filter by category ID', example: 'uuid' })\n  @IsOptional()\n  @IsString()\n  categoryId?: string;\n\n  @ApiPropertyOptional({ description: 'Include products from descendant subcategories when categoryId is set', example: 'true' })\n  @IsOptional()\n  @Type(() => Boolean)\n  includeSubcategories?: boolean;",
}]);
apply('products/products.service.ts', [{
  oldText: "    // Category filter\n    if (categoryId) {\n      where.categoryId = categoryId;\n    }",
  newText: "    // Category filter (optionally include all descendant subcategories)\n    if (categoryId) {\n      if (query.includeSubcategories) {\n        where.categoryId = { in: await this.collectCategoryWithDescendants(categoryId) };\n      } else {\n        where.categoryId = categoryId;\n      }\n    }",
}, {
  oldText: "  /**\n   * M24.2.4 (603) \u2014 attach presentation-only list fields for the Capability",
  newText: "  /**\n   * Collect the given category id plus all descendant category ids (recursive tree walk).\n   * Used by findAll(includeSubcategories) so selecting a parent category shows products\n   * of the entire subcategory tree.\n   */\n  private async collectCategoryWithDescendants(categoryId: string): Promise<string[]> {\n    const included: string[] = [];\n    const stack: string[] = [categoryId];\n    while (stack.length > 0) {\n      const current = stack.pop() as string;\n      included.push(current);\n      const children = await this.prisma.productCategory.findMany({\n        where: { parentId: current },\n        select: { id: true },\n      });\n      for (const child of children) {\n        stack.push(child.id);\n      }\n    }\n    return included;\n  }\n\n  /**\n   * M24.2.4 (603) \u2014 attach presentation-only list fields for the Capability",
}]);

console.log('\nALL DONE'); 
