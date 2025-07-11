self.addEventListener('install', (event)=>{
    event.waitUntil(caches.open('my-cache').then((cache)=>{
        return cache.addAll([
            '/',
            '/index.html',
            './css/index.css'
        ]);
    }));
});
self.addEventListener('fetch', (event)=>{
    event.respondWith(caches.match(event.request).then((cachedResponse)=>{
        return cachedResponse || fetch(event.request);
    }));
});

//# sourceMappingURL=service-worker.js.map
