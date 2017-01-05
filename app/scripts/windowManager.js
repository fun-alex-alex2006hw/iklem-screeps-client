const url = require("url"),
  path = require("path");

function windowManager() {
  const self = {
    defaultPage: "index",
    currentPage: "index"
  };

  self.createWindow = (window) => {
    window.loadURL(url.format({
        protocol: "file",
        slashes: true,
        pathname: path.join(__dirname, `${self.currentPage}.html'`)
      })
    );
  };

  self.changeTo = (name, window) => {
    if (self.currentPage !== name) {
      console.log(self.currentPage);
      self.currentPage = name;
      console.log(self.currentPage);
      self.createWindow(window);
      console.log(self.currentPage);
    }
  };

  return self;
}

module.exports = windowManager;
