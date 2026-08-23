// Dump unified search response — supplierProducts is at top level
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const api = 'http://localhost:4000/api/v1';
const cookie = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_buyer_cookies.txt';
const raw = execSync(`curl.exe -s -b "${cookie}" "${api}/search?q=&page=1&pageSize=50"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
const j = JSON.parse(raw);
const log = [];
log.push('=== Post-scale Regression: supplierProducts in Unified Search ===');
if (j.supplierProducts) {
  log.push('total supplierProducts: ' + j.supplierProducts.total);
  const items = j.supplierProducts.items || [];
  log.push('items count: ' + items.length);
  const statuses = {};
  for (const e of items) {
    const p = e.supplierProduct;
    statuses[p.status] = (statuses[p.status] || 0) + 1;
    log.push(`  - ${p.brand} | ${p.series || '-'} | ${p.modelNumber} | ${p.status} | org=${e.supplierProduct.organization ? e.supplierProduct.organization.name : '?'} | offers=${e.commercialSummary.offerCount}`);
  }
  log.push('status distribution: ' + JSON.stringify(statuses));
  const suspicious = items.filter((e) => /SCALE|BASE|LITE|MAX|ADV|IP\b|C$/i.test(e.supplierProduct.modelNumber));
  log.push('SCALE DRAFT pollution check: ' + suspicious.length + ' suspicious entries (expect 0 — only PUBLISHED indexed)');
  log.push('');
  log.push('facets: brands=' + (j.supplierProductFacets?.brands?.length ?? 0) + ', series=' + (j.supplierProductFacets?.series?.length ?? 0));
  if (j.supplierProductFacets?.commercial) {
    log.push('commercial facet: ' + JSON.stringify(j.supplierProductFacets.commercial));
  }
} else {
  log.push('NO supplierProducts key');
}
writeFileSync('f:\\Desktop\\VISNDT\\VISNDT\\database\\_6621_search_verify.txt', log.join('\r\n'), 'utf8');
console.log(log.join('\n'));
