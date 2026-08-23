// 663 regression — Unified Search (661.6 FROZEN) unchanged
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const api = 'http://localhost:4000/api/v1';
const cookie = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_buyer_cookies.txt';
const log = [];

function get(path) {
  const raw = execSync(`curl.exe -s -b "${cookie}" "${api}${path}"`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  try {
    return JSON.parse(raw);
  } catch {
    return { _raw: raw.slice(0, 200) };
  }
}

log.push('=== 663 Regression: Unified Search (FROZEN) ===');
let r = get(`/search?type=supplier-product&q=&page=1&pageSize=50`);
if (r._raw) {
  log.push('ERROR: ' + r._raw);
} else {
  const sp = r.supplierProducts;
  log.push('supplierProducts total=' + (sp?.total ?? 'N/A'));
  if (sp?.items) {
    const st = {};
    for (const e of sp.items) {
      const p = e.supplierProduct;
      st[p.status] = (st[p.status] || 0) + 1;
    }
    log.push('status dist: ' + JSON.stringify(st) + '  (expect only PUBLISHED)');
    log.push('facets brands=' + (r.supplierProductFacets?.brands?.length ?? 0));
  }
}

writeFileSync('f:\\Desktop\\VISNDT\\VISNDT\\database\\_663_search_regression.txt', log.join('\r\n'), 'utf8');
console.log(log.join('\n'));