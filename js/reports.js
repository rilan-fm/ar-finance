(function(root){
const T=(n,s,d)=>({n,s,d:d||{}});
const GASTO=[
T('Víveres Alimentos',['Abarrotes','Verduras','Lácteos','Carne de res','Carne de pollo','Pan/Masitas','Frutas','Huevo','Otro']),
T('Hogar',['Servicios básicos','Aseo/Higiene personal','Comida fuera de casa','Mantenimiento','Ropa y zapatos hijos','Otro'],{'Servicios básicos':['Luz','Agua','Internet','Gas']}),
T('Colegio hijos',['Recreos','Materiales','Pensiones','Cuotas/Aportes','Refrigerios','Uniformes','Otros']),
T('Rilan',['Banco','Coca/Extras','Ocio','Ayuda a familia','Refrigerios','Ropa','Herramientas','Otro']),
T('Ingrid',['Yanbal','Higiene personal','Transporte','Ropa','Ayuda a familia','Otros']),
T('Auto',['Combustible','Mantenimiento','Repuestos','Parqueo/Peajes','Otro']),
T('Iglesia',['Diezmo/Ofrenda','Refrigerio','Transporte','Otro']),
T('Universidad hijos',['Pasajes','Materiales','Matrículas/Inscripciones','Otro']),
T('Préstamos',['De familia','De amigos','Otro']),
T('Salud',['Medicamentos','Consulta médica','Laboratorio','Otro']),
T('Viajes en familia',['Comida/Refrigerios','Pasajes/Combustible','Parques/Hotel','Otro'])];
const INGRESO=[T('Rilan',['Sueldo escuela','Dividendo escuela','Trading','Otros ingresos']),T('Ingrid',['Sueldo escuela','Dividendo escuela','Yanbal','Otros ingresos']),T('Hospedaje',['En mi familia','En otras familias']),T('Otros ingresos',[])];
const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>{const[i,d]=Number(n||0).toFixed(2).split('.');return 'Bs '+i.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+','+d};
const etiquetaMes=k=>MESES[+k.slice(5,7)-1]+' '+k.slice(0,4);
const dias=(a,b)=>Math.max(1,Math.round((Date.parse(b)-Date.parse(a))/864e5)+1);
const ordenar=l=>l.slice().sort((a,b)=>b.fecha.localeCompare(a.fecha)||String(b.creado_en||'').localeCompare(String(a.creado_en||'')));
function filtrar(l,{desde,hasta,tipo,cats,q,anio,mes,sub,det}={}){const t=(q||'').trim().toLowerCase();
 return l.filter(m=>(!sub||m.subcategoria===sub)&&(!det||m.detalle===det)&&(!anio||m.fecha.slice(0,4)===anio)&&(!mes||m.fecha.slice(5,7)===mes)&&(!desde||m.fecha>=desde)&&(!hasta||m.fecha<=hasta)&&(!tipo||m.tipo===tipo)&&(!cats||!cats.length||cats.includes(m.categoria))&&(!t||(m.descripcion||'').toLowerCase().includes(t)||m.categoria.toLowerCase().includes(t)||(m.subcategoria||'').toLowerCase().includes(t)));}
const mesesConDatos=l=>[...new Set(l.map(m=>m.fecha.slice(0,7)))].sort().reverse();
const aniosConDatos=l=>[...new Set(l.map(m=>m.fecha.slice(0,4)))].sort().reverse();
function totales(l,desde,hasta){let ingresos=0,gastos=0;l.forEach(m=>m.tipo==='ingreso'?ingresos+=+m.monto:gastos+=+m.monto);
 const f=l.map(m=>m.fecha).sort(),a=desde||f[0],b=hasta||f[f.length-1],nm=Math.max(1,mesesConDatos(l).length);
 return{ingresos,gastos,balance:ingresos-gastos,promDiario:l.length?gastos/dias(a,b):0,gMes:gastos/nm,iMes:ingresos/nm,n:l.length};}
function agrupar(l,fn){const o={};l.forEach(m=>{const k=fn(m);o[k]=(o[k]||0)+ +m.monto});return Object.entries(o).map(([k,total])=>({k,cat:k,total})).sort((x,y)=>y.total-x.total);}
const porCategoria=(l,tipo='gasto')=>agrupar(l.filter(m=>tipo==null||m.tipo===tipo),m=>m.categoria);
const porSub=(l,conCat)=>agrupar(l,m=>(conCat?m.categoria+' › ':'')+(m.subcategoria||(conCat?'(general)':m.categoria))+(m.detalle?' › '+m.detalle:''));
function porMes(l){const o={};l.forEach(m=>{const k=m.fecha.slice(0,7);o[k]=o[k]||{mes:k,ingresos:0,gastos:0};o[k][m.tipo==='ingreso'?'ingresos':'gastos']+= +m.monto});
 return Object.values(o).sort((a,b)=>a.mes.localeCompare(b.mes));}
function topProducto(l){const o={};l.filter(m=>m.tipo==='gasto'&&(m.descripcion||'').trim()).forEach(m=>{const k=m.descripcion.trim().toLowerCase(),e=o[k]=o[k]||{nombre:m.descripcion.trim(),unidades:0,veces:0};e.unidades+=m.cantidad>0?+m.cantidad:1;e.veces++});
 return Object.values(o).sort((a,b)=>b.unidades-a.unidades||b.veces-a.veces)[0]||null;}
const U=s=>Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10)),iso=t=>new Date(t).toISOString().slice(0,10);
const lunes=s=>iso(U(s)-((new Date(U(s)).getUTCDay()+6)%7)*864e5);
function rango(f,l,hoy){const fe=l.map(m=>m.fecha).sort();let a=f.desde,b=f.hasta;
 if(!a)a=f.anio&&f.mes?`${f.anio}-${f.mes}-01`:f.anio?f.anio+'-01-01':fe[0];
 if(!b){if(f.anio&&f.mes)b=`${f.anio}-${f.mes}-${String(new Date(Date.UTC(+f.anio,+f.mes,0)).getUTCDate()).padStart(2,'0')}`;
  else if(f.anio){b=f.anio+'-12-31';if(hoy&&hoy<b&&hoy>=a)b=hoy}else b=fe[fe.length-1]}
 if(fe.length&&b<fe[fe.length-1])b=fe[fe.length-1];return[a,b]}
