const {ipcRenderer} = require('electron')

process.once('loaded', () => {
  window.addEventListener('message', event => {
    if (event.data.type === 'select-dir-in') {
      ipcRenderer.send('select-dir-in');
    }
  });

  ipcRenderer.on('select-dir-out', (_, data) => {
    window.postMessage({
      type: 'select-dir-out',
      data,
    })
  })
})
