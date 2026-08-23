const BASE = 'http://localhost:4000/api/v1';
(async () => {
  const r = await fetch(BASE + '/search?type=supplier-product&pageSize=100');
  const text = await r.text();
  console.log('STATUS', r.status);
  console.log('RAW LENGTH', text.length);
  console.log('RAW HEAD', text.slice(0, 600));
  console.log('RAW TYPE OF data check');
  try {
    const j = JSON.parse(text);
    console.log('parsed keys', Object.keys(j));
    console.log('typeof data:', typeof j.data);
    if (typeof j.data === 'string') {
      console.log('data is string, first 400 chars:', j.data.slice(0, 400));
    } else {
      console.log('data keys:', j.data ? Object.keys(j.data) : 'NULL');
    }
  } catch (e) {
    console.log('PARSE ERR', e.message);
  }
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
