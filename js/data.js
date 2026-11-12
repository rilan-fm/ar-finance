// Capa de datos: la interfaz solo usa estos métodos. Adaptadores: memoria y supabase.
(function(root){
function memoria(seed,pres,rec,met,plan,pag){let pl=(plan||[]).map(x=>({...x})),pg=(pag||[]).map(x=>({...x})),m=(seed||[]).map(x=>({...x})),ps=(pres||[]).map(x=>({...x})),rc=(rec||[]).map(x=>({...x})),mt=(met||[]).map(x=>({...x})),cs=[],n='',k=1,user=null;
 return{nombre:'memoria',
  async sesion(){return user},
  async entrar(email){user={email:email||'demo@local'};return user},
  async registrar(email){return this.entrar(email)},
  async salir(){user=null},
  async listar(){return m.map(x=>({...x}))},
  async agregar(x){const r={...x,id:'m'+k++,creado_en:new Date().toISOString()};m.push(r);return{...r}},
  async agregarVarios(xs){const r=xs.map(x=>({...x,id:'m'+k++,creado_en:new Date().toISOString()}));m.push(...r);return r.map(x=>({...x}))},
  async eliminar(id){m=m.filter(r=>r.id!==id)},
  async actualizar(id,x){const r=m.find(q=>q.id===id);if(!r)throw new Error('El movimiento no existe');Object.assign(r,x);return{...r}},
  async listarPres(){return ps.map(x=>({...x}))},
  async guardarPres(p){const e=ps.find(x=>x.categoria===p.categoria);if(e){e.monto=p.monto;return{...e}}const r={...p,id:'np'+k++};ps.push(r);return{...r}},
  async eliminarPres(id){ps=ps.filter(x=>x.id!==id)},
  async listarRec(){return rc.map(x=>({...x}))},
  async guardarRec(r){const x={...r,id:'nr'+k++};rc.push(x);return{...x}},
  async eliminarRec(id){rc=rc.filter(x=>x.id!==id)},
  async renombrarPresRec(a,b){ps.forEach(x=>{if(x.categoria===a)x.categoria=b});rc.forEach(x=>{if(x.categoria===a)x.categoria=b})},
  async listarMetas(){return mt.map(x=>({...x}))},
  async guardarMeta(x){const r={...x,id:'nm'+k++};mt.push(r);return{...r}},
  async actualizarMeta(id,x){const r=mt.find(q=>q.id===id);if(!r)throw new Error('La meta no existe');Object.assign(r,x);return{...r}},
  async eliminarMeta(id){mt=mt.filter(x=>x.id!==id)},
  async listarPlan(){return pl.map(x=>({...x}))},
  async guardarPlan(p){const e=pl.find(x=>x.categoria===p.categoria&&(x.subcategoria||null)===(p.subcategoria||null));if(e){e.monto=p.monto;return{...e}}const r={...p,subcategoria:p.subcategoria||null,id:'nl'+k++};pl.push(r);return{...r}},
  async eliminarPlan(id){pl=pl.filter(x=>x.id!==id)},
  async listarPagos(){return pg.map(x=>({...x}))},
  async guardarPago(x){const r={...x,id:'ng'+k++};pg.push(r);return{...r}},
  async actualizarPago(id,x){const r=pg.find(q=>q.id===id);if(!r)throw new Error('El pago no existe');Object.assign(r,x);return{...r}},
  async eliminarPago(id){pg=pg.filter(x=>x.id!==id)},
  async renombrarPlan(a,b){pl.forEach(x=>{if(x.categoria===a)x.categoria=b});pg.forEach(x=>{if(x.categoria===a)x.categoria=b})},
  async listarCats(){return cs.map(x=>({...x}))},
  async guardarCat(c){if(cs.length>=3)throw new Error('Máximo 3 categorías propias');const r={...c,id:'c'+k++};cs.push(r);return{...r}},
  async eliminarCat(id){cs=cs.filter(x=>x.id!==id)},
  async actualizarCat(id,x){const c=cs.find(r=>r.id===id);if(!c)throw new Error('La categoría no existe');Object.assign(c,x);return{...c}},
  async renombrarCat(a,b){m.forEach(r=>{if(r.tipo==='gasto'&&r.categoria===a)r.categoria=b})},
  async cambiarClave(p){if(!p||p.length<6)throw new Error('La contraseña debe tener al menos 6 caracteres.')},
  async leerNota(){return n},async guardarNota(t){n=t}};}
const conTiempo=(u,o)=>{o=o||{};const ac=new AbortController(),m=String(o.method||(u&&u.method)||'GET').toUpperCase(),url=String((u&&u.url)||u),ms=url.includes('/auth/v1/')?20000:m==='GET'?12000:7000,t=setTimeout(()=>ac.abort(),ms);
 return root.fetch(u,o.signal?o:{...o,signal:ac.signal}).finally(()=>clearTimeout(t))};
function supabase(url,key){const c=root.supabase.createClient(url,key,{global:{fetch:conTiempo}});let uid=null;
 const ok=r=>{if(r.error){const e=new Error(r.error.message);e.status=r.status||r.error.status||0;if(!e.status||e.status===401||r.error.name==='AuthRetryableFetchError'||/fetch|network|abort|load failed/i.test(String(r.error.message)))e.red=true;throw e}return r.data};
 const us=u=>u&&(uid=u.id,{email:u.email,id:u.id});
 return{nombre:'supabase',
  async sesion(){const d=ok(await c.auth.getSession());return us(d.session&&d.session.user)},
  async entrar(e,p){return us(ok(await c.auth.signInWithPassword({email:e,password:p})).user)},
  async registrar(e,p){const d=ok(await c.auth.signUp({email:e,password:p}));if(!d.session)throw new Error('Revisa tu correo para confirmar la cuenta.');return us(d.user)},
  async salir(){await c.auth.signOut({scope:'local'});uid=null},
  async listar(){return ok(await c.from('movimientos').select('*').order('fecha',{ascending:false}))},
  async agregar(x){return ok(await c.from('movimientos').insert(x).select().single())},
  async agregarVarios(xs){return ok(await c.from('movimientos').insert(xs).select())},
  async insertarIdem(rs){ok(await c.from('movimientos').upsert(rs,{onConflict:'id',ignoreDuplicates:true}))},
  async eliminar(id){ok(await c.from('movimientos').delete().eq('id',id))},
  async actualizar(id,x){return ok(await c.from('movimientos').update(x).eq('id',id).select().single())},
  async listarPres(){return ok(await c.from('presupuestos').select('*').order('categoria'))},
  async guardarPres(p){return ok(await c.from('presupuestos').upsert({...p,user_id:uid},{onConflict:'user_id,categoria'}).select().single())},
  async eliminarPres(id){ok(await c.from('presupuestos').delete().eq('id',id))},
  async listarRec(){return ok(await c.from('recurrentes').select('*').order('dia'))},
  async guardarRec(r){return ok(await c.from('recurrentes').insert(r).select().single())},
  async eliminarRec(id){ok(await c.from('recurrentes').delete().eq('id',id))},
  async renombrarPresRec(a,b){ok(await c.from('presupuestos').update({categoria:b}).eq('categoria',a));ok(await c.from('recurrentes').update({categoria:b}).eq('categoria',a))},
  async listarMetas(){return ok(await c.from('metas').select('*').order('creado_en'))},
  async guardarMeta(x){return ok(await c.from('metas').insert(x).select().single())},
  async actualizarMeta(id,x){return ok(await c.from('metas').update(x).eq('id',id).select().single())},
  async eliminarMeta(id){ok(await c.from('metas').delete().eq('id',id))},
  async listarPlan(){return ok(await c.from('plan_presupuesto').select('*').order('categoria'))},
  async guardarPlan(p){let q=c.from('plan_presupuesto').select('id').eq('categoria',p.categoria);q=p.subcategoria?q.eq('subcategoria',p.subcategoria):q.is('subcategoria',null);const e=ok(await q.maybeSingle());
   return e?ok(await c.from('plan_presupuesto').update({monto:p.monto}).eq('id',e.id).select().single()):ok(await c.from('plan_presupuesto').insert({categoria:p.categoria,subcategoria:p.subcategoria||null,monto:p.monto}).select().single())},
  async eliminarPlan(id){ok(await c.from('plan_presupuesto').delete().eq('id',id))},
  async listarPagos(){return ok(await c.from('pagos_anuales').select('*').order('creado_en'))},
  async guardarPago(x){return ok(await c.from('pagos_anuales').insert(x).select().single())},
  async actualizarPago(id,x){return ok(await c.from('pagos_anuales').update(x).eq('id',id).select().single())},
  async eliminarPago(id){ok(await c.from('pagos_anuales').delete().eq('id',id))},
  async renombrarPlan(a,b){ok(await c.from('plan_presupuesto').update({categoria:b}).eq('categoria',a));ok(await c.from('pagos_anuales').update({categoria:b}).eq('categoria',a))},
  async listarCats(){return ok(await c.from('categorias').select('*').order('nombre'))},
  async guardarCat(x){return ok(await c.from('categorias').insert(x).select().single())},
  async eliminarCat(id){ok(await c.from('categorias').delete().eq('id',id))},
  async actualizarCat(id,x){return ok(await c.from('categorias').update(x).eq('id',id).select().single())},
  async renombrarCat(a,b){ok(await c.from('movimientos').update({categoria:b}).eq('tipo','gasto').eq('categoria',a))},
  async cambiarClave(p){ok(await c.auth.updateUser({password:p}))},
  async leerNota(){const d=ok(await c.from('notas').select('texto').maybeSingle());return d?d.texto:''},
  async guardarNota(t){ok(await c.from('notas').upsert({user_id:uid,texto:t,actualizado_en:new Date().toISOString()}))}};}
const esRed=e=>!!e&&(e.red===true||/failed to fetch|networkerror|network request failed|load failed|abort|timeout|fetch/i.test(String(e.message||'')));
const nuevoId=()=>{try{if(root.crypto&&root.crypto.randomUUID)return root.crypto.randomUUID()}catch(e){}return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16)})};
function almacenIDB(){let dbp=null;const abre=()=>dbp||(dbp=new Promise((ok,no)=>{const r=root.indexedDB.open('ar_finance',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}));
 const tx=async(modo,f)=>{const db=await abre();return new Promise((ok,no)=>{const t=db.transaction('kv',modo),r=f(t.objectStore('kv'));t.oncomplete=()=>ok(r&&r.result);t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)})};
 return{get:k=>tx('readonly',s=>s.get(k)),set:(k,v)=>tx('readwrite',s=>s.put(v,k)),del:k=>tx('readwrite',s=>s.delete(k)),
  async limpiar(pre){const db=await abre();return new Promise((ok,no)=>{const t=db.transaction('kv','readwrite'),r=t.objectStore('kv').openCursor();r.onsuccess=()=>{const c=r.result;if(c){if(String(c.key).startsWith(pre))c.delete();c.continue()}};t.oncomplete=()=>ok();t.onerror=()=>no(t.error)})}}}
