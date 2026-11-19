// Dictado de gastos (0.18.0): lógica pura, sin pantalla. Se prueba en Node (test/voz.test.js).
// parse() separa el texto en gastos; construirLibreta() aprende de tu historial; clasificar() decide categoría › subcategoría › detalle.
(function(root){
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const STOP=new Set(['de','del','la','el','los','las','a','al','en','por','para','un','una','unos','unas','y','e','con']);
const pal=s=>norm(s).split(' ').filter(w=>w&&!STOP.has(w)).map(w=>w.length>4&&/[nlrdz]es$/.test(w)?w.slice(0,-2):w.length>3&&w.endsWith('s')?w.slice(0,-1):w);
const clave=s=>pal(s).join(' ');
const sumaDias=(iso,d)=>new Date(Date.UTC(+iso.slice(0,4),+iso.slice(5,7)-1,+iso.slice(8,10))+d*864e5).toISOString().slice(0,10);
/* ---------- Separar el texto en gastos ---------- */
const NUM='(\\d+(?:[.,]\\d{1,2})?)',num=s=>parseFloat(String(s).replace(',','.'));
function montos(t){const out=[];let m;const a=new RegExp(NUM+'\\s*(?:bolivianos?|bs\\b|bob\\b)|\\b(?:bs|bolivianos?)\\s*'+NUM,'gi');
 while((m=a.exec(t)))out.push({i:m.index,j:m.index+m[0].length,v:num(m[1]||m[2])});
 if(out.length)return out;
 const b=new RegExp(NUM,'g');while((m=b.exec(t)))out.push({i:m.index,j:m.index+m[0].length,v:num(m[1])});return out}
function limpia(s){let x=String(s||'').replace(/\s+/g,' ').trim(),p;
 do{p=x;x=x.replace(/^(?:compre|compré|compramos|gaste|gasté|pague|pagué|pagamos|y|e|ademas|además|tambien|también|luego|despues|después|otro|otra|de|del|por|en|un|una|unos|unas|a)\s+/i,'').replace(/\s+(?:y|e|de|del|por|en)$/i,'').replace(/^[\s:\-–—]+|[\s:\-–—]+$/g,'')}while(x!==p);
 if(/^(?:y|e|de|del|por|en|a|un|una)$/i.test(x))x='';
 return x?x.charAt(0).toUpperCase()+x.slice(1):''}
function parse(texto,hoy){const t=String(texto||'').replace(/\bbs\./gi,'bs').replace(/\r/g,'\n'),chunks=t.split(/[;\n]+|\.(?!\d)|,(?!\d)/).map(x=>x.trim()).filter(Boolean),items=[];let fecha=null;
 for(const c0 of chunks){let ch=c0;const fd=ch.match(/\b(anteayer|antier|ayer|hoy)\b/i);
  if(fd){const w=fd[1].toLowerCase();fecha=w==='hoy'?null:sumaDias(hoy,w==='ayer'?-1:-2);ch=ch.replace(new RegExp('\\b'+fd[1]+'\\b','ig'),' ')}
  const ms=montos(ch);
  if(!ms.length){items.push({desc:limpia(ch),monto:null,fecha});continue}
  if(ms.length===1){items.push({desc:limpia(ch.slice(0,ms[0].i)+' '+ch.slice(ms[0].j)),monto:ms[0].v,fecha});continue}
  const primero=limpia(ch.slice(0,ms[0].i))==='';   // «10 bolivianos de plátano 20 de manzana» (monto primero) o «plátano 10 manzana 20» (monto al final)
  ms.forEach((m,k)=>items.push({desc:limpia(primero?ch.slice(m.j,k+1<ms.length?ms[k+1].i:ch.length):ch.slice(k?ms[k-1].j:0,m.i)),monto:m.v,fecha}));
  if(!primero){const resto=limpia(ch.slice(ms[ms.length-1].j));if(resto)items.push({desc:resto,monto:null,fecha})}}
 const r=[];
 for(const it of items){if(!it.desc&&it.monto!=null&&r.length&&r[r.length-1].monto==null){r[r.length-1].monto=it.monto;continue}   // «plátano, 10 bolivianos»
  if(!it.desc&&it.monto==null)continue;r.push(it)}
 return r}
/* ---------- Diccionario inicial (se afina con las pruebas reales) ---------- */
const W=(a,pl)=>new RegExp('\\b(?:'+a+')'+(pl===false?'':'(?:e?s)?')+'\\b');
const NIN='caleb|aitana|hijo|hija|hijos|hijas|nino|nina|ninos|ninas',ROPA='zapato|zapatilla|ropa|polera|pantalon|chamarra|calzado|media|buzo|casaca|camisa|vestido|short|chompa|sandalia|ojota|jean|calcetin';
const ROP=n=>new RegExp('^(?=.*\\b(?:'+ROPA+')(?:e?s)?\\b)(?=.*\\b(?:'+n+')\\b)');
const VIV='Víveres Alimentos',SB='Servicios básicos';
const REGLAS=[
 [ROP(NIN),'Hogar','Ropa y zapatos hijos','',20],[ROP('rilan|papa|esposo'),'Rilan','Ropa','',20],[ROP('ingrid|mama|esposa'),'Ingrid','Ropa','',20],
 [W('broa?ster|brasa|pollo frito|spiedo|pizza|hamburguesa|salchipapa|almuerzo|cena|desayuno|saltena|empanada|pique|restaurante|helado|sandwich|pollo cocido|anticucho|chicharron|silpancho|pacumuto|charque|menu'),'Hogar','Comida fuera de casa','',15],
 [W('comida'),'Hogar','Comida fuera de casa','',5],
 [W('huevo'),VIV,'Huevo','',5],[W('pollo|pechuga|alita|muslo'),VIV,'Carne de pollo','',5],
 [W('carne|res|bife|costilla|higado|lomo|molida|asado|cerdo|chancho|chuleta|chorizo|salchicha|jamon'),VIV,'Carne de res','',0],
 [W('pan|masita|marraqueta|tantawawa|pastel|torta|galleta'),VIV,'Pan/Masitas','',0],
 [W('platano|banano|banana|manzana|naranja|mandarina|uva|papaya|sandia|durazno|pera|frutilla|limon|pina|mango|melon|fruta|chirimoya|palta|tuna|cereza|ciruela'),VIV,'Frutas','',0],
 [W('tomate|cebolla|papa|zanahoria|lechuga|verdura|locoto|choclo|arveja|haba|ajo|pimenton|zapallo|pepino|apio|repollo|acelga|perejil|camote|yuca|brocoli|coliflor|rabano|nabo|vainita|espinaca|remolacha'),VIV,'Verduras','',0],
 [W('leche|queso|yogur|yogurt|mantequilla|crema de leche|requeson'),VIV,'Lácteos','',0],
 [W('arroz|fideo|azucar|aceite|harina|sal|atun|lenteja|avena|cafe|chocolate|mermelada|salsa|ketchup|mayonesa|sardina|gelatina|cereal|quinua|chuno|maiz|tallarin'),VIV,'Abarrotes','',0],
 [W('coca cola|gaseosa|refresco|jugo|agua mineral'),VIV,'Abarrotes','',10],
 [W('luz|electricidad|elfec',false),'Hogar',SB,'Luz',10],
 [/\b(?:factura|recibo|cuenta|pago|servicio|boleta)\s+(?:de\s+)?(?:la\s+)?agua\b|^agua$|\bsemapa\b/,'Hogar',SB,'Agua',12],
 [W('internet|wifi|wi fi',false),'Hogar',SB,'Internet',10],[W('gas|garrafa'),'Hogar',SB,'Gas',10],
 [W('jabon|shampoo|champu|detergente|lavandina|papel higienico|pasta dental|crema dental|dentifrico|desodorante|limpiador|escoba|trapeador|cepillo|esponja|desinfectante|ambientador|panal'),'Hogar','Aseo/Higiene personal','',0],
 [W('plomero|electricista|albanil|reparacion|arreglo|pintura|foco|cerradura'),'Hogar','Mantenimiento','',0],
 [W('pension|mensualidad'),'Colegio hijos','Pensiones','',10],[W('cuaderno|libro|lapiz|lapices|lapicero|cartulina|folder|regla|material escolar|materiales|tijera|pegamento'),'Colegio hijos','Materiales','',5],
 [W('uniforme'),'Colegio hijos','Uniformes','',5],[W('recreo|kiosco'),'Colegio hijos','Recreos','',5],[W('aporte|cuota del curso|cuota de curso'),'Colegio hijos','Cuotas/Aportes','',5],
 [W('banco|cuota del banco'),'Rilan','Banco','',10],[W('coca|chofer|chofercito|mate de coca'),'Rilan','Coca/Extras','',0],[W('cine|pesca|billar|futbol|cancha'),'Rilan','Ocio','',5],
 [W('yanbal',false),'Ingrid','Yanbal','',10],[W('diezmo|ofrenda'),'Iglesia','Diezmo/Ofrenda','',10],
 [W('gasolina|diesel|combustible|nafta|surtidor'),'Auto','Combustible','',10],[W('parqueo|peaje|estacionamiento'),'Auto','Parqueo/Peajes','',10],
 [W('mecanico|llanta|bateria|freno|cambio de aceite|aceite de motor|lavado de auto|lavado de carro'),'Auto','Mantenimiento','',12],[W('repuesto|amortiguador|filtro'),'Auto','Repuestos','',10],
 [W('medicina|medicamento|remedio|farmacia|pastilla|jarabe|vitamina|paracetamol|ibuprofeno|antibiotico'),'Salud','Medicamentos','',5],[W('consulta|doctor|medico|dentista|pediatra'),'Salud','Consulta médica','',5],[W('laboratorio|analisis|radiografia|ecografia'),'Salud','Laboratorio','',5],
 [W('prestamo'),'Préstamos','','',5],[W('matricula|inscripcion'),'Universidad hijos','Matrículas/Inscripciones','',5],[/^(?=.*\bpasajes?\b)(?=.*\buniversidad\b)/,'Universidad hijos','Pasajes','',20],
 [W('hotel|parque'),'Viajes en familia','Parques/Hotel','',5]];
/* ---------- Libreta: lo que ya registraste + lo que corriges en la pantalla de revisión ---------- */
function construirLibreta(movs,apr){const g={};
 (movs||[]).forEach(m=>{if(m.tipo!=='gasto'||!m.categoria)return;const k=clave(m.descripcion);if(!k)return;const id=[m.categoria,m.subcategoria||'',m.detalle||''].join('|'),e=g[k]=g[k]||{};e[id]=(e[id]||0)+1});
 const exact={},lista=[];
 Object.entries(g).forEach(([k,e])=>{const id=Object.entries(e).sort((a,b)=>b[1]-a[1])[0][0],[c,s,d]=id.split('|'),x={key:k,words:k.split(' '),c,s,d,ap:false};exact[k]=x;lista.push(x)});
 Object.entries(apr||{}).forEach(([k,v])=>{if(!k||!v||!v.c)return;const x={key:k,words:k.split(' '),c:v.c,s:v.s||'',d:v.d||'',ap:true};if(exact[k])lista[lista.indexOf(exact[k])]=x;else lista.push(x);exact[k]=x});
 return{exact,lista}}
function completo(tree,c,s,d){const n=tree.find(x=>x.n===c);if(!n)return false;
 if(n.s.length){if(!s||!n.s.includes(s))return false;const ds=n.d&&n.d[s];if(ds&&(!d||!ds.includes(d)))return false}else if(s)return false;return true}
/* Puntajes: aprendido 110 > historial exacto 100 > diccionario 60-80 > historial parcial (solo si cubre más de la mitad de las palabras) 43-60 */
function clasificar(desc,lib,tree){const n=norm(desc),k=clave(desc),w=pal(desc),cand=[];lib=lib||{exact:{},lista:[]};
 const ex=lib.exact[k];if(ex)cand.push({c:ex.c,s:ex.s,d:ex.d,sc:ex.ap?110:100,f:ex.ap?'aprendido':'historial'});
 for(const r of REGLAS)if(r[0].test(n))cand.push({c:r[1],s:r[2],d:r[3],sc:60+r[4],f:'diccionario'});
 for(const e of lib.lista)if(e.key!==k&&e.words.length&&e.words.length*2>w.length&&e.words.every(x=>w.includes(x)))cand.push({c:e.c,s:e.s,d:e.d,sc:40+3*e.words.length+(e.ap?5:0),f:e.ap?'aprendido':'historial'});
 cand.sort((a,b)=>b.sc-a.sc);
 for(const x of cand){const nd=tree.find(c=>c.n===x.c);if(!nd)continue;const s=x.s&&nd.s.includes(x.s)?x.s:'',d=s&&nd.d&&nd.d[s]&&nd.d[s].includes(x.d)?x.d:'';return{c:x.c,s,d,f:x.f,ok:completo(tree,x.c,s,d)}}
 return{c:'',s:'',d:'',f:'',ok:false}}
const api={norm,clave,sumaDias,parse,montos,limpia,construirLibreta,clasificar,completo,REGLAS};
if(typeof module!=='undefined')module.exports=api;else root.Voz=api;
})(typeof window!=='undefined'?window:globalThis);
