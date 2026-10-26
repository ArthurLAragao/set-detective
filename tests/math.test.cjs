/* Verificação independente por enumeração de conjuntos e fórmulas inversas. */
const assert = require('node:assert/strict');
const core = require('../script.js');
let checks = 0;
function eq(actual, expected) { assert.deepEqual(actual, expected); checks++; }
const expected = [
  {a:15,ab:10,b:8,none:7,union:33},
  {a:34,ab:28,b:27,none:11,union:89},
  {a:40,b:30,c:25,ab:30,ac:25,bc:20,abc:25,none:5,union:195}
];
core.missions.forEach((p,i)=>{
  eq(p.solution,expected[i]);
  eq(core.assess(p,Object.fromEntries(Object.entries(expected[i]).map(([k,v])=>[k,String(v)]))).correct,true);
  for(const key of [...core.keysFor(p.count),'union']) {
    const wrong={...expected[i],[key]:expected[i][key]+1};
    eq(core.assess(p,wrong).wrong,[key]);
  }
});
eq(core.missions[2].totals,{a:120,b:105,c:95,ab:55,ac:50,bc:45,abc:25});
for (const invalid of ['', '-1', '1.2', '1e2', 'NaN', 'Infinity', '3a', '201', '1,5']) eq(core.parseAnswer(invalid,200),null);
eq(core.parseAnswer('0',200),0); eq(core.parseAnswer(' 40 ',200),40);
eq(core.missionPoints(0,0),300); eq(core.missionPoints(1,1),250); eq(core.missionPoints(100,4),100);
let seed=872143;
const rng=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
const counts=new Set(), types=new Set();
for(let i=0;i<10000;i++) {
  const p=core.makeChallenge(i,rng),r=p.solution,t=p.totals;
  counts.add(p.count);types.add(p.question.type);
  const regions=core.keysFor(p.count);
  eq(regions.reduce((n,k)=>n+r[k],0),p.universe);
  eq(regions.filter(k=>k!=='none').reduce((n,k)=>n+r[k],0),r.union);
  const union=t.a+t.b+(p.count===3?t.c-t.ac-t.bc+t.abc:0)-t.ab;
  eq(union,r.union);
  eq(p.universe-union,r.none);
  if(p.count===3){
    eq(t.a-t.ab-t.ac+t.abc,r.a);eq(t.b-t.ab-t.bc+t.abc,r.b);eq(t.c-t.ac-t.bc+t.abc,r.c);
    eq(t.ab-t.abc,r.ab);eq(t.ac-t.abc,r.ac);eq(t.bc-t.abc,r.bc);
  }else{eq(t.a-t.ab,r.a);eq(t.b-t.ab,r.b);}
  const wanted={union:r.union,none:r.none,a:r.a,one:r.a+r.b+(r.c||0),ab:r.ab}[p.question.type];
  eq(p.question.answer,wanted);
  eq(core.assess(p,{final:String(wanted)},true).correct,true);
  eq(core.assess(p,{final:String(wanted+1)},true).correct,false);
  eq(core.assess(p,{final:''},true).valid,false);
  for(const k of regions) {assert(Number.isInteger(r[k])&&r[k]>=0);checks++;}
}
eq([...counts].sort(),[2,3]);eq([...types].sort(),['a','ab','none','one','union']);
eq(core.makeChallengeSet(rng).length,5);
console.log(JSON.stringify({status:'PASS',checks,randomProblems:10000,missions:3,counts:[...counts],questionTypes:[...types]},null,2));
