// Facet filter verification post-scale (brand / series / hasOffer)
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const api = 'http://localhost:4000/api/v1';
const cookie = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_buyer_cookies.txt';
const log = [];
const enc = encodeURIComponent;

function search(qs) {
  const raw = execSync(`curl.exe -s -b "${cookie}" "${api}/search?${qs}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  return JSON.parse(raw);
}

log.push('=== Post-scale Facet Filter Verification ===');
log.push('');
// 1. brand=明视
let r = search(`q=&brand=${enc('明视')}&page=1&pageSize=50`);
log.push('1) brand=明视 → total=' + (r.supplierProducts?.total ?? 'N/A'));
if (r.supplierProducts?.items) {
  for (const e of r.supplierProducts.items) log.push(`     ${e.supplierProduct.brand} | ${e.supplierProduct.modelNumber}`);
}
log.push('');
// 2. series=高清智能系列
r = search(`q=&series=${enc('高清智能系列')}&page=1&pageSize=50`);
log.push('2) series=高清智能系列 → total=' + (r.supplierProducts?.total ?? 'N/A'));
if (r.supplierProducts?.items) {
  for (const e of r.supplierProducts.items) log.push(`     ${e.supplierProduct.brand} | ${e.supplierProduct.series} | ${e.supplierProduct.modelNumber}`);
}
log.push('');
// 3. hasOffer=false (should be 0 — all 6 published have active offers)
r = search(`q=&hasOffer=false&page=1&pageSize=50`);
log.push('3) hasOffer=false → total=' + (r.supplierProducts?.total ?? 'N/A'));
log.push('');
// 4. hasOffer=true
r = search(`q=&hasOffer=true&page=1&pageSize=50`);
log.push('4) hasOffer=true → total=' + (r.supplierProducts?.total ?? 'N/A'));
log.push('');
// 5. combined brand=锐视 + hasOffer=true
r = search(`q=&brand=${enc('锐视')}&hasOffer=true&page=1&pageSize=50`);
log.push('5) brand=锐视&hasOffer=true → total=' + (r.supplierProducts?.total ?? 'N/A'));
if (r.supplierProducts?.items) {
  for (const e of r.supplierProducts.items) log.push(`     ${e.supplierProduct.brand} | ${e.supplierProduct.modelNumber} | ${e.supplierProduct.status}`);
}
log.push('');
// 6. keyword=VX-6000
r = search(`q=${enc('VX-6000')}&page=1&pageSize=50`);
log.push('6) q=VX-6000 → supplierProducts total=' + (r.supplierProducts?.total ?? 'N/A'));
if (r.supplierProducts?.items) {
  for (const e of r.supplierProducts.items) log.push(`     ${e.supplierProduct.brand} | ${e.supplierProduct.series} | ${e.supplierProduct.modelNumber}`);
}
writeFileSync('f:\\Desktop\\VISNDT\\VISNDT\\database\\_6621_facets_verify.txt', log.join('\r\n'), 'utf8');
console.log(log.join('\n'));
