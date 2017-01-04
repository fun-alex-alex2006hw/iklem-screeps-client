class ServerManager {
  constructor() {
    self.selected = -1;
  }

  changeSelectedServer(newID) {
    if (typeof newID === "number") {
      self.selected = newID;
    }
  }
}
