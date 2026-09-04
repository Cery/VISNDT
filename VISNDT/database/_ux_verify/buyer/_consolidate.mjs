import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
const OUT='F:/Desktop/VISNDT/VISNDT/database/_ux_verify/buyer';
const jl=(f)=>readFileSync(`${OUT}/${f}`,'utf8').split('\n').filter(Boolean).map(JSON.parse);
const e1=jl('buyer_evidence.jsonl');
const e6=jl('buyer_evidence6.jsonl');
const em=jl('buyer_evidence_mobile.jsonl');
// base from e1: keep steps 1,2,6,7,8,10,11,12,13,MOBILE(e1)
const base=e1.filter(x=> ![3,4,5,9].includes(x.step) && !/real/.test(String(x.step)) && x.step!=='cleanup-verify');
// drop e1 step1 dup from base since e6 has a fresh login record
const baseNo1=base.filter(x=>x.step!==1);
const final=[...baseNo1, ...e6];
writeFileSync(`${OUT}/buyer_evidence.jsonl`, final.map(x=>JSON.stringify(x)).join('\n')+'\n');
console.log('consolidated rows:', final.length);
console.log('steps:', final.map(x=>x.step).join(','));
// cleanup scratch
for(const f of ['buyer_evidence2.jsonl','buyer_evidence3.jsonl','buyer_evidence4.jsonl','buyer_evidence5.jsonl']){
  if(existsSync(`${OUT}/${f}`)){ unlinkSync(`${OUT}/${f}`); console.log('removed',f); }
}
// remove scratch scripts
for(const f of ['_buyer_runner.mjs','_buyer_runner2.mjs','_buyer_runner3.mjs','_buyer_runner4.mjs','_diag.mjs','_diag2.mjs','_qb.js','_qb2.js','_verify_cleanup.js','_cleanup_uxb.js']){
  if(existsSync(`${OUT}/${f}`)){ unlinkSync(`${OUT}/${f}`); console.log('removed',f); }
}