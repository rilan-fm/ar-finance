// Service worker de Ar_Finance: guarda la app en el dispositivo para que abra al instante y funcione sin internet.
// Los DATOS no pasan por aquí (los guarda data.js). Subir V en cada versión, igual que ?v= en index.html.
// 0.17.0: una versión nueva NO se activa sola. Espera a que la persona pulse «Descargar actualización» (con progreso)
// y luego «Instalar y reiniciar». Mensajes de la app: ESTADO, DESCARGAR, ACTIVAR.
const V='0.18.1',SHELL='ar-shell-'+V,CDN='ar-cdn';
const LOCAL=['./','index.html','css/styles.css?v='+V,'js/config.js','js/data.js?v='+V,'js/reports.js?v='+V,'js/icons.js?v='+V,'js/pdf.js?v='+V,'js/voz.js?v='+V,'js/app.js?v='+V,'manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','img/logo-full-dark.png','img/logo-full-light.png'];
const LIBS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.js','https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
const HOSTS=['cdn.jsdelivr.net','cdnjs.cloudflare.com'];
const avisa=async m=>{for(const c of await self.clients.matchAll({includeUncontrolled:true}))c.postMessage({...m,v:V})};
let bajando=null;
// Descarga todo en pasos y avisa el progreso. Devuelve true si los archivos de la app quedaron completos.
function descarga(){return bajando||(bajando=(async()=>{
 const c=await caches.open(SHELL),l=await caches.open(CDN),total=LOCAL.length+LIBS.length;let hecho=0,fallos=0;
 const paso=()=>avisa({tipo:'progreso',hecho:++hecho,total});
 await avisa({tipo:'progreso',hecho:0,total});
 for(const u of LOCAL){try{await c.add(new Request(u,{cache:'reload'}))}catch(e){fallos++}await paso()}
 for(const u of LIBS){try{if(!await l.match(u,{ignoreVary:true}))await l.add(new Request(u,{mode:'cors'}))}catch(e){}await paso()}
 const ok=fallos===0&&!!await c.match('index.html',{ignoreSearch:true});
 if(ok)await c.put('__listo',new Response('1'));
 await avisa({tipo:ok?'listo':'error'});return ok})().finally(()=>{bajando=null}))}
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 // Primera instalación, o migración desde versiones anteriores a 0.17 (que no entienden el aviso nuevo): se activa sola.
 const viejo=(await caches.keys()).some(k=>/^ar-shell-0\.(?:[0-9]|1[0-6])\./.test(k));
 if(!self.registration.active||viejo){if(await descarga())await self.skipWaiting()}})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 const c=await caches.open(SHELL);
 if(!await c.match('__listo'))await descarga().catch(()=>{});   // se activó sin haber descargado (p. ej. al cerrar y abrir la app)
 if(await c.match('index.html',{ignoreSearch:true}))for(const k of await caches.keys())if(k.startsWith('ar-shell-')&&k!==SHELL)await caches.delete(k);
 await self.clients.claim()})())});
self.addEventListener('message',e=>{const d=e.data||{};
 if(d.tipo==='ESTADO')e.waitUntil((async()=>{const c=await caches.open(SHELL);if(e.source)e.source.postMessage({tipo:'estado',v:V,listo:!!await c.match('__listo')})})());
 else if(d.tipo==='DESCARGAR')e.waitUntil(descarga());
 else if(d.tipo==='ACTIVAR')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(HOSTS.includes(u.hostname))return e.respondWith(cdn(r));
 if(u.origin!==location.origin)return;
 if(r.mode==='navigate')return e.respondWith(caches.match('index.html',{ignoreSearch:true}).then(m=>m||fetch(r)));
 e.respondWith(local(r))});
async function local(r){const c=await caches.open(SHELL),m=await c.match(r),ver=r.url.includes('?v=');
 if(m){if(!ver)fetch(r).then(x=>{if(x&&x.ok)c.put(r,x)}).catch(()=>{});return m}
 const m2=await c.match(r,{ignoreSearch:true});
 const red=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x}).catch(()=>null);
 return m2||(await red)||new Response('',{status:504})}
async function cdn(r){const c=await caches.open(CDN),m=await c.match(r.url,{ignoreVary:true});if(m)return m;
 try{const x=await fetch(r);if(x&&(x.ok||x.type==='opaque'))c.put(r.url,x.clone());return x}catch(e){return new Response('',{status:504})}}
