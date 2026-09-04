const API = 'http://localhost:4000/api/v1';
const SENS = ['password', 'passwordhash', 'refreshtoken', 'accesstoken', 'secret', 'privatekey', 'apikey', 'session'];
function scan(o,p,f){if(!o||typeof o!=='object')return;if(Array.isArray(o)){o.forEach((x,i)=>scan(x,p+'['+i+']',f));return;}for(const k of Object.keys(o)){const v=o[k],lk=k.toLowerCase();if(SENS.some(s=>lk.includes(s)))f.push(p+'.'+k);if(v&&typeof v==='object')scan(v,p?p+'.'+k:k,f);}}
const leak=(o)=>{const f=[];scan(o,'',f);return f;};
const get=async p=>{const r=await fetch(API+p);return{status:r.status,body:await r.json().catch(()=>({}))};};
(async()=>{
  const routes = ['/products?page=1&pageSize=5','/supplier-products?page=1&pageSize=5','/knowledge/public/entries?page=1&pageSize=5','/search?q=检测&page=1&pageSize=5','/search/context'];
  for(const rt of routes){
    const r=await get(rt); const f=leak(r.body);
    console.log(rt+' -> status='+r.status+' sensitive='+f.length+(f.length?( ' paths='+f.slice(0,4).join(',')):'')+' OK='+(f.length===0));
  }
})().catch(e=>{console.error('ERR '+e.message);process.exit(1);});