import fs from 'fs';
function apply(file, replacements) {
  let src = fs.readFileSync(file, 'utf8'); let c=0;
  for (const {oldText,newText} of replacements) {
    if (src.includes(newText)) { console.log('SKIP '+file); continue; }
    if(!src.includes(oldText)) throw new Error('NOT FOUND '+file+':\n'+oldText.slice(0,150));
    src = src.split(oldText).join(newText); c++;
  }
  if(c>0){ fs.writeFileSync(file,src,'utf8'); console.log('UPDATED '+file+' ('+c+')'); }
}

const ad='f:/Desktop/VISNDT/VISNDT/apps/admin/src/';

// parameter.types.ts
apply(ad+'types/parameter.types.ts', [
 {oldText:"export interface ParameterGroup {\n  id: string;\n  name: string;\n  code: string;\n  description?: string;\n  createdAt: string;\n  updatedAt: string;\n}",
  newText:"export interface ParameterGroup {\n  id: string;\n  name: string;\n  code: string;\n  description?: string;\n  categoryId?: string;\n  category?: {\n    id: string;\n    name: string;\n    slug: string;\n  } | null;\n  createdAt: string;\n  updatedAt: string;\n}"},
 {oldText:"export interface CreateParameterGroupDto {\n  name: string;\n  code: string;\n  description?: string;\n}",
  newText:"export interface CreateParameterGroupDto {\n  name: string;\n  code: string;\n  description?: string;\n  categoryId?: string;\n}"},
 {oldText:"export interface UpdateParameterGroupDto {\n  name?: string;\n  code?: string;\n  description?: string;\n}",
  newText:"export interface UpdateParameterGroupDto {\n  name?: string;\n  code?: string;\n  description?: string;\n  categoryId?: string;\n}"},
]);

// parameter-definition.types.ts
apply(ad+'types/parameter-definition.types.ts', [
 {oldText:"  group?: {\n    id: string;\n    name: string;\n    code: string;\n  };",
  newText:"  group?: {\n    id: string;\n    name: string;\n    code: string;\n    category?: {\n      id: string;\n      name: string;\n    } | null;\n  };"},
]);

// parameter-group.service.ts
apply(ad+'api/parameter-group.service.ts', [
 {oldText:"  async getList(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<ParameterGroupListResponse> {",
  newText:"  async getList(params?: { page?: number; pageSize?: number; keyword?: string; categoryId?: string }): Promise<ParameterGroupListResponse> {"},
]);

// parameter-definition.service.ts
apply(ad+'api/parameter-definition.service.ts', [
 {oldText:"  async getList(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<ParameterDefinitionListResponse> {",
  newText:"  async getList(params?: { page?: number; pageSize?: number; keyword?: string; categoryId?: string; parameterGroupId?: string }): Promise<ParameterDefinitionListResponse> {"},
]);

// product.types.ts SearchProductParams
apply(ad+'types/product.types.ts', [
 {oldText:"export interface SearchProductParams {\n  keyword?: string;\n  categoryId?: string;\n  status?: string;",
  newText:"export interface SearchProductParams {\n  keyword?: string;\n  categoryId?: string;\n  includeSubcategories?: boolean;\n  status?: string;"},
]);

// categories.service.ts inline ProductCategory add parentId/children
apply(ad+'api/categories.service.ts', [
 {oldText:"interface ProductCategory {\n  id: string;\n  name: string;\n  slug: string;\n  description?: string;\n  createdAt: string;\n  updatedAt: string;\n}",
  newText:"interface ProductCategory {\n  id: string;\n  name: string;\n  slug: string;\n  description?: string;\n  parentId?: string;\n  children?: ProductCategory[];\n  createdAt: string;\n  updatedAt: string;\n}"},
]);

console.log('ALL DONE');
