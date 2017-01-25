const fs = require("fs"),
  remote = require("electron").remote.require('./main');

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
  $scope.loadServerList = () => {
    fs.readFile("app/servers.json", (err, data) => {
      if (!err && data.length > 2) {
        $scope.serverList = [];
        servers = JSON.parse(data.toString())
        serverListService.clean();
        for(let server of servers) {
          serverListService.addServer(server);
        }
        $scope.serverList = serverListService.getServerList();
        $scope.$apply();
      } else {
        Materialize.toast(`Please add a server`, 5000);
      }
    });
  };

  $scope.saveServerList = () => {
    fs.writeFile("app/servers.json",
    `${JSON.stringify(serverListService.getServerList(true))}`,
    function(err) {
      if (!err) {
        Materialize.toast(`Server list updated!`, 4000);
        $scope.$apply();
      }
    });
  };

  $scope.home = () => {
    $location.path("/");
  };

  $scope.openURL = (link) => { remote.openExternal(link); }
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
    .otherwise("/");
}

function serverListService() {
  let serverList = [];

  return {
    addServer: server => serverList.push(server),

    updateServer: (serverID, newServer) => serverList[serverID] = newServer,

    removeServer: (serverID) => delete serverList[serverID],

    getServerList: (noHashKey = false) => {
      if (noHashKey) {
        let newList = [];
        for(let server of serverList) {
          if (server) {
            newList.push({
              name: server.name,
              ip: server.ip,
              port: server.port,
              hasOtherAuthSys: server.hasOtherAuthSys,
              user: server.user || {}
            });
          }
        }
        serverList = newList;
      }
      return serverList;
    },

    getServerWithID: serverID => serverList[serverID],

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
