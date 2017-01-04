class WindowMananger {
  constructor() {
    self.defaultPage = "index";
    self.currentPage = self.defaultPage;
  }

  changeTo(name) {
    if (self.currentPage !== name) {
      self.currentPage = name;
    }
  }
}
