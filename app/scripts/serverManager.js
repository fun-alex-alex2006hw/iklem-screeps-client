function serverManager() {
  const self = {
    selected: -1
  };

  self.changeSelectedServer = newServerID => {
    if (typeof newServerID === "number" && newServerID !== self.selected) {
      self.selected = newServerID;
    }
  };

  self.addServer = (name, ip, port, password) => {
    
  };

  return self;
}

module.exports = serverManager;
