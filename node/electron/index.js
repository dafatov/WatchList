const {app, BrowserWindow} = require('electron');
const {spawn} = require('child_process');
const treeKill = require('tree-kill');

const url = 'http://localhost:8080/';
let serverProcess;

app.on('ready', () => {
  serverProcess = spawn('java', ['-jar', './server/server.jar']);

  startBrowser();
});

app.on('will-quit', () => treeKill(serverProcess?.pid));

const startBrowser = () => {
  fetch(url)
    .then(() => new BrowserWindow({
      title: 'WatchList',
      fullscreen: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
      },
    }).loadURL(url))
    .catch(() => setTimeout(() => startBrowser(), 250));
};
