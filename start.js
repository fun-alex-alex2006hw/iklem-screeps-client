const fs = require("fs");
const spawnSync = require("child_process").spawnSync;
const electronCommand = process.platform === "win32" ? "electron.exe" : "electron";

if (fs.existsSync("app/greenworks/lib")) {
  spawnSync(`node_modules/electron/dist/${electronCommand}`, ["."]);
} else {
  console.log("Please launch the install for your os.");
  console.log("Current platform:", process.platform);
  console.log(
    "Command to launch: npm run",
    process.platform === "win32" ? "install_windows" :
      process.platform === "linux" ? "install_linux" : "install_osx");
  process.exit(0);
  // TODO: add automatic install.
}
