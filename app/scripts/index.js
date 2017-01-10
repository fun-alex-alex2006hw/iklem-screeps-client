const fs = require("fs");

(function() {
  angular
    .module("screepsClient", [require("angular-animate"), require("angular-route")])
    .controller("serverList", ["$scope", "$location", "serverListService", serverList])
    .controller("addServer", ["$scope", "$location", "serverListService", addServer])
    .service("serverListService", [serverListService])
    .animation('.container', ["$routeParams", "$location", fadeScale])
    .config(["$routeProvider", routing]);
}());

function serverList($scope, $location, serverListService) {
  // Load server list
  // If file doesn't exist, notify the user to add servers to the list
  //$scope.server = {};
  $scope.server = serverListService.getServerFromList(0);

  $scope.loadServerList = () => {
    fs.readFile("app/servers.json", (err, data) => {
      if (!err && data.length > 0) {
        $scope.serverList = [];
        servers = JSON.parse(data.toString())
        serverListService.clean();
        for(let server of servers) {
          serverListService.addServer(server);
        }
        $scope.serverList = serverListService.getServerList();
        $scope.$apply();
        console.log($scope.serverList)
      } else if (err) {
        Materialize.toast(`Please add a server`, 5000);
      }
    });
  }

  $scope.home = () => {
    $location.path("/");
  }

  $scope.addServer = () => {
    $location.path("/add");
  }

  $scope.openServer = (serverID) => {
    // TODO: add connexion to server.
    $scope.server = $scope.serverList[serverID];
    $('#modalServer').modal('open');
  }

  $scope.loadServerList();
  $('.modal').modal();
}

function routing($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/serverList.html"
    })
    .when("/add", {
      templateUrl: "views/add.html"
    })
    .otherwise("/");
}

function serverListService() {
  let serverList = [];

  return {
    addServer: (server) => serverList.push(server),

    getServerList: (noHashKey = false) => {
      if (noHashKey) {
        let newList = [];
        for(let server of serverList) {
          newList.push({
            name: server.name,
            ip: server.ip,
            port: server.port,
            hasOtherAuthSys: server.hasOtherAuthSys
          });
        }
        serverList = newList;
      }
      return serverList;
    },

    getServerFromList: (serverID) => serverList[serverID],

    clean: () => serverList = []
  };
}

function fadeScale($routeParams, $location) {
  return {
    // WHEN ALL APPEARS !!!
    enter: function(element, done) {
      // TODO: Add animations
      done();
    },
    // WHEN ALL DISAPPEARS !!!
    leave: function(element, done) {
      // TODO: Add animations
      done();
    }
  }
}