function granularidad(f,a,b){const d=dias(a,b);if((f.anio&&!f.mes&&!f.desde&&!f.hasta)||d>330)return['mes','semana'];return d<=31?['dia','semana']:['semana','dia']}
function serie(l,g,a,b){const key=s=>g==='dia'?s:g==='semana'?lunes(s):s.slice(0,7),ks=[];
 const lab=k=>g==='mes'?MESES[+k.slice(5,7)-1].slice(0,3)+' '+k.slice(2,4):(g==='semana'?'Sem ':'')+k.slice(8)+'/'+k.slice(5,7);
 if(g==='mes'){let y=+a.slice(0,4),m=+a.slice(5,7);const ey=+b.slice(0,4),em=+b.slice(5,7);while(y<ey||(y===ey&&m<=em)){ks.push(y+'-'+String(m).padStart(2,'0'));if(++m>12){m=1;y++}}}
 else{let t=g==='dia'?U(a):U(lunes(a));const e=U(b);while(t<=e){ks.push(iso(t));t+=(g==='dia'?1:7)*864e5}}
 const o={};ks.forEach(k=>o[k]={k,label:lab(k),ingresos:0,gastos:0});
 l.forEach(m=>{const e=o[key(m.fecha)];if(e)e[m.tipo==='ingreso'?'ingresos':'gastos']+= +m.monto});return ks.map(k=>o[k])}
