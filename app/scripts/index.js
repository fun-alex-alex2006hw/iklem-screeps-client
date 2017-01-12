const fs = require("fs");

(function() {
  angular
    .module("screepsClient", [require("angular-animate"), require("angular-route")])
    .controller("serverList", ["$scope", "$location", "serverListService", serverList])
    .controller("addServer", ["$scope", "$location", "$routeParams", "serverListService", addServer])
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

  $scope.addServer = (editMode = false, serverID = -1) => {
    if (editMode) {
      $location.path(`/add/edit/${serverID}`);
    } else {
      $location.path("/add");
    }
  }

  $scope.openServer = (serverID) => {
    $scope.serverID = serverID;
    $scope.server = $scope.serverList[serverID];
    $('#modalServer').modal('open');
  }

  $scope.connectToServer = (serverID) => {

  }

  $scope.loadServerList();
  $('.modal').modal({
    starting_top: '4%',
    ending_top: '50%'
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
    .otherwise("/");
}

function serverListService() {
  let serverList = [];

  return {
    addServer: server => serverList.push(server),

    updateServer: (serverID, newServer) => serverList[serverID] = newServer,

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

    getServerFromList: serverID => serverList[serverID],

    clean: () => serverList = []
  };
}

function fadeScale($routeParams, $location) {
  return {
    // WHEN ALL APPEARS !!!
    enter: function(element, done) {
      enterAnim = new TimelineMax({delay:0, onComplete:done});
      enterAnim.add(TweenMax.from(element, 0.4, {opacity:0, ease:Expo.easeOut}));
    },
    // WHEN ALL DISAPPEARS !!!
    leave: function(element, done) {
      // Animation isn't needed here. Maybe in the future
      done();
    }
  }
}
