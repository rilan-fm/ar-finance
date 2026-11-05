(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=Reports,esc=R.esc,F=R.fmt;
const VERSION='0.13.1';
let D,movs=[],custom=[],plan=[],pagos=[],metas=[],plOk=false,metOk=false,ch={},st,userEmail='';
const NUEVA='Nueva categoría',hoy=()=>new Date().toLocaleDateString('sv');
const tree=()=>R.GASTO.concat(custom.map(c=>({n:c.nombre,s:c.subs||[],d:{},id:c.id})));
const nomCats=()=>tree().map(c=>c.n).concat(R.INGRESO.map(c=>c.n));
const sel=(l,id,list,v)=>`<label>${l}<select id="${id}"><option value="">Selecciona…</option>${list.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
const K=(a,b,c='',cl='a',ic='')=>`<div class="k ${cl}">${ic?`<span class="kic ${c==='ingreso'?'pos':c==='gasto'?'neg':''}">${Icons.svg(ic)}</span>`:''}<div><small>${a}</small><b class="${c}">${b}</b></div></div>`;
const msg=(e,t)=>$(e).textContent=t;
function iniciar(){
 const c=window.MF_CONFIG||{};
 if(c.allowSignup===false&&!window.MF_PREVIEW)$('#l-up').hidden=true;
 D=window.MF_PREVIEW?Data.memoria(window.MF_SEED,window.MF_SEED_PRES,window.MF_SEED_REC,window.MF_SEED_MET,window.MF_SEED_PLAN,window.MF_SEED_PAG):(c.url&&!/^TU-/.test(c.url)?Data.supabase(c.url,c.anonKey):null);
 if(!D)return msg('#login-msg','Configura js/config.js con la URL y clave anon de Supabase (ver README).');
 $('#l-in').onclick=()=>acceso('entrar');$('#l-up').onclick=()=>acceso('registrar');
 if(window.MF_PREVIEW){$('#l-mail').value='demo@local';$('#l-pass').value='demo123';msg('#login-msg','Vista previa con datos de ejemplo (adaptador memoria).')}
 D.sesion().then(u=>u&&entrar(u)).catch(e=>msg('#login-msg',e.message));
}
async function acceso(m){try{msg('#login-msg','…');await entrar(await D[m]($('#l-mail').value.trim(),$('#l-pass').value))}catch(e){msg('#login-msg',e.message)}}
async function entrar(u){
 $('#login').hidden=true;$('#app').hidden=false;$('#who').textContent=u.email;userEmail=u.email;$('#c-mail').textContent=u.email;
 movs=await D.listar();custom=await D.listarCats();await cargaPlan();await cargaMetas();$('#n-txt').value=await D.leerNota();
 const a=R.aniosConDatos(movs),y=String(new Date().getFullYear());
 resetReg('');fs.anio=R.anioResumen(hoy(),movs);pintaTipos();armarCats();todo();
}
function todo(){general();historial();pintaFil();renderRep();pintaPagos();pintaMetas();avisos()}
/* ---------- General ---------- */
let chg={};
const gradBar=(c1,c2)=>q=>{const a=q.chart.chartArea;if(!a)return c1;const g=q.chart.ctx.createLinearGradient(a.left,0,a.right,0);g.addColorStop(0,c1);g.addColorStop(1,c2);return g};
const gradV=(c1,c2)=>q=>{const a=q.chart.chartArea;if(!a)return c1;const g=q.chart.ctx.createLinearGradient(0,a.bottom,0,a.top);g.addColorStop(0,c1);g.addColorStop(1,c2);return g};
const gradD=(c1,c2)=>q=>{const a=q.chart.chartArea;if(!a)return c1;const g=q.chart.ctx.createLinearGradient(a.left,a.top,a.right,a.bottom);g.addColorStop(0,c1);g.addColorStop(1,c2);return g};
const neon={id:'neon',beforeDatasetDraw(c,_a,o){if(o&&o.on){c.ctx.save();c.ctx.shadowBlur=o.blur;c.ctx.shadowColor=o.color}},afterDatasetDraw(c,_a,o){if(o&&o.on)c.ctx.restore()}};
const centroDona={id:'centroDona',afterDatasetsDraw(c,_a,o){if(!o)return;const x=c.ctx,a=c.chartArea,cx=(a.left+a.right)/2,cy=(a.top+a.bottom)/2;x.save();x.textAlign='center';x.textBaseline='middle';x.fillStyle=o.mu;x.font='600 '+Math.round(o.size*.55)+'px system-ui,sans-serif';x.fillText(o.label,cx,cy-o.size*.7);x.fillStyle=o.color;x.font='800 '+o.size+'px system-ui,sans-serif';x.fillText(o.valor,cx,cy+o.size*.25);x.restore()}};
const pctDona={id:'pctDona',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data,s=d[0]+d[1];x.save();x.font='700 '+o.size+'px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';
 m.data.forEach((a,i)=>{if(!d[i])return;const p=a.getCenterPoint();x.fillStyle=i?o.c1:o.c0;x.fillText(R.fmtPct(R.pct(d[i],s)),p.x,p.y)});x.restore()}};
const rotulos2={id:'rotulos2',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx;x.save();x.fillStyle=o.color;x.font='600 '+o.size+'px system-ui,sans-serif';x.textBaseline='middle';x.textAlign='left';
 c.data.datasets.forEach((s,k)=>c.getDatasetMeta(k).data.forEach((b,i)=>{const v=s.data[i];if(v==null)return;x.fillText('Bs '+R.fmtCorto(v)+' · '+R.fmtPct(R.pct(v,k?o.s1:o.s0),0),b.x+6,b.y)}));x.restore()}};
function general(){
 Object.values(chg).forEach(c=>c.destroy());chg={};
 const y=R.anioResumen(hoy(),movs),l=movs.filter(m=>m.fecha.startsWith(y)),t=R.totales(l),c=R.porCategoria(l)[0],p=R.topProducto(l);
 $('#g-tit').textContent='Resumen del año '+y;
 if(!l.length){$('#g-out').innerHTML='<div class="card muted">Aún no hay movimientos. Empieza en «Registrar».</div>';return}
 const u=R.ordenarReg(movs).slice(0,5),ti=R.porCategoria(l,'ingreso').slice(0,3),tg=R.porCategoria(l).slice(0,3),todos=ti.concat(tg);
 $('#g-out').innerHTML=`<div class="grid">${K('Ingresos',F(t.ingresos),'ingreso','a','up')}${K('Gastos',F(t.gastos),'gasto','a','down')}${K('Balance',F(t.balance),t.balance<0?'gasto':'ingreso','a','scale')}
 ${K('Categoría de gasto más fuerte',c?esc(c.cat)+' · '+F(c.total):'—','','p','trophy')}${K('Producto más registrado',p?esc(p.nombre)+' · '+(+p.unidades.toFixed(2))+' uds ('+p.veces+' reg.)':'—','','o','cart')}</div>
 <div class="duo">${card('Ingresos vs. gastos (%)','g1')}${card('Las 3 categorías más fuertes de ingresos y de gastos','g2')}</div>
 <div class="card"><h3>Últimos movimientos</h3><ul class="list">${u.map(fila).join('')}</ul></div>
 <div class="go2"><button class="btn" data-go="reg">${Icons.svg('plus')}<span>Añadir registro</span></button><button class="btn ghost" data-go="his">${Icons.svg('list')}<span>Ver historial</span></button></div>`;
 TM=tema(true);Chart.defaults.color=TM.mu;Chart.defaults.font.size=chico()?13:12;
 const osc=matchMedia('(prefers-color-scheme:dark)').matches;
 const gi=TM.gi,gg=TM.gg,tot=t.ingresos+t.gastos;
 chg.g1=new Chart($('#g1'),{type:'doughnut',plugins:[centroDona,neon],data:{labels:['Ingresos · '+R.fmtPct(R.pct(t.ingresos,tot)),'Gastos · '+R.fmtPct(R.pct(t.gastos,tot))],datasets:[{data:[t.ingresos,t.gastos],backgroundColor:['#13dbf3','#fe9900'],borderColor:'transparent',borderWidth:0,spacing:0,borderRadius:0,hoverOffset:8}]},
  options:{color:TM.mu,maintainAspectRatio:false,animation:false,cutout:'72%',plugins:{fondo:false,legend:ley(),tooltip:{callbacks:{label:q=>' '+q.label.split(' · ')[0]+': '+F(q.parsed)}},neon:{on:false},centroDona:{label:'Balance',valor:'Bs '+R.fmtCorto(t.balance),color:t.balance<0?'#ff3b6b':'#00ff54',mu:TM.mu,size:chico()?20:26}}}});
 chg.g2=new Chart($('#g2'),{type:'bar',plugins:[rotulos2,neon],data:{labels:todos.map(x=>x.cat),datasets:[
  {label:'Ingresos',data:todos.map((x,i)=>i<ti.length?x.total:null),backgroundColor:'#13dbf3',borderRadius:10,borderSkipped:false,maxBarThickness:22},
  {label:'Gastos',data:todos.map((x,i)=>i>=ti.length?x.total:null),backgroundColor:'#fe9900',borderRadius:10,borderSkipped:false,maxBarThickness:22}]},
  options:{color:TM.mu,indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:chico()?100:124}},plugins:{fondo:false,legend:ley(),tooltip:{callbacks:{label:q=>' '+q.dataset.label+': '+F(q.parsed.x)}},neon:{on:false},rotulos2:{on:true,color:TM.tx,size:chico()?11:12,s0:t.ingresos,s1:t.gastos}},
   scales:{x:{...gy(),stacked:true,grid:{color:TM.bd,lineWidth:1,borderDash:[4,5],drawTicks:false}},y:{stacked:true,grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?16:28)}}}}}});
}
/* ---------- Desplazamiento suave: muestra lo nuevo sin que el usuario tenga que bajar ---------- */
const offTop=()=>(window.innerWidth<=760?72:16)+(!$('#t-rep').hidden&&$('#f-bar')?$('#f-bar').offsetHeight+8:0);
function revelar(ini,fin){if(!ini)return;requestAnimationFrame(()=>{const t=ini.getBoundingClientRect().top-offTop(),necesita=(fin||ini).getBoundingClientRect().bottom-(window.innerHeight-24);
 const dy=t<0?t:Math.max(0,Math.min(necesita,t));if(Math.abs(dy)>8)window.scrollBy({top:dy,behavior:'smooth'})})}
const irArriba=()=>window.scrollTo({top:0,behavior:'smooth'});
function irRes(){const o=$('#rep-out');requestAnimationFrame(()=>window.scrollTo({top:o.getBoundingClientRect().top+window.scrollY-offTop(),behavior:'smooth'}))}
function irCats(){const c=$('#f-cats'),t=c.querySelector('.tiles');if(t)revelar(c.querySelector('.chosen')||t,c);else if(c.firstElementChild)revelar(c.firstElementChild,c);else irRes()}
/* ---------- Registrar ---------- */
function resetReg(tipo,m='',a=''){st={tipo,fecha:fechaInicial(),cat:'',sub:'',det:'',desc:'',cant:'1',monto:'',m,a};drawReg()}
function nuevaCat(){const full=custom.length>=3;
 return `<div class="box"><b>Nueva categoría</b>`+(full?`<p class="warn">Ya tienes 3 categorías propias (el máximo). Elimina una para poder crear otra.</p>`:
 `<label>Nombre<input id="nc-n" maxlength="30"></label><label>Subcategorías (separadas por coma)<textarea id="nc-s" rows="2" placeholder="Ej.: Mascotas, Veterinario"></textarea></label><button class="btn" data-act="nc-ok">Crear categoría</button>`)+
 (custom.length?`<div class="chips">${custom.map(c=>`<span class="chip">${esc(c.nombre)} <button class="del" data-del="${esc(c.id)}" title="Eliminar" aria-label="Eliminar">${Icons.svg('trash')}</button></span>`).join('')}</div>`:'')+`</div>`}
const fechaLarga=iso=>{if(!iso)return 'Elige una fecha';const d=new Date(iso+'T12:00:00');if(isNaN(d))return '';const t=d.toLocaleDateString('es-BO',{weekday:'long',day:'numeric',month:'long',year:'numeric'});return (iso===hoy()?'Hoy · ':'')+t.charAt(0).toUpperCase()+t.slice(1)};
const tile=(lv,n,i=0)=>`<button class="tile lv-${lv}" data-lv="${lv}" data-v="${esc(n)}" style="--i:${i};--ik:${Icons.col(n)}"><span class="ic">${Icons.svg(n)}</span><span class="tl">${esc(n)}</span></button>`;
const LV={cat:'Categoría',sub:'Subcategoría',det:'Detalle'},LVI={cat:'Origen del ingreso',sub:'Categoría',det:'Detalle'};
const lvl=(lv,list,v,a,ing)=>v?`<div class="chosen${a===lv?' pop':''}"><div class="tile big lv-${lv}"><span class="ic">${Icons.svg(v)}</span><span class="tl">${esc(v)}</span></div><button class="btn ghost sm" data-undo="${lv}">↺ Cambiar ${(ing?LVI:LV)[lv].toLowerCase()}</button></div>`
 :`<p class="muted lab">${(ing?LVI:LV)[lv]}</p><div class="tiles${a?' sweep':''}">${list.map((n,i)=>tile(lv,n,i)).join('')}</div>`;
let busy=false,mesFijo='',diaFijo=1,cal=null;
const fechaInicial=()=>mesFijo?R.fechaEnMes(mesFijo,diaFijo):hoy();
function behind(t,cb){if(busy)return;busy=true;const r=t.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 [...t.parentElement.children].forEach(x=>{if(x===t)return x.classList.add('zoom');const q=x.getBoundingClientRect();
  x.style.setProperty('--dx',cx-(q.left+q.width/2)+'px');x.style.setProperty('--dy',cy-(q.top+q.height/2)+'px');x.classList.add('away')});
 setTimeout(()=>{busy=false;cb()},400)}
function drawReg(sc){
 const g=st.tipo==='gasto',a=st.a;st.a='';
 const colTipo=(t,n)=>`<div class="tipo-col ${t==='ingreso'?'ing':'gas'}${st.tipo===t?' on':''}"><button type="button" class="ill-btn" data-tipo="${t}" tabindex="-1" aria-hidden="true">${Icons.hero(t)}</button><button type="button" class="btn-tipo${st.tipo===t?' on':''}" data-tipo="${t}">${n}</button></div>`;
 let h=`<div class="tipos${st.tipo?' c':''}">${colTipo('gasto','Gasto')}${colTipo('ingreso','Ingreso')}</div>`;
 if(st.m)h+=`<p class="ok">${esc(st.m)}</p>`;
 if(st.tipo){
  h+=`<div class="fecha-box${mesFijo?' fijo':''}"><span class="fecha-ttl">📅 Fecha del registro</span><button type="button" id="g-fecha" class="fecha-btn" data-cal="dia" aria-haspopup="dialog">${esc(fechaLarga(st.fecha))}</button><div class="fecha-fila">${mesFijo?`<span class="mes-fijo-chip">📌 Mes fijo: ${esc(R.etiquetaMes(mesFijo))}</span><button type="button" class="btn g ghost sm" data-cal="mes">Cambiar mes</button><button type="button" class="btn ghost sm" data-cal="quitar">Quitar</button>`:`<button type="button" class="btn g ghost sm" data-cal="mes">📌 Fijar mes</button>`}</div><small class="fecha-txt">${mesFijo?'Los registros nuevos usarán este mes hasta que lo quites.':'¿Varios datos de otro mes? Fíjalo una sola vez.'}</small></div>`+lvl('cat',g?tree().map(c=>c.n).concat(NUEVA):R.INGRESO.map(c=>c.n),st.cat,a,!g);
  if(st.cat===NUEVA)h+=nuevaCat();
  else if(st.cat){
   const n=(g?tree():R.INGRESO).find(c=>c.n===st.cat),subs=n?n.s:[],dets=n&&n.d[st.sub];
   if(subs.length)h+=lvl('sub',subs,st.sub,a,!g);
   if(subs.length&&st.sub&&dets)h+=lvl('det',dets,st.det,a,!g);
   if((!subs.length||st.sub)&&(!dets||st.det))
    h+=`<div class="fields${g?'':' ni'}"><label>Descripción / detalle<input id="g-desc" maxlength="120" value="${esc(st.desc)}"></label>`+(g?`<div class="cant-box">Cantidad (1 por defecto)<div class="stepper"><button type="button" data-q="-1" aria-label="Menos">−</button><input id="g-cant" type="number" min="0.01" step="any" inputmode="decimal" value="${esc(st.cant)}"><button type="button" data-q="1" aria-label="Más">+</button></div></div>`:'')+
    `<label>Monto (Bs)<input id="g-monto" type="number" step="0.01" min="0.01" inputmode="decimal" value="${esc(st.monto)}"></label></div><div class="row acts"><button class="btn" data-act="ok">Registrar ${g?'gasto':'ingreso'}</button><button class="btn ghost" data-act="no">Cancelar</button></div>`;
  }}
 $('#reg-body').innerHTML=h;
 if(a||sc){const rb=$('#reg-body'),ch2=rb.querySelectorAll('.chosen');revelar(a==='tipo'?(rb.querySelector('.tiles')||rb.querySelector('.fecha-box')):(ch2[ch2.length-1]||rb.querySelector('.tiles')||rb.querySelector('.fecha-box')),rb)}
}
async function guardar(){
 const monto=Math.round(parseFloat(st.monto)*100)/100,cant=parseFloat(st.cant);
 if(!(monto>0))return alert('Ingresa un monto mayor a 0.');if(!st.fecha)return alert('Elige una fecha.');
 if(mesFijo&&!st.fecha.startsWith(mesFijo))return alert('La fecha no está en el mes fijado ('+R.etiquetaMes(mesFijo)+'). Elige un día de ese mes o quita el mes fijo.');
 try{movs.push(await D.agregar({tipo:st.tipo,monto,fecha:st.fecha,categoria:st.cat,subcategoria:st.sub||null,detalle:st.det||null,descripcion:st.desc.trim(),cantidad:cant>0?cant:1}));
  resetReg('',`✔ ${st.tipo==='gasto'?'Gasto':'Ingreso'} registrado · ${R.fechaCorta(st.fecha)}`);todo();irArriba()}catch(e){alert('Error: '+e.message)}
}
async function crearCat(){
 const n=$('#nc-n').value.trim(),subs=[...new Set($('#nc-s').value.split(/[,;\n]/).map(x=>x.trim()).filter(Boolean))].slice(0,15);
 if(!n)return alert('Escribe un nombre.');if(custom.length>=3)return alert('Máximo 3 categorías propias.');
 if(n.toLowerCase()===NUEVA.toLowerCase()||nomCats().some(x=>x.toLowerCase()===n.toLowerCase()))return alert('Ya existe una categoría con ese nombre.');
 try{custom.push(await D.guardarCat({nombre:n,subs}));st.cat=n;st.sub=st.det='';armarCats();drawReg(1)}catch(e){alert(e.message)}
}
async function borrarCat(id){if(!confirm('¿Eliminar esta categoría? Los movimientos ya registrados se conservan.'))return;
 try{await D.eliminarCat(id);custom=custom.filter(c=>c.id!==id);st.cat='';rs.cat=rs.sub=rs.det='';armarCats();drawReg();pintaCfgCats()}catch(e){alert(e.message)}}
/* ---------- Calendario propio y mes fijo (0.11.0) ---------- */
const p2=n=>String(n).padStart(2,'0');
function accionCal(k){
 if(k==='quitar'){mesFijo='';st.fecha=hoy();drawReg();return}
 const ym=mesFijo||((k==='dia'&&st.fecha)||hoy()).slice(0,7);
 cal=k==='dia'?{modo:'dia',vista:'dias',ym,anio:+ym.slice(0,4)}:{modo:'mes',vista:'meses',ym,anio:+ym.slice(0,4)};
 pintaCal();$('#cal-back').hidden=false;document.body.style.overflow='hidden';
 const f=$('#cal-box .cal-d.sel')||$('#cal-box .cal-mm.sel')||$('#cal-box .cal-d:not(.vacio)');if(f)f.focus()}
function cerrarCal(){cal=null;$('#cal-back').hidden=true;document.body.style.overflow='';const b=$('#g-fecha');if(b)b.focus()}
function pintaCal(){const hy=hoy(),pie=(extra='')=>`<div class="cal-f">${extra}<button type="button" class="btn ghost" data-c="x">Cerrar</button></div>`;let h;
 if(cal.vista==='meses'){const act=cal.modo==='mes'?mesFijo:(st.fecha||'').slice(0,7);
  h=`<div class="cal-hint" id="cal-t">${cal.modo==='mes'?'Fijar mes para varios registros':'Elige el mes'}</div><div class="cal-h"><button type="button" class="cal-nav" data-c="ya" aria-label="Año anterior">‹</button><span class="cal-ttl">${cal.anio}</span><button type="button" class="cal-nav" data-c="ys" aria-label="Año siguiente">›</button></div><div class="cal-m">${R.MESES.map((n,i)=>{const ym=cal.anio+'-'+p2(i+1);return `<button type="button" class="cal-mm${ym===act?' sel':''}${ym===hy.slice(0,7)?' hoy':''}" data-c="m" data-ym="${ym}">${n.slice(0,3)}</button>`}).join('')}</div>`+pie(cal.modo==='mes'?'<button type="button" class="btn g" data-c="mact">Mes actual</button>':'')}
 else{const{n,off}=R.matrizMes(cal.ym),bloq=!!mesFijo,tit=R.MESES[+cal.ym.slice(5,7)-1]+' '+cal.ym.slice(0,4),
   dias=Array.from({length:off},()=>'<span class="cal-d vacio"></span>').join('')+Array.from({length:n},(_,i)=>{const f=cal.ym+'-'+p2(i+1);return `<button type="button" class="cal-d${f===st.fecha?' sel':''}${f===hy?' hoy':''}" data-c="d" data-f="${f}">${i+1}</button>`}).join('');
  h=`<div class="cal-hint" id="cal-t">${bloq?'📌 Mes fijo · elige el día':'Elige el día'}</div><div class="cal-h"><button type="button" class="cal-nav" data-c="pm" aria-label="Mes anterior"${bloq?' disabled':''}>‹</button>${bloq?`<span class="cal-ttl">${esc(tit)}</span>`:`<button type="button" class="cal-ttl" data-c="vm" title="Cambiar mes o año">${esc(tit)} ▾</button>`}<button type="button" class="cal-nav" data-c="nm" aria-label="Mes siguiente"${bloq?' disabled':''}>›</button></div><div class="cal-w">${['L','M','M','J','V','S','D'].map(x=>`<span>${x}</span>`).join('')}</div><div class="cal-g">${dias}</div>`+pie(!bloq||hy.startsWith(mesFijo)?'<button type="button" class="btn g" data-c="hoy">Hoy</button>':'')}
 $('#cal-box').innerHTML=h}
function elegirMes(ym){if(!mesFijo)diaFijo=1;mesFijo=ym;st.fecha=R.fechaEnMes(ym,diaFijo);cerrarCal();drawReg()}
function elegirDia(f){st.fecha=f;if(mesFijo)diaFijo=+f.slice(8,10);cerrarCal();drawReg()}
function clicCal(e){const b=e.target.closest('[data-c]');if(!b||!cal)return;const k=b.dataset.c;
 if(k==='x')return cerrarCal();
 if(k==='pm'||k==='nm'){cal.ym=R.sumaMes(cal.ym,k==='pm'?-1:1);return pintaCal()}
 if(k==='vm'){cal.vista='meses';cal.anio=+cal.ym.slice(0,4);return pintaCal()}
 if(k==='ya'||k==='ys'){cal.anio+=k==='ya'?-1:1;return pintaCal()}
 if(k==='m'){if(cal.modo==='mes')return elegirMes(b.dataset.ym);cal.ym=b.dataset.ym;cal.vista='dias';return pintaCal()}
 if(k==='mact')return elegirMes(hoy().slice(0,7));
 if(k==='d')return elegirDia(b.dataset.f);
 if(k==='hoy')return elegirDia(hoy())}
/* ---------- Historial ---------- */
const fila=m=>`<li><div>${esc(m.categoria)}${m.subcategoria?' › '+esc(m.subcategoria):''}${m.detalle?' › '+esc(m.detalle):''}<small>${esc(m.fecha)} · ${esc(m.descripcion)}${m.cantidad&&+m.cantidad!==1?' · x'+esc(+m.cantidad):''}</small></div><div><b class="${esc(m.tipo)}">${m.tipo==='ingreso'?'+':'−'}${F(m.monto)}</b>${m.id?` <button class="edt" data-ed="${esc(m.id)}" title="Editar" aria-label="Editar">${Icons.svg('pencil')}</button> <button class="del" data-id="${esc(m.id)}" title="Eliminar" aria-label="Eliminar">${Icons.svg('trash')}</button>`:''}</div></li>`;
let hLim=7;
function historial(){const l=R.ordenarReg(R.filtrar(movs,{q:$('#h-q').value,tipo:$('#h-tipo').value}));
 $('#h-list').innerHTML=l.length?l.slice(0,hLim).map(fila).join(''):'<li class="muted">Sin movimientos.</li>';
 const b=$('#h-mas');b.hidden=l.length<=hLim;b.textContent='Mostrar más ('+(l.length-hLim)+' restantes)'}
async function borrar(id){if(!confirm('¿Eliminar este movimiento?'))return;try{await D.eliminar(id);movs=movs.filter(m=>m.id!==id);todo()}catch(e){alert(e.message)}}
/* ---------- Pagos mensuales del año (0.12.0) ---------- */
async function cargaPlan(){try{plan=await D.listarPlan();pagos=await D.listarPagos();plOk=true}catch(e){plan=[];pagos=[];plOk=false}}
const FALTA='<li class="warn lab">Falta activar esta función en la base de datos (migración 003). Revisa las instrucciones de la actualización.</li>';
const nivTxt={excedido:'Sobrepasado',cerca:'Cerca del límite',ok:'Dentro del presupuesto'},pgTxt={pagado:'✔ Completo',vencido:'Atrasado',pronto:'Sin margen',ok:'En curso'},MI=['E','F','M','A','M','J','J','A','S','O','N','D'];
const anioPagos=()=>hoy().slice(0,4),mesesTxt=n=>n+(n===1?' mes':' meses');
const ico=n=>`<span class="pr-ic" style="--ik:${Icons.col(n)}">${Icons.svg(n)}</span>`;
const pgMeses=m=>`<div class="pg-m">${m.map((x,i)=>`<span class="${x?'on':''}" title="${R.MESES[i]}">${MI[i]}</span>`).join('')}</div>`;
function pgFila(p,an,acc){const ruta=[p.categoria,p.subcategoria,p.detalle].filter(Boolean).map(esc).join(' › '),actual=an===anioPagos(),
 aviso=p.nivel==='vencido'&&actual?`Faltan ${p.faltan} pago${p.faltan===1?'':'s'} y solo quedan ${mesesTxt(p.restan)}.`:p.nivel==='pronto'?`Debes pagar todos los meses que quedan (${p.restan}).`:p.nivel==='vencido'?`Gestión cerrada con ${p.faltan} pago${p.faltan===1?'':'s'} pendiente${p.faltan===1?'':'s'}.`:'';
 return `<li class="pg-it pg-${p.nivel}"><div><b>${esc(p.nombre)}</b> <small class="badge nv-${p.nivel}">${pgTxt[p.nivel]}</small><small>${ruta}</small><div class="pg-cnt"><b>${p.hechos}/${p.pagos_anio}</b> pagos realizados en la gestión ${esc(an)}${p.lograda?'':' · faltan '+p.faltan}</div><div class="bar"><i style="width:${p.pct}%"></i></div>${pgMeses(p.meses)}${aviso?`<small class="${p.nivel==='vencido'?'warn':''}">${aviso}</small>`:''}</div><div>${acc?`${p.pagadoMes?'':`<button class="btn sm" data-pp="${esc(p.id)}">Registrar pago</button>`}<button class="edt" data-pe="${esc(p.id)}" title="Editar" aria-label="Editar">${Icons.svg('pencil')}</button><button class="del" data-pd="${esc(p.id)}" title="Quitar" aria-label="Quitar">${Icons.svg('trash')}</button>`:''}</div></li>`}
function pintaPagos(){const el=$('#pg-list'),an=anioPagos();$('#pg-anio').textContent='('+an+')';$('#pg-add').hidden=!plOk;
 if(!plOk){el.innerHTML=FALTA;return}
 const ps=R.estadoPagos(movs,pagos,an,hoy());
 el.innerHTML=ps.length?ps.map(p=>pgFila(p,an,true)).join(''):'<li class="muted">Aún no configuraste pagos mensuales. Pulsa «Configurar pago mensual» (por ejemplo: Luz, Agua, Banco o Pensiones).</li>'}
function pagosCard(f,b,cat){if(!plOk||!pagos.length)return '';const an=f.anio||b.slice(0,4),it=pagos.filter(p=>!cat||p.categoria===cat);if(!it.length)return '';
 return `<div class="card pg-card"><h3>📅 Pagos mensuales · gestión ${esc(an)}</h3><ul class="list">${R.estadoPagos(movs,it,an,hoy()).map(p=>pgFila(p,an,false)).join('')}</ul></div>`}
let pgE=null;
function abrirPg(id){const p=id?pagos.find(x=>x.id===id):null;pgE=p?{id:p.id,cat:p.categoria,sub:p.subcategoria||'',det:p.detalle||'',n:String(p.pagos_anio)}:{id:'',cat:'',sub:'',det:'',n:'12'};msg('#pg-m','');pintaPgE();$('#pg-back').hidden=false;document.body.style.overflow='hidden'}
function cerrarPg(){pgE=null;$('#pg-back').hidden=true;document.body.style.overflow=''}
function pintaPgE(){const t=tree(),n=t.find(c=>c.n===pgE.cat),subs=n?n.s:[],dets=(n&&n.d[pgE.sub])||[];
 $('#pg-t').textContent=pgE.id?'Editar pago mensual':'Configurar pago mensual';
 $('#pg-f').innerHTML=sel('Categoría','pg-cat',t.map(c=>c.n),pgE.cat)+(subs.length?sel('Subcategoría (opcional)','pg-sub',subs,pgE.sub):'')+(dets.length?sel('Detalle (opcional)','pg-det',dets,pgE.det):'')+`<label>¿Cuántos pagos al año? (1 a 12)<input id="pg-n" type="number" min="1" max="12" inputmode="numeric" value="${esc(pgE.n)}"></label><small class="muted">Ejemplos: luz = 12 · pensión del colegio = 10 (meses de clases).</small>`}
async function guardarPg(){if(!pgE)return;const bad=t=>msg('#pg-m',t),n=Math.round(parseFloat(pgE.n)),id=pgE.id;
 if(!pgE.cat)return bad('Elige una categoría.');if(!(n>=1&&n<=12))return bad('Los pagos al año deben estar entre 1 y 12.');
 const x={nombre:(pgE.det||pgE.sub||pgE.cat).slice(0,40),categoria:pgE.cat,subcategoria:pgE.sub||null,detalle:pgE.det||null,pagos_anio:n};
 if(!id&&pagos.some(p=>p.categoria===x.categoria&&(p.subcategoria||null)===x.subcategoria&&(p.detalle||null)===x.detalle))return bad('Ya configuraste ese pago.');
 try{$('#pg-ok').disabled=true;if(id){const r=await D.actualizarPago(id,x);pagos=pagos.map(p=>p.id===id?{...p,...x,...(r||{})}:p)}else pagos.push(await D.guardarPago(x));cerrarPg();todo()}catch(e){bad('Error: '+e.message)}finally{$('#pg-ok').disabled=false}}
async function borrarPg(id){if(!confirm('¿Quitar este pago mensual? Los gastos ya registrados se conservan.'))return;try{await D.eliminarPago(id);pagos=pagos.filter(p=>p.id!==id);todo()}catch(e){alert(e.message)}}
async function pagarPg(id){const p=pagos.find(x=>x.id===id);if(!p)return;const v=prompt('Monto pagado de «'+p.nombre+'» (Bs):','');if(v===null||String(v).trim()==='')return;
 const mo=Math.round(parseFloat(String(v).replace(',','.'))*100)/100;if(!(mo>0))return alert('Monto no válido.');
 try{movs.push(await D.agregar({tipo:'gasto',monto:mo,fecha:hoy(),categoria:p.categoria,subcategoria:p.subcategoria||null,detalle:p.detalle||null,descripcion:p.nombre,cantidad:1}));todo()}catch(e){alert('Error: '+e.message)}}
function avisos(){const el=$('#g-av');if(!plOk){el.innerHTML='';return}const hy=hoy(),mes=hy.slice(0,7),
 an=R.analisisPresupuesto(R.presupuestoReal(movs.filter(m=>m.fecha.startsWith(mes)),mes+'-01',mes+'-'+p2(R.matrizMes(mes).n)),plan),pe=an.filas.filter(f=>f.nivel!=='ok'),
 pg=R.estadoPagos(movs,pagos,hy.slice(0,4),hy).filter(x=>!x.lograda&&(x.nivel==='vencido'||x.nivel==='pronto'||(x.pagos_anio===12&&!x.pagadoMes&&+hy.slice(8,10)>=25)));
 if(!pe.length&&!pg.length){el.innerHTML='';return}
 el.innerHTML=`<div class="card av"><h3>🔔 Avisos</h3><ul class="list">${pe.map(f=>`<li><span>${f.nivel==='excedido'?'⚠':'🟠'} <b>${esc(f.cat)}</b>: llevas ${F(f.real)} de ${F(f.asignado)} este mes (${R.fmtPct(f.pct,0)})${f.nivel==='excedido'?' · superaste el presupuesto por '+F(-f.dif):''}</span></li>`).join('')}${pg.map(x=>`<li><span>${x.nivel==='vencido'?'⛔':'⏰'} <b>${esc(x.nombre)}</b>: ${x.hechos}/${x.pagos_anio} pagos${x.nivel==='vencido'?' · atrasado: faltan '+x.faltan+' y quedan '+mesesTxt(x.restan):x.nivel==='pronto'?' · debes pagar todos los meses que quedan':' · aún sin pago este mes'}</span></li>`).join('')}</ul><button class="btn ghost sm" data-go="his">Ver pagos mensuales</button></div>`}
/* ---------- Metas de ahorro ---------- */
async function cargaMetas(){try{metas=await D.listarMetas();metOk=true}catch(e){metas=[];metOk=false}}
function pintaMetas(){$('#mt-form').hidden=!metOk;
 if(!metOk){$('#mt-list').innerHTML='<li class="warn lab">Falta activar esta función en la base de datos (migración 002). Revisa las instrucciones de la actualización.</li>';return}
 const ms=R.estadoMetas(metas,hoy());
 $('#mt-list').innerHTML=ms.length?ms.map(m=>`<li class="${m.lograda?'lograda':''}"><div><b>${esc(m.nombre)}</b> <small class="badge nv-${m.lograda?'pagado':m.vencida?'vencido':'ok'}">${m.lograda?'¡Meta lograda!':m.vencida?'Plazo vencido':'En camino'}</small><small>${F(m.ahorrado)} de ${F(m.objetivo)} · ${R.fmtPct(m.pct,0)}${m.lograda?'':' · faltan '+F(m.faltan)}</small><div class="bar"><i style="width:${Math.min(100,m.pct)}%"></i></div>${m.fecha_limite&&!m.lograda?`<small>Fecha límite ${R.fechaCorta(m.fecha_limite)}${m.porMes?' · ahorra ≈ '+F(m.porMes)+' por mes':''}</small>`:''}</div><div>${m.lograda?'':`<button class="btn sm" data-ma="${esc(m.id)}">Aportar</button>`}<button class="del" data-md="${esc(m.id)}" title="Quitar" aria-label="Quitar">${Icons.svg('trash')}</button></div></li>`).join(''):'<li class="muted">Aún no tienes metas. Crea la primera abajo.</li>'}
async function guardarMeta(){const n=$('#mt-n').value.trim(),o=Math.round(parseFloat($('#mt-o').value)*100)/100,fl=$('#mt-f').value,bad=t=>msg('#mt-msg',t);
 if(!n)return bad('Escribe el nombre de la meta.');if(!(o>0))return bad('Ingresa un objetivo mayor a 0.');if(fl&&fl<hoy())return bad('La fecha límite ya pasó.');
 try{metas.push(await D.guardarMeta({nombre:n.slice(0,40),objetivo:o,ahorrado:0,fecha_limite:fl||null}));$('#mt-n').value=$('#mt-o').value=$('#mt-f').value='';todo();bad('✔ Meta creada')}catch(e){bad('Error: '+e.message)}}
async function aportarMeta(id){const m=metas.find(x=>x.id===id);if(!m)return;const v=prompt('¿Cuánto aportas a «'+m.nombre+'» (Bs)? Usa un número negativo para retirar.','');if(v===null||String(v).trim()==='')return;
 const a=Math.round(parseFloat(String(v).replace(',','.'))*100)/100;if(!isFinite(a)||a===0)return alert('Monto no válido.');
 const nuevo=Math.max(0,Math.round((+m.ahorrado+a)*100)/100);try{const r=await D.actualizarMeta(id,{ahorrado:nuevo});m.ahorrado=r&&r.ahorrado!=null?+r.ahorrado:nuevo;todo()}catch(e){alert('Error: '+e.message)}}
async function borrarMeta(id){if(!confirm('¿Quitar esta meta?'))return;try{await D.eliminarMeta(id);metas=metas.filter(m=>m.id!==id);todo()}catch(e){alert(e.message)}}
/* ---------- Editar movimiento ---------- */
let ed=null;
function abrirEd(id){const m=movs.find(x=>x.id===id);if(!m)return;
 ed={id,tipo:m.tipo,fecha:m.fecha,cat:m.categoria,sub:m.subcategoria||'',det:m.detalle||'',desc:m.descripcion||'',cant:String(m.cantidad>0?+m.cantidad:1),monto:String(m.monto)};
 msg('#ed-m','');pintaEd();$('#ed-back').hidden=false;document.body.style.overflow='hidden'}
function cerrarEd(){ed=null;$('#ed-back').hidden=true;document.body.style.overflow=''}
function pintaEd(){const g=ed.tipo==='gasto',base=g?tree():R.INGRESO,cats=base.map(c=>c.n);if(ed.cat&&!cats.includes(ed.cat))cats.push(ed.cat);
 const n=base.find(c=>c.n===ed.cat),subs=n?n.s.slice():[];if(ed.sub&&!subs.includes(ed.sub))subs.push(ed.sub);
 const dets=n&&n.d[ed.sub]?n.d[ed.sub].slice():[];if(ed.det&&!dets.includes(ed.det))dets.push(ed.det);
 $('#ed-t').textContent='Editar '+(g?'gasto':'ingreso');
 $('#ed-f').innerHTML=`<label>Fecha<input type="date" id="ed-fecha" value="${esc(ed.fecha)}"></label>`+sel(g?'Categoría':'Origen del ingreso','ed-cat',cats,ed.cat)+(subs.length?sel(g?'Subcategoría':'Categoría','ed-sub',subs,ed.sub):'')+(dets.length?sel('Detalle','ed-det',dets,ed.det):'')+
 `<label>Descripción<input id="ed-desc" maxlength="120" value="${esc(ed.desc)}"></label><div class="row2${g?'':' u'}">`+(g?`<label>Cantidad<input id="ed-cant" type="number" min="0.01" step="any" inputmode="decimal" value="${esc(ed.cant)}"></label>`:'')+`<label>Monto (Bs)<input id="ed-monto" type="number" step="0.01" min="0.01" inputmode="decimal" value="${esc(ed.monto)}"></label></div>`}
async function guardarEd(){if(!ed)return;const bad=t=>msg('#ed-m',t),monto=Math.round(parseFloat(ed.monto)*100)/100,cant=parseFloat(ed.cant);
 if(!ed.fecha)return bad('Elige una fecha.');if(!ed.cat)return bad('Elige una categoría.');if(!(monto>0))return bad('Ingresa un monto mayor a 0.');
 const x={fecha:ed.fecha,categoria:ed.cat,subcategoria:ed.sub||null,detalle:ed.det||null,descripcion:ed.desc.trim(),monto,cantidad:cant>0?cant:1},id=ed.id;
 try{$('#ed-ok').disabled=true;const r=await D.actualizar(id,x);movs=movs.map(m=>m.id===id?{...m,...x,...(r||{})}:m);cerrarEd();todo()}catch(e){bad('Error: '+e.message)}finally{$('#ed-ok').disabled=false}}
/* ---------- Reportes ---------- */
const TIPOS=[['vs','Gastos vs Ingresos'],['gasto','Gastos'],['ingreso','Ingresos'],['presupuesto','Presupuesto']],GN={dia:'día',semana:'semana',mes:'mes'},PL={dia:'días',semana:'semanas',mes:'meses'};
let tipoR='',vsSel=[],rs={cat:'',sub:'',det:'',a:''},fs={anio:'',mes:'',rango:false,desde:'',hasta:''},fopen='',V={gasto:{multi:false,fold:false,todos:false},ingreso:{multi:false,fold:false,todos:false}},vsInfo=[];
function pintaTipos(){$('#f-t').innerHTML=TIPOS.map(([k,n])=>`<button type="button" class="rtc ${k}${k===tipoR?' sel':''}" data-k="${k}" aria-pressed="${k===tipoR}"><span class="rti">${Icons.rtype(k)}</span><span class="rtl">${n}</span></button>`).join('')}
const vsOn=(t,c)=>vsSel.some(x=>x.t===t&&x.c===c),vsDe=t=>vsSel.filter(x=>x.t===t).map(x=>x.c);
const ingNom=()=>R.INGRESO.map(c=>c.n).concat([...new Set(movs.filter(m=>m.tipo==='ingreso').map(m=>m.categoria))].filter(x=>!R.INGRESO.some(c=>c.n===x)));
const vsItem=(t,n)=>{const on=vsOn(t,n),f=V[t].fold?(on?' zoom':' away gone'):'';return `<button type="button" class="vs-it ${t}${on?' on':''}${f}" role="switch" aria-checked="${on}" data-vs="${t}" data-v="${esc(n)}" style="--ik:${Icons.col(n)}"><span class="ic">${Icons.svg(n)}</span><span class="tl">${esc(n)}</span><span class="sw" aria-hidden="true"><i></i></span></button>`};
function panelVs(){const col=(t,tit,ic,l)=>`<div class="vs-col ${t}" data-col="${t}"><div class="vs-h"><h3><span class="kic ${t==='gasto'?'neg':'pos'}">${Icons.svg(ic)}</span>${tit}</h3><div class="vs-chks"><label class="vs-chk"><input type="checkbox" data-vsm="${t}"${V[t].multi?' checked':''}><span>Seleccionar varios</span></label><label class="vs-chk"><input type="checkbox" data-vst="${t}"${V[t].todos?' checked':''}><span>Todos</span></label></div></div><div class="vs-g">${l.map(n=>vsItem(t,n)).join('')}</div><div class="vs-foot" data-foot="${t}"></div></div>`;
 return `<div class="vs-cols">${col('gasto','Gastos','down',tree().map(c=>c.n))}${col('ingreso','Ingresos','up',ingNom())}</div>`}
function vsFoot(t){const el=$('[data-foot="'+t+'"]');if(!el)return;el.innerHTML=V[t].multi&&vsDe(t).length>=2?`<button type="button" class="btn sm${V[t].fold?' ghost':''}" data-vsgo="${t}">${V[t].fold?'Añadir o quitar categorías':'Analizar'}</button>`:''}
function vsPlegar(c,plegar){if(!c)return;const its=[...c.querySelectorAll('.vs-it')],on=its.filter(x=>x.classList.contains('on')),off=its.filter(x=>!x.classList.contains('on'));
 const hacia=()=>{const r=(on[0]||its[0]).getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;off.forEach(x=>{const q=x.getBoundingClientRect();x.style.setProperty('--dx',cx-(q.left+q.width/2)+'px');x.style.setProperty('--dy',cy-(q.top+q.height/2)+'px');x.classList.add('away')})};
 if(plegar){hacia();on.forEach(x=>x.classList.add('zoom'));setTimeout(()=>{if(V[c.dataset.col].fold)off.forEach(x=>x.classList.add('gone'))},400)}
 else{its.forEach(x=>{x.classList.remove('gone','away','zoom');x.classList.add('nt')});hacia();void c.offsetWidth;its.forEach(x=>x.classList.remove('nt','away'))}}
function vsToggle(t,c,btn){const v=V[t],col=btn.closest('.vs-col'),nuevo=!vsSel.length,i=vsSel.findIndex(x=>x.t===t&&x.c===c),marca=on=>{btn.classList.toggle('on',on);btn.setAttribute('aria-checked',on)};
 if(v.todos&&!(v.fold&&v.multi)){v.todos=false;const q=col.querySelector('[data-vst]');if(q)q.checked=false}
 if(v.fold){if(v.multi)return;vsSel.splice(i,1);marca(false);v.fold=false;vsPlegar(col,false)}
 else if(v.multi){if(i>=0)vsSel.splice(i,1);else vsSel.push({t,c});marca(i<0);vsFoot(t)}
 else if(i>=0){vsSel.splice(i,1);marca(false)}
 else{vsSel.push({t,c});marca(true);v.fold=true;vsPlegar(col,true)}
 renderRep();if(nuevo&&vsSel.length)setTimeout(irRes,v.fold?450:0)}
function vsMulti(t,on){const v=V[t],c=$('.vs-col[data-col="'+t+'"]');v.multi=on;
 if(on){if(v.fold){v.fold=false;vsPlegar(c,false)}}
 else{if(v.todos){v.todos=false;const q=c.querySelector('[data-vst]');if(q)q.checked=false}const s=vsDe(t);if(s.length){const k=s[0];vsSel=vsSel.filter(x=>x.t!==t||x.c===k);c.querySelectorAll('.vs-it.on').forEach(x=>{if(x.dataset.v!==k){x.classList.remove('on','zoom');x.setAttribute('aria-checked','false')}});v.fold=true;vsPlegar(c,true);renderRep()}}
 vsFoot(t)}
function vsTodos(t,on){const v=V[t],c=$('.vs-col[data-col="'+t+'"]'),nuevo=!vsSel.length,todas=t==='gasto'?tree().map(x=>x.n):ingNom();
 vsSel=vsSel.filter(x=>x.t!==t);v.todos=on;
 if(on){v.multi=true;todas.forEach(n=>vsSel.push({t,c:n}));const m=c.querySelector('[data-vsm]');if(m)m.checked=true;c.querySelectorAll('.vs-it').forEach(x=>{x.classList.add('on');x.setAttribute('aria-checked','true')})}
 else c.querySelectorAll('.vs-it').forEach(x=>{x.classList.remove('on','zoom');x.setAttribute('aria-checked','false')});
 if(v.fold){v.fold=false;vsPlegar(c,false)}
 vsFoot(t);renderRep();if(nuevo&&vsSel.length)setTimeout(irRes,0)}
function vsAnalizar(t){const v=V[t];v.fold=!v.fold;vsPlegar($('.vs-col[data-col="'+t+'"]'),v.fold);vsFoot(t);if(v.fold)setTimeout(irRes,450)}
function armarCats(){const a=rs.a;rs.a='';if(!tipoR){$('#f-cats').innerHTML='';return}if(tipoR==='vs'){$('#f-cats').innerHTML=panelVs();vsFoot('gasto');vsFoot('ingreso');return}if(tipoR==='presupuesto'){$('#f-cats').innerHTML='';return}
 const g=tipoR==='gasto',n=(g?tree():R.INGRESO).find(c=>c.n===rs.cat),subs=n?n.s:[],dets=n&&n.d[rs.sub],leg=[...new Set(movs.filter(m=>m.tipo==='ingreso').map(m=>m.categoria))].filter(x=>!R.INGRESO.some(c=>c.n===x));
 let h=lvl('cat',g?tree().map(c=>c.n):R.INGRESO.map(c=>c.n).concat(leg),rs.cat,a,!g);
 if(rs.cat&&subs.length)h+=lvl('sub',subs,rs.sub,a,!g);if(rs.sub&&dets)h+=lvl('det',dets,rs.det,a,!g);
 $('#f-cats').innerHTML=h}
/* Filtros fijos: Año / Mes / Rango */
function pintaFil(){const as=R.aniosConDatos(movs),base=fs.anio?movs.filter(x=>x.fecha.startsWith(fs.anio)):movs,ms=[...new Set(base.map(x=>x.fecha.slice(5,7)))].sort(),pk=fs.rango?'rango':fopen,
 mn=k=>chico()?R.MESES[+k-1].slice(0,3):R.MESES[+k-1],
 b=(k,t,on)=>`<button type="button" class="fbtn${on?' on':''}${pk===k?' open':''}" data-fb="${k}" aria-expanded="${pk===k}">${t}</button>`,
 cp=(a,v,t,on)=>`<button type="button" class="fchip${on?' on':''}" ${a}="${v}">${t}</button>`;
 $('#f-btns').innerHTML=b('anio','Año'+(fs.anio?': '+fs.anio:''),!!fs.anio&&!fs.rango)+b('mes','Mes'+(fs.mes?': '+mn(fs.mes):''),!!fs.mes&&!fs.rango)+b('rango','Rango',fs.rango);
 const p=$('#f-pan');p.hidden=!pk;
 p.innerHTML=pk==='anio'?cp('data-fy','','Todos',!fs.anio)+as.map(y=>cp('data-fy',y,y,fs.anio===y)).join(''):pk==='mes'?cp('data-fm','','Todos',!fs.mes)+ms.map(k=>cp('data-fm',k,R.MESES[+k-1],fs.mes===k)).join(''):pk==='rango'?`<label>Desde<input id="f-d" type="date" value="${esc(fs.desde)}"></label><label>Hasta<input id="f-h" type="date" value="${esc(fs.hasta)}"></label>`:''}
function limpiaFil(){fs={anio:R.anioResumen(hoy(),movs),mes:'',rango:false,desde:'',hasta:''};fopen='';tipoR='';vsSel=[];V={gasto:{multi:false,fold:false,todos:false},ingreso:{multi:false,fold:false,todos:false}};rs={cat:'',sub:'',det:'',a:''};pintaFil();pintaTipos();armarCats();renderRep()}
const filtros=()=>({anio:fs.rango?'':fs.anio,mes:fs.rango?'':fs.mes,desde:fs.rango?fs.desde:'',hasta:fs.rango?fs.hasta:'',tipo:(tipoR==='vs'||tipoR==='presupuesto')?'':tipoR,cats:rs.cat?[rs.cat]:[],sub:rs.sub,det:rs.det});
const NOM={gastos:'Gastos',ingresos:'Ingresos'},chico=()=>window.innerWidth<=760,recorta=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
let PDFM=false;
const tema=fo=>{const osc=fo||(!PDFM&&matchMedia('(prefers-color-scheme:dark)').matches),cv=getComputedStyle(document.documentElement).getPropertyValue('--c').trim();
 return osc?{mu:'#dbe1ff',tx:'#f4f6ff',bd:'rgba(200,210,255,.14)',c:cv,gastos:'#c75bff',ingresos:'#00f8ff',osc,gi:['#00f8ff','#3b82ff'],gg:['#c75bff','#ff4fd8'],gb:['#4254FF','#00C0F5'],okc:'#22c55e',rampa:['#2AFAE9','#00C0F5','#4254FF','#8708E8','#D604FF','#fe9900']}:{mu:'#3b4466',tx:'#0b1130',bd:'rgba(11,17,48,.10)',c:PDFM?'#ffffff':cv,gastos:'#9a17dc',ingresos:'#0a86a8',osc,gi:['#0a86a8','#2563eb'],gg:['#9a17dc','#d6249f'],gb:['#3848DA','#02A1D2'],okc:'#16a34a',rampa:['#24D0C8','#02A1D2','#3848DA','#710AC7','#B206DA','#e07b00']}};
let TM=tema();
const DPR0=()=>Math.max(2,window.devicePixelRatio||1);
if(window.Chart){Chart.defaults.devicePixelRatio=DPR0();Chart.defaults.font.family='system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'}
if(window.Chart)Chart.register({id:'fondo',beforeDraw(c){const x=c.ctx;x.save();x.globalCompositeOperation='destination-over';x.fillStyle=TM.c;x.fillRect(0,0,c.width,c.height);x.restore()}});
const rotulos={id:'rotulos',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data;x.save();x.fillStyle=o.color;x.font='600 '+o.size+'px system-ui,sans-serif';x.textBaseline='middle';x.textAlign='left';
 m.data.forEach((b,i)=>x.fillText('Bs '+R.fmtCorto(d[i])+' · '+R.fmtPct(R.pct(d[i],o.suma),0),b.x+6,b.y));x.restore()}};
const ley=()=>({position:'bottom',labels:{usePointStyle:true,pointStyle:'circle',boxWidth:7,boxHeight:7,padding:16,color:TM.mu}});
const tip={padding:10,cornerRadius:8,boxPadding:4,callbacks:{label:c=>' '+(c.dataset.label?c.dataset.label+': ':'')+F(c.chart.options.indexAxis==='y'?c.parsed.x:c.parsed.y)}};
const gx=()=>({grid:{display:false},border:{display:false},ticks:{maxRotation:chico()?45:0,autoSkip:true,autoSkipPadding:10,padding:6}}),gy=()=>({beginAtZero:true,border:{display:false},grid:{color:TM.bd,lineWidth:1,drawTicks:false},ticks:{padding:8,callback:v=>R.fmtCorto(v)}});
const opt=(x={})=>({maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:ley(),tooltip:tip},scales:{x:gx(),y:gy()},...x});
const barH=(id,l,c,suma)=>new Chart($(id),{type:'bar',plugins:[rotulos],data:{labels:l.map(x=>x.cat),datasets:[{data:l.map(x=>x.total),backgroundColor:c,borderRadius:6,maxBarThickness:26}]},
 options:{indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:chico()?100:124}},plugins:{legend:{display:false},tooltip:{callbacks:{label:q=>' '+F(q.parsed.x)+' · '+R.fmtPct(R.pct(q.parsed.x,suma))}},rotulos:{on:true,color:TM.tx,size:chico()?11:12,suma}},
  scales:{x:gy(),y:{grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?17:30)}}}}}});
const ds=(s,keys)=>keys.map(k=>({label:NOM[k],data:s.map(x=>x[k]),backgroundColor:TM[k],borderRadius:4,maxBarThickness:34}));
const barM=(id,pm)=>new Chart($(id),{type:'bar',data:{labels:pm.map(m=>R.mesCorto(m.mes)),datasets:ds(pm,['ingresos','gastos'])},options:opt()});
const barS=(id,s,keys)=>new Chart($(id),{type:'bar',data:{labels:s.map(x=>x.label),datasets:ds(s,keys)},options:opt()});
const lineEvo=(id,s,keys)=>new Chart($(id),{type:'line',data:{labels:s.map(x=>x.label),datasets:keys.flatMap(k=>{const v=s.map(x=>x[k]);return[{label:NOM[k],data:v,borderColor:TM[k],backgroundColor:TM[k]+'26',fill:keys.length===1,tension:.35,borderWidth:2.5,borderCapStyle:'round',borderJoinStyle:'round',pointBackgroundColor:TM[k],pointBorderColor:TM.c,pointBorderWidth:2,pointRadius:s.length>40?0:3.5,pointHoverRadius:6},{label:'Tendencia '+NOM[k].toLowerCase(),data:R.tendencia(v).linea,borderColor:TM[k],borderDash:[6,5],pointRadius:0,borderWidth:1.75,fill:false}]})},options:opt()});
const badge=v=>`<small class="badge">${{sube:'↗ en aumento',baja:'↘ en descenso',estable:'→ estable'}[R.tendencia(v).dir]}</small>`;
const card=(h,id,hl,ht)=>`<div class="card${hl?' hl':''}"><h3>${h}</h3><div class="cv"${ht?` style="height:${ht}px"`:''}><canvas id="${id}"></canvas></div></div>`;
const sub=t=>`<span class="sub">${t}</span>`;
function renderRep(){
 const f=filtros(),o=$('#rep-out'),fm=$('#f-msg'),mal=f.desde&&f.hasta&&f.desde>f.hasta;Object.values(ch).forEach(c=>c.destroy());ch={};
 fm.hidden=!mal;fm.textContent=mal?'La fecha «Desde» es posterior a «Hasta». Corrígela para ver el reporte.':'';if(mal){o.innerHTML='';return}
 $('#pdf').hidden=!tipoR||(tipoR==='vs'&&!vsSel.length);
 if(!tipoR){o.innerHTML='<div class="card vacio"><b>Elige un tipo de reporte</b><span class="muted">Pulsa «Gastos vs Ingresos», «Gastos» o «Ingresos» para empezar.</span></div>';return}
 TM=tema();Chart.defaults.color=TM.mu;Chart.defaults.font.size=chico()?13:12;
 const l=R.filtrar(movs,f);
 if(tipoR==='presupuesto'){presupuestoVista(l.filter(m=>m.tipo==='gasto'),f);return}
 if(!l.length){o.innerHTML='<div class="card vacio"><b>Sin datos para este filtro</b><span class="muted">Prueba con otro mes o pulsa «Limpiar».</span></div>';return}
 const[a,b]=R.rango(f,l,hoy()),gr=R.granularidad(f,a,b),s1=R.serie(l,gr[0],a,b),s2=R.serie(l,gr[1],a,b),t=R.totales(l,a,b),sem=Math.max(1,R.dias(a,b)/7);
 const e1=`Evolución por ${GN[gr[0]]}`,e2=`Por ${GN[gr[1]]}`,per=`<div class="perio">📅 ${R.fechaCorta(a)} – ${R.fechaCorta(b)} · ${t.n} movimiento${t.n===1?'':'s'}</div>`;
 if(tipoR==='vs'){
  if(!vsSel.length){o.innerHTML='<div class="card vacio"><b>Activa categorías para comparar</b><span class="muted">Usa los interruptores de Gastos (izquierda) e Ingresos (derecha). Si activas la misma categoría en ambos lados (por ejemplo Rilan) se comparan en un mismo bloque.</span></div>';return}
  if(soloTipo()){gastosBloques(l,a,b,o,soloTipo());return}
  mezclaBloque(l,a,b,o);return}
 const gk=tipoR==='gasto'?'gastos':'ingresos',tot=t[gk],W=tipoR==='gasto'?'Gasto':'Ingreso',ev=card(e1+' '+badge(s1.map(x=>x[gk])),'c2');
 if(!f.cats.length){const pc=R.porCategoria(l,tipoR),p0=pc[0];
  o.innerHTML=per+`<div class="grid">${K(W+' total',F(tot),tipoR,'a',tipoR)}${K(W+' promedio por mes',F(t[gk==='gastos'?'gMes':'iMes']),'','o','calendar')}${K(W+' promedio por semana',F(tot/sem),'','p','calweek')}${K(W+' promedio diario',F(tot/R.dias(a,b)),'','a','sun')}${K('Movimientos',t.n,'','a','list')}${K(tipoR==='gasto'?'Categoría más fuerte':'Fuente más fuerte',p0?F(p0.total)+sub(esc(p0.cat)+' · '+R.fmtPct(R.pct(p0.total,tot))+' del total'):'—','','p','trophy')}</div>
  <div class="duo">${card(W+'s por categoría','c1',1,Math.max(280,pc.length*30+40))}${ev}</div>${card(e2,'c3')}`;
  ch.c1=barH('#c1',pc,TM[gk],tot)}
 else{const fr=R.frecuentes(l),p=fr[0],base=R.totales(R.filtrar(movs,{...f,cats:[],sub:'',det:''}))[gk];
  o.innerHTML=per+`<h2>${[f.cats[0],f.sub,f.det].filter(Boolean).map(esc).join(' › ')}</h2><div class="grid">${K(W+' total',F(tot),tipoR,'a',tipoR)}${K('Participación',R.fmtPct(R.pct(tot,base))+sub('de tus '+gk+' del periodo'),'','o','scale')}${K(W+' más frecuente',F(p.total)+sub(esc(p.k)+' · '+p.n+'×'),'','p','repeat')}${K(W+' promedio por semana',F(tot/sem),'','o','calweek')}${K('Movimientos',t.n,'','a','list')}${K('Promedio por movimiento',F(tot/t.n),'','a','coin')}</div>
  <div class="duo">${card(W+'s más recurrentes y sus montos','c1',1,Math.max(240,Math.min(8,fr.length)*34+40))}${ev}</div>${card(e2,'c3')}`;
  ch.c1=barH('#c1',fr.slice(0,8).map(x=>({cat:`${x.k} (${x.n}×)`,total:x.total})),TM[gk],tot)}
 ch.c2=lineEvo('#c2',s1,[gk]);ch.c3=barS('#c3',s2,[gk]);if(tipoR==='gasto')o.insertAdjacentHTML('beforeend',pagosCard(f,b,f.cats[0]||''));
}
/* ---------- Reportes › Presupuesto (0.12.0) ---------- */
let PRV=null;const prOpen=new Set();
const linea100={id:'linea100',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.scales.x.getPixelForValue(100),a=c.chartArea,g=c.ctx;g.save();g.setLineDash([6,5]);g.strokeStyle=o.color;g.lineWidth=2;g.beginPath();g.moveTo(x,a.top);g.lineTo(x,a.bottom);g.stroke();g.restore()}};
const rotPct={id:'rotPct',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data;x.save();x.fillStyle=o.color;x.font='700 '+o.size+'px system-ui,sans-serif';x.textBaseline='middle';x.textAlign='left';m.data.forEach((b,i)=>x.fillText(R.fmtPct(d[i],0),b.x+6,b.y));x.restore()}};
const rangoPres=(f,l)=>{let[a,b]=R.rango(f,l,hoy());if(!a)a=hoy().slice(0,4)+'-01-01';if(!b)b=hoy();return[a,b]};
const colNivel=n=>n==='excedido'?'#ff3b6b':n==='cerca'?'#fe9900':TM.okc;
const msgPres=(f,mens)=>{const m=mens?' en promedio al mes':' al mes';return f.nivel==='excedido'?`Sobrepasaste el presupuesto: gastas ${F(f.real)} frente a ${F(f.asignado)}${m} (exceso de ${F(-f.dif)}).`:f.nivel==='cerca'?`Estás al ${R.fmtPct(f.pct,0)} de tu presupuesto de ${esc(f.cat)}: te quedan ${F(f.dif)}${m}.`:`Estás dentro del presupuesto: te sobran ${F(f.dif)}${m}.`};
function presupuestoVista(lg,f){const o=$('#rep-out'),[a,b]=rangoPres(f,lg),real=R.presupuestoReal(lg,a,b);PRV={lg,a,b,real};TM=tema();
 const per=`<div class="perio">📅 ${R.fechaCorta(a)} – ${R.fechaCorta(b)} · ${real.meses.toFixed(1).replace('.',',')} meses equivalentes · ${lg.length} gasto${lg.length===1?'':'s'}</div>`;
 if(!plOk){o.innerHTML=per+'<div class="card vacio"><b>Falta activar esta función en la base de datos</b><span class="muted">Ejecuta la migración 003 (ver README) y recarga la página.</span></div>';return}
 const vr=x=>{const e=plan.find(p=>p.categoria===x.c&&(p.subcategoria||null)===(x.s||null));return e?e.monto:''},
  izq=real.lista.length?`<ul class="list">${real.lista.map(c=>`<li class="pr-r"><details><summary><span class="pr-n">${ico(c.cat)}${esc(c.cat)} <small class="muted">▾</small></span><b>${F(c.prom)}</b></summary><ul class="pr-subl">${c.subs.map(x=>`<li><span class="pr-n">${ico(x.sub)}${esc(x.sub)}</span><span>${F(x.prom)}</span></li>`).join('')}</ul></details></li>`).join('')}<li class="pr-tot"><span>Total mensual promedio</span><b>${F(real.prom)}</b></li></ul>`:'<p class="muted">Sin gastos en este periodo.</p>',
  der=tree().map(c=>{const rc=real.lista.find(x=>x.cat===c.n),ph=x=>x?Math.round(x.prom):0,tieneS=plan.some(p=>p.categoria===c.n&&p.subcategoria);
   return `<label class="pr-row"><span class="pr-n">${ico(c.n)}${esc(c.n)}</span><input type="number" min="0" step="0.01" inputmode="decimal" data-pc="${esc(c.n)}" data-ps="" value="${vr({c:c.n})}" placeholder="${ph(rc)}"></label>`+(c.s.length?`<details class="pr-sd" data-od="${esc(c.n)}"${tieneS||prOpen.has(c.n)?' open':''}><summary>Subcategorías de ${esc(c.n)}</summary>${c.s.map(s2=>{const sr=rc&&rc.subs.find(x=>x.sub===s2);return `<label class="pr-row s"><span class="pr-n">${ico(s2)}${esc(s2)}</span><input type="number" min="0" step="0.01" inputmode="decimal" data-pc="${esc(c.n)}" data-ps="${esc(s2)}" value="${vr({c:c.n,s:s2})}" placeholder="${ph(sr)}"></label>`}).join('')}</details>`:'')}).join('');
 o.innerHTML=per+`<div class="pr-cols"><section class="card pr-col"><h3>📊 Presupuesto real promedio</h3><p class="muted lab">Promedio mensual de lo que realmente gastaste en el periodo (total ÷ meses equivalentes). Toca una categoría para ver sus subcategorías.</p>${izq}</section>
 <section class="card pr-col"><h3>🎯 Presupuesto asignado</h3><p class="muted lab">Escribe cuánto quieres gastar al mes (Bs). Deja vacío para quitarlo. Lo gris es tu promedio real, como referencia. Si fijas la categoría y también subcategorías, el análisis usa el monto de la categoría.</p>${der}<div class="pr-acts"><button class="btn ghost sm" type="button" data-pa="1">Rellenar con el promedio real</button><small id="pr-st" class="muted"></small></div></section></div>
 <h2 class="pr-an-h">Análisis: presupuesto asignado vs real promedio</h2><div id="pr-an"></div>`;
 analisisPres();o.insertAdjacentHTML('beforeend',pagosCard(f,b,''))}
function analisisPres(){const el=$('#pr-an');if(!el||!PRV)return;['p1','p2','p3'].forEach(k=>{if(ch[k]){ch[k].destroy();delete ch[k]}});
 const{real,a,b,lg}=PRV,an=R.analisisPresupuesto(real,plan),mens=real.meses>1.05;
 if(!an.filas.length){el.innerHTML='<div class="card vacio"><b>Aún no asignas presupuesto</b><span class="muted">Escribe un monto mensual en «Presupuesto asignado» o usa «Rellenar con el promedio real». Aquí verás el análisis.</span></div>';return}
 TM=tema();const multi=real.meses>1.5,con=new Set(an.filas.map(x=>x.cat)),lp=lg.filter(m=>con.has(m.categoria)),hy=hoy(),mesAct=a.slice(0,7)===b.slice(0,7)&&b.slice(0,7)===hy.slice(0,7);
 let proy='';if(mesAct){const pj=R.proyeccionMes(lp.reduce((x,m)=>x+ +m.monto,0),hy);proy=K('Proyección de cierre del mes',F(pj)+sub('vs '+F(an.asignado)+' · '+(pj>an.asignado?'te pasarías por '+F(pj-an.asignado):'quedarías '+F(an.asignado-pj)+' por debajo')),pj>an.asignado?'gasto':'ingreso','p','trend')}
 const vd=an.excedidas?`⛔ ${an.excedidas} de ${an.filas.length} categoría${an.filas.length===1?'':'s'} sobrepasa${an.excedidas===1?'':'n'} su presupuesto.`+(an.cercanas?` Además ${an.cercanas} está${an.cercanas===1?'':'n'} cerca del límite.`:''):an.cercanas?`🟠 Ninguna categoría se pasó, pero ${an.cercanas} está${an.cercanas===1?'':'n'} cerca del límite (80 % o más).`:'✅ Estás dentro del presupuesto en todas tus categorías.',
  vcl=an.excedidas?'mal':an.cercanas?'neu':'',
  filas=an.filas.map(x=>`<li class="pr-${x.nivel}"><div><span class="pr-n">${ico(x.cat)}<b>${esc(x.cat)}</b></span> <small class="badge nv-${x.nivel}">${nivTxt[x.nivel]}</small><small>${msgPres(x,mens)}</small><div class="bar"><i style="width:${Math.min(100,x.pct)}%"></i></div>${x.desajuste?`<small class="warn">Ojo: las subcategorías suman ${F(x.sumaSubs)}, más que el presupuesto de la categoría.</small>`:''}${x.subs.length?`<ul class="pr-subl">${x.subs.map(q=>`<li><span class="pr-n">${ico(q.sub)}${esc(q.sub)}: ${F(q.real)} de ${F(q.asignado)}</span><b class="${q.nivel==='excedido'?'gasto':q.nivel==='cerca'?'':'ingreso'}">${R.fmtPct(q.pct,0)}</b></li>`).join('')}</ul>`:''}</div><b>${R.fmtPct(x.pct,0)}</b></li>`).join(''),
  sinp=an.sinPres.length?`<p class="muted lab">Sin presupuesto asignado: ${an.sinPres.slice(0,6).map(c=>esc(c.cat)+' ('+F(c.prom)+')').join(' · ')}${an.sinPres.length>6?' …':''}. Total ${F(an.sinProm)} al mes.</p>`:'',
  ht=Math.max(300,an.filas.length*50+80);
 el.innerHTML=`<div class="vd ${vcl}">${vd}</div><div class="grid">${K('Presupuesto asignado',F(an.asignado)+sub('por mes · '+an.filas.length+' categoría'+(an.filas.length===1?'':'s')),'','a','coin')}${K('Real promedio'+(mens?' mensual':' del mes'),F(an.real)+sub('en esas categorías'),'gasto','p','down')}${K('Diferencia',F(an.dif)+sub(an.dif>=0?'te sobra al mes':'te excedes al mes'),an.dif>=0?'ingreso':'gasto','o','scale')}${K('Uso del presupuesto',R.fmtPct(an.pct)+sub(an.excedidas?an.excedidas+' sobrepasada'+(an.excedidas===1?'':'s'):'ninguna sobrepasada'),'','a','trophy')}${proy}</div>
 <div class="card"><h3>Estado por categoría</h3><ul class="list pr-av">${filas}</ul>${sinp}</div>
 <div class="gb-ch solo">${card('Asignado vs real promedio (Bs al mes)','p1',0,ht)}${card('% del presupuesto usado (línea = 100 %)','p2',0,ht)}${card(multi?'Gasto mensual vs presupuesto asignado':'Gasto acumulado del mes vs presupuesto','p3',0,ht)}</div>`;
 const lab=an.filas.map(x=>x.cat),ys={grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?16:24)}}};
 ch.p1=new Chart($('#p1'),{type:'bar',plugins:[neon],data:{labels:lab,datasets:[{label:'Asignado',data:an.filas.map(x=>x.asignado),backgroundColor:gradBar(TM.gb[0],TM.gb[1]),borderRadius:8,borderSkipped:false,maxBarThickness:16},{label:'Real promedio',data:an.filas.map(x=>x.real),backgroundColor:gradBar(TM.gg[0],TM.gg[1]),borderRadius:8,borderSkipped:false,maxBarThickness:16}]},options:{indexAxis:'y',maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},plugins:{legend:ley(),tooltip:tip,neon:{on:TM.osc,blur:10,color:'#6d8bff'}},scales:{x:gy(),y:ys}}});
 const mx=Math.max(...an.filas.map(x=>x.pct));
 ch.p2=new Chart($('#p2'),{type:'bar',plugins:[linea100,rotPct],data:{labels:lab,datasets:[{data:an.filas.map(x=>x.pct),backgroundColor:an.filas.map(x=>colNivel(x.nivel)),borderRadius:8,borderSkipped:false,maxBarThickness:22}]},options:{indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:46}},plugins:{legend:{display:false},tooltip:{callbacks:{label:q=>' '+R.fmtPct(q.parsed.x)+' del presupuesto'}},linea100:{on:true,color:TM.tx},rotPct:{on:true,color:TM.tx,size:chico()?11:12}},scales:{x:{...gy(),max:Math.max(120,Math.ceil(mx/10)*10+10),ticks:{padding:8,callback:v=>v+'%'}},y:ys}}});
 const lim=(n,v)=>({label:'Presupuesto asignado',data:v.map(()=>an.asignado),borderColor:TM.gb[1],borderDash:[6,5],borderWidth:2.5,pointRadius:0,fill:false});
 if(multi){const sr=R.serie(lp,'mes',a,b);ch.p3=new Chart($('#p3'),{type:'bar',data:{labels:sr.map(x=>x.label),datasets:[{type:'bar',label:'Gasto real',data:sr.map(x=>x.gastos),backgroundColor:gradV(TM.gg[0],TM.gg[1]),borderRadius:8,borderSkipped:false,maxBarThickness:34},{type:'line',...lim(0,sr)}]},options:opt()})}
 else{let c=0;const sr=R.serie(lp,'dia',a,b).filter(x=>!mesAct||x.k<=hy),v=sr.map(x=>(c+=x.gastos,Math.round(c*100)/100));ch.p3=new Chart($('#p3'),{type:'line',data:{labels:sr.map(x=>x.label),datasets:[{label:'Gasto acumulado',data:v,borderColor:TM.gg[0],backgroundColor:TM.gg[0]+'30',fill:true,tension:.3,borderWidth:3,pointRadius:0,pointHoverRadius:5},lim(0,sr)]},options:opt()})}}
async function guardarPlanInput(i){const c=i.dataset.pc,s2=i.dataset.ps||null,v=Math.round(parseFloat(String(i.value).replace(',','.'))*100)/100,ex=plan.find(x=>x.categoria===c&&(x.subcategoria||null)===s2),sm=$('#pr-st');
 try{if(!(v>0)){if(ex){await D.eliminarPlan(ex.id);plan=plan.filter(x=>x!==ex)}i.value=''}
  else{const r=await D.guardarPlan({categoria:c,subcategoria:s2,monto:v});if(ex)Object.assign(ex,r);else plan.push(r);i.value=v}
  if(sm)sm.textContent='✔ Guardado';analisisPres();avisos()}catch(e){if(sm)sm.textContent='Error: '+e.message}}
async function rellenarPlan(){if(!PRV)return;const ya=new Set(plan.map(p=>p.categoria)),nu=PRV.real.lista.filter(c=>!ya.has(c.cat)&&c.prom>=1);
 if(!nu.length)return alert('Todas tus categorías con gastos ya tienen presupuesto.');
 if(!confirm('Se asignará el promedio real (redondeado a 10 Bs) a '+nu.length+' categoría'+(nu.length===1?'':'s')+' sin presupuesto. ¿Continuar?'))return;
 try{for(const c of nu)plan.push(await D.guardarPlan({categoria:c.cat,subcategoria:null,monto:Math.max(10,Math.round(c.prom/10)*10)}));renderRep();avisos()}catch(e){alert('Error: '+e.message)}}
function pdfPres(){let pg=[];PDFM=true;Chart.defaults.devicePixelRatio=3;
 try{renderRep();pg=Object.values(ch).map(x=>({img:x.toBase64Image('image/png',1),w:x.canvas.width,h:x.canvas.height}))}finally{PDFM=false;Chart.defaults.devicePixelRatio=DPR0();renderRep()}
 if(!pg.length)return alert('No hay datos para exportar. Asigna presupuestos primero.');const f=filtros(),[a,b]=rangoPres(f,R.filtrar(movs,{...f,tipo:'gasto'}));
 PDF.generarBloques({titulo:'Presupuesto asignado vs real',archivo:'reporte-presupuesto.pdf',periodo:'Periodo: '+R.fechaCorta(a)+' a '+R.fechaCorta(b),paginas:pg})}
/* ---------- Gastos vs Ingresos: solo categorías de gasto (0.8.0) ---------- */
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mezcla=(a,b,t)=>{const x=hx(a),y=hx(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('')},
 heat=f=>{const r=TM.rampa,p=Math.max(0,Math.min(1,f))*(r.length-1),i=Math.min(r.length-2,Math.floor(p));return mezcla(r[i],r[i+1],p-i)},fv=(v,mn,mx)=>mx>mn?(v-mn)/(mx-mn):1;
const pctAnillo={id:'pctAnillo',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data,s=d.reduce((p,q)=>p+q,0);x.save();x.font='700 '+o.size+'px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle=o.color;x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=4;
 m.data.forEach((a,i)=>{const p=R.pct(d[i],s);if(p<5)return;const q=a.getCenterPoint();x.fillText(R.fmtPct(p,0),q.x,q.y)});x.restore()}};
const barSub=(id,l,suma)=>{const v=l.map(x=>x.total),mn=Math.min(...v),mx=Math.max(...v);return new Chart($(id),{type:'bar',plugins:[rotulos],data:{labels:l.map(x=>x.cat),datasets:[{data:v,backgroundColor:v.map(x=>heat(fv(x,mn,mx))),borderRadius:6,maxBarThickness:28}]},
 options:{indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:PDFM?(chico()?100:124):8}},plugins:{legend:{display:false},tooltip:{callbacks:{label:q=>' '+F(q.parsed.x)+' · '+R.fmtPct(R.pct(q.parsed.x,suma))}},rotulos:{on:PDFM,color:TM.tx,size:chico()?11:12,suma}},
  scales:{x:gy(),y:{grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?16:24)}}}}}})};
const anillo=(id,l,suma)=>{const v=l.map(x=>x.total),mn=Math.min(...v),mx=Math.max(...v),lg=ley();lg.labels={...lg.labels,padding:8,font:{size:11}};return new Chart($(id),{type:'doughnut',plugins:[pctAnillo],data:{labels:l.map(x=>x.cat),datasets:[{data:v,backgroundColor:v.map(x=>heat(fv(x,mn,mx))),borderColor:TM.c,borderWidth:2,spacing:1,borderRadius:4,hoverOffset:6}]},
 options:{maintainAspectRatio:false,animation:false,cutout:'50%',plugins:{legend:lg,tooltip:{callbacks:{label:q=>' '+q.label+': '+F(q.parsed)+' · '+R.fmtPct(R.pct(q.parsed,suma))}},pctAnillo:{on:true,size:chico()?12:13,color:'#fff'}}}})};
const lineaHeat=(id,s,gk)=>{const v=s.map(x=>x[gk]),mn=Math.min(...v),mx=Math.max(...v),col=y=>heat(fv(y,mn,mx));return new Chart($(id),{type:'line',data:{labels:s.map(x=>x.label),datasets:[
 {label:NOM[gk],data:v,borderColor:TM[gk],segment:{borderColor:q=>col((q.p0.parsed.y+q.p1.parsed.y)/2)},backgroundColor:'transparent',tension:.35,borderWidth:3,borderCapStyle:'round',pointBackgroundColor:v.map(col),pointBorderColor:TM.c,pointBorderWidth:2,pointRadius:s.length>40?0:4,pointHoverRadius:6},
 {label:'Tendencia',data:R.tendencia(v).linea,borderColor:TM.mu,borderDash:[6,5],pointRadius:0,borderWidth:1.75,fill:false}]},options:opt()})};
const COLH=['#0891b2','#af11f2','#e07b00','#16a34a'],COLV=['var(--ac)','var(--hl)','#fe9900','var(--c-gr)'],UNN={dia:'diario',semana:'semanal',mes:'mensual'},UNP={dia:'día',semana:'semana',mes:'mes'};
const soloTipo=()=>vsSel.length&&vsSel.every(x=>x.t==='gasto')?'gasto':vsSel.length&&vsSel.every(x=>x.t==='ingreso')?'ingreso':'';
function gastosBloques(l,a,b,o,tp){const g=tp==='gasto',gk=g?'gastos':'ingresos',Wp=g?'Gastos':'Ingresos',W=g?'Gasto':'Ingreso',glob=!!V[tp].todos,cats=glob?['']:vsSel.map(x=>x.c),un=R.unidadProm(a,b),solo=cats.length===1,jobs=[];vsInfo=[];
 const per=`<div class="perio">📅 ${R.fechaCorta(a)} – ${R.fechaCorta(b)} · análisis por ${UNP[un]}</div>`;
 const html=cats.map((c,k)=>{const mov=l.filter(m=>m.tipo===tp&&(glob||m.categoria===c)),bc=COLV[k%4],nom=glob?'Resumen global de '+Wp.toLowerCase():c,ti=`<h2 class="gb-t"><span class="kic ${g?'neg':'pos'}">${Icons.svg(glob?tp:c)}</span>${esc(nom)}</h2>`;
  if(!mov.length){vsInfo.push({c:nom,vacio:true});return `<section class="gb" style="--bc:${bc}">${ti}<div class="card vacio"><b>Sin ${Wp.toLowerCase()} en este periodo</b><span class="muted">No hay registros con el filtro actual.</span></div></section>`}
  const tt=R.totales(mov,a,b)[gk],pf=R.promedioFlex(tt,a,b),mf=R.masFrecuente(mov,glob?'categoria':'subcategoria'),ps=glob?R.porCategoria(mov,tp):R.porSubcat(mov),sr=R.serie(mov,un,a,b),rg=n=>n+' registro'+(n===1?'':'s'),
   cards=[{l:Wp+' totales',v:F(tt),s:rg(mov.length),cl:'a',ic:g?'down':'up',c:tp},{l:W+' promedio '+UNN[un],v:F(pf.valor),s:'por '+UNP[un],cl:'o',ic:'calendar',c:''},{l:W+' más frecuente',v:mf.k,s:rg(mf.n)+' · '+F(mf.total),cl:'p',ic:'repeat',c:''}],
   ht=Math.max(300,ps.length*30+60),id=x=>'g'+k+x,pn=glob?'Categorías':'Subcategorías';
  vsInfo.push({c:nom,bc:COLH[k%4],cards,ids:[id('a'),id('b'),id('c')]});
  jobs.push(()=>{ch[id('a')]=barSub('#'+id('a'),ps,tt);ch[id('b')]=anillo('#'+id('b'),ps,tt);ch[id('c')]=lineaHeat('#'+id('c'),sr,gk)});
  return `<section class="gb" style="--bc:${bc}">${ti}<div class="grid">${cards.map(x=>K(x.l,esc(x.v)+sub(esc(x.s)),x.c,x.cl,x.ic)).join('')}</div><div class="gb-ch${solo?' solo':''}">${card(pn+' por monto',id('a'),0,ht)}${card('Participación por '+pn.slice(0,-1).toLowerCase().replace('categorí','categoría').replace('categoríaa','categoría'),id('b'),0,ht)}${card('Evolución por '+UNP[un]+' '+badge(sr.map(x=>x[gk])),id('c'),0,ht)}</div></section>`}).join('');
 o.innerHTML=per+`<div class="gb-wrap${solo?'':' dos'}">${html}</div>`;jobs.forEach(j=>j())}
const rotDif={id:'rotDif',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data;x.save();x.fillStyle=o.color;x.font='600 '+o.size+'px system-ui,sans-serif';x.textBaseline='middle';
 m.data.forEach((b,i)=>{const v=d[i],n=v<0;x.textAlign=n?'right':'left';x.fillText((n?'−':'+')+'Bs '+R.fmtCorto(Math.abs(v)),b.x+(n?-6:6),b.y)});x.restore()}};
const rotV={id:'rotV',afterDatasetsDraw(c,_a,o){if(!o||!o.on)return;const x=c.ctx,m=c.getDatasetMeta(0),d=c.data.datasets[0].data;x.save();x.fillStyle=o.color;x.font='700 '+o.size+'px system-ui,sans-serif';x.textAlign='center';
 m.data.forEach((b,i)=>{const n=d[i]<0;x.textBaseline=n?'top':'bottom';x.fillText('Bs '+R.fmtCorto(d[i]),b.x,b.y+(n?6:-6))});x.restore()}};
const difBars=(id,it)=>new Chart($(id),{type:'bar',plugins:[rotDif],data:{labels:it.map(x=>x.cat),datasets:[{data:it.map(x=>x.total),backgroundColor:it.map(x=>x.total<0?TM.gastos:TM.ingresos),borderRadius:6,maxBarThickness:26}]},
 options:{indexAxis:'y',maintainAspectRatio:false,animation:false,layout:{padding:{right:PDFM?(chico()?80:96):8,left:PDFM?(chico()?80:96):0}},plugins:{legend:{display:false},tooltip:{callbacks:{label:q=>{const x=it[q.dataIndex];return[' Ingresos: '+F(x.i),' Gastos: '+F(x.g),' Diferencia: '+F(x.total)]}}},rotDif:{on:PDFM,color:TM.tx,size:chico()?11:12}},
  scales:{x:gy(),y:{grid:{display:false},ticks:{callback(v){return recorta(this.getLabelForValue(v),chico()?16:24)}}}}}});
const barras3=(id,t)=>new Chart($(id),{type:'bar',plugins:[rotV],data:{labels:['Ingresos','Gastos','Balance'],datasets:[{data:[t.ingresos,t.gastos,t.balance],backgroundColor:[TM.ingresos,TM.gastos,TM.rampa[2]],borderRadius:8,maxBarThickness:70}]},
 options:{maintainAspectRatio:false,animation:false,layout:{padding:{top:28,bottom:10}},plugins:{legend:{display:false},tooltip:{callbacks:{label:q=>' '+F(q.parsed.y)}},rotV:{on:true,color:TM.tx,size:chico()?11:12}},scales:{x:gx(),y:gy()}}});
const acumulado=(id,s)=>{let c=0;const v=s.map(x=>(c+=x.ingresos-x.gastos,Math.round(c*100)/100));return new Chart($(id),{type:'line',data:{labels:s.map(x=>x.label),datasets:[{label:'Balance acumulado',data:v,borderColor:TM.ingresos,segment:{borderColor:q=>(q.p0.parsed.y+q.p1.parsed.y)/2<0?TM.gastos:TM.ingresos},fill:{target:'origin',above:TM.ingresos+'26',below:TM.gastos+'26'},tension:.3,borderWidth:3,borderCapStyle:'round',pointBackgroundColor:v.map(y=>y<0?TM.gastos:TM.ingresos),pointBorderColor:TM.c,pointBorderWidth:2,pointRadius:s.length>40?0:3.5,pointHoverRadius:6}]},options:opt({plugins:{legend:{display:false},tooltip:tip}})})};
function mezclaBloque(l,a,b,o){const gN=vsDe('gasto'),iN=vsDe('ingreso'),mov=R.enSeleccion(l,vsSel),un=R.unidadProm(a,b),nm=(t,N)=>V[t].todos?'(todas)':N.join(' + '),titulo='Gasto '+nm('gasto',gN)+' vs Ingreso '+nm('ingreso',iN);vsInfo=[];
 const per=`<div class="perio">📅 ${R.fechaCorta(a)} – ${R.fechaCorta(b)} · ${mov.length} movimiento${mov.length===1?'':'s'} en tu selección · análisis por ${UNP[un]}</div>`,ti=`<h2 class="gb-t"><span class="kic">${Icons.svg('vs')}</span>${esc(titulo)}</h2>`;
 if(!mov.length){vsInfo.push({c:titulo,vacio:true});o.innerHTML=per+`<div class="gb-wrap"><section class="gb" style="--bc:var(--ac)">${ti}<div class="card vacio"><b>Sin movimientos en este periodo</b><span class="muted">No hay registros de esta selección con el filtro actual.</span></div></section></div>`;return}
 const t=R.totales(mov,a,b),nI=mov.filter(m=>m.tipo==='ingreso').length,rg=n=>n+' registro'+(n===1?'':'s'),d0=R.difPorSubcat(mov),dif=d0.length>12?d0.slice(0,12).concat([(q=>({cat:'Otras ('+(d0.length-12)+')',i:q.i,g:q.g,total:q.i-q.g}))(d0.slice(12).reduce((p,x)=>({i:p.i+x.i,g:p.g+x.g}),{i:0,g:0}))]):d0,s=R.serie(mov,un,a,b),ratio=t.ingresos>0?R.pct(t.gastos,t.ingresos):null,
  cards=[{l:'Ingresos',v:F(t.ingresos),s:rg(nI),cl:'a',ic:'up',c:'ingreso'},{l:'Gastos',v:F(t.gastos),s:rg(mov.length-nI),cl:'a',ic:'down',c:'gasto'},{l:'Balance',v:F(t.balance),s:'ingresos − gastos',cl:'p',ic:'scale',c:t.balance<0?'gasto':'ingreso'},{l:'Gasto sobre ingreso',v:ratio==null?'—':R.fmtPct(ratio),s:ratio==null?'Sin ingresos en la selección':ratio>100?'Gastas más de lo que ingresa':'Tasa de ahorro: '+R.fmtPct(100-ratio),cl:'o',ic:'coin',c:''}],ht=Math.max(300,dif.length*30+60);
 vsInfo.push({c:titulo,bc:COLH[0],cards,ids:['m0a','m0b','m0c']});
 o.innerHTML=per+`<div class="gb-wrap"><section class="gb" style="--bc:var(--ac)">${ti}<p class="vs-tag">Ingresos = suma de las categorías de ingreso activas · Gastos = suma de las de gasto activas · Balance = Ingresos − Gastos · Gasto sobre ingreso = Gastos ÷ Ingresos</p><div class="grid">${cards.map(x=>K(x.l,esc(x.v)+sub(esc(x.s)),x.c,x.cl,x.ic)).join('')}</div><div class="gb-ch solo">${card('Diferencia por subcategoría (la suma de las barras = Balance)','m0a',0,ht)}${card('Ingresos vs gastos','m0b',0,ht)}${card('Balance acumulado por '+UNP[un],'m0c',0,ht)}</div></section></div>`;
 ch.m0a=difBars('#m0a',dif);ch.m0b=barras3('#m0b',t);ch.m0c=acumulado('#m0c',s)}
const rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
function texto(g,t,x,y,max,px,peso,col){let p=px;g.font=peso+' '+p+'px system-ui,sans-serif';while(g.measureText(t).width>max&&p>16){p-=2;g.font=peso+' '+p+'px system-ui,sans-serif'}g.fillStyle=col;g.fillText(t,x,y)}
function componer(x){const W=2400,P=60,gap=30,cw=(W-2*P-2*gap)/3,sh=Math.round(cw*.9),H=P+120+230+40+sh+P,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
 g.fillStyle='#fff';g.fillRect(0,0,W,H);g.textBaseline='top';texto(g,x.c,P,P,W-2*P,76,800,'#0b1130');const cy=P+120;
 x.cards.forEach((c,i)=>{const cx=P+i*(cw+gap);g.lineWidth=6;g.strokeStyle=x.bc;rr(g,cx,cy,cw,230,24);g.stroke();texto(g,c.l,cx+30,cy+24,cw-60,34,600,'#3b4466');texto(g,c.v,cx+30,cy+76,cw-60,60,800,'#0b1130');texto(g,c.s,cx+30,cy+160,cw-60,32,500,'#3b4466')});
 const y0=cy+230+40;x.ids.forEach((id,i)=>{const c=ch[id].canvas,cx=P+i*(cw+gap),r=Math.min((cw-20)/c.width,(sh-20)/c.height),w=c.width*r,h=c.height*r;g.lineWidth=5;g.strokeStyle=x.bc;rr(g,cx,y0,cw,sh,24);g.stroke();g.drawImage(c,cx+(cw-w)/2,y0+(sh-h)/2,w,h)});
 return{img:cv.toDataURL('image/png'),w:W,h:H}}
function pdfGastos(){const f=filtros(),l=R.filtrar(movs,f);if(!l.length)return alert('No hay datos para exportar.');const[a,b]=R.rango(f,l,hoy());let pags=[];
 PDFM=true;Chart.defaults.devicePixelRatio=3;
 try{renderRep();pags=vsInfo.filter(x=>!x.vacio).map(componer)}finally{PDFM=false;Chart.defaults.devicePixelRatio=DPR0();renderRep()}
 if(!pags.length)return alert('No hay datos para exportar.');
 const tp=soloTipo();PDF.generarBloques({titulo:tp==='gasto'?'Gastos por categoria':tp==='ingreso'?'Ingresos por categoria':'Gastos vs Ingresos',archivo:tp==='gasto'?'reporte-gastos.pdf':tp==='ingreso'?'reporte-ingresos.pdf':'reporte-gastos-vs-ingresos.pdf',periodo:'Periodo: '+R.fechaCorta(a)+' a '+R.fechaCorta(b),paginas:pags})}
function pdf(){if(!tipoR)return alert('Elige un tipo de reporte.');if(tipoR==='presupuesto')return pdfPres();if(tipoR==='vs'&&vsSel.length)return pdfGastos();const f=filtros();let l0=R.filtrar(movs,f);if(tipoR==='vs')l0=R.enSeleccion(l0,vsSel);const l=R.ordenar(l0);if(!l.length)return alert('No hay datos para exportar.');const[a,b]=R.rango(f,l,hoy());let imgs=[];
 PDFM=true;Chart.defaults.devicePixelRatio=3;
 try{renderRep();imgs=Object.values(ch).slice(0,tipoR==='vs'?40:2).map(x=>({img:x.toBase64Image('image/png',1),w:x.canvas.width,h:x.canvas.height}))}finally{PDFM=false;Chart.defaults.devicePixelRatio=DPR0();renderRep()}
 if(imgs.length<2)return alert('No hay datos para exportar.');
 PDF.generar({rango:`Periodo: ${a} a ${b}`,tot:R.totales(l,a,b),porCat:R.porCategoria(l),filas:l,imgs})}
/* ---------- Notas ---------- */
function crece(){const t=$('#n-txt');if(!t.offsetParent)return;t.style.height='auto';t.style.height=t.scrollHeight+'px'}
let tm;function nota(){crece();msg('#n-st','Guardando…');clearTimeout(tm);tm=setTimeout(async()=>{try{await D.guardarNota($('#n-txt').value);msg('#n-st','Guardado ✔')}catch(e){msg('#n-st','Error: '+e.message)}},800)}
async function importar(file){try{const j=JSON.parse(await file.text()),nuevos=R.paraImportar(movs,j.movimientos);
 if(!confirm(`Se importarán ${nuevos.length} movimientos nuevos (los duplicados se omiten). ¿Continuar?`))return;
 let n=0;for(const m of nuevos){movs.push(await D.agregar(m));msg('#c-st',`Importando ${++n}/${nuevos.length}…`)}
 for(const c of (Array.isArray(j.categorias)?j.categorias:[])){const nm=String(c&&c.nombre||'').trim().slice(0,30);
  if(nm&&custom.length<3&&nm.toLowerCase()!==NUEVA.toLowerCase()&&!nomCats().some(x=>x.toLowerCase()===nm.toLowerCase()))custom.push(await D.guardarCat({nombre:nm,subs:(Array.isArray(c.subs)?c.subs:[]).map(x=>String(x).slice(0,40)).slice(0,15)}))}
 if(typeof j.notas==='string'&&j.notas&&!$('#n-txt').value){$('#n-txt').value=j.notas;await D.guardarNota(j.notas)}
 if(metOk)for(const m of(Array.isArray(j.metas)?j.metas:[]))if(m&&m.nombre&&+m.objetivo>0&&!metas.some(x=>x.nombre===m.nombre))metas.push(await D.guardarMeta({nombre:String(m.nombre).slice(0,40),objetivo:Math.round(+m.objetivo*100)/100,ahorrado:Math.max(0,Math.round((+m.ahorrado||0)*100)/100),fecha_limite:/^\d{4}-\d{2}-\d{2}$/.test(m.fecha_limite||'')?m.fecha_limite:null}));
 if(plOk){const pl=[...(Array.isArray(j.plan)?j.plan:[]),...(Array.isArray(j.presupuestos)?j.presupuestos:[]).map(p=>({categoria:p&&p.categoria,subcategoria:null,monto:p&&p.monto}))];
  for(const p of pl)if(p&&p.categoria&&+p.monto>0&&!plan.some(x=>x.categoria===p.categoria&&(x.subcategoria||null)===(p.subcategoria||null)))plan.push(await D.guardarPlan({categoria:String(p.categoria).slice(0,60),subcategoria:p.subcategoria?String(p.subcategoria).slice(0,60):null,monto:Math.round(+p.monto*100)/100}));
  const pg=[...(Array.isArray(j.pagos)?j.pagos:[]),...(Array.isArray(j.recurrentes)?j.recurrentes:[]).map(r=>({nombre:r&&r.nombre,categoria:r&&r.categoria,subcategoria:r&&r.subcategoria,detalle:r&&r.detalle,pagos_anio:12}))];
  for(const r of pg)if(r&&r.nombre&&r.categoria&&!pagos.some(x=>x.nombre===r.nombre&&x.categoria===r.categoria))pagos.push(await D.guardarPago({nombre:String(r.nombre).slice(0,40),categoria:String(r.categoria).slice(0,60),subcategoria:r.subcategoria?String(r.subcategoria).slice(0,60):null,detalle:r.detalle?String(r.detalle).slice(0,60):null,pagos_anio:Math.min(12,Math.max(1,Math.round(+r.pagos_anio)||12))}))}
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
   (pend.length?`<button id="xl-go" class="btn">Importar ${pend.length} movimientos</button>`:'');revelar(o)}
 catch(e){o.textContent='Error: '+e.message}}
async function exportarXL(){if(!movs.length)return alert('Aún no hay movimientos para exportar.');const b=$('#n-xlx');b.disabled=true;msg('#c-st','Preparando el Excel…');
 try{await cargaXL();const wb=R.libroExcel(ExcelJS,movs,hoy()),buf=await wb.xlsx.writeBuffer(),bl=new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),a=document.createElement('a');
  a.href=URL.createObjectURL(bl);a.download='ar-finance-registros-'+hoy()+'.xlsx';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);msg('#c-st','✔ Excel descargado ('+movs.length+' movimientos)')}
 catch(e){msg('#c-st','Error al crear el Excel: '+e.message)}finally{b.disabled=false}}
async function importarXL(){const b=$('#xl-go');b.disabled=true;let n=0;
 try{for(let i=0;i<pend.length;i+=200){const g=pend.slice(i,i+200);movs.push(...await D.agregarVarios(g));n+=g.length;b.textContent=`Importando ${n}/${pend.length}…`}
  pend=[];todo();$('#xl-res').innerHTML=`<p class="ok">✔ ${n} movimientos importados.</p>`;revelar($('#xl-res'))}
 catch(e){$('#xl-res').innerHTML=`<p class="warn">Error tras ${n} movimientos: ${esc(e.message)}. Pulsa Revisar de nuevo: los ya importados se omiten.</p>`;todo()}}
function respaldo(){const b=new Blob([JSON.stringify({exportado:new Date().toISOString(),notas:$('#n-txt').value,movimientos:movs,categorias:custom,plan,pagos,metas},null,2)],{type:'application/json'});
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
 try{await D.actualizarCat(id,{nombre:n,subs});if(n!==viejo&&plOk){await D.renombrarPlan(viejo,n);plan.forEach(p=>{if(p.categoria===viejo)p.categoria=n});pagos.forEach(r=>{if(r.categoria===viejo)r.categoria=n})}if(k){await D.renombrarCat(viejo,n);movs.forEach(m=>{if(m.tipo==='gasto'&&m.categoria===viejo)m.categoria=n})}
  c.nombre=n;c.subs=subs;vsSel.forEach(x=>{if(x.t==='gasto'&&x.c===viejo)x.c=n});if(st.cat===viejo){st.cat=n;if(st.sub&&!subs.includes(st.sub))st.sub=st.det=''}if(rs.cat===viejo){rs.cat=n;if(rs.sub&&!subs.includes(rs.sub))rs.sub=rs.det=''}
  cfgEd='';armarCats();drawReg();todo();pintaCfgCats()}catch(e){alert('Error: '+e.message)}}
const kResp=()=>'ar_resp_'+userEmail;
function estadoResp(){let f=null;try{f=localStorage.getItem(kResp())}catch(e){}const el=$('#c-resp');
 if(!f){el.textContent='Aún no has hecho un respaldo desde este dispositivo.';el.className='warn';return}
 const n=R.diasEntre(f,hoy());el.textContent='Último respaldo: '+R.fechaCorta(f)+' (hace '+n+(n===1?' día':' días')+')';el.className=n>14?'warn':'muted'}
/* ---------- Eventos ---------- */
function menu(t){const cur=$('.mi.on');if(!cur||cur.dataset.t!==t)window.scrollTo(0,0);$$('.mi').forEach(x=>x.classList.toggle('on',x.dataset.t===t));$$('.tab').forEach(s=>s.hidden=s.id!=='t-'+t);$('#side').classList.remove('open');$('#scrim').classList.remove('on');if(t==='rep')renderRep();if(t==='gen')general();if(t==='cfg')pintaCfg();if(t==='his')crece()}
document.addEventListener('DOMContentLoaded',()=>{
 $$('.mi').forEach(b=>{b.insertAdjacentHTML('afterbegin','<span class="mi-ic">'+Icons.svg(b.dataset.ic)+'</span>');b.onclick=()=>menu(b.dataset.t)});
 const app=$('#app'),setMenu=o=>{app.classList.toggle('colapsado',!o);try{localStorage.setItem('ar_menu',o?'1':'0')}catch(e){}window.dispatchEvent(new Event('resize'))};
 try{if(localStorage.getItem('ar_menu')==='0')app.classList.add('colapsado')}catch(e){}
 $('#sb-hide').onclick=()=>setMenu(false);$('#sb-show').onclick=()=>setMenu(true);
 $('#burger').onclick=()=>{$('#side').classList.add('open');$('#scrim').classList.add('on')};$('#scrim').onclick=()=>menu($('.mi.on').dataset.t);
 const rb=$('#reg-body');
 $('#cal-box').onclick=clicCal;$('#cal-back').onclick=e=>{if(e.target.id==='cal-back')cerrarCal()};
 rb.addEventListener('input',e=>{const k={'g-desc':'desc','g-cant':'cant','g-monto':'monto'}[e.target.id];if(k)st[k]=e.target.value});
 rb.addEventListener('click',e=>{
  const t=e.target.closest('.tile[data-lv]');
  if(t)return behind(t,()=>{const lv=t.dataset.lv;st[lv]=t.dataset.v;if(lv==='cat')st.sub=st.det='';if(lv==='sub')st.det='';st.m='';st.a=lv;drawReg()});
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.cal)accionCal(b.dataset.cal);
  else if(b.dataset.tipo)resetReg(b.dataset.tipo,'','tipo');
  else if(b.dataset.undo){const lv=b.dataset.undo;st[lv]='';if(lv==='cat')st.sub=st.det='';if(lv==='sub')st.det='';drawReg(1)}
  else if(b.dataset.q){const v=Math.max(1,Math.round((parseFloat(st.cant)||1)+ +b.dataset.q));st.cant=String(v);$('#g-cant').value=st.cant}
  else if(b.dataset.act==='ok')guardar();else if(b.dataset.act==='no'){resetReg('');irArriba()}else if(b.dataset.act==='nc-ok')crearCat();else if(b.dataset.del)borrarCat(b.dataset.del)});
 $('#g-out').onclick=e=>{const d=e.target.closest('.del'),g=e.target.closest('[data-go]'),p=e.target.closest('.edt');if(d)borrar(d.dataset.id);else if(p)abrirEd(p.dataset.ed);else if(g)menu(g.dataset.go)};
 $('#h-q').oninput=$('#h-tipo').onchange=()=>{hLim=7;historial()};$('#h-mas').onclick=()=>{hLim+=10;historial()};
 $('#h-list').onclick=e=>{const b=e.target.closest('.del'),p=e.target.closest('.edt');if(b)borrar(b.dataset.id);else if(p)abrirEd(p.dataset.ed)};
 $('#ed-f').addEventListener('change',e=>{if(!ed)return;const i=e.target.id;
  if(i==='ed-cat'){ed.cat=e.target.value;ed.sub=ed.det='';pintaEd()}else if(i==='ed-sub'){ed.sub=e.target.value;ed.det='';pintaEd()}else if(i==='ed-det')ed.det=e.target.value;else if(i==='ed-fecha')ed.fecha=e.target.value});
 $('#ed-f').addEventListener('input',e=>{const k={'ed-desc':'desc','ed-cant':'cant','ed-monto':'monto'}[e.target.id];if(k&&ed)ed[k]=e.target.value});
 $('#mt-ok').onclick=guardarMeta;$('#mt-list').onclick=e=>{const d=e.target.closest('[data-md]'),p=e.target.closest('[data-ma]');if(d)borrarMeta(d.dataset.md);else if(p)aportarMeta(p.dataset.ma)};
 $('#pg-add').onclick=()=>abrirPg('');$('#pg-list').onclick=e=>{const d=e.target.closest('[data-pd]'),p=e.target.closest('[data-pe]'),q=e.target.closest('[data-pp]');if(d)borrarPg(d.dataset.pd);else if(p)abrirPg(p.dataset.pe);else if(q)pagarPg(q.dataset.pp)};
 $('#pg-no').onclick=cerrarPg;$('#pg-back').onclick=e=>{if(e.target.id==='pg-back')cerrarPg()};$('#pg-ok').onclick=guardarPg;
 $('#pg-f').addEventListener('change',e=>{if(!pgE)return;const i=e.target.id;if(i==='pg-cat'){pgE.cat=e.target.value;pgE.sub=pgE.det='';pintaPgE()}else if(i==='pg-sub'){pgE.sub=e.target.value;pgE.det='';pintaPgE()}else if(i==='pg-det')pgE.det=e.target.value});
 $('#pg-f').addEventListener('input',e=>{if(pgE&&e.target.id==='pg-n')pgE.n=e.target.value});
 $('#rep-out').addEventListener('change',e=>{const i=e.target.closest('[data-pc]');if(i)guardarPlanInput(i)});
 $('#rep-out').addEventListener('click',e=>{if(e.target.closest('[data-pa]'))rellenarPlan()});
 $('#rep-out').addEventListener('toggle',e=>{const d=e.target;if(d&&d.dataset&&d.dataset.od){if(d.open)prOpen.add(d.dataset.od);else prOpen.delete(d.dataset.od)}},true);
 $('#g-av').onclick=e=>{const g=e.target.closest('[data-go]');if(g)menu(g.dataset.go)};window.addEventListener('resize',()=>{if(!$('#t-his').hidden)crece()});
 $('#ed-no').onclick=cerrarEd;$('#ed-back').onclick=e=>{if(e.target.id==='ed-back')cerrarEd()};$('#ed-ok').onclick=guardarEd;
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(cal)cerrarCal();else if(ed)cerrarEd();else if(pgE)cerrarPg()}});
 $('#f-bar').onclick=e=>{if(e.target.closest('#f-todo'))return limpiaFil();const b=e.target.closest('[data-fb]'),y=e.target.closest('[data-fy]'),m=e.target.closest('[data-fm]');
  if(b){const k=b.dataset.fb;
   if(k==='rango'){if(fs.rango){fs.rango=false;fs.anio=fs.anio||R.anioResumen(hoy(),movs);fopen=''}else{fs.rango=true;fs.anio=fs.mes='';fopen='rango'}}
   else{if(fs.rango){fs.rango=false;fs.anio=R.anioResumen(hoy(),movs)}fopen=fopen===k?'':k}
   pintaFil();renderRep()}
  else if(y){fs.anio=y.dataset.fy;fs.rango=false;fopen='';if(fs.anio&&fs.mes&&!movs.some(x=>x.fecha.startsWith(fs.anio+'-'+fs.mes)))fs.mes='';pintaFil();renderRep()}
  else if(m){fs.mes=m.dataset.fm;fs.rango=false;fopen='';pintaFil();renderRep()}};
 $('#f-pan').onchange=e=>{if(e.target.id==='f-d')fs.desde=e.target.value;else if(e.target.id==='f-h')fs.hasta=e.target.value;else return;renderRep()};
 document.addEventListener('click',e=>{if(fopen&&!e.composedPath().includes($('#f-bar'))){fopen='';pintaFil()}});
 $('#f-t').onclick=e=>{const b=e.target.closest('.rtc');if(!b)return;tipoR=tipoR===b.dataset.k?'':b.dataset.k;rs={cat:'',sub:'',det:'',a:'tipo'};pintaTipos();armarCats();renderRep();if(tipoR)irCats()};
 $('#f-cats').onclick=e=>{const vi=e.target.closest('.vs-it');if(vi)return vsToggle(vi.dataset.vs,vi.dataset.v,vi);const vg=e.target.closest('[data-vsgo]');if(vg)return vsAnalizar(vg.dataset.vsgo);const t=e.target.closest('.tile[data-lv]');
  if(t)return behind(t,()=>{const lv=t.dataset.lv;rs[lv]=t.dataset.v;if(lv==='cat')rs.sub=rs.det='';if(lv==='sub')rs.det='';rs.a=lv;armarCats();renderRep();irCats()});
  const b=e.target.closest('[data-undo]');if(b){const lv=b.dataset.undo;rs[lv]='';if(lv==='cat')rs.sub=rs.det='';if(lv==='sub')rs.det='';armarCats();renderRep();irCats()}};
 $('#f-cats').onchange=e=>{const d=e.target.closest('[data-vst]');if(d)return vsTodos(d.dataset.vst,d.checked);const c=e.target.closest('[data-vsm]');if(c)vsMulti(c.dataset.vsm,c.checked)};
 matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{{if(!$('#t-rep').hidden)renderRep();if(!$('#t-gen').hidden)general()}});
 $('#pdf').onclick=pdf;$('#n-xlx').onclick=exportarXL;$('#n-xl').onclick=()=>{const p=$('#xl-panel');p.hidden=false;revelar(p)};$('#xl-x').onclick=()=>{$('#xl-panel').hidden=true};$('#xl-rev').onclick=revisarXL;$('#xl-res').onclick=e=>{if(e.target.id==='xl-go')importarXL()};$('#n-txt').oninput=nota;$('#n-exp').onclick=respaldo;$('#n-imp').onclick=()=>$('#n-file').click();$('#n-file').onchange=e=>{const f=e.target.files[0];if(f)importar(f);e.target.value=''};
 $('#c-cats').onclick=e=>{const b=e.target.closest('[data-ce]');if(!b)return;const k=b.dataset.ce;
  if(k==='ed'){cfgEd=b.dataset.id;pintaCfgCats()}else if(k==='no'){cfgEd='';pintaCfgCats()}else if(k==='ok')editarCat(b.dataset.id);else if(k==='del')borrarCat(b.dataset.id)};
 $('#c-pwb').onclick=async()=>{const a=$('#c-pw').value,b=$('#c-pw2').value,m=$('#c-pwm'),bad=t=>{m.className='warn lab';m.textContent=t};
  if(a.length<6)return bad('La contraseña debe tener al menos 6 caracteres.');if(a!==b)return bad('Las contraseñas no coinciden.');
  try{await D.cambiarClave(a);$('#c-pw').value=$('#c-pw2').value='';m.className='ok lab';m.textContent='✔ Contraseña cambiada.'}catch(e){bad('Error: '+e.message)}};
 $('#out').onclick=$('#c-out').onclick=async()=>{await D.salir();location.reload()};iniciar();
});
})();