function tendencia(v){const n=v.length;if(n<2)return{linea:v.slice(),pend:0,dir:'estable'};
 const mx=(n-1)/2,my=v.reduce((s,x)=>s+x,0)/n;let sxy=0,sxx=0;v.forEach((y,i)=>{sxy+=(i-mx)*(y-my);sxx+=(i-mx)**2});const p=sxy/sxx,c=my-p*mx,rel=my?p*(n-1)/my:0;
 return{linea:v.map((_,i)=>+(c+p*i).toFixed(2)),pend:p,dir:rel>0.1?'sube':rel<-0.1?'baja':'estable'}}
function frecuentes(l){const o={};l.forEach(m=>{const k=(m.subcategoria||m.categoria)+(m.detalle?' › '+m.detalle:''),e=o[k]=o[k]||{k,n:0,total:0};e.n++;e.total+=+m.monto});
 return Object.values(o).sort((a,b)=>b.n-a.n||b.total-a.total)}
function paraImportar(actuales,lista){const clave=m=>[m.tipo,m.fecha,(+m.monto).toFixed(2),m.categoria,m.subcategoria||'',m.detalle||'',String(m.descripcion||'').trim()].join('|');
 const vistos=new Set(actuales.map(clave)),out=[];
 (Array.isArray(lista)?lista:[]).forEach(m=>{if(!m||!['ingreso','gasto'].includes(m.tipo)||!(+m.monto>0)||!/^\d{4}-\d{2}-\d{2}$/.test(m.fecha)||typeof m.categoria!=='string'||!m.categoria)return;
  const x={tipo:m.tipo,monto:Math.round(+m.monto*100)/100,fecha:m.fecha,categoria:m.categoria.slice(0,60),subcategoria:m.subcategoria?String(m.subcategoria).slice(0,60):null,detalle:m.detalle?String(m.detalle).slice(0,60):null,descripcion:String(m.descripcion||'').slice(0,120),cantidad:+m.cantidad>0?+m.cantidad:1};
  const k=clave(x);if(!vistos.has(k)){vistos.add(k);out.push(x)}});return out}
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const ALIAS={fecha:'fecha',tipo:'tipo',categoria:'categoria',cat:'categoria',subcategoria:'subcategoria',subcat:'subcategoria',detalle:'detalle',descripcion:'descripcion',concepto:'descripcion',cantidad:'cantidad',monto:'monto',montobs:'monto',importe:'monto',valor:'monto'};
function numero(v){if(typeof v==='number')return isFinite(v)?v:NaN;let s=String(v??'').replace(/[^\d.,-]/g,'');if(!s||s==='-')return NaN;
 const c=s.lastIndexOf(','),p=s.lastIndexOf('.');
 if(c>-1&&p>-1)s=c>p?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');
 else if(c>-1)s=/,\d{1,2}$/.test(s)&&s.split(',').length===2?s.replace(',','.'):s.replace(/,/g,'');
 else if(p>-1)s=/\.\d{1,2}$/.test(s)&&s.split('.').length===2?s:s.replace(/\./g,'');
 return parseFloat(s)}
function fechaISO(v){let d=null;
 if(v instanceof Date&&!isNaN(v))d=[v.getUTCFullYear(),v.getUTCMonth()+1,v.getUTCDate()];
 else if(typeof v==='number'&&v>20000&&v<80000){const t=new Date(Math.round((v-25569)*864e5));d=[t.getUTCFullYear(),t.getUTCMonth()+1,t.getUTCDate()]}
 else{const s=String(v??'').trim(),m=s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  if(m)d=[+m[1],+m[2],+m[3]];
  else{const n=s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/);if(n){let a=+n[1],b=+n[2],y=+n[3];if(y<100)y+=2000;d=b>12&&a<=12?[y,a,b]:[y,b,a]}}}
 if(!d)return null;const[y,m,dd]=d,t=new Date(Date.UTC(y,m-1,dd));
 if(y<2000||y>2100||t.getUTCFullYear()!==y||t.getUTCMonth()!==m-1||t.getUTCDate()!==dd)return null;
 return `${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`}
