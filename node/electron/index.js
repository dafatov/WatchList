const { app, BrowserWindow } = require("electron");

function createWindow() {
  let win = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // and load the index.html of the app.
  win.loadURL("http://localhost:8080/");
}
app.on("ready", createWindow);