/* Capa «sin conexión»: guarda una copia local de tus datos y una cola de cambios en movimientos y nota. Se sincroniza sola al volver internet.
   Cada movimiento nuevo lleva un id propio (uuid) y se envía con upsert: si se reintenta, nunca se duplica. */
function conCola(inner,kv,env){env=env||{};
 const online=env.online||(()=>typeof navigator==='undefined'||navigator.onLine!==false),uuid=env.uuid||nuevoId,ahora=env.ahora||(()=>new Date().toISOString()),MSGOFF='Sin conexión: esta acción necesita internet.';
 const kget=async k=>{try{return await kv.get(k)}catch(e){return undefined}},kset=async(k,v)=>{try{await kv.set(k,v)}catch(e){}},cl=x=>x==null?x:JSON.parse(JSON.stringify(x));
 let uid='',q=[],fallos=[],cache={},sinc=false;const cbs=[],cbsSync=[];
 const K=n=>'ar:'+uid+':'+n,estado=()=>({pendientes:q.length,sincronizando:sinc,fallos:fallos.slice(),online:online()}),emit=()=>{const s=estado();cbs.forEach(f=>{try{f(s)}catch(e){}})},guardaQ=()=>kset(K('q'),q),guardaC=n=>kset(K(n),cache[n]);
 async function cargar(){q=(await kget(K('q')))||[];fallos=(await kget(K('fallos')))||[];cache={};for(const n of['movs','cats','plan','pagos','metas','nota']){const v=await kget(K(n));if(v!==undefined)cache[n]=v}}
 async function fijar(u){if(u.id)uid=u.id;await kset('ar:user',{id:uid,email:u.email});await cargar();emit();return u}
 const leer=async(n,fn,def)=>{if(online()){try{const d=await fn();cache[n]=d;await guardaC(n);return cl(d)}catch(e){if(!esRed(e))throw e}}return cl(cache[n]!==undefined?cache[n]:def)};
 const REF={cats:'listarCats',plan:'listarPlan',pagos:'listarPagos',metas:'listarMetas',movs:'listar'};
 const refresca=ns=>ns.forEach(n=>{if(n==='movs'&&q.length)return;Promise.resolve().then(()=>inner[REF[n]]()).then(d=>{cache[n]=d;return guardaC(n)}).catch(()=>{})});
 const directo=async(fn,ns)=>{if(!online())throw new Error(MSGOFF);try{const r=await fn();refresca(ns);return r}catch(e){if(esRed(e))throw new Error(MSGOFF);throw e}};
 async function aplicar(o){if(o.op==='add')return inner.insertarIdem([o.x]);
  if(o.op==='addv'){for(let i=0;i<o.rows.length;i+=200)await inner.insertarIdem(o.rows.slice(i,i+200));return}
  if(o.op==='del')return inner.eliminar(o.id);if(o.op==='upd')return inner.actualizar(o.id,o.x);if(o.op==='nota')return inner.guardarNota(o.t)}
 async function sincronizar(sinCb){if(sinc||!q.length||!online())return !q.length;sinc=true;emit();let hubo=false;
  try{let u=null;try{u=await inner.sesion()}catch(e){if(esRed(e))return false;throw e}
   if(!u)return false;
   while(q.length){const o=q[0];let parar=false;
    try{await aplicar(o)}catch(e){if(esRed(e)||e.status===401)parar=true;else{fallos.push({op:o.op,msg:String(e.message||e)});await kset(K('fallos'),fallos)}}
    if(parar)break;q.shift();hubo=true;await guardaQ()}
  }catch(e){}finally{sinc=false;emit()}
  if(!q.length&&hubo&&!sinCb)cbsSync.forEach(f=>{try{f()}catch(e){}});
  return !q.length}
 const antes=async()=>{if(q.length&&online())await sincronizar(true)},movs=()=>cache.movs||(cache.movs=[]);
 const w={...inner,nombre:'supabase+cola',
  async sesion(){let u=null,err=null;try{u=await inner.sesion()}catch(e){err=e}
   if(u)return fijar(u);
   if(!online()||(err&&esRed(err))){const g=await kget('ar:user');if(g&&g.id){uid=g.id;await cargar();emit();return{email:g.email,id:g.id}}}
   if(err)throw err;return null},
  async entrar(e,p){return fijar(await inner.entrar(e,p))},
  async registrar(e,p){return fijar(await inner.registrar(e,p))},
  async salir(){try{await inner.salir()}catch(e){}try{await kv.limpiar(K(''));await kv.del('ar:user')}catch(e){}uid='';q=[];cache={};fallos=[]},
  async listar(){if(q.length&&online())await sincronizar(true);if(q.length)return cl(cache.movs||[]);return leer('movs',()=>inner.listar(),[])},
  async agregar(x){await antes();const r={...x,id:uuid(),creado_en:ahora()};
   if(online()&&!q.length){try{const s=await inner.agregar({...x,id:r.id});movs().push(s);await guardaC('movs');return cl(s)}catch(e){if(!esRed(e))throw e}}
   movs().push(r);q.push({op:'add',x:r});await guardaC('movs');await guardaQ();emit();return cl(r)},
  async agregarVarios(xs){await antes();const rows=xs.map(x=>({...x,id:uuid(),creado_en:ahora()}));
   if(online()&&!q.length){try{const s=await inner.agregarVarios(rows);movs().push(...s);await guardaC('movs');return cl(s)}catch(e){if(!esRed(e))throw e}}
   movs().push(...rows);q.push({op:'addv',rows});await guardaC('movs');await guardaQ();emit();return cl(rows)},
  async eliminar(id){await antes();
   if(online()&&!q.length){try{await inner.eliminar(id);cache.movs=movs().filter(m=>m.id!==id);await guardaC('movs');return}catch(e){if(!esRed(e))throw e}}
   cache.movs=movs().filter(m=>m.id!==id);await guardaC('movs');
   const i=sinc?-1:q.findIndex(o=>o.op==='add'&&o.x.id===id);if(i>=0)q.splice(i,1);else q.push({op:'del',id});await guardaQ();emit()},
  async actualizar(id,x){await antes();const aplicaC=()=>{cache.movs=movs().map(m=>m.id===id?{...m,...x}:m)};
   if(online()&&!q.length){try{const s=await inner.actualizar(id,x);aplicaC();await guardaC('movs');return cl(s)}catch(e){if(!esRed(e))throw e}}
   const i=sinc?-1:q.findIndex(o=>o.op==='add'&&o.x.id===id);if(i>=0)Object.assign(q[i].x,x);else q.push({op:'upd',id,x:{...x}});
   aplicaC();await guardaC('movs');await guardaQ();emit();return cl(movs().find(m=>m.id===id)||{id,...x})},
  async leerNota(){if(q.some(o=>o.op==='nota'))return cache.nota||'';return leer('nota',()=>inner.leerNota(),'')},
  async guardarNota(t){await antes();cache.nota=t;await guardaC('nota');
   if(online()&&!q.length){try{await inner.guardarNota(t);return}catch(e){if(!esRed(e))throw e}}
   if(!sinc)q=q.filter(o=>o.op!=='nota');q.push({op:'nota',t});await guardaQ();emit()},
  listarCats:()=>leer('cats',()=>inner.listarCats(),[]),listarPlan:()=>leer('plan',()=>inner.listarPlan(),[]),listarPagos:()=>leer('pagos',()=>inner.listarPagos(),[]),listarMetas:()=>leer('metas',()=>inner.listarMetas(),[]),
  guardarCat:x=>directo(()=>inner.guardarCat(x),['cats']),eliminarCat:i=>directo(()=>inner.eliminarCat(i),['cats']),actualizarCat:(i,x)=>directo(()=>inner.actualizarCat(i,x),['cats']),renombrarCat:(a,b)=>directo(()=>inner.renombrarCat(a,b),['movs']),
  guardarPlan:p=>directo(()=>inner.guardarPlan(p),['plan']),eliminarPlan:i=>directo(()=>inner.eliminarPlan(i),['plan']),renombrarPlan:(a,b)=>directo(()=>inner.renombrarPlan(a,b),['plan','pagos']),
  guardarPago:x=>directo(()=>inner.guardarPago(x),['pagos']),actualizarPago:(i,x)=>directo(()=>inner.actualizarPago(i,x),['pagos']),eliminarPago:i=>directo(()=>inner.eliminarPago(i),['pagos']),
  guardarMeta:x=>directo(()=>inner.guardarMeta(x),['metas']),actualizarMeta:(i,x)=>directo(()=>inner.actualizarMeta(i,x),['metas']),eliminarMeta:i=>directo(()=>inner.eliminarMeta(i),['metas']),
  cambiarClave:p=>directo(()=>inner.cambiarClave(p),[]),
  estado,alCambiar:f=>{cbs.push(f)},alSincronizar:f=>{cbsSync.push(f)},sincronizar:()=>sincronizar(),
  descartarFallos(){fallos=[];kset(K('fallos'),[]);emit()},
  leerCache(){return cache.movs?{movs:cl(cache.movs),custom:cl(cache.cats||[]),plan:cl(cache.plan||[]),pagos:cl(cache.pagos||[]),plOk:cache.plan!==undefined&&cache.pagos!==undefined,metas:cl(cache.metas||[]),metOk:cache.metas!==undefined,nota:cache.nota||''}:null}};
 if(!env.sinEventos&&typeof window!=='undefined'){window.addEventListener('online',()=>{emit();sincronizar()});window.addEventListener('offline',emit);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&q.length)sincronizar()});setInterval(()=>{if(q.length&&online())sincronizar()},30000)}
 return w}
const api={memoria,supabase,conCola,almacenIDB,esRed};
if(typeof module!=='undefined')module.exports=api;else root.Data=api;
})(typeof window!=='undefined'?window:globalThis);
