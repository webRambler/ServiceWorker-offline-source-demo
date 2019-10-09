const cacheList = [
  './index.html',
  './main.css',
  'app.js',
  'img/wk.jpg'
]

const SW_CACHE_NAME = 'sw-offline'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SW_CACHE_NAME)
      .then(cache => {
        console.log('cahche open');
        return cache.addAll(cacheList)
      })
  )
})

self.addEventListener('fetch', event => {
  const req = event.request
  console.log('请求为', req);

  event.respondWith(
    caches.match(req).then(cache => {
      if (cache) {
        return cache
      } else {
        console.log('此处的资源需要向网络进行请求', req);
        // 如果我们想要增量的缓存新的请求，我们可以通过处理fetch请求的response并且添加它们到缓存中来实现(如下代码所示)
        var fetchRequest = req.clone();
        return fetch(fetchRequest).then(response=> {
            if (!response || response.status !== 200 || !response.headers.get('Content-type').match(/img/)) {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(SW_CACHE_NAME)
              .then(function (cache) {
                cache.put(req, responseToCache);
              })
            })
          }
    })
  )
})