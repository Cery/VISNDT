// Dump unified search response keys + supplierProducts (post-scale regression)
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const api = 'http://localhost:4000/api/v1';
const cookie = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_buyer_cookies.txt';
const raw = execSync(`curl.exe -s -b "${cookie}" "${api}/search?q=&page=1&pageSize=50"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
const j = JSON.parse(raw);
const log = [];
log.push('top keys: ' + Object.keys(j).join(', '));
log.push('data keys: ' + (j.data ? Object.keys(j.data).join(', ') : 'no data'));
if (j.data && j.data.supplierProducts) {
  log.push('supplierProducts total: ' + j.data.supplierProducts.total);
  const items = j.data.supplierProducts.items || [];
  log.push('items count: ' + items.length);
  const statuses = {};
  for (const e of items) {
    const p = e.supplierProduct;
    statuses[p.status] = (statuses[p.status] || 0) + 1;
    log.push(`  - ${p.brand} | ${p.series || '-'} | ${p.modelNumber} | ${p.status} | offers=${e.commercialSummary.offerCount}`);
  }
  log.push('status distribution: ' + JSON.stringify(statuses));
} else {
  log.push('NO supplierProducts key in data');
}
writeFileSync('f:\\Desktop\\VISNDT\\VISNDT\\database\\_6621_search_keys.txt', log.join('\r\n'), 'utf8');
console.log(log.join('\n'));
