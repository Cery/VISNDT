const API = 'http://localhost:4000/api/v1';
const PW = 'demo123456';
async function login(email,pw){
  try{
    const r = await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pw})});
    const j = await r.json().catch(()=>({}));
    return {status:r.status, token: r.ok && j?.data?.accessToken ? j.data.accessToken : null, keys: Object.keys(j?.data||{})};
  }catch(e){ return {status:'ERR', token:null, keys:[e.message]}; }
}
(async()=>{
  for (const e of ['admin@visndt.com','demo.admin@visndt.local','admin.vs.763@visndt.local','admin.zx.763@visndt.local','demo.buyer.01@visndt.local']){
    const r = await login(e,PW);
    console.log('LOGIN', e, '=> status='+r.status, 'token='+(r.token?'OK':'NO'), 'dataKeys='+r.keys.join(','));
  }
  process.exit(0);
})().catch(e=>{console.error('ERR '+e.message);process.exit(1);});