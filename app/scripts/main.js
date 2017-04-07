const file = require("fs"),
  remote = require("electron").remote.require('./main'),
  greenworks = require('./greenworks/greenworks');

let checkSteam = 0;

(function() {
  angular
    .module("screepsClient", [require("angular-animate"), require("angular-route")])
    .controller("mainController", ["$scope", "$location", "serverListService", mainController])
    .controller("serverList", ["$scope", "$location", "serverListService", serverList])
    .controller("addServer", ["$scope", "$location", "$routeParams", "serverListService", addServer])
    .service("serverListService", [serverListService])
    .animation('.container', ["$routeParams", "$location", fadeScale])
    .config(["$routeProvider", routing]);
}());

function mainController($scope, $location, serverListService) {
  $scope.subtitles = require("./libs/subtitles.js");

  /**
   * Check if server is reachable
   * @param  {Server} server the server to check
   */
  $scope.checkServerStatus = (server) => {
    server.status = undefined;
    server.version = undefined;
    server.error = undefined;
    request({
      url: `http://${server.ip}:${server.port}`,
      method: "GET",
      timeout: 10000
    }, (err, res, body) => {
      if (!res) {
        server.status = false;
        server.error = err;
        console.log("Error for server", server.name, "\n\r", err);
      } else {
        if (!$scope.getServerVersion(server, body)) {
          server.warning = "Warning: Can't get server version.";
        }
        server.status = true;
        server.credOK = server.user.email ? true : false;
        server.steamOK = $scope.steamRunning;
      }
      $scope.$apply();
    })
  };

  /**
   * Check if server has version and store it
   * @param  {Server} server the server to check
   * @param  {string} body   body with the version in it
   * @return {boolean}       True if there's one, False if error
   */
  $scope.getServerVersion = (server, body) => {
    const version = body.match(/v[0-9.]+/g)
    if (version) {
      server.version = version[0];
      return true;
    }
    return false;
  }

  /**
   * Reload the servers status
   * @param  {Boolean} [force=false] force the list to refresh
   */
  $scope.reload = (force = false) => {
    console.log("RELOADING!");
    if (force) {
      $scope.serverList = [];
      $scope.loadServerList();
    } else {
      $('.fixed-action-btn').closeFAB();
      for (let server of $scope.serverList) {
        $scope.checkServerStatus(server);
      }
    }
  }

  /**
   * Load the servers from the servers.json file
   */
  $scope.loadServerList = () => {
    file.readFile("app/servers.json", (err, data) => {
      if (!err && data.length > 2) {
        $scope.serverList = [];
        servers = JSON.parse(data.toString())
        serverListService.clean();
        for(let server of servers) {
          serverListService.addServer(server);
          $scope.checkServerStatus(server);
        }
        $scope.serverList = serverListService.getServerList();
        $scope.$apply();
      } else {
        Materialize.toast(`Please add a server`, 5000);
      }
    });
  };

  /**
   * Save the actual list to the servers.json file
   */
  $scope.saveServerList = () => {
    file.writeFile("app/servers.json",
    `${JSON.stringify(serverListService.getServerList(true))}`,
    function(err) {
      if (!err) {
        Materialize.toast(`Server list updated!`, 4000);
        $scope.$apply();
      }
    });
  };

  /**
   * If steam is open, initialize Greenworks for Steam authentification
   */
  $scope.initGreenworks = () => {
    if (greenworks.isSteamRunning()) {
      if (!greenworks.initAPI()) {
        console.log('Error on initializing steam API.');
      } else {
        console.log('Steam API initialized successfully.');
        $scope.steamRunning = true;
        clearInterval(checkSteam);
      }
      return true;
    } else {
      console.log("Steam not running...");
      $scope.steamRunning = false;
    }
  }

  /**
   * Return to the home page (serverList)
   */
  $scope.home = () => $location.path("/");

  /**
   * Open external URL to the defautl web browser.
   * @param  {string} link the link to go to
   */
  $scope.openURL = (link) => remote.openExternal(link);

  /**
   * (DEBUG) change the subtitle
   */
  $scope.changeSub = () => {
    $scope.subtitle = $scope.subtitles[Math.floor(Math.random() * $scope.subtitles.length)];
  }

  $scope.changeSub();

  $scope.steamRunning = false;
  checkSteam = setInterval($scope.initGreenworks, 5000);
  $scope.initGreenworks();

  $(document).ready(function () {
    TweenMax.to($("body"), .4, {opacity:1})
    $("#game").click(() => {
      console.log("game");
      $scope.$apply(() => {
        $location.path(`/game`);
      })
    })
  });
}

function routing($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/serverList.html"
    })
    .when("/add", {
      templateUrl: "views/add.html"
    })
    .when("/add/:action/:serverID", {
      templateUrl: "views/add.html"
    })
    .when("/game", {
      templateUrl: "views/game.html"
    })
    .otherwise("/");
}

function serverListService() {
  let serverList = [];

  return {
    addServer: server => serverList.push(server),

    updateServer: (server, newServer) => serverList[server.id] = newServer,

    removeServer: server => delete serverList[server.id],

    getServerList: (noHashKey = false) => {
      if (noHashKey) {
        let newList = [];
        for(let id in serverList) {
          let server = serverList[id];
          if (server) {
            newList.push({
              id,
              name: server.name,
              ip: server.ip,
              port: server.port,
              user: server.user || {}
            });
          }
        }
        serverList = newList;
      }
      return serverList;
    },

    getServerWithID: id => serverList[id],

    getLastID: () => serverList.length - 1,

    getNextID: () => serverList.length,

    clean: () => serverList = []
  };
}

function fadeScale($routeParams, $location) {
  return {
    // WHEN ALL APPEARS !!!
    enter: function(element, done) {
      enterAnim = new TimelineMax({delay:0, onComplete:done});
      enterAnim.add(TweenMax.from(element, 0.8, {opacity:0, ease:Expo.easeOut}));
    },
    // WHEN ALL DISAPPEARS !!!
    leave: function(element, done) {
      // Animation isn't needed here. Maybe in the future
      done();
    }
  }
}
