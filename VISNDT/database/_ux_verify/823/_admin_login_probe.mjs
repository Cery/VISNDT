const base='http://localhost:4000/api/v1';
async function tryLogin(email, pwd){
  const r = await fetch(base+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pwd})});
  const t = await r.text();
  let token=null; let user=null; try{ const j=JSON.parse(t); token=j.data?.access_token||j.data?.accessToken||null; user=j.data?.user||null;}catch{}
  return {status:r.status, token:!!token, user:user?JSON.stringify({email:user.email,role:user.role,workspaceRole:user.workspaceRole}):null, snippet:t.slice(0,120)};
}
try{
  const r=await tryLogin('demo.admin@visndt.local','demo123456');
  console.log('demo.admin/demo123456 =>', r.status, r.token?('[TOKEN user='+r.user+']'):r.snippet);
}catch(e){console.log('ERR',e.message);}