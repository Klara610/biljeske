var CACHE = 'biljeske-v3';

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(['./', './index.html', './icon.png']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if (k !== CACHE) return caches.delete(k);
      }));
    })
  );
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return resp;
    }).catch(function(){
      return caches.match(e.request).then(function(r){
        return r || caches.match('./index.html');
      });
    })
  );
});
