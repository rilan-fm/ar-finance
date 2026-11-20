// Dictado de gastos (0.18.0): lógica pura, sin pantalla. Se prueba en Node (test/voz.test.js).
// parse() separa el texto en gastos; construirLibreta() aprende de tu historial; clasificar() decide categoría › subcategoría › detalle.
(function(root){
const norm=s=>String(s==null?'':s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const STOP=new Set(['de','del','la','el','los','las','a','al','en','por','para','un','una','unos','unas','y','e','con']);
const pal=s=>norm(s).split(' ').filter(w=>w&&!STOP.has(w)).map(w=>w.length>4&&/[nlrdz]es$/.test(w)?w.slice(0,-2):w.length>3&&w.endsWith('s')?w.slice(0,-1):w);
const clave=s=>pal(s).join(' ');
const sumaDias=(iso,d)=>new Date(Date.UTC(+iso.slice(0,4),+iso.slice(5,7)-1,+iso.slice(8,10))+d*864e5).toISOString().slice(0,10);
/* ---------- Separar el texto en gastos ---------- */
/* Regla de oro (0.18.1): solo se registra lo que tiene MONTO. Lo demás (introducción, «y esos son los registros del día», muletillas) se ignora. */
const NUM='(\\d+(?:[.,]\\d{1,2})?)',num=s=>parseFloat(String(s).replace(',','.'));
const L='a-záéíóúñü',W2=a=>new RegExp('(?<!['+L+'])(?:'+a+')(?!['+L+'])','gi');
const MES={enero:1,febrero:2,marzo:3,abril:4,mayo:5,junio:6,julio:7,agosto:8,septiembre:9,setiembre:9,octubre:10,noviembre:11,diciembre:12};
const RELLENO=W2('digamos|osea|o sea|bueno|entonces|pues|por ejemplo');
const CIERRE=/(?:^|\s)(?:y\s+)?(?:(?:esos|esas|estos|estas|eso)\s+(?:son|fueron|es)(?![a-záéíóúñ])|eso\s+es\s+todo|es\s+todo|nada\s+m[aá]s|ya\s+est[aá])[\s\S]*$/i;
const MK=/§([a-z]{2})§/g;
function quitaIntro(s){if(String(s).trim().split(/\s+/).length<3)return s;const re=W2('lista|siguientes?|registrar|registros?|comprado|compramos|compré|compre|fecha');let m,fin=-1;while((m=re.exec(s)))fin=m.index+m[0].length;return fin<0?s:s.slice(fin)}
/* Fechas dichas: «15 de febrero», «el 3 de marzo de 2026», «15/02», «ayer», «anteayer», «hoy». Se cambian por marcas §xx§ para saber desde qué punto del texto rigen. */
function fechasTexto(t,hoy){const fs=[],hy=+hoy.slice(0,4),p2=n=>String(n).padStart(2,'0'),iso=(y,m,d)=>y+'-'+p2(m)+'-'+p2(d);
 const ok=(y,m,d)=>{const x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d};
 const anio=(m,d,y)=>{if(y)return y<100?2000+y:y;return iso(hy,m,d)>hoy?hy-1:hy};   // sin año: el más reciente que no sea futuro
 const mark=f=>{fs.push(f);const k=fs.length-1;return ' §'+String.fromCharCode(97+(k/26|0),97+k%26)+'§ '};
 const pre='(?:(?:el|en fecha|con fecha|de fecha|fecha)\\s+)?';
 t=t.replace(new RegExp(pre+'(?<!\\d)(\\d{1,2})\\s+de\\s+('+Object.keys(MES).join('|')+')(?:\\s+(?:de|del)\\s+(\\d{4}))?(?!\\d)','gi'),(all,d,mes,y)=>{const m=MES[mes.toLowerCase()],yy=anio(m,+d,y?+y:0);return ok(yy,m,+d)?mark(iso(yy,m,+d)):' '});
 t=t.replace(new RegExp(pre+'(?<!\\d)(\\d{1,2})[\\/-](\\d{1,2})(?:[\\/-](\\d{2,4}))?(?!\\d)','gi'),(all,d,m,y)=>{const yy=anio(+m,+d,y?+y:0);return ok(yy,+m,+d)?mark(iso(yy,+m,+d)):' '});   // fecha imposible: se descarta la frase (no se toma como precio)
 t=t.replace(W2('anteayer|antier|ayer|hoy'),w=>{w=w.toLowerCase();return mark(w==='hoy'?null:sumaDias(hoy,w==='ayer'?-1:-2))});
 return{t,fs}}
/* Números dichos en letras («cuarenta», «ciento cincuenta», «dos mil quinientos») → cifras. Algunos teléfonos los escriben así. */
const NP={cero:0,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,trece:13,catorce:14,quince:15,dieciseis:16,diecisiete:17,dieciocho:18,diecinueve:19,veinte:20,veintiuno:21,veintiun:21,veintiuna:21,veintidos:22,veintitres:23,veinticuatro:24,veinticinco:25,veintiseis:26,veintisiete:27,veintiocho:28,veintinueve:29,treinta:30,cuarenta:40,cincuenta:50,sesenta:60,setenta:70,ochenta:80,noventa:90,cien:100,ciento:100,doscientos:200,trescientos:300,cuatrocientos:400,quinientos:500,seiscientos:600,setecientos:700,ochocientos:800,novecientos:900};
const sinAc=w=>w.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),UNO1=new Set(['uno','un','una']);
const tipoNum=w=>{w=sinAc(w);if(w==='mil')return{t:'mil'};if(UNO1.has(w))return{t:'u',v:1,uno:true};if(NP[w]==null)return null;const v=NP[w];return{t:v>=100?'h':v>=30?'ten':v>=10?'teen':'u',v}};
function numerosEnPalabras(texto){const parts=String(texto).split(/([a-záéíóúñüA-ZÁÉÍÓÚÑÜ]+)/);let out=parts[0];
 const run=i=>{let tot=0,cur=0,last='',fin=-1;
  for(let j=i;j<parts.length;j+=2){const lw=sinAc(parts[j]);let x;
   if(lw==='y'){const nx=j+2<parts.length?tipoNum(parts[j+2]):null;if(last==='ten'&&nx&&nx.t==='u'&&/^\s+$/.test(parts[j-1+2]||'')){last='y';if(!/^\s+$/.test(parts[j+1]||''))break;continue}break}
   x=tipoNum(parts[j]);if(!x)break;
   const ok=x.t==='mil'?last!=='mil'&&last!=='y':x.t==='h'?(last===''||last==='mil'):(x.t==='ten'||x.t==='teen')?(last===''||last==='h'||last==='mil'):x.uno?last==='y':(last===''||last==='h'||last==='mil'||last==='y');
   if(!ok)break;
   if(x.t==='mil'){tot+=(cur||1)*1000;cur=0}else cur+=x.v;last=x.t;fin=j;
   if(!/^\s+$/.test(parts[j+1]||''))break}
  return fin<0?null:{fin,val:tot+cur}};
 for(let i=1;i<parts.length;i+=2){const r=run(i);if(r){out+=r.val+(parts[r.fin+1]||'');i=r.fin}else out+=parts[i]+(parts[i+1]||'')}
 return out.replace(/(\d+)\s+con\s+(\d{1,2})(?=\s*(?:bolivianos?|bs\b|bob\b))/gi,'$1.$2')}
function montos(t){const out=[];let m;const a=new RegExp(NUM+'\\s*(?:bolivianos?|bs\\b|bob\\b)|\\b(?:bs|bolivianos?)\\s*'+NUM,'gi');
 while((m=a.exec(t)))out.push({i:m.index,j:m.index+m[0].length,v:num(m[1]||m[2])});
 if(out.length){const c=new RegExp('(?<![\\d.,])'+NUM+'(?=\\s+(?:de|del|para)\\s)','g');   // «40 de carne de res» sin la palabra «bolivianos»
  while((m=c.exec(t)))if(!out.some(o=>m.index>=o.i&&m.index<o.j))out.push({i:m.index,j:m.index+m[0].length,v:num(m[1])});
  return out.sort((x,y)=>x.i-y.i)}
 const b=new RegExp(NUM,'g');while((m=b.exec(t)))out.push({i:m.index,j:m.index+m[0].length,v:num(m[1])});return out}
function limpia(s){let x=String(s||'').replace(/\s+/g,' ').trim(),p;
 do{p=x;x=x.replace(/^(?:compre|compré|compramos|gaste|gasté|pague|pagué|pagamos|y|e|ademas|además|tambien|también|luego|despues|después|otro|otra|de|del|por|en|un|una|unos|unas|a)\s+/i,'').replace(/\s+(?:y|e|de|del|por|en)$/i,'').replace(/^[\s:\-–—]+|[\s:\-–—]+$/g,'')}while(x!==p);
 if(/^(?:y|e|de|del|por|en|a|un|una)$/i.test(x))x='';
 return x?x.charAt(0).toUpperCase()+x.slice(1):''}
/* parse(texto, hoy, info): devuelve SOLO los gastos con monto. Si pasas info, info.ignorados trae lo que se dijo sin monto. */
function parse(texto,hoy,info){const t0=numerosEnPalabras(String(texto||'').replace(/\bbs\./gi,'bs').replace(/\r/g,'\n').replace(RELLENO,' ')),{t,fs}=fechasTexto(t0,hoy);
 let fecha=null;const items=[];
 const sinMarcas=x=>x.replace(MK,' ');
 const mk=(raw,monto)=>{raw=String(raw||'').replace(MK,(_,c)=>{fecha=fs[(c.charCodeAt(0)-97)*26+c.charCodeAt(1)-97];return ' '});return{desc:limpia(quitaIntro(raw.replace(CIERRE,''))),monto,fecha}};
 const chunks=t.split(/[;\n]+|\.(?!\d)|,(?!\d)/).map(x=>x.trim()).filter(Boolean);
 for(const ch of chunks){const ms=montos(ch);
  if(!ms.length){items.push(mk(ch,null));continue}
  if(ms.length===1){items.push(mk(ch.slice(0,ms[0].i)+' '+ch.slice(ms[0].j),ms[0].v));continue}
  const antes=sinMarcas(ch.slice(0,ms[0].i)),primero=limpia(quitaIntro(antes.replace(CIERRE,'')))==='';   // «10 bolivianos de plátano 20 de manzana» (monto primero) o «plátano 10 manzana 20» (monto al final)
  if(primero)mk(ch.slice(0,ms[0].i),null);   // solo para registrar la fecha dicha en la introducción
  ms.forEach((m,k)=>items.push(mk(primero?ch.slice(m.j,k+1<ms.length?ms[k+1].i:ch.length):ch.slice(k?ms[k-1].j:0,m.i),m.v)));
  if(!primero){const resto=mk(ch.slice(ms[ms.length-1].j),null);if(resto.desc)items.push(resto)}}
 const r=[];
 for(const it of items){if(!it.desc&&it.monto!=null&&r.length&&r[r.length-1].monto==null){r[r.length-1].monto=it.monto;continue}   // «plátano, 10 bolivianos»
  if(!it.desc&&it.monto==null)continue;r.push(it)}
 if(info)info.ignorados=r.filter(x=>x.monto==null).map(x=>x.desc);
 return r.filter(x=>x.monto!=null)}
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
const api={numerosEnPalabras,norm,clave,sumaDias,parse,montos,limpia,construirLibreta,clasificar,completo,REGLAS};
if(typeof module!=='undefined')module.exports=api;else root.Voz=api;
})(typeof window!=='undefined'?window:globalThis);
