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
        // 如果我们想要增量的缓存新的请求，我们可以通过处理fetch请求的response并且添加它们到缓存中来实现(如下代码所示)

        console.log('此处的资源需要向网络进行请求', req);
        // 克隆请求。因为请求是一个“stream”，只能用一次。但我们需要用两次，一次用来缓存，一次给浏览器抓取内容，所以需要克隆
        var fetchRequest = req.clone();
        return fetch(fetchRequest).then(response=> {
            // 检查是否为有效的响应。basic表示同源响应，也就是说，这意味着，对第三方资产的请求不会添加到缓存。
            if (!response || response.status !== 200 || !response.headers.get('Content-type').match(/img/)) {
              return response;
            }
            // 同request，response是一个“stream”，只能用一次，但我们需要用两次，一次用来缓存一个返回给浏览器，所以需要克隆。
            var responseToCache = response.clone();
            // 缓存新请求
            caches.open(SW_CACHE_NAME)
              .then(function (cache) {
                cache.put(req, responseToCache);
              })
            })
          }
    })
  )
})