const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {exec} = require('child_process');
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');
const path = require('path');

const url = 'http://localhost:8080';
const icon = './resources/icons/watch-list.png';

let loadingWindow;
let mainWindow;

const initUpdater = () => {
  autoUpdater.autoDownload = false;
  autoUpdater.disableWebInstaller = false;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.autoRunAppAfterInstall = false;

  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
};

const initApp = () => {
  app.on('ready', () => {
    startLoading().then(() => autoUpdate())
      .then(() => exec('java -jar ./server/server.jar')
        .stdout.on('data', data => log.info(data)))
      .then(() => startBrowser());
  });

  app.on('window-all-closed', app.quit);
};

(() => {
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  initUpdater();
  initApp();
})();

const autoUpdate = () => new Promise(resolve => {
  autoUpdater.on('update-available', () => {
    log.info('update-available');
    loadingWindow.webContents.send('setProgress', 0);
    return autoUpdater.downloadUpdate();
  });

  autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
    loadingWindow.webContents.send('setProgress');
    return resolve();
  });

  autoUpdater.on('download-progress', ({percent}) => {
    log.info(`download-progress: ${percent}`);
    loadingWindow.webContents.send('setProgress', Math.round(percent));
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    return autoUpdater.quitAndInstall(true, true);
  });

  autoUpdater.on('error', error => log.error(error));

  return autoUpdater.checkForUpdates();
});

const startLoading = () => {
  loadingWindow = new BrowserWindow({
    show: true,
    frame: false,
    title: 'Loading',
    icon,
    width: 900,
    height: 576,
    webPreferences: {
      preload: path.join(__dirname, 'preloadLoading.js'),
    },
  });

  return loadingWindow.loadFile('./loading/loading.html');
};

const startBrowser = () => {
  fetch(url)
    .then(() => {
      mainWindow = new BrowserWindow({
        show: false,
        title: 'WatchList',
        icon,
        width: 900,
        height: 576,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
          preload: path.join(__dirname, 'preloadMain.js'),
        },
      });

      mainWindow.once('ready-to-show', () => {
        ipcMain.on('select-dir-in', event => {
          dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
          }).then(({filePaths}) => filePaths.length > 0
            && event.reply('select-dir-out', filePaths));
        });

        loadingWindow.hide();
        mainWindow.show();
      });

      mainWindow.on('closed', app.quit);

      return mainWindow.loadURL(url);
    })
    .then(() => setInterval(() => fetch(`${url}/health`)
      .catch(() => app.quit()), 250))
    .catch(() => setTimeout(() => startBrowser(), 250));
};
