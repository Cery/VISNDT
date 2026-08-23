// 663 D5 runtime verify — Admin media center entityType filter (SUPPLIER_PRODUCT)
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const api = 'http://localhost:4000/api/v1';
const cookie = 'f:\\Desktop\\VISNDT\\VISNDT\\database\\_admin_cookies.txt';
const log = [];
const enc = encodeURIComponent;

function get(path) {
  const raw = execSync(`curl.exe -s -b "${cookie}" "${api}${path}"`, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  try {
    return JSON.parse(raw);
  } catch {
    return { _raw: raw.slice(0, 300) };
  }
}

log.push('=== 663 D5 Media Center Runtime Verification ===');
log.push('');

// 1. All files
let r = get(`/files?page=1&pageSize=50`);
if (r._raw) {
  log.push('ERROR (maybe auth expired): ' + r._raw);
} else {
  log.push('1) GET /files → total=' + (r.data?.total ?? r.total ?? 'N/A'));
  const items = r.data?.items ?? r.items ?? [];
  const byEntity = {};
  for (const it of items) {
    const k = it.entityType || '?';
    byEntity[k] = (byEntity[k] || 0) + 1;
  }
  log.push('   entityType distribution: ' + JSON.stringify(byEntity));
  log.push('');

  // 2. entityType=SUPPLIER_PRODUCT filter
  r = get(`/files?entityType=${enc('SUPPLIER_PRODUCT')}&page=1&pageSize=50`);
  const spItems = r.data?.items ?? r.items ?? [];
  log.push('2) GET /files?entityType=SUPPLIER_PRODUCT → total=' + (r.data?.total ?? r.total ?? 0));
  for (const it of spItems) {
    log.push(`     ${it.fileName} | type=${it.fileType} | status=${it.status} | org=${it.organizationName || '-'}`);
  }
  log.push('');

  // 3. entityType=PRODUCT filter
  r = get(`/files?entityType=${enc('PRODUCT')}&page=1&pageSize=50`);
  log.push('3) GET /files?entityType=PRODUCT → total=' + (r.data?.total ?? r.total ?? 0));
  const pItems = r.data?.items ?? r.items ?? [];
  for (const it of pItems) {
    log.push(`     ${it.fileName} | type=${it.fileType} | org=${it.organizationName || '-'}`);
  }
  log.push('');

  // 4. entityType=CONTENT filter
  r = get(`/files?entityType=${enc('CONTENT')}&page=1&pageSize=50`);
  log.push('4) GET /files?entityType=CONTENT → total=' + (r.data?.total ?? r.total ?? 0));
}

writeFileSync('f:\\Desktop\\VISNDT\\VISNDT\\database\\_663_media_verify.txt', log.join('\r\n'), 'utf8');
console.log(log.join('\n'));
