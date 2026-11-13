// Service worker de Ar_Finance: guarda la app en el teléfono para que abra al instante y funcione sin internet.
// Los DATOS no pasan por aquí (los guarda data.js). Subir V en cada versión, igual que ?v= en index.html.
const V='0.14.1',SHELL='ar-shell-'+V,CDN='ar-cdn';
const LOCAL=['./','index.html','css/styles.css?v='+V,'js/config.js','js/data.js?v='+V,'js/reports.js?v='+V,'js/icons.js?v='+V,'js/pdf.js?v='+V,'js/app.js?v='+V,'manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','img/logo-full-dark.png','img/logo-full-light.png'];
const LIBS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.js','https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];
const HOSTS=['cdn.jsdelivr.net','cdnjs.cloudflare.com'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 const c=await caches.open(SHELL),l=await caches.open(CDN);
 await Promise.allSettled(LOCAL.map(u=>c.add(new Request(u,{cache:'reload'}))));
 await Promise.allSettled(LIBS.map(async u=>{if(!await l.match(u,{ignoreVary:true}))await l.add(new Request(u,{mode:'cors'}))}));
 await self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
 for(const k of await caches.keys())if(k.startsWith('ar-shell-')&&k!==SHELL)await caches.delete(k);
 await self.clients.claim()})())});
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
