const sw = navigator.serviceWorker
if (sw) {
  sw.register('sw.js', {scope: './'})
    .then(res => {
      console.log('sw open...', res);
    })
    .catch(err => {
      console.log('sw error', err);
    })
} else {
  console.log('sw is not supported!');
}