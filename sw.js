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
        // 可以使用fetch进行请求
        // fetch(req.url).then(data => {
        //   ......
        // })
      }
    })
  )
})