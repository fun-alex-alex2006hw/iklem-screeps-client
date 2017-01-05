const {app, BrowserWindow} = require("electron"),
  WindowManager = require("./scripts/windowManager.js"),
  ServerManager = require("./scripts/serverManager.js");

let mainWindow,
  windowManager = WindowManager();
  server = ServerManager();

function createMainWindow() {
  const win = new BrowserWindow({
    title: "Unofficial Screeps client",
    show: false,
    // TODO: change dynamicaly the icon
    icon: "app/assets/images/logo/screeps.png",

    width: 800,
    height: 600,
    backgroundColor: "#1a181a",

    webPreferences: {
      devTools: true
    }
  });

  win.loadURL(`file://${__dirname}/views/index.html`)

  win.on('ready-to-show', () => {
      win.show();
  });

  return win;
}

app.on("ready", () => {
  mainWindow = createMainWindow();
})

exports.selectedServer = serverID => {
  server.changeSelectedServer(serverID);
  return `Clicked on server n°${serverID}`;
};

exports.openWindow = (windowName) => {
  windowManager.changeTo(windowName, mainWindow);
};
