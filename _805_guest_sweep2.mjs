const API = 'http://localhost:4000/api/v1';
const SENS = ['password', 'passwordhash', 'refreshtoken', 'accesstoken', 'secret', 'privatekey', 'apikey', 'session'];
function scan(o,p,f){if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach((x,i)=>scan(x,p+'['+i+']',f));return;}for(const k of Object.keys(o)){const v=o[k],lk=k.toLowerCase();if(SENS.some(s=>lk.includes(s)))f.push(p+'.'+k);if(v&&typeof v==='object')scan(v,p?p+'.'+k:k,f);}}
const leak=(o)=>{const f=[];scan(o,'',f);return f;};
const get=async p=>{const r=await fetch(API+p);return{status:r.status,body:await r.json().catch(()=>({}))};};
async function walk(list, detail) {
  const res = await get(list+'?page=1&pageSize=5');
  const rows = res.body?.data?.data ?? [];
  const items = Array.isArray(rows) ? rows : [rows];
  let f = leak(res.body);
  let out = list+' -> status='+res.status+' sensitive='+f.length+(f.length?(' ['+f.slice(0,3)+']'):'');
  if (detail && items.length) {
    const k = (detail==='slug') ? 'slug' : 'id';
    const seg = items[0]?.[k];
    if (seg) { const d = await get(list+'/'+seg); const f2 = leak(d.body); out += ' | detail='+list+'/'+seg+' status='+d.status+' sensitive='+f2.length+(f2.length?(' ['+f2.slice(0,3)+']'):''); }
  }
  return out;
}
(async()=>{
  const lines = [];
  lines.push(await walk('/demands','id'));
  lines.push(await walk('/rfqs','id'));
  lines.push(await walk('/workflow-events','id'));
  lines.push(await walk('/products','id'));
  lines.push(await walk('/content/public','slug'));
  lines.push(await walk('/knowledge/public/entries','slug'));
  lines.push(await walk('/search?q=检测'));
  lines.push(await walk('/product-categories','id'));
  lines.push(await walk('/parameter-definitions','id'));
  lines.push(await walk('/parameter-groups','id'));
  for (const l of lines) console.log('RESULT ' + l);
})().catch(e=>{console.error('ERR '+e.message);process.exit(1);});