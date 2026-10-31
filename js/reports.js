(function(root){
const T=(n,s,d)=>({n,s,d:d||{}});
const GASTO=[
T('Víveres Alimentos',['Abarrotes','Verduras','Lácteos','Carne de res','Carne de pollo','Pan/Masitas','Frutas','Huevo','Otro']),
T('Hogar',['Servicios básicos','Aseo/Higiene personal','Comida fuera de casa','Mantenimiento','Otro'],{'Servicios básicos':['Luz','Agua','Internet','Gas']}),
T('Colegio hijos',['Recreos','Materiales','Pensiones','Cuotas/Aportes','Refrigerios','Uniformes','Otros']),
T('Rilan',['Banco','Coca/Extras','Ocio','Ayuda a familia','Refrigerios','Ropa','Herramientas','Otro']),
T('Ingrid',['Yanbal','Higiene personal','Transporte','Ropa']),
T('Auto',['Combustible','Mantenimiento','Repuestos','Parqueo/Peajes','Otro']),
T('Iglesia',['Diezmo/Ofrenda','Refrigerio','Transporte','Otro']),
T('Universidad hijos',['Pasajes','Materiales','Matrículas/Inscripciones','Otro']),
T('Préstamos',['De familia','De amigos','Otro']),
T('Salud',['Medicamentos','Consulta médica','Laboratorio','Otro']),
T('Viajes en familia',['Comida/Refrigerios','Pasajes/Combustible','Parques/Hotel','Otro'])];
const INGRESO=['Sueldo','Negocio','Ahorros','Regalo','Otros ingresos'];
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
 return[a,b]}
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
  const x={tipo:m.tipo,monto:Math.round(+m.monto*100)/100,fecha:m.fecha,categoria:m.categoria.slice(0,60),subcategoria:m.subcategoria?String(m.subcategoria).slice(0,60):null,detalle:m.detalle?String(m.detalle).slice(0,60):null,descripcion:String(m.descripcion||'').slice(0,120),cantidad:+m.cantidad>0?+m.cantidad:null};
  const k=clave(x);if(!vistos.has(k)){vistos.add(k);out.push(x)}});return out}
const api={paraImportar,MESES,rango,granularidad,serie,tendencia,frecuentes,GASTO,INGRESO,esc,fmt,etiquetaMes,dias,ordenar,filtrar,mesesConDatos,aniosConDatos,totales,porCategoria,porSub,porMes,topProducto};
if(typeof module!=='undefined')module.exports=api;else root.Reports=api;
})(typeof window!=='undefined'?window:globalThis);
