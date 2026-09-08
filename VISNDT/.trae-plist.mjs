import fs from 'fs';
const file = 'f:/Desktop/VISNDT/VISNDT/apps/admin/src/pages/ProductList.tsx';
let src = fs.readFileSync(file, 'utf8');
let c=0;
function rep(oldText,newText){ if(src.includes(newText)){ console.log('SKIP already'); return;} if(!src.includes(oldText)) throw new Error('NOT FOUND:\n'+oldText.slice(0,120)); src=src.split(oldText).join(newText); c++; }

// A) antd import add TreeSelect
rep("import { Table, Space, Spin, Alert, Button, message, Modal, Checkbox, Row, Col } from 'antd';",
    "import { Table, Space, Spin, Alert, Button, message, Modal, Checkbox, Row, Col, TreeSelect } from 'antd';");

// B) helpers after STATUS_LABEL_MAP
rep(`const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '已上架',
  DRAFT: '草稿',
  INACTIVE: '已下架',
};
`,
`const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '已上架',
  DRAFT: '草稿',
  INACTIVE: '已下架',
};

/** Build Ant Design TreeSelect treeData from ProductCategory list (parentId hierarchy) */
function buildCategoryTreeData(catList: ProductCategory[]) {
  const map = new Map<string, ProductCategory>();
  for (const cat of catList) map.set(cat.id, { ...cat, children: cat.children ?? [] });
  const roots: ProductCategory[] = [];
  for (const node of map.values()) {
    const parent = node.parentId ? map.get(node.parentId) : undefined;
    if (parent) {
      (parent.children = parent.children ?? []).push(node);
    } else {
      roots.push(node);
    }
  }
  const toData = (node: ProductCategory): Record<string, unknown> => ({
    title: node.name,
    value: node.id,
    children: (node.children ?? []).length > 0 ? (node.children as ProductCategory[]).map(toData) : undefined,
  });
  return roots.map(toData);
}

/** Return full category path label (e.g. 工业检测 / 内窥镜) from a category id */
function resolveCategoryPath(catList: ProductCategory[], id: string): string {
  const map = new Map(catList.map((c) => [c.id, c]));
  const chain: string[] = [];
  let cur = map.get(id);
  while (cur) {
    chain.unshift(cur.name);
    cur = cur.parentId ? map.get(cur.parentId) : undefined;
  }
  return chain.join(' / ');
}
`);

// C) fetchProducts include subcategories
rep(`      if (query.categoryId) {
        params.categoryId = query.categoryId;
      }`,
`      if (query.categoryId) {
        params.categoryId = query.categoryId;
        params.includeSubcategories = true;
      }`);

// D) category filter field -> custom TreeSelect
rep(`          { key: 'categoryId', label: '分类', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })), width: 200 },`,
`          {
            key: 'categoryId',
            label: '分类',
            type: 'custom',
            width: 240,
            render: (value: unknown, onChange: (v: unknown) => void) => (
              <TreeSelect
                placeholder="选择分类（含其子分类）"
                allowClear
                treeDefaultExpandAll
                showSearch
                treeNodeFilterProp="title"
                style={{ width: 240 }}
                value={(value as string) || undefined}
                onChange={(v) => onChange(v)}
                treeData={buildCategoryTreeData(categories)}
              />
            ),
          },`);

// E) category column -> full path
rep(`    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: Product['category']) => category?.name || '-',
    },`,
`    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (_: unknown, record: Product) => {
        const cat = record.category;
        if (!cat) return '-';
        return resolveCategoryPath(categories, cat.id) || cat.name;
      },
    },`);

fs.writeFileSync(file, src, 'utf8');
console.log('ProductList.tsx updated ('+c+' edits)');