function validarFilas(mat,cat){const out={total:0,validos:[],errores:[],desconocidas:{}};let hi=-1,idx={};
 for(let i=0;i<Math.min(mat.length,15);i++){const m={};(mat[i]||[]).forEach((h,j)=>{const k=ALIAS[norm(h).replace(/ /g,'')];if(k&&!(k in m))m[k]=j});if('fecha' in m&&'monto' in m){hi=i;idx=m;break}}
 if(hi<0){out.errores.push({fila:0,msg:'No encontré los encabezados. La primera fila debe tener: Fecha, Tipo, Categoría, Subcategoría, Detalle, Descripción, Cantidad, Monto.'});return out}
 for(const k of['tipo','categoria'])if(!(k in idx)){out.errores.push({fila:0,msg:'Falta la columna «'+k+'».'});return out}
 const gc=Object.fromEntries(cat.gasto.map(c=>[norm(c.n),c])),ic=Object.fromEntries(cat.ingreso.map(c=>[norm(c.n),c]));
 for(let i=hi+1;i<mat.length;i++){const r=mat[i]||[];if(r.every(x=>String(x??'').trim()===''))continue;out.total++;
  const g=k=>k in idx?r[idx[k]]:'',fila=i+1,err=m=>out.errores.push({fila,msg:m});
  const ti=norm(g('tipo')),tipo=/^(gasto|gastos|egreso|egresos)$/.test(ti)?'gasto':/^(ingreso|ingresos)$/.test(ti)?'ingreso':'';
  if(!tipo){err('Tipo «'+g('tipo')+'» no válido (usa gasto o ingreso).');continue}
  const fecha=fechaISO(g('fecha'));if(!fecha){err('Fecha «'+(g('fecha') instanceof Date?'(fecha)':g('fecha'))+'» no válida.');continue}
  const monto=numero(g('monto'));if(!(monto>0)){err('Monto «'+g('monto')+'» no válido (debe ser mayor a 0).');continue}
  const cn=norm(g('categoria'));let c,nombre,sub=null,det=null;c=(tipo==='gasto'?gc:ic)[cn];nombre=c&&c.n;
  if(!nombre){const k=String(g('categoria')).trim()||'(vacía)',kk=k+' ('+tipo+')';out.desconocidas[kk]=(out.desconocidas[kk]||0)+1;err('Categoría «'+k+'» no existe para '+tipo+'.');continue}
  {const sv=norm(g('subcategoria'));
   if(!sv&&tipo==='ingreso'&&c.s.length){err('Falta la categoría del ingreso (columna Subcategoría).');continue}
   if(sv){sub=c.s.find(x=>norm(x)===sv);if(!sub){err('Subcategoría «'+g('subcategoria')+'» no existe en '+nombre+'.');continue}
    const dv=norm(g('detalle'));if(dv){det=(c.d[sub]||[]).find(x=>norm(x)===dv);if(!det){err('Detalle «'+g('detalle')+'» no existe en '+sub+'.');continue}}}
   else if(norm(g('detalle'))){err('Hay detalle pero falta la subcategoría.');continue}}
  let cantidad=1;const cv=g('cantidad');if(String(cv??'').trim()!==''){cantidad=numero(cv);if(!(cantidad>0)){err('Cantidad «'+cv+'» no válida.');continue}}
  out.validos.push({tipo,monto:Math.round(monto*100)/100,fecha,categoria:nombre,subcategoria:sub,detalle:det,descripcion:String(g('descripcion')??'').trim().slice(0,120),cantidad})}
 return out}
