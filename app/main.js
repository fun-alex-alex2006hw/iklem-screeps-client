const {app, BrowserWindow} = require("electron"),
  ServerManager = require("./libs/serverManager.js");

let mainWindow,
  server = ServerManager();

function createMainWindow() {
  const win = new BrowserWindow({
    title: "Unofficial Screeps client",
    show: false,
    // TODO: change dynamicaly the icon
    icon: "app/images/logo/screeps.png",

    width: 800,
    height: 600,
    backgroundColor: "#1a181a",

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

exports.selectedServer = serverID => {
  server.changeSelectedServer(serverID);
  return `Clicked on server n°${serverID}`;
};

exports.openWindow = (windowName) => {
  // CHANGE WINDOW
};
