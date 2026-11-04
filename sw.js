/* JR Barbearia — service worker. Rede primeiro para o painel (nunca fica velho);
   sem internet usa a última cópia. Firebase e fontes ficam guardados para abrir offline. */
const V='jr-v8';
const SHELL=['./','./painel-jr-1.index.html','./manifest.json','./icon-192.png','./apple-touch-icon.png','./icon-512.png','./icon-maskable-512.png'];
const FB=['app','firestore'].map(n=>'https://cdnjs.cloudflare.com/ajax/libs/firebase/12.17.1/firebase-'+n+'-compat.min.js');
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(V);
  await Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})));
  await Promise.all(FB.map(u=>fetch(u,{mode:'cors'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})));
  await self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==V&&k.startsWith('jr-'))await caches.delete(k);
  await self.clients.claim();
})())});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.origin===location.origin){e.respondWith(netFirst(r,e));return}
  if(u.hostname==='cdnjs.cloudflare.com'||u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com')e.respondWith(cacheFirst(r));
});
async function netFirst(r,e){
  const c=await caches.open(V),nav=r.mode==='navigate';
  const net=(nav?fetch(r.url,{cache:'no-cache',credentials:'same-origin'}):fetch(r)).then(n=>{
    if(n&&n.ok&&n.type==='basic'){const cp=n.clone();e.waitUntil(c.put(r.url.split('#')[0],cp).catch(()=>{}))}
    return n;
  });
  const cached=()=>c.match(r.url.split('#')[0],{ignoreSearch:true}).then(m=>m||(nav?c.match('./painel-jr-1.index.html',{ignoreSearch:true}):null));
  try{return await Promise.race([net,new Promise((_,j)=>setTimeout(()=>j(0),4000))])}
  catch(x){const m=await cached();if(m)return m;try{return await net}catch(y){return Response.error()}}
}
async function cacheFirst(r){
  const c=await caches.open(V),m=await c.match(r);
  if(m)return m;
  try{const n=await fetch(r);if(n&&(n.ok||n.type==='opaque'))c.put(r,n.clone());return n}catch(x){return Response.error()}
}