const pct=(p,t)=>t>0?Math.round(p/t*1000)/10:0;
const fmtPct=(x,d=1)=>Number(x||0).toFixed(d).replace('.',',')+'%';
const fmtCorto=n=>{const v=Math.round(Number(n||0));return(v<0?'-':'')+String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')};
const fechaCorta=s=>s.slice(8,10)+'/'+s.slice(5,7)+'/'+s.slice(0,4);
const mesCorto=k=>MESES[+k.slice(5,7)-1].slice(0,3)+' '+k.slice(2,4);
function periodoRapido(k,hoy,l){const ms=mesesConDatos(l),as=aniosConDatos(l);if(!ms.length)return null;
 if(k==='anio'){const y=hoy.slice(0,4);return{anio:as.includes(y)?y:as[0],mes:''}}
 const hm=hoy.slice(0,7);let ym=ms.includes(hm)?hm:ms[0];
 if(k==='anterior'){let y=+ym.slice(0,4),m=+ym.slice(5,7)-1;if(m<1){m=12;y--}ym=y+'-'+String(m).padStart(2,'0');if(!ms.includes(ym))return null}
 return{anio:ym.slice(0,4),mes:ym.slice(5,7)}}
const anioResumen=(hoy,l)=>{const as=aniosConDatos(l),y=hoy.slice(0,4);return as.includes(y)?y:(as[0]||y)};
const diasEntre=(a,b)=>Math.round((U(b)-U(a))/864e5);
const tms=m=>Date.parse(m.creado_en)||0;
const ordenarReg=l=>l.slice().sort((a,b)=>tms(b)-tms(a)||b.fecha.localeCompare(a.fecha));
function bloquesVs(l,sel){const b=[],ix={};
 sel.forEach(o=>{let k=ix[o.c];if(k==null){k=ix[o.c]=b.length;b.push({nombre:o.c,g:false,i:false})}b[k][o.t==='gasto'?'g':'i']=true});
 b.forEach(x=>{x.mov=l.filter(m=>m.categoria===x.nombre&&((x.g&&m.tipo==='gasto')||(x.i&&m.tipo==='ingreso')))});return b}
const enSeleccion=(l,sel)=>l.filter(m=>sel.some(o=>o.t===m.tipo&&o.c===m.categoria));
function estadoPresupuestos(l,pres,mes){return pres.map(p=>{const g=l.filter(m=>m.tipo==='gasto'&&m.categoria===p.categoria&&m.fecha.startsWith(mes)).reduce((s,m)=>s+ +m.monto,0),lim=+p.monto;
 return{...p,limite:lim,gastado:g,restante:lim-g,pct:pct(g,lim),nivel:g>lim?'excedido':g>=lim*0.8?'cerca':'ok'}}).sort((a,b)=>b.pct-a.pct)}
function estadoRecurrentes(l,rec,hoy){const mes=hoy.slice(0,7),ult=new Date(Date.UTC(+hoy.slice(0,4),+hoy.slice(5,7),0)).getUTCDate(),d0=+hoy.slice(8,10),rk={vencido:0,pronto:1,ok:2,pagado:3};
 return rec.map(r=>{const de=Math.min(+r.dia,ult),dias=de-d0,pagado=l.some(m=>m.tipo==='gasto'&&m.fecha.startsWith(mes)&&m.categoria===r.categoria&&(m.subcategoria||'')===(r.subcategoria||'')&&(m.detalle||'')===(r.detalle||'')),
  nivel=pagado?'pagado':dias<0?'vencido':dias<=3?'pronto':'ok';return{...r,diaEf:de,dias,pagado,nivel}}).sort((a,b)=>rk[a.nivel]-rk[b.nivel]||a.diaEf-b.diaEf)}
function estadoMetas(ms,hoy){return ms.map(m=>{const o=+m.objetivo,a=+m.ahorrado||0,fal=Math.max(0,o-a),lograda=a>=o,fl=m.fecha_limite||null,vencida=!!fl&&!lograda&&fl<hoy,
  meses=fl&&!lograda&&fl>=hoy?Math.max(1,Math.round(diasEntre(hoy,fl)/30.44)):0;
 return{...m,objetivo:o,ahorrado:a,faltan:fal,pct:pct(a,o),lograda,vencida,mesesRest:meses,porMes:meses?Math.ceil(fal/meses*100)/100:0}}).sort((x,y)=>(x.lograda-y.lograda)||y.pct-x.pct)}
const mesesEntre=(a,b)=>(+b.slice(0,4)-+a.slice(0,4))*12+(+b.slice(5,7)-+a.slice(5,7))+1;
const unidadProm=(a,b)=>{const d=dias(a,b);return d<14?'dia':d<=100?'semana':'mes'};
function promedioFlex(total,a,b){const u=unidadProm(a,b),n=u==='dia'?dias(a,b):u==='semana'?Math.max(1,dias(a,b)/7):Math.max(1,dias(a,b)/30.4375);return{unidad:u,n,valor:total/n}}
const porSubcat=l=>agrupar(l,m=>m.subcategoria||'(general)');
function masFrecuente(l,campo){const o={};l.forEach(m=>{const k=(campo==='categoria'?m.categoria:m.subcategoria)||'(general)',e=o[k]=o[k]||{k,n:0,total:0};e.n++;e.total+=+m.monto});return Object.values(o).sort((a,b)=>b.n-a.n||b.total-a.total)[0]||null}
function difPorSubcat(l){const o={};l.forEach(m=>{const k=m.subcategoria||m.categoria,e=o[k]=o[k]||{cat:k,i:0,g:0};e[m.tipo==='ingreso'?'i':'g']+= +m.monto});
 return Object.values(o).map(e=>({...e,total:e.i-e.g})).sort((x,y)=>Math.abs(y.total)-Math.abs(x.total))}
function matrizMes(ym){const y=+ym.slice(0,4),m=+ym.slice(5,7);return{n:new Date(Date.UTC(y,m,0)).getUTCDate(),off:(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7}}
function sumaMes(ym,d){let y=+ym.slice(0,4),m=+ym.slice(5,7)-1+d;y+=Math.floor(m/12);m=((m%12)+12)%12;return y+'-'+String(m+1).padStart(2,'0')}
function fechaEnMes(ym,dia){const n=matrizMes(ym).n;return ym+'-'+String(Math.min(Math.max(1,Math.round(+dia)||1),n)).padStart(2,'0')}
function mesesEquiv(a,b){if(b<a)return 1;const fin=b.slice(0,7);let ym=a.slice(0,7),t=0;
 for(let g=0;g<600;g++){const n=matrizMes(ym).n,i=ym===a.slice(0,7)?+a.slice(8,10):1,f=ym===fin?+b.slice(8,10):n;t+=Math.max(0,f-i+1)/n;if(ym===fin)break;ym=sumaMes(ym,1)}
 return Math.max(t,1/31)}
function presupuestoReal(l,a,b){const g=l.filter(m=>m.tipo==='gasto'),n=mesesEquiv(a,b),cs={};
 g.forEach(m=>{const c=cs[m.categoria]=cs[m.categoria]||{cat:m.categoria,total:0,subs:{}},k=m.subcategoria||'(general)';c.total+= +m.monto;c.subs[k]=(c.subs[k]||0)+ +m.monto});
 const lista=Object.values(cs).map(c=>({cat:c.cat,total:c.total,prom:c.total/n,subs:Object.entries(c.subs).map(([sub,t])=>({sub,total:t,prom:t/n})).sort((x,y)=>y.total-x.total)})).sort((x,y)=>y.total-x.total),total=lista.reduce((s,c)=>s+c.total,0);
 return{meses:n,lista,total,prom:total/n}}
function planEfectivo(plan){const o={};plan.forEach(p=>{const c=o[p.categoria]=o[p.categoria]||{cat:p.categoria,directo:0,subs:{},sumaSubs:0};if(p.subcategoria){c.subs[p.subcategoria]=+p.monto;c.sumaSubs+= +p.monto}else c.directo=+p.monto});
 return Object.values(o).map(c=>({...c,efectivo:c.directo>0?c.directo:c.sumaSubs}))}
const nivelPres=p=>p>100?'excedido':p>=80?'cerca':'ok';
const r1=x=>Math.round(x*10)/10;
function analisisPresupuesto(real,plan){const pe=planEfectivo(plan),rc=Object.fromEntries(real.lista.map(c=>[c.cat,c]));
 const filas=pe.filter(c=>c.efectivo>0).map(c=>{const r=rc[c.cat],prom=r?r.prom:0,pc=prom/c.efectivo*100,
  subs=Object.entries(c.subs).filter(([,m])=>m>0).map(([s,m])=>{const sr=r&&r.subs.find(x=>x.sub===s),sp=sr?sr.prom:0,pp=sp/m*100;return{sub:s,asignado:m,real:sp,pct:r1(pp),nivel:nivelPres(pp),dif:m-sp}});
  return{cat:c.cat,asignado:c.efectivo,real:prom,total:r?r.total:0,pct:r1(pc),nivel:nivelPres(pc),dif:c.efectivo-prom,subs,sumaSubs:c.sumaSubs,desajuste:c.directo>0&&c.sumaSubs>c.directo}}).sort((x,y)=>y.pct-x.pct);
 const asignado=filas.reduce((s,f)=>s+f.asignado,0),realCon=filas.reduce((s,f)=>s+f.real,0),con=new Set(filas.map(f=>f.cat)),sinPres=real.lista.filter(c=>!con.has(c.cat));
 return{filas,asignado,real:realCon,dif:asignado-realCon,pct:asignado?r1(realCon/asignado*100):0,excedidas:filas.filter(f=>f.nivel==='excedido').length,cercanas:filas.filter(f=>f.nivel==='cerca').length,sinPres,sinProm:sinPres.reduce((s,c)=>s+c.prom,0),meses:real.meses}}
const proyeccionMes=(gastado,hoy)=>gastado/(+hoy.slice(8,10))*matrizMes(hoy.slice(0,7)).n;
function estadoPagos(l,items,anio,hoy){const hy=hoy.slice(0,4),mA=+hoy.slice(5,7),rk={vencido:0,pronto:1,ok:2,pagado:3};
 return items.map(it=>{const tot=Math.max(1,Math.min(12,Math.round(+it.pagos_anio)||12)),meses=Array(12).fill(false);
  l.forEach(m=>{if(m.tipo==='gasto'&&m.fecha.slice(0,4)===anio&&m.categoria===it.categoria&&(!it.subcategoria||m.subcategoria===it.subcategoria)&&(!it.detalle||m.detalle===it.detalle))meses[+m.fecha.slice(5,7)-1]=true});
  const hechos=meses.filter(Boolean).length,faltan=Math.max(0,tot-hechos),lograda=hechos>=tot;let nivel=lograda?'pagado':'ok',restan=0;
  if(!lograda){if(anio<hy)nivel='vencido';else if(anio===hy){restan=12-mA+(meses[mA-1]?0:1);nivel=faltan>restan?'vencido':faltan===restan?'pronto':'ok'}}
  return{...it,pagos_anio:tot,meses,hechos,faltan,lograda,pct:Math.min(100,r1(hechos/tot*100)),nivel,restan,pagadoMes:anio===hy&&meses[mA-1]}}).sort((a,b)=>rk[a.nivel]-rk[b.nivel])}
const api={mesesEquiv,presupuestoReal,planEfectivo,nivelPres,analisisPresupuesto,proyeccionMes,estadoPagos,matrizMes,sumaMes,fechaEnMes,difPorSubcat,mesesEntre,unidadProm,promedioFlex,porSubcat,masFrecuente,estadoMetas,estadoPresupuestos,estadoRecurrentes,ordenarReg,bloquesVs,enSeleccion,diasEntre,anioResumen,pct,fmtPct,fmtCorto,fechaCorta,mesCorto,periodoRapido,validarFilas,norm,paraImportar,MESES,rango,granularidad,serie,tendencia,frecuentes,GASTO,INGRESO,esc,fmt,etiquetaMes,dias,ordenar,filtrar,mesesConDatos,aniosConDatos,totales,porCategoria,porSub,porMes,topProducto};
if(typeof module!=='undefined')module.exports=api;else root.Reports=api;
})(typeof window!=='undefined'?window:globalThis);
