const {app, BrowserWindow} = require('electron');
const {spawn} = require('child_process');
const treeKill = require('tree-kill');

const url = 'http://localhost:8080/';

let loadingWindow;
let mainWindow;
let serverProcess;

(() => {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  app.on('ready', () => {
    startLoading().then(() => {
      serverProcess = spawn('java', ['-jar', './server/server.jar']);
    }).then(() => startBrowser());
  });

  app.on('window-all-closed', app.quit);

  app.on('will-quit', () => treeKill(serverProcess?.pid));
})();

const startLoading = () => {
  loadingWindow = new BrowserWindow({
    show: true,
    frame: false,
    width: 900,
    height: 576,
  });

  return loadingWindow.loadFile('./loading/loading.html');
};

const startBrowser = () => {
  fetch(url)
    .then(() => {
      mainWindow = new BrowserWindow({
        show: false,
        title: 'WatchList',
        fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
        },
      });

      mainWindow.once('ready-to-show', () => {
        loadingWindow.hide();
        mainWindow.show();
      });

      mainWindow.on('closed', app.quit);

      return mainWindow.loadURL(url);
    })
    .catch(() => setTimeout(() => startBrowser(), 250));
};
