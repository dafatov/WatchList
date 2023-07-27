const {app, BrowserWindow} = require("electron");

const createWindow = () => {
  const browserWindow = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  browserWindow.loadURL("http://localhost:8080/");
}

app.on("ready", createWindow);
