(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=Reports,esc=R.esc,F=R.fmt;
const VERSION='0.5.0';
let D,movs=[],custom=[],ch={},st,userEmail='';
const NUEVA='Nueva categoría',hoy=()=>new Date().toLocaleDateString('sv');
const tree=()=>R.GASTO.concat(custom.map(c=>({n:c.nombre,s:c.subs||[],d:{},id:c.id})));
const nomCats=()=>tree().map(c=>c.n).concat(R.INGRESO.map(c=>c.n));
const sel=(l,id,list,v)=>`<label>${l}<select id="${id}"><option value="">Selecciona…</option>${list.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
const K=(a,b,c='',cl='a',ic='')=>`<div class="k ${cl}">${ic?`<span class="kic ${c==='ingreso'?'pos':c==='gasto'?'neg':''}">${Icons.svg(ic)}</span>`:''}<div><small>${a}</small><b class="${c}">${b}</b></div></div>`;
const msg=(e,t)=>$(e).textContent=t;
function iniciar(){
 const c=window.MF_CONFIG||{};
 if(c.allowSignup===false&&!window.MF_PREVIEW)$('#l-up').hidden=true;
 D=window.MF_PREVIEW?Data.memoria(window.MF_SEED):(c.url&&!/^TU-/.test(c.url)?Data.supabase(c.url,c.anonKey):null);
 if(!D)return msg('#login-msg','Configura js/config.js con la URL y clave anon de Supabase (ver README).');
 $('#l-in').onclick=()=>acceso('entrar');$('#l-up').onclick=()=>acceso('registrar');
 if(window.MF_PREVIEW){$('#l-mail').value='demo@local';$('#l-pass').value='demo123';msg('#login-msg','Vista previa con datos de ejemplo (adaptador memoria).')}
 D.sesion().then(u=>u&&entrar(u)).catch(e=>msg('#login-msg',e.message));
}
async function acceso(m){try{msg('#login-msg','…');await entrar(await D[m]($('#l-mail').value.trim(),$('#l-pass').value))}catch(e){msg('#login-msg',e.message)}}
async function entrar(u){
 $('#login').hidden=true;$('#app').hidden=false;$('#who').textContent=u.email;userEmail=u.email;$('#c-mail').textContent=u.email;
 movs=await D.listar();custom=await D.listarCats();$('#n-txt').value=await D.leerNota();
 const a=R.aniosConDatos(movs),y=String(new Date().getFullYear());
 resetReg('');pintaTipos();armarCats();poblar();if(a.length){$('#f-anio').value=a.includes(y)?y:a[0]}todo();
}
function todo(){general();historial();poblar();renderRep()}
/* ---------- General ---------- */
let chg={};
const pctDona={id:'pctDona',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data,s=d[0]+d[1];x.save();x.font='700 '+o.size+'px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';
 m.data.forEach((a,i)=>{if(!d[i])return;const p=a.getCenterPoint();x.fillStyle=i?o.c1:o.c0;x.fillText(R.fmtPct(R.pct(d[i],s)),p.x,p.y)});x.restore()}};
const rotulos2={id:'rotulos2',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx;x.save();x.fillStyle=o.color;x.font='600 '+o.size+'px system-ui,sans-serif';x.textBaseline='middle';x.textAlign='left';
 c.data.datasets.forEach((s,k)=>c.getDatasetMeta(k).data.forEach((b,i)=>{const v=s.data[i];if(v==null)return;x.fillText('Bs '+R.fmtCorto(v)+' · '+R.fmtPct(R.pct(v,k?o.s1:o.s0),0),b.x+6,b.y)}));x.restore()}};
function general(){
 Object.values(chg).forEach(c=>c.destroy());chg={};
 const y=R.anioResumen(hoy(),movs),l=movs.filter(m=>m.fecha.startsWith(y)),t=R.totales(l),c=R.porCategoria(l)[0],p=R.topProducto(l);
 $('#g-tit').textContent='Resumen del año '+y;
 if(!l.length){$('#g-out').innerHTML='<div class="card muted">Aún no hay movimientos. Empieza en «Registrar».</div>';return}
 const u=R.ordenar(movs).slice(0,5),ti=R.porCategoria(l,'ingreso').slice(0,3),tg=R.porCategoria(l).slice(0,3),todos=ti.concat(tg);
 $('#g-out').innerHTML=`<div class="grid">${K('Ingresos',F(t.ingresos),'ingreso','a','up')}${K('Gastos',F(t.gastos),'gasto','a','down')}${K('Balance',F(t.balance),t.balance<0?'gasto':'ingreso','a','scale')}
 ${K('Categoría de gasto más fuerte',c?esc(c.cat)+' · '+F(c.total):'—','','p','trophy')}${K('Producto más registrado',p?esc(p.nombre)+' · '+(+p.unidades.toFixed(2))+' uds ('+p.veces+' reg.)':'—','','o','cart')}</div>
 <div class="duo">${card('Ingresos vs. gastos (%)','g1')}${card('Las 3 categorías más fuertes de ingresos y de gastos','g2')}</div>
 <div class="card"><h3>Últimos movimientos</h3><ul class="list">${u.map(fila).join('')}</ul></div>
 <div class="go2"><button class="btn" data-go="reg">${Icons.svg('plus')}<span>Añadir registro</span></button><button class="btn ghost" data-go="his">${Icons.svg('list')}<span>Ver historial</span></button></div>`;
 TM=tema();Chart.defaults.color=TM.mu;Chart.defaults.font.size=chico()?13:12;
 const osc=matchMedia('(prefers-color-scheme:dark)').matches;
 chg.g1=new Chart($('#g1'),{type:'doughnut',plugins:[pctDona],data:{labels:['Ingresos','Gastos'],datasets:[{data:[t.ingresos,t.gastos],backgroundColor:[TM.ingresos,TM.gastos],borderColor:TM.c,borderWidth:3}]},
  options:{maintainAspectRatio:false,animation:false,cutout:'52%',plugins:{legend:ley(),tooltip:{callbacks:{label:q=>' '+q.label+': '+F(q.parsed)+' · '+R.fmtPct(R.pct(q.parsed,t.ingresos+t.gastos))}},pctDona:{on:true,size:chico()?13:15,c0:osc?'#04122a':'#fff',c1:'#fff'}}}});
 chg.g2=new Chart($('#g2'),{type:'bar',plugins:[rotulos2],data:{labels:todos.map(x=>x.cat),datasets:[
  {label:'Ingresos',data:todos.map((x,i)=>i<ti.length?x.total:null),backgroundColor:TM.ingresos,borderRadius:6,maxBarThickness:26},
  {label:'Gastos',data:todos.map((x,i)=>i>=ti.length?x.total:null),backgroundColor:TM.gastos,borderRadius:6,maxBarThickness:26}]},
  options:{indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:chico()?100:124}},plugins:{legend:ley(),tooltip:{callbacks:{label:q=>' '+q.dataset.label+': '+F(q.parsed.x)}},rotulos2:{on:true,color:TM.tx,size:chico()?11:12,s0:t.ingresos,s1:t.gastos}},
   scales:{x:{...gy(),stacked:true},y:{stacked:true,grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?16:28)}}}}}});
}
/* ---------- Registrar ---------- */
function resetReg(tipo,m='',a=''){st={tipo,fecha:hoy(),cat:'',sub:'',det:'',desc:'',cant:'1',monto:'',m,a};drawReg()}
function nuevaCat(){const full=custom.length>=3;
 return `<div class="box"><b>Nueva categoría</b>`+(full?`<p class="warn">Ya tienes 3 categorías propias (el máximo). Elimina una para poder crear otra.</p>`:
 `<label>Nombre<input id="nc-n" maxlength="30"></label><label>Subcategorías (separadas por coma)<textarea id="nc-s" rows="2" placeholder="Ej.: Mascotas, Veterinario"></textarea></label><button class="btn" data-act="nc-ok">Crear categoría</button>`)+
 (custom.length?`<div class="chips">${custom.map(c=>`<span class="chip">${esc(c.nombre)} <button class="del" data-del="${esc(c.id)}" title="Eliminar" aria-label="Eliminar">${Icons.svg('trash')}</button></span>`).join('')}</div>`:'')+`</div>`}
const fechaLarga=iso=>{if(!iso)return 'Elige una fecha';const d=new Date(iso+'T12:00:00');if(isNaN(d))return '';const t=d.toLocaleDateString('es-BO',{weekday:'long',day:'numeric',month:'long',year:'numeric'});return (iso===hoy()?'Hoy · ':'')+t.charAt(0).toUpperCase()+t.slice(1)};
const tile=(lv,n,i=0)=>`<button class="tile lv-${lv}" data-lv="${lv}" data-v="${esc(n)}" style="--i:${i};--ik:${Icons.col(n)}"><span class="ic">${Icons.svg(n)}</span><span class="tl">${esc(n)}</span></button>`;
const LV={cat:'Categoría',sub:'Subcategoría',det:'Detalle'},LVI={cat:'Origen del ingreso',sub:'Categoría',det:'Detalle'};
const lvl=(lv,list,v,a,ing)=>v?`<div class="chosen${a===lv?' pop':''}"><div class="tile big lv-${lv}"><span class="ic">${Icons.svg(v)}</span><span class="tl">${esc(v)}</span></div><button class="btn ghost sm" data-undo="${lv}">↺ Cambiar ${(ing?LVI:LV)[lv].toLowerCase()}</button></div>`
 :`<p class="muted lab">${(ing?LVI:LV)[lv]}</p><div class="tiles${a?' sweep':''}">${list.map((n,i)=>tile(lv,n,i)).join('')}</div>`;
let busy=false;
function behind(t,cb){if(busy)return;busy=true;const r=t.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 [...t.parentElement.children].forEach(x=>{if(x===t)return x.classList.add('zoom');const q=x.getBoundingClientRect();
  x.style.setProperty('--dx',cx-(q.left+q.width/2)+'px');x.style.setProperty('--dy',cy-(q.top+q.height/2)+'px');x.classList.add('away')});
 setTimeout(()=>{busy=false;cb()},400)}
function drawReg(){
 const g=st.tipo==='gasto',a=st.a;st.a='';
 let h=`<div class="seg2"><button class="btn g${g?'':' ghost'}" data-tipo="gasto">Gasto</button><button class="btn${st.tipo==='ingreso'?'':' ghost'}" data-tipo="ingreso">Ingreso</button></div>`;
 if(st.m)h+=`<p class="ok">${esc(st.m)}</p>`;
 if(st.tipo){
  h+=`<div class="fecha-box"><span class="fecha-ttl">📅 Fecha del registro</span><input type="date" id="g-fecha" class="fecha-in" value="${esc(st.fecha)}"><small id="g-fecha-txt" class="fecha-txt">${fechaLarga(st.fecha)}</small></div>`+lvl('cat',g?tree().map(c=>c.n).concat(NUEVA):R.INGRESO.map(c=>c.n),st.cat,a,!g);
  if(st.cat===NUEVA)h+=nuevaCat();
  else if(st.cat){
   const n=(g?tree():R.INGRESO).find(c=>c.n===st.cat),subs=n?n.s:[],dets=n&&n.d[st.sub];
   if(subs.length)h+=lvl('sub',subs,st.sub,a,!g);
   if(subs.length&&st.sub&&dets)h+=lvl('det',dets,st.det,a,!g);
   if((!subs.length||st.sub)&&(!dets||st.det))
    h+=`<label>Descripción / detalle<input id="g-desc" maxlength="120" value="${esc(st.desc)}"></label>`+(g?`<div class="cant-box">Cantidad (1 por defecto)<div class="stepper"><button type="button" data-q="-1" aria-label="Menos">−</button><input id="g-cant" type="number" min="0.01" step="any" inputmode="decimal" value="${esc(st.cant)}"><button type="button" data-q="1" aria-label="Más">+</button></div></div>`:'')+
    `<label>Monto (Bs)<input id="g-monto" type="number" step="0.01" min="0.01" inputmode="decimal" value="${esc(st.monto)}"></label><div class="row acts"><button class="btn" data-act="ok">Registrar ${g?'gasto':'ingreso'}</button><button class="btn ghost" data-act="no">Cancelar</button></div>`;
  }}
 $('#reg-body').innerHTML=h;
}
async function guardar(){
 const monto=Math.round(parseFloat(st.monto)*100)/100,cant=parseFloat(st.cant);
 if(!(monto>0))return alert('Ingresa un monto mayor a 0.');if(!st.fecha)return alert('Elige una fecha.');
 try{movs.push(await D.agregar({tipo:st.tipo,monto,fecha:st.fecha,categoria:st.cat,subcategoria:st.sub||null,detalle:st.det||null,descripcion:st.desc.trim(),cantidad:cant>0?cant:1}));
  resetReg('',`✔ ${st.tipo==='gasto'?'Gasto':'Ingreso'} registrado`);todo()}catch(e){alert('Error: '+e.message)}
}
async function crearCat(){
 const n=$('#nc-n').value.trim(),subs=[...new Set($('#nc-s').value.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean))].slice(0,15);
 if(!n)return alert('Escribe un nombre.');if(custom.length>=3)return alert('Máximo 3 categorías propias.');
 if(n.toLowerCase()===NUEVA.toLowerCase()||nomCats().some(x=>x.toLowerCase()===n.toLowerCase()))return alert('Ya existe una categoría con ese nombre.');
 try{custom.push(await D.guardarCat({nombre:n,subs}));st.cat=n;st.sub=st.det='';armarCats();drawReg()}catch(e){alert(e.message)}
}
async function borrarCat(id){if(!confirm('¿Eliminar esta categoría? Los movimientos ya registrados se conservan.'))return;
 try{await D.eliminarCat(id);custom=custom.filter(c=>c.id!==id);st.cat='';rs.cat=rs.sub=rs.det='';armarCats();drawReg();pintaCfgCats()}catch(e){alert(e.message)}}
/* ---------- Historial ---------- */
const fila=m=>`<li><div>${esc(m.categoria)}${m.subcategoria?' › '+esc(m.subcategoria):''}${m.detalle?' › '+esc(m.detalle):''}<small>${esc(m.fecha)} · ${esc(m.descripcion)}${m.cantidad&&+m.cantidad!==1?' · x'+esc(+m.cantidad):''}</small></div><div><b class="${esc(m.tipo)}">${m.tipo==='ingreso'?'+':'−'}${F(m.monto)}</b>${m.id?` <button class="del" data-id="${esc(m.id)}" title="Eliminar" aria-label="Eliminar">${Icons.svg('trash')}</button>`:''}</div></li>`;
function historial(){const l=R.ordenar(R.filtrar(movs,{q:$('#h-q').value,tipo:$('#h-tipo').value}));
 $('#h-list').innerHTML=l.length?l.map(fila).join(''):'<li class="muted">Sin movimientos.</li>'}
async function borrar(id){if(!confirm('¿Eliminar este movimiento?'))return;try{await D.eliminar(id);movs=movs.filter(m=>m.id!==id);todo()}catch(e){alert(e.message)}}
/* ---------- Reportes ---------- */
const TIPOS=[['vs','Gastos vs Ingresos'],['gasto','Gastos'],['ingreso','Ingresos']],GN={dia:'día',semana:'semana',mes:'mes'},PL={dia:'días',semana:'semanas',mes:'meses'};
let tipoR='vs',rs={cat:'',sub:'',det:'',a:''};
const pt=(k,n,x)=>`<button class="tile${x?' sel':''}" data-k="${esc(k)}" data-v="${esc(k)}" style="--ik:${Icons.col(k)}"><span class="ic">${Icons.svg(k)}</span><span class="tl">${esc(n)}</span></button>`;
function pintaTipos(){$('#f-t').innerHTML=TIPOS.map(([k,n])=>pt(k,n,k===tipoR)).join('')}
function armarCats(){const a=rs.a;rs.a='';if(tipoR==='vs'){$('#f-cats').innerHTML='';return}
 const g=tipoR==='gasto',n=(g?tree():R.INGRESO).find(c=>c.n===rs.cat),subs=n?n.s:[],dets=n&&n.d[rs.sub],leg=[...new Set(movs.filter(m=>m.tipo==='ingreso').map(m=>m.categoria))].filter(x=>!R.INGRESO.some(c=>c.n===x));
 let h=lvl('cat',g?tree().map(c=>c.n):R.INGRESO.map(c=>c.n).concat(leg),rs.cat,a,!g);
 if(rs.cat&&subs.length)h+=lvl('sub',subs,rs.sub,a,!g);if(rs.sub&&dets)h+=lvl('det',dets,rs.det,a,!g);
 $('#f-cats').innerHTML=h}
function poblar(){const m=$('#f-mes').value,a=$('#f-anio').value,base=a?movs.filter(x=>x.fecha.startsWith(a)):movs;
 $('#f-anio').innerHTML='<option value="">Todos</option>'+R.aniosConDatos(movs).map(k=>`<option>${k}</option>`).join('');
 $('#f-mes').innerHTML='<option value="">Todos</option>'+[...new Set(base.map(x=>x.fecha.slice(5,7)))].sort().map(k=>`<option value="${k}">${R.MESES[+k-1]}</option>`).join('');
 $('#f-anio').value=a;if($('#f-anio').selectedIndex<0)$('#f-anio').value='';$('#f-mes').value=m;if($('#f-mes').selectedIndex<0)$('#f-mes').value=''}
const filtros=()=>({anio:$('#f-anio').value,mes:$('#f-mes').value,desde:$('#f-d').value,hasta:$('#f-h').value,tipo:tipoR==='vs'?'':tipoR,cats:rs.cat?[rs.cat]:[],sub:rs.sub,det:rs.det});
const NOM={gastos:'Gastos',ingresos:'Ingresos'},chico=()=>window.innerWidth<=760,recorta=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
const tema=()=>{const s=getComputedStyle(document.documentElement),v=n=>s.getPropertyValue(n).trim();return{mu:v('--mu'),bd:v('--bd'),c:v('--c'),tx:v('--tx'),gastos:'#af11f2',ingresos:matchMedia('(prefers-color-scheme:dark)').matches?'#00f8ff':'#0891b2'}};
let TM=tema();
if(window.Chart)Chart.register({id:'fondo',beforeDraw(c){const x=c.ctx;x.save();x.globalCompositeOperation='destination-over';x.fillStyle=TM.c;x.fillRect(0,0,c.width,c.height);x.restore()}});
const rotulos={id:'rotulos',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data;x.save();x.fillStyle=o.color;x.font='600 '+o.size+'px system-ui,sans-serif';x.textBaseline='middle';x.textAlign='left';
 m.data.forEach((b,i)=>x.fillText('Bs '+R.fmtCorto(d[i])+' · '+R.fmtPct(R.pct(d[i],o.suma),0),b.x+6,b.y));x.restore()}};
const ley=()=>({position:'bottom',labels:{usePointStyle:true,boxWidth:8,padding:14}});
const tip={callbacks:{label:c=>' '+(c.dataset.label?c.dataset.label+': ':'')+F(c.chart.options.indexAxis==='y'?c.parsed.x:c.parsed.y)}};
const gx=()=>({grid:{display:false},ticks:{maxRotation:chico()?45:0,autoSkip:true,autoSkipPadding:10}}),gy=()=>({beginAtZero:true,grid:{color:TM.bd},ticks:{callback:v=>R.fmtCorto(v)}});
const opt=(x={})=>({maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:ley(),tooltip:tip},scales:{x:gx(),y:gy()},...x});
const barH=(id,l,c,suma)=>new Chart($(id),{type:'bar',plugins:[rotulos],data:{labels:l.map(x=>x.cat),datasets:[{data:l.map(x=>x.total),backgroundColor:c,borderRadius:6,maxBarThickness:26}]},
 options:{indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:chico()?100:124}},plugins:{legend:{display:false},tooltip:{callbacks:{label:q=>' '+F(q.parsed.x)+' · '+R.fmtPct(R.pct(q.parsed.x,suma))}},rotulos:{on:true,color:TM.tx,size:chico()?11:12,suma}},
  scales:{x:gy(),y:{grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?17:30)}}}}}});
const ds=(s,keys)=>keys.map(k=>({label:NOM[k],data:s.map(x=>x[k]),backgroundColor:TM[k],borderRadius:4,maxBarThickness:34}));
const barM=(id,pm)=>new Chart($(id),{type:'bar',data:{labels:pm.map(m=>R.mesCorto(m.mes)),datasets:ds(pm,['ingresos','gastos'])},options:opt()});
const barS=(id,s,keys)=>new Chart($(id),{type:'bar',data:{labels:s.map(x=>x.label),datasets:ds(s,keys)},options:opt()});
const lineEvo=(id,s,keys)=>new Chart($(id),{type:'line',data:{labels:s.map(x=>x.label),datasets:keys.flatMap(k=>{const v=s.map(x=>x[k]);return[{label:NOM[k],data:v,borderColor:TM[k],backgroundColor:TM[k]+'26',fill:keys.length===1,tension:.3,borderWidth:2.5,pointRadius:s.length>40?0:3,pointHoverRadius:6},{label:'Tendencia '+NOM[k].toLowerCase(),data:R.tendencia(v).linea,borderColor:TM[k],borderDash:[6,5],pointRadius:0,borderWidth:2,fill:false}]})},options:opt()});
const badge=v=>`<small class="badge">${{sube:'↗ en aumento',baja:'↘ en descenso',estable:'→ estable'}[R.tendencia(v).dir]}</small>`;
const card=(h,id,hl,ht)=>`<div class="card${hl?' hl':''}"><h3>${h}</h3><div class="cv"${ht?` style="height:${ht}px"`:''}><canvas id="${id}"></canvas></div></div>`;
const sub=t=>`<span class="sub">${t}</span>`;
function renderRep(){
 const f=filtros(),o=$('#rep-out'),fm=$('#f-msg'),mal=f.desde&&f.hasta&&f.desde>f.hasta;Object.values(ch).forEach(c=>c.destroy());ch={};
 fm.hidden=!mal;fm.textContent=mal?'La fecha «Desde» es posterior a «Hasta». Corrígela para ver el reporte.':'';if(mal){o.innerHTML='';return}
 TM=tema();Chart.defaults.color=TM.mu;Chart.defaults.font.size=chico()?13:12;
 const l=R.filtrar(movs,f);
 if(!l.length){o.innerHTML='<div class="card vacio"><b>Sin datos para este filtro</b><span class="muted">Prueba con otro mes o pulsa «Limpiar».</span></div>';return}
 const[a,b]=R.rango(f,l,hoy()),gr=R.granularidad(f,a,b),s1=R.serie(l,gr[0],a,b),s2=R.serie(l,gr[1],a,b),t=R.totales(l,a,b),sem=Math.max(1,R.dias(a,b)/7);
 const e1=`Evolución por ${GN[gr[0]]}`,e2=`Por ${GN[gr[1]]}`,per=`<div class="perio">📅 ${R.fechaCorta(a)} – ${R.fechaCorta(b)} · ${t.n} movimiento${t.n===1?'':'s'}</div>`;
 if(tipoR==='vs'){
  const sg=s1.filter(x=>x.gastos>x.ingresos).length,tg=R.tendencia(s1.map(x=>x.gastos)).dir,ti=R.tendencia(s1.map(x=>x.ingresos)).dir,nm={sube:'↗ suben',baja:'↘ bajan',estable:'→ estables'},
   pc=R.porCategoria(l)[0],ah=t.ingresos>0?R.pct(t.balance,t.ingresos):null;
  o.innerHTML=per+`<div class="grid">${K('Ingresos',F(t.ingresos),'ingreso','a','up')}${K('Gastos',F(t.gastos),'gasto','a','down')}${K('Balance',F(t.balance),t.balance<0?'gasto':'ingreso','a','scale')}${K('Tasa de ahorro',ah==null?'—':R.fmtPct(ah),ah!=null&&ah<0?'gasto':'ingreso','a','coin')}${K('Gasto promedio por mes',F(t.gMes),'','o','calendar')}${K('Ingreso promedio por mes',F(t.iMes),'','p','calendar')}${K('Gastos > ingresos',sg+' de '+s1.length+' '+PL[gr[0]],sg?'gasto':'ingreso','a','alert')}${K('Categoría de gasto más fuerte',pc?F(pc.total)+sub(esc(pc.cat)+' · '+R.fmtPct(R.pct(pc.total,t.gastos))+' de tus gastos'):'—','','p','trophy')}</div>
  <div class="vd${t.balance<0?' mal':''}"><b>${t.balance<0?'⚠ Los gastos superan a los ingresos':t.balance>0?'✔ Los ingresos superan a los gastos':'Ingresos y gastos están igualados'}</b> en este periodo. Tendencia: gastos ${nm[tg]}, ingresos ${nm[ti]}.</div>
  <div class="duo">${card('Comportamiento: ingresos vs. gastos por '+GN[gr[0]],'c1',1)}${card('Ingresos y gastos por mes','c2')}</div>${card(e2,'c3')}`;
  ch.c1=lineEvo('#c1',s1,['ingresos','gastos']);ch.c2=barM('#c2',R.porMes(l));ch.c3=barS('#c3',s2,['ingresos','gastos']);return}
 const gk=tipoR==='gasto'?'gastos':'ingresos',tot=t[gk],W=tipoR==='gasto'?'Gasto':'Ingreso',ev=card(e1+' '+badge(s1.map(x=>x[gk])),'c2');
 if(!f.cats.length){const pc=R.porCategoria(l,tipoR),p0=pc[0];
  o.innerHTML=per+`<div class="grid">${K(W+' total',F(tot),tipoR,'a',tipoR)}${K(W+' promedio por mes',F(t[gk==='gastos'?'gMes':'iMes']),'','o','calendar')}${K(W+' promedio por semana',F(tot/sem),'','p','calweek')}${K(W+' promedio diario',F(tot/R.dias(a,b)),'','a','sun')}${K('Movimientos',t.n,'','a','list')}${K(tipoR==='gasto'?'Categoría más fuerte':'Fuente más fuerte',p0?F(p0.total)+sub(esc(p0.cat)+' · '+R.fmtPct(R.pct(p0.total,tot))+' del total'):'—','','p','trophy')}</div>
  <div class="duo">${card(W+'s por categoría','c1',1,Math.max(280,pc.length*30+40))}${ev}</div>${card(e2,'c3')}`;
  ch.c1=barH('#c1',pc,TM[gk],tot)}
 else{const fr=R.frecuentes(l),p=fr[0],base=R.totales(R.filtrar(movs,{...f,cats:[],sub:'',det:''}))[gk];
  o.innerHTML=per+`<h2>${[f.cats[0],f.sub,f.det].filter(Boolean).map(esc).join(' › ')}</h2><div class="grid">${K(W+' total',F(tot),tipoR,'a',tipoR)}${K('Participación',R.fmtPct(R.pct(tot,base))+sub('de tus '+gk+' del periodo'),'','o','scale')}${K(W+' más frecuente',F(p.total)+sub(esc(p.k)+' · '+p.n+'×'),'','p','repeat')}${K(W+' promedio por semana',F(tot/sem),'','o','calweek')}${K('Movimientos',t.n,'','a','list')}${K('Promedio por movimiento',F(tot/t.n),'','a','coin')}</div>
  <div class="duo">${card(W+'s más recurrentes y sus montos','c1',1,Math.max(240,Math.min(8,fr.length)*34+40))}${ev}</div>${card(e2,'c3')}`;
  ch.c1=barH('#c1',fr.slice(0,8).map(x=>({cat:`${x.k} (${x.n}×)`,total:x.total})),TM[gk],tot)}
 ch.c2=lineEvo('#c2',s1,[gk]);ch.c3=barS('#c3',s2,[gk]);
}
function pdf(){const f=filtros(),l=R.ordenar(R.filtrar(movs,f)),c=Object.values(ch);if(!l.length||c.length<2)return alert('No hay datos para exportar.');const[a,b]=R.rango(f,l,hoy());
 PDF.generar({rango:`Periodo: ${a} a ${b}`,tot:R.totales(l,a,b),porCat:R.porCategoria(l),filas:l,imgs:c.slice(0,2).map(x=>x.toBase64Image('image/png',1))})}
/* ---------- Notas ---------- */
let tm;function nota(){msg('#n-st','Guardando…');clearTimeout(tm);tm=setTimeout(async()=>{try{await D.guardarNota($('#n-txt').value);msg('#n-st','Guardado ✔')}catch(e){msg('#n-st','Error: '+e.message)}},800)}
async function importar(file){try{const j=JSON.parse(await file.text()),nuevos=R.paraImportar(movs,j.movimientos);
 if(!confirm(`Se importarán ${nuevos.length} movimientos nuevos (los duplicados se omiten). ¿Continuar?`))return;
 let n=0;for(const m of nuevos){movs.push(await D.agregar(m));msg('#c-st',`Importando ${++n}/${nuevos.length}…`)}
 for(const c of (Array.isArray(j.categorias)?j.categorias:[])){const nm=String(c&&c.nombre||'').trim().slice(0,30);
  if(nm&&custom.length<3&&nm.toLowerCase()!==NUEVA.toLowerCase()&&!nomCats().some(x=>x.toLowerCase()===nm.toLowerCase()))custom.push(await D.guardarCat({nombre:nm,subs:(Array.isArray(c.subs)?c.subs:[]).map(x=>String(x).slice(0,40)).slice(0,15)}))}
 if(typeof j.notas==='string'&&j.notas&&!$('#n-txt').value){$('#n-txt').value=j.notas;await D.guardarNota(j.notas)}
 armarCats();todo();msg('#c-st',`Importación lista: ${n} movimientos ✔`)}catch(e){msg('#c-st','Error al importar: '+e.message)}}
/* ---------- Importar desde Excel ---------- */
let pend=[];
const plano=v=>{if(v&&typeof v==='object'&&!(v instanceof Date)){if('result' in v)return v.result;if('text' in v)return v.text;if(Array.isArray(v.richText))return v.richText.map(t=>t.text).join('');return ''}return v};
const cargaXL=()=>window.ExcelJS?Promise.resolve():new Promise((ok,no)=>{const e=document.createElement('script');e.src='https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';e.onload=ok;e.onerror=()=>no(new Error('No se pudo cargar la librería de Excel. Usa la opción de pegar las filas.'));document.head.appendChild(e)});
async function leerXL(f){await cargaXL();const wb=new ExcelJS.Workbook();await wb.xlsx.load(await f.arrayBuffer());const ws=wb.getWorksheet('Movimientos')||wb.worksheets[0];if(!ws)throw new Error('El archivo no tiene hojas.');
 const n=Math.min(ws.rowCount,5001),c=Math.max(ws.columnCount,8),m=[];for(let i=1;i<=n;i++){const v=ws.getRow(i).values;m.push(Array.from({length:c},(_,j)=>plano(v[j+1])))}return m}
function leerTxt(t){const l=t.replace(/\r/g,'').split('\n').filter(x=>x.trim()!==''),s=t.includes('\t')?'\t':t.includes(';')?';':',';return l.map(x=>x.split(s))}
async function revisarXL(){const f=$('#xl-file').files[0],o=$('#xl-res');pend=[];
 try{o.textContent='Leyendo…';const mat=f?await leerXL(f):leerTxt($('#xl-txt').value);if(!mat.length){o.textContent='No hay datos: sube un archivo o pega las filas.';return}
  const r=R.validarFilas(mat,{gasto:tree(),ingreso:R.INGRESO});pend=R.paraImportar(movs,r.validos);const dup=r.validos.length-pend.length;
  const desc=Object.entries(r.desconocidas).map(([k,n])=>`${esc(k)}: ${n}`).join(' · ');
  o.innerHTML=`<p><b>${r.total}</b> filas leídas · <b class="ingreso">${pend.length}</b> listas para importar · ${dup} duplicadas (se omiten) · <b class="${r.errores.length?'gasto':''}">${r.errores.length}</b> con error</p>`+
   (desc?`<p class="warn">Categorías que no existen en la app: ${desc}. Corrígelas en el Excel (Buscar y reemplazar) o créalas en Registrar.</p>`:'')+
   (r.errores.length?`<ul class="list">${r.errores.slice(0,15).map(e=>`<li><span>${e.fila?'Fila '+e.fila+': ':''}${esc(e.msg)}</span></li>`).join('')}</ul>${r.errores.length>15?`<p class="muted">… y ${r.errores.length-15} más.</p>`:''}`:'')+
   (pend.length?`<button id="xl-go" class="btn">Importar ${pend.length} movimientos</button>`:'')}
 catch(e){o.textContent='Error: '+e.message}}
async function importarXL(){const b=$('#xl-go');b.disabled=true;let n=0;
 try{for(let i=0;i<pend.length;i+=200){const g=pend.slice(i,i+200);movs.push(...await D.agregarVarios(g));n+=g.length;b.textContent=`Importando ${n}/${pend.length}…`}
  pend=[];todo();$('#xl-res').innerHTML=`<p class="ok">✔ ${n} movimientos importados.</p>`}
 catch(e){$('#xl-res').innerHTML=`<p class="warn">Error tras ${n} movimientos: ${esc(e.message)}. Pulsa Revisar de nuevo: los ya importados se omiten.</p>`;todo()}}
function respaldo(){const b=new Blob([JSON.stringify({exportado:new Date().toISOString(),notas:$('#n-txt').value,movimientos:movs,categorias:custom},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='respaldo-finanzas.json';a.click();try{localStorage.setItem(kResp(),hoy())}catch(e){}estadoResp()}
/* ---------- Configuración ---------- */
let cfgEd='';
function pintaCfg(){cfgEd='';pintaCfgCats();estadoResp();$('#c-ver').textContent=VERSION}
function pintaCfgCats(){const el=$('#c-cats');
 if(!custom.length){el.innerHTML='<p class="muted lab">Aún no tienes categorías propias.</p>';return}
 el.innerHTML=custom.map(c=>c.id===cfgEd?`<div class="box"><label>Nombre<input id="ce-n" maxlength="30" value="${esc(c.nombre)}"></label><label>Subcategorías (separadas por coma)<textarea id="ce-s" rows="2">${esc((c.subs||[]).join(', '))}</textarea></label><div class="row"><button class="btn sm" data-ce="ok" data-id="${esc(c.id)}">Guardar</button><button class="btn ghost sm" data-ce="no">Cancelar</button></div></div>`
  :`<div class="cat-row"><div><b>${esc(c.nombre)}</b><small class="muted">${(c.subs||[]).length?esc(c.subs.join(', ')):'Sin subcategorías'}</small></div><div class="acts2"><button class="btn ghost sm" data-ce="ed" data-id="${esc(c.id)}">✎ Editar</button><button class="del" data-ce="del" data-id="${esc(c.id)}" title="Eliminar" aria-label="Eliminar">${Icons.svg('trash')}</button></div></div>`).join('')}
async function editarCat(id){const c=custom.find(x=>x.id===id);if(!c)return;
 const n=$('#ce-n').value.trim(),subs=[...new Set($('#ce-s').value.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean))].slice(0,15),viejo=c.nombre;
 if(!n)return alert('Escribe un nombre.');
 if(n.toLowerCase()===NUEVA.toLowerCase()||nomCats().filter(x=>x!==viejo).some(x=>x.toLowerCase()===n.toLowerCase()))return alert('Ya existe una categoría con ese nombre.');
 const k=n===viejo?0:movs.filter(m=>m.tipo==='gasto'&&m.categoria===viejo).length;
 if(k&&!confirm(`Se cambiará el nombre también en ${k} movimiento${k===1?'':'s'} ya registrado${k===1?'':'s'}. ¿Continuar?`))return;
 try{await D.actualizarCat(id,{nombre:n,subs});if(k){await D.renombrarCat(viejo,n);movs.forEach(m=>{if(m.tipo==='gasto'&&m.categoria===viejo)m.categoria=n})}
  c.nombre=n;c.subs=subs;if(st.cat===viejo){st.cat=n;if(st.sub&&!subs.includes(st.sub))st.sub=st.det=''}if(rs.cat===viejo){rs.cat=n;if(rs.sub&&!subs.includes(rs.sub))rs.sub=rs.det=''}
  cfgEd='';armarCats();drawReg();todo();pintaCfgCats()}catch(e){alert('Error: '+e.message)}}
const kResp=()=>'ar_resp_'+userEmail;
function estadoResp(){let f=null;try{f=localStorage.getItem(kResp())}catch(e){}const el=$('#c-resp');
 if(!f){el.textContent='Aún no has hecho un respaldo desde este dispositivo.';el.className='warn';return}
 const n=R.diasEntre(f,hoy());el.textContent='Último respaldo: '+R.fechaCorta(f)+' (hace '+n+(n===1?' día':' días')+')';el.className=n>14?'warn':'muted'}
/* ---------- Eventos ---------- */
function menu(t){$$('.mi').forEach(x=>x.classList.toggle('on',x.dataset.t===t));$$('.tab').forEach(s=>s.hidden=s.id!=='t-'+t);$('#side').classList.remove('open');$('#scrim').classList.remove('on');if(t==='rep')renderRep();if(t==='gen')general();if(t==='cfg')pintaCfg()}
document.addEventListener('DOMContentLoaded',()=>{
 $$('.mi').forEach(b=>b.onclick=()=>menu(b.dataset.t));
 $('#burger').onclick=()=>{$('#side').classList.add('open');$('#scrim').classList.add('on')};$('#scrim').onclick=()=>menu($('.mi.on').dataset.t);
 const rb=$('#reg-body');
 rb.addEventListener('change',e=>{if(e.target.id==='g-fecha'){st.fecha=e.target.value;$('#g-fecha-txt').textContent=fechaLarga(st.fecha)}});
 rb.addEventListener('input',e=>{const k={'g-desc':'desc','g-cant':'cant','g-monto':'monto'}[e.target.id];if(k)st[k]=e.target.value});
 rb.addEventListener('click',e=>{
  const t=e.target.closest('.tile[data-lv]');
  if(t)return behind(t,()=>{const lv=t.dataset.lv;st[lv]=t.dataset.v;if(lv==='cat')st.sub=st.det='';if(lv==='sub')st.det='';st.m='';st.a=lv;drawReg()});
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.tipo)resetReg(b.dataset.tipo,'','tipo');
  else if(b.dataset.undo){const lv=b.dataset.undo;st[lv]='';if(lv==='cat')st.sub=st.det='';if(lv==='sub')st.det='';drawReg()}
  else if(b.dataset.q){const v=Math.max(1,Math.round((parseFloat(st.cant)||1)+ +b.dataset.q));st.cant=String(v);$('#g-cant').value=st.cant}
  else if(b.dataset.act==='ok')guardar();else if(b.dataset.act==='no')resetReg('');else if(b.dataset.act==='nc-ok')crearCat();else if(b.dataset.del)borrarCat(b.dataset.del)});
 $('#g-out').onclick=e=>{const d=e.target.closest('.del'),g=e.target.closest('[data-go]');if(d)borrar(d.dataset.id);else if(g)menu(g.dataset.go)};
 $('#h-q').oninput=$('#h-tipo').onchange=historial;$('#h-list').onclick=e=>{const b=e.target.closest('.del');if(b)borrar(b.dataset.id)};
 $('#f-anio').onchange=()=>{poblar();renderRep()};$('#f-mes').onchange=$('#f-d').onchange=$('#f-h').onchange=renderRep;
 $('#f-t').onclick=e=>{const b=e.target.closest('.tile');if(!b)return;tipoR=b.dataset.k;rs={cat:'',sub:'',det:'',a:'tipo'};pintaTipos();armarCats();renderRep()};
 $('#f-cats').onclick=e=>{const t=e.target.closest('.tile[data-lv]');
  if(t)return behind(t,()=>{const lv=t.dataset.lv;rs[lv]=t.dataset.v;if(lv==='cat')rs.sub=rs.det='';if(lv==='sub')rs.det='';rs.a=lv;armarCats();renderRep()});
  const b=e.target.closest('[data-undo]');if(b){const lv=b.dataset.undo;rs[lv]='';if(lv==='cat')rs.sub=rs.det='';if(lv==='sub')rs.det='';armarCats();renderRep()}};
 $('#f-todo').onclick=()=>{$('#f-anio').value=$('#f-mes').value=$('#f-d').value=$('#f-h').value='';tipoR='vs';rs={cat:'',sub:'',det:'',a:''};pintaTipos();armarCats();poblar();renderRep()};
 $('#f-q').onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;const q=R.periodoRapido(b.dataset.p,hoy(),movs),fm=$('#f-msg');
  if(!q){fm.textContent='No hay movimientos en ese periodo.';fm.hidden=false;return}
  $('#f-d').value=$('#f-h').value='';$('#f-anio').value=q.anio;poblar();$('#f-mes').value=q.mes;renderRep()};
 matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{{if(!$('#t-rep').hidden)renderRep();if(!$('#t-gen').hidden)general()}});
 $('#pdf').onclick=pdf;$('#n-xl').onclick=()=>{$('#xl-panel').hidden=false};$('#xl-x').onclick=()=>{$('#xl-panel').hidden=true};$('#xl-rev').onclick=revisarXL;$('#xl-res').onclick=e=>{if(e.target.id==='xl-go')importarXL()};$('#n-txt').oninput=nota;$('#n-exp').onclick=respaldo;$('#n-imp').onclick=()=>$('#n-file').click();$('#n-file').onchange=e=>{const f=e.target.files[0];if(f)importar(f);e.target.value=''};
 $('#c-cats').onclick=e=>{const b=e.target.closest('[data-ce]');if(!b)return;const k=b.dataset.ce;
  if(k==='ed'){cfgEd=b.dataset.id;pintaCfgCats()}else if(k==='no'){cfgEd='';pintaCfgCats()}else if(k==='ok')editarCat(b.dataset.id);else if(k==='del')borrarCat(b.dataset.id)};
 $('#c-pwb').onclick=async()=>{const a=$('#c-pw').value,b=$('#c-pw2').value,m=$('#c-pwm'),bad=t=>{m.className='warn lab';m.textContent=t};
  if(a.length<6)return bad('La contraseña debe tener al menos 6 caracteres.');if(a!==b)return bad('Las contraseñas no coinciden.');
  try{await D.cambiarClave(a);$('#c-pw').value=$('#c-pw2').value='';m.className='ok lab';m.textContent='✔ Contraseña cambiada.'}catch(e){bad('Error: '+e.message)}};
 $('#out').onclick=$('#c-out').onclick=async()=>{await D.salir();location.reload()};iniciar();
});
})();
