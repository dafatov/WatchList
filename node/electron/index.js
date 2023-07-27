const {app, BrowserWindow} = require('electron');

app.on('ready', () =>
  new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  }).loadURL('http://localhost:8080/'));
