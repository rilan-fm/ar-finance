// Capa de datos: la interfaz solo usa estos métodos. Adaptadores: memoria y supabase.
(function(root){
function memoria(seed){let m=(seed||[]).map(x=>({...x})),cs=[],n='',k=1,user=null;
 return{nombre:'memoria',
  async sesion(){return user},
  async entrar(email){user={email:email||'demo@local'};return user},
  async registrar(email){return this.entrar(email)},
  async salir(){user=null},
  async listar(){return m.map(x=>({...x}))},
  async agregar(x){const r={...x,id:'m'+k++,creado_en:new Date().toISOString()};m.push(r);return{...r}},
  async agregarVarios(xs){const r=xs.map(x=>({...x,id:'m'+k++,creado_en:new Date().toISOString()}));m.push(...r);return r.map(x=>({...x}))},
  async eliminar(id){m=m.filter(r=>r.id!==id)},
  async listarCats(){return cs.map(x=>({...x}))},
  async guardarCat(c){if(cs.length>=3)throw new Error('Máximo 3 categorías propias');const r={...c,id:'c'+k++};cs.push(r);return{...r}},
  async eliminarCat(id){cs=cs.filter(x=>x.id!==id)},
  async leerNota(){return n},async guardarNota(t){n=t}};}
function supabase(url,key){const c=root.supabase.createClient(url,key);let uid=null;
 const ok=r=>{if(r.error)throw new Error(r.error.message);return r.data};
 const us=u=>u&&(uid=u.id,{email:u.email});
 return{nombre:'supabase',
  async sesion(){const d=ok(await c.auth.getSession());return us(d.session&&d.session.user)},
  async entrar(e,p){return us(ok(await c.auth.signInWithPassword({email:e,password:p})).user)},
  async registrar(e,p){const d=ok(await c.auth.signUp({email:e,password:p}));if(!d.session)throw new Error('Revisa tu correo para confirmar la cuenta.');return us(d.user)},
  async salir(){await c.auth.signOut();uid=null},
  async listar(){return ok(await c.from('movimientos').select('*').order('fecha',{ascending:false}))},
  async agregar(x){return ok(await c.from('movimientos').insert(x).select().single())},
  async agregarVarios(xs){return ok(await c.from('movimientos').insert(xs).select())},
  async eliminar(id){ok(await c.from('movimientos').delete().eq('id',id))},
  async listarCats(){return ok(await c.from('categorias').select('*').order('nombre'))},
  async guardarCat(x){return ok(await c.from('categorias').insert(x).select().single())},
  async eliminarCat(id){ok(await c.from('categorias').delete().eq('id',id))},
  async leerNota(){const d=ok(await c.from('notas').select('texto').maybeSingle());return d?d.texto:''},
  async guardarNota(t){ok(await c.from('notas').upsert({user_id:uid,texto:t,actualizado_en:new Date().toISOString()}))}};}
const api={memoria,supabase};
if(typeof module!=='undefined')module.exports=api;else root.Data=api;
})(typeof window!=='undefined'?window:globalThis);
