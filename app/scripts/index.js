const jq = require("jquery"),
  fs = require("fs");

(function() {
  angular
    .module("screepsClient", [require("angular-route")])
    .controller("serverList", ["$scope", "$location", "serverListService", serverList])
    .controller("addServer", ["$scope", "$location", "serverListService", addServer])
    .service("serverListService", [serverListService])
    .config(["$routeProvider", routing]);
}());

function serverList($scope, $location, serverListS) {
  // Load server list
  // If file doesn't exist, notify the user to add servers to the list
  $scope.loadServerList = () => {
    fs.readFile("app/servers.json", (err, data) => {
      if (!err && data.length > 0) {
        $scope.$apply(() => {
          $scope.serverList = [];
          servers = JSON.parse(data.toString())
          serverListS.clean();
          for(let server of servers) {
            serverListS.addServer(server);
          }
          $scope.serverList = serverListS.getServerList();
        });
        console.log($scope.serverList)
      } else if (err) {
        alert("Please add a server");
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
    alert(JSON.stringify($scope.serverList[serverID]));
  }

  $scope.loadServerList();
}

function routing($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/serverList.html",
      controller: "serverList"
    })
    .when("/add", {
      templateUrl: "views/add.html",
      controller: "addServer"
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
