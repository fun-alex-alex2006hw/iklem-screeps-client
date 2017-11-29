/*
Installer for the client
This will move the required files into the app/greenworks/lib folder.
 */

const fs = require("fs");

const appGreenworksLib = "app/greenworks/lib";
const files = {
  linux: {
    dir: "run_libs/linux",
    files: [
      "greenworks-linux64.node",
      "libsdkencryptedappticket.so",
      "libsteam_api.so"
    ]
  },
  windows: {
    dir: "run_libs/windows",
    files: [
      "greenworks-win64.node",
      "sdkencryptedappticket64.dll",
      "steam_api64.dll"
    ]
  },
  osx: {
    dir: "run_libs/osx",
    files: []
  }
}

// The copyFile from FS in only for Node 8. So i've found one on stackoverflow :3
function copyFile(src, dest) {

  let readStream = fs.createReadStream(src);

  readStream.once('error', (err) => {
    console.log(err);
  });

  readStream.once('end', () => {
    console.log('done copying');
  });

  readStream.pipe(fs.createWriteStream(dest));
}
// ------------------------

const [,, ...args] = process.argv

console.log(`Copying files for ${args[0]} installation...`);
console.log("When done, you can start with \"npm start\"");

if (!fs.existsSync(appGreenworksLib)) {
  fs.mkdirSync(appGreenworksLib)
  // Copying files from run_libs to the app/greenworks.
  for(const file of files[args[0]].files) {
    copyFile(`${files[args[0]].dir}/${file}`, `${appGreenworksLib}/${file}`);
  }
} else {
  console.log("Already done the installation.");
  process.exit(0);
}
