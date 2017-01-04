const {app, BrowserWindow} = require("electron");

let mainWindow;

function createMainWindow() {
  const win = new BrowserWindow({
    title: "Unofficial Screeps client",
    width: 800,
    height: 600,
    backgroundColor: "#1a181a",
    show: false
  });

  win.loadURL(`file://${__dirname}/views/index.html`)

  win.on('ready-to-show', function() {
      win.show();
      win.focus();
  });

  return win;
}

app.on("ready", () => {
  mainWindow = createMainWindow();
})
