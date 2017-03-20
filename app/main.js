const {app, BrowserWindow, shell} = require("electron");

let mainWindow;

function createMainWindow() {
  const win = new BrowserWindow({
    title: "Unofficial Screeps client",
    show: false,
    // TODO: change dynamicaly the icon
    icon: "app/images/logo/screeps.png",

    width: 1280,
    height: 720,
    backgroundColor: "#1D1D1D",

    webPreferences: {
      devTools: true
    }
  });

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('ready-to-show', () => {
      win.show();
  });

  return win;
}

app.on("ready", () => {
  mainWindow = createMainWindow();
})

exports.openWindow = (windowName) => {
  // CHANGE WINDOW
};

exports.openExternal = (link) => {
  shell.openExternal(link)
}
