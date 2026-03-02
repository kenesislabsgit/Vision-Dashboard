import React, { useEffect, useRef, useState } from 'react';
import { Users, Eye, Activity } from 'lucide-react';
interface Vec2 { x: number; y: number; }
interface Agent {
  id: string; type: 'worker'|'inspector'; zone: string; pos: Vec2; target: Vec2;
  speed: number; color: string; state: 'working'|'moving'|'paused';
  pauseTimer: number; workTimer: number; workstation: Vec2|null;
  orbitAngle: number; orbitRadius: number; pathIndex: number;
}
const ZONES = {
  production:{x:40,y:40,w:620,h:380,label:'Production Floor',color:'#FF6B35'},
  warehouse:{x:700,y:40,w:660,h:380,label:'Warehouse & Storage',color:'#1A1A1A'},
  qc:{x:40,y:460,w:400,h:360,label:'QC Laboratory',color:'#00C853'},
  control:{x:480,y:460,w:880,h:360,label:'Control Room',color:'#6366F1'},
};
const WS:Record<string,Vec2[]> = {
  production:[{x:120,y:120},{x:240,y:120},{x:360,y:120},{x:480,y:120},{x:120,y:240},{x:240,y:240},{x:360,y:240},{x:480,y:240},{x:120,y:340},{x:240,y:340},{x:360,y:340},{x:560,y:200}],
  warehouse:[{x:780,y:100},{x:880,y:100},{x:980,y:100},{x:1080,y:100},{x:1280,y:100},{x:780,y:200},{x:880,y:200},{x:980,y:200},{x:1080,y:200},{x:1280,y:200},{x:780,y:300},{x:1280,y:300}],
  qc:[{x:120,y:540},{x:240,y:540},{x:120,y:660},{x:240,y:660},{x:360,y:540},{x:360,y:660}],
  control:[{x:560,y:540},{x:680,y:540},{x:800,y:540},{x:920,y:540},{x:560,y:660},{x:680,y:660},{x:800,y:660},{x:1240,y:600}],
};
const IP:Vec2[]=[{x:350,y:230},{x:660,y:230},{x:660,y:440},{x:350,y:440},{x:350,y:640},{x:660,y:640},{x:660,y:440},{x:1050,y:440},{x:1050,y:640},{x:660,y:640},{x:350,y:640},{x:350,y:440},{x:660,y:440},{x:660,y:230},{x:350,y:230}];
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const dist=(a:Vec2,b:Vec2)=>Math.sqrt((b.x-a.x)**2+(b.y-a.y)**2);
const rn=(min:number,max:number)=>min+Math.random()*(max-min);
const rnI=(min:number,max:number)=>Math.floor(rn(min,max+1));
const clZ=(p:Vec2,z:{x:number,y:number,w:number,h:number},pad=20):Vec2=>({x:Math.max(z.x+pad,Math.min(z.x+z.w-pad,p.x)),y:Math.max(z.y+pad,Math.min(z.y+z.h-pad,p.y))});
const rpZ=(z:{x:number,y:number,w:number,h:number},pad=30):Vec2=>({x:rn(z.x+pad,z.x+z.w-pad),y:rn(z.y+pad,z.y+z.h-pad)});
function makeAgents():Agent[] {
  const agents:Agent[]=[];let id=0;
  const cols=['#FF6B35','#00C853','#6366F1','#F59E0B','#EC4899','#06B6D4'];
  const counts:Record<string,number>={production:14,warehouse:10,qc:7,control:6};
  for(const[zn,count] of Object.entries(counts)){
    const zone=ZONES[zn as keyof typeof ZONES];const stations=WS[zn];
    for(let i=0;i<count;i++){
      const ws=stations[i%stations.length];const ang=rn(0,Math.PI*2);const rad=rn(12,28);
      const sp={x:ws.x+Math.cos(ang)*rad,y:ws.y+Math.sin(ang)*rad};
      agents.push({id:`w${id++}`,type:'worker',zone:zn,pos:clZ(sp,zone),target:clZ(sp,zone),
        speed:rn(0.4,0.9),color:cols[i%cols.length],state:Math.random()>0.4?'working':'paused',
        pauseTimer:rn(0,120),workTimer:rn(60,300),workstation:ws,orbitAngle:ang,orbitRadius:rad,pathIndex:0});
    }
  }
  for(let i=0;i<3;i++){
    const zone=ZONES.production;const pos=rpZ(zone);
    agents.push({id:`t${id++}`,type:'worker',zone:'transit',pos,target:rpZ(ZONES.warehouse),
      speed:rn(1.0,1.4),color:'#94A3B8',state:'moving',pauseTimer:0,workTimer:0,
      workstation:null,orbitAngle:0,orbitRadius:0,pathIndex:0});
  }
  agents.push({id:'inspector',type:'inspector',zone:'patrol',pos:{...IP[0]},target:{...IP[1]},
    speed:0.7,color:'#FF5252',state:'moving',pauseTimer:0,workTimer:0,
    workstation:null,orbitAngle:0,orbitRadius:0,pathIndex:1});
  return agents;
}
function tickAgents(agents:Agent[]):Agent[] {
  return agents.map(a=>{
    const ag={...a};
    if(ag.type==='inspector'){
      const d=dist(ag.pos,ag.target);
      if(d<3){ag.pathIndex=(ag.pathIndex+1)%IP.length;ag.target={...IP[ag.pathIndex]};}
      else{const t=Math.min(ag.speed/d,1);ag.pos={x:lerp(ag.pos.x,ag.target.x,t),y:lerp(ag.pos.y,ag.target.y,t)};}
      return ag;
    }
    if(ag.zone==='transit'){
      const d=dist(ag.pos,ag.target);
      if(d<4){const zk=Object.keys(ZONES) as(keyof typeof ZONES)[];ag.target=rpZ(ZONES[zk[rnI(0,zk.length-1)]]);ag.pauseTimer=rn(60,180);ag.state='paused';}
      else if(ag.state==='paused'){ag.pauseTimer-=1;if(ag.pauseTimer<=0)ag.state='moving';}
      else{const t=Math.min(ag.speed/d,1);ag.pos={x:lerp(ag.pos.x,ag.target.x,t),y:lerp(ag.pos.y,ag.target.y,t)};}
      return ag;
    }
    if(ag.state==='working'&&ag.workstation){
      ag.orbitAngle+=0.008+Math.random()*0.004;const wb=Math.sin(ag.orbitAngle*3)*4;
      const tp={x:ag.workstation.x+Math.cos(ag.orbitAngle)*(ag.orbitRadius+wb),y:ag.workstation.y+Math.sin(ag.orbitAngle)*(ag.orbitRadius+wb)};
      const zone=ZONES[ag.zone as keyof typeof ZONES];const cl=clZ(tp,zone);
      ag.pos={x:lerp(ag.pos.x,cl.x,0.15),y:lerp(ag.pos.y,cl.y,0.15)};
      ag.workTimer-=1;if(ag.workTimer<=0){ag.state='paused';ag.pauseTimer=rn(40,120);}
    }else if(ag.state==='paused'){
      ag.pauseTimer-=1;if(ag.pauseTimer<=0){
        if(Math.random()>0.6){const st=WS[ag.zone];const nw=st[rnI(0,st.length-1)];ag.workstation=nw;ag.orbitRadius=rn(12,28);ag.state='moving';ag.target=clZ({x:nw.x+rn(-20,20),y:nw.y+rn(-20,20)},ZONES[ag.zone as keyof typeof ZONES]);}
        else{ag.state='working';ag.workTimer=rn(80,280);}
      }
    }else if(ag.state==='moving'){
      const d=dist(ag.pos,ag.target);
      if(d<3){ag.state='working';ag.workTimer=rn(80,280);ag.orbitAngle=rn(0,Math.PI*2);}
      else{const t=Math.min(ag.speed/d,1);ag.pos={x:lerp(ag.pos.x,ag.target.x,t),y:lerp(ag.pos.y,ag.target.y,t)};}
    }
    return ag;
  });
}
const FacilityMap:React.FC<{agents:Agent[]}>=({agents})=>{
  return(
    <svg viewBox="0 0 1400 860" className="w-full h-full" style={{background:'#F5F5F7'}}>
      {Array.from({length:28}).map((_,i)=><line key={`gv${i}`} x1={i*50} y1={0} x2={i*50} y2={860} stroke="#E5E7EB" strokeWidth={0.5}/>)}
      {Array.from({length:18}).map((_,i)=><line key={`gh${i}`} x1={0} y1={i*50} x2={1400} y2={i*50} stroke="#E5E7EB" strokeWidth={0.5}/>)}
      <rect x={40} y={40} width={620} height={380} rx={8} fill="#FFF7F4" stroke="#FF6B35" strokeWidth={2}/>
      <text x={60} y={68} fontSize={13} fontWeight="700" fill="#FF6B35" fontFamily="sans-serif">PRODUCTION FLOOR</text>
      {[120,240,360,480].map(cx=><g key={`c1${cx}`}><rect x={cx-28} y={90} width={56} height={44} rx={4} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1}/><rect x={cx-20} y={96} width={40} height={28} rx={2} fill="#D1D5DB"/><circle cx={cx+14} cy={100} r={4} fill="#FF6B35"/><text x={cx} y={148} fontSize={7} fill="#6B7280" textAnchor="middle" fontFamily="sans-serif">CNC</text></g>)}
      {[120,240,360,480].map(cx=><g key={`c2${cx}`}><rect x={cx-28} y={210} width={56} height={44} rx={4} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1}/><rect x={cx-20} y={216} width={40} height={28} rx={2} fill="#D1D5DB"/><circle cx={cx+14} cy={220} r={4} fill="#00C853"/><text x={cx} y={268} fontSize={7} fill="#6B7280" textAnchor="middle" fontFamily="sans-serif">CNC</text></g>)}
      {[120,240,360].map(cx=><g key={`b${cx}`}><rect x={cx-30} y={318} width={60} height={30} rx={3} fill="#FDE68A" stroke="#F59E0B" strokeWidth={1}/><text x={cx} y={337} fontSize={7} fill="#92400E" textAnchor="middle" fontFamily="sans-serif">BENCH</text></g>)}
      <ellipse cx={560} cy={200} rx={30} ry={20} fill="#C7D2FE" stroke="#6366F1" strokeWidth={1.5}/>
      <text x={560} y={204} fontSize={7} fill="#4338CA" textAnchor="middle" fontFamily="sans-serif">LATHE</text>
      <rect x={60} y={390} width={580} height={16} rx={4} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={1}/>
      <text x={350} y={401} fontSize={7} fill="#6B7280" textAnchor="middle" fontFamily="sans-serif">CONVEYOR</text>
      <rect x={700} y={40} width={660} height={380} rx={8} fill="#F8FAFC" stroke="#1A1A1A" strokeWidth={2}/>
      <text x={720} y={68} fontSize={13} fontWeight="700" fill="#1A1A1A" fontFamily="sans-serif">WAREHOUSE</text>
      {[780,880,980,1080].map(rx=><g key={`r${rx}`}><rect x={rx-30} y={80} width={60} height={240} rx={2} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1}/>{[100,140,180,220,260,300].map(ry=><line key={`s${rx}${ry}`} x1={rx-28} y1={ry} x2={rx+28} y2={ry} stroke="#9CA3AF" strokeWidth={0.8}/>)}<text x={rx} y={340} fontSize={7} fill="#6B7280" textAnchor="middle" fontFamily="sans-serif">RACK</text></g>)}
      <rect x={1250} y={80} width={80} height={300} rx={2} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1}/>
      <text x={1290} y={398} fontSize={7} fill="#6B7280" textAnchor="middle" fontFamily="sans-serif">BULK</text>
      <rect x={720} y={360} width={620} height={40} rx={4} fill="#D1FAE5" stroke="#00C853" strokeWidth={1}/>
      <text x={1030} y={385} fontSize={8} fill="#065F46" textAnchor="middle" fontFamily="sans-serif">LOADING DOCK</text>
      <rect x={40} y={460} width={400} height={360} rx={8} fill="#F0FDF4" stroke="#00C853" strokeWidth={2}/>
      <text x={60} y={488} fontSize={13} fontWeight="700" fill="#00C853" fontFamily="sans-serif">QC LABORATORY</text>
      {[120,240].map(cx=><g key={`lb${cx}`}><rect x={cx-35} y={510} width={70} height={50} rx={4} fill="#DCFCE7" stroke="#00C853" strokeWidth={1}/><circle cx={cx-15} cy={530} r={8} fill="none" stroke="#00C853" strokeWidth={1.5}/><circle cx={cx+10} cy={530} r={6} fill="none" stroke="#00C853" strokeWidth={1.5}/><text x={cx} y={575} fontSize={7} fill="#065F46" textAnchor="middle" fontFamily="sans-serif">BENCH</text></g>)}
      {[120,240].map(cx=><g key={`mc${cx}`}><rect x={cx-35} y={630} width={70} height={50} rx={4} fill="#DCFCE7" stroke="#00C853" strokeWidth={1}/><circle cx={cx} cy={638} r={6} fill="#00C853"/><text x={cx} y={695} fontSize={7} fill="#065F46" textAnchor="middle" fontFamily="sans-serif">MICRO</text></g>)}
      <rect x={325} y={510} width={90} height={80} rx={4} fill="#DCFCE7" stroke="#00C853" strokeWidth={1}/>
      <text x={370} y={608} fontSize={7} fill="#065F46" textAnchor="middle" fontFamily="sans-serif">SPECTROMETER</text>
      <rect x={480} y={460} width={880} height={360} rx={8} fill="#EEF2FF" stroke="#6366F1" strokeWidth={2}/>
      <text x={500} y={488} fontSize={13} fontWeight="700" fill="#6366F1" fontFamily="sans-serif">CONTROL ROOM</text>
      {[560,680,800,920].map(cx=><g key={`mn${cx}`}><rect x={cx-32} y={510} width={64} height={44} rx={3} fill="#1A1A1A"/><rect x={cx-26} y={516} width={52} height={30} rx={1} fill="#1E3A5F"/><line x1={cx-20} y1={524} x2={cx+20} y2={524} stroke="#6366F1" strokeWidth={1} opacity={0.6}/><line x1={cx-20} y1={530} x2={cx+10} y2={530} stroke="#00C853" strokeWidth={1} opacity={0.6}/><text x={cx} y={572} fontSize={7} fill="#6366F1" textAnchor="middle" fontFamily="sans-serif">MON</text></g>)}
      {[560,680,800].map(cx=><g key={`dk${cx}`}><rect x={cx-35} y={630} width={70} height={35} rx={3} fill="#C7D2FE" stroke="#6366F1" strokeWidth={1}/><text x={cx} y={652} fontSize={7} fill="#4338CA" textAnchor="middle" fontFamily="sans-serif">DESK</text></g>)}
      <rect x={1180} y={490} width={50} height={160} rx={3} fill="#1A1A1A"/>
      <text x={1205} y={665} fontSize={7} fill="#6B7280" textAnchor="middle" fontFamily="sans-serif">SERVERS</text>
      <rect x={1250} y={490} width={80} height={80} rx={3} fill="#374151" stroke="#6366F1" strokeWidth={1}/>
      <text x={1290} y={535} fontSize={8} fill="#C7D2FE" textAnchor="middle" fontFamily="sans-serif">UPS</text>
      <rect x={660} y={40} width={40} height={820} rx={0} fill="#E5E7EB" opacity={0.5}/>
      <rect x={40} y={420} width={1320} height={40} rx={0} fill="#E5E7EB" opacity={0.5}/>
      {agents.map(a=>{
        const ins=a.type==='inspector';const r=ins?9:7;
        return(<g key={a.id}>
          {ins&&<circle cx={a.pos.x} cy={a.pos.y} r={16} fill="#FF5252" opacity={0.15}><animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/></circle>}
          {a.state==='working'&&!ins&&<circle cx={a.pos.x} cy={a.pos.y} r={r+4} fill={a.color} opacity={0.12}/>}
          <circle cx={a.pos.x} cy={a.pos.y} r={r} fill={a.color} stroke="white" strokeWidth={1.5} opacity={0.92}/>
          {ins&&<text x={a.pos.x} y={a.pos.y+3} fontSize={6} fill="white" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">INS</text>}
        </g>);
      })}
    </svg>
  );
};
export const FloorMap:React.FC=()=>{
  const[agents,setAgents]=useState<Agent[]>(()=>makeAgents());
  const[tab,setTab]=useState<'workers'|'inspector'>('workers');
  const rafRef=useRef<number>(0);const lastRef=useRef<number>(0);
  useEffect(()=>{
    const loop=(ts:number)=>{if(ts-lastRef.current>50){lastRef.current=ts;setAgents(p=>tickAgents(p));}rafRef.current=requestAnimationFrame(loop);};
    rafRef.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(rafRef.current);
  },[]);
  const zoneCounts=Object.keys(ZONES).map(z=>({zone:z,label:ZONES[z as keyof typeof ZONES].label,count:agents.filter(a=>a.type==='worker'&&a.zone===z).length,color:ZONES[z as keyof typeof ZONES].color}));
  return(
    <div className="flex flex-col h-full gap-4" style={{minHeight:'calc(100vh - 120px)'}}>
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex gap-2">
          <button onClick={()=>setTab('workers')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${tab==='workers'?'bg-charcoal text-white shadow':'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}><Users className="w-4 h-4"/>Workers</button>
          <button onClick={()=>setTab('inspector')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${tab==='inspector'?'bg-charcoal text-white shadow':'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}><Eye className="w-4 h-4"/>Inspector</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {zoneCounts.map(z=><div key={z.zone} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-gray-700 shadow-sm"><span className="w-2 h-2 rounded-full" style={{background:z.color}}/>{z.label.split(' ')[0]}: {z.count}</div>)}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-gray-200 text-xs font-medium text-gray-700 shadow-sm"><Activity className="w-3 h-3 text-status-error"/>Inspector: 1</div>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden" style={{minHeight:0}}>
        <FacilityMap agents={tab==='workers'?agents.filter(a=>a.type==='worker'):agents}/>
      </div>
      <div className="flex items-center gap-6 flex-shrink-0 px-1">
        <span className="text-xs text-gray-400 font-medium">Legend:</span>
        {[{c:'#FF6B35',l:'Production'},{c:'#1A1A1A',l:'Warehouse'},{c:'#00C853',l:'QC Lab'},{c:'#6366F1',l:'Control'},{c:'#94A3B8',l:'Transit'},{c:'#FF5252',l:'Inspector'}].map(i=><div key={i.l} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:i.c}}/><span className="text-xs text-gray-500">{i.l}</span></div>)}
        <div className="ml-auto flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-status-success animate-pulse"/><span className="text-xs text-gray-400">Live tracking</span></div>
      </div>
    </div>
  );
};