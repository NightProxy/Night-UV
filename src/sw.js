importScripts('/@/bundle.js');
importScripts('/@/config.js');
importScripts(__uv$config.sw || '/@/sw-.js');

const UV = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(UV.fetch(event)));
