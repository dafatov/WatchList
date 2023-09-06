const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setProgress: (callback) => ipcRenderer.on('setProgress', callback)
})
