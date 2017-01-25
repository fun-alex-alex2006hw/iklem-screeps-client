function addServer($scope, $location, $routeParams, serverListService) {
  $scope.back = () => $scope.home();

  $scope.add = () => {
    let server = $scope.server;
    console.log($scope.server);
    if(!$scope.isEditing) {
      if (server.ip !== "") {
        serverListService.addServer(server);
        fs.writeFile("app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`,
        function(err) {
          if (!err) {
            Materialize.toast(`Server added!`, 4000);
            $scope.$apply($scope.back());
          }
        });
      } else {
        Materialize.toast("You need to provide the IP address", 5000);
      }
    }
  }

  $scope.edit = () => {
    let server = $scope.server;
    if($scope.isEditing) {
      if (server.ip !== "") {
        serverListService.updateServer($routeParams.serverID, server);
        fs.writeFile("app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`,
        function(err) {
          if (!err) {
            Materialize.toast(`Server updated!`, 4000);
            $scope.$apply($scope.back());
          }
        });
      } else {
        Materialize.toast("You can't remove the IP address!", 5000);
      }
    }
  }

  $scope.checkAuthMod = () => {
    let server = $scope.server;
      api = new ScreepsAPI({
        host: server.ip,
        port: server.port
      }),
      checkAuth = api.connect();

    checkAuth
      .then(() => {})
      .catch(err => {
        console.log(err);
        switch (err) {
          case "BADREQUEST":
            server.hasOtherAuthSys = true;
            $scope.showOtherForm = true;
            break;
          default:
          case "AUTHMODMISSING":
            server.hasOtherAuthSys = false;
            $scope.showOtherForm = false;
            break;
        }
        Materialize.updateTextFields();
        $scope.$apply();
      });
  }

  if ($routeParams.action === "edit") {
    $scope.server = serverListService.getServerWithID($routeParams.serverID);
    if(!$scope.server) {
      $scope.back();
    } else {
      $scope.checkAuthMod();
      $scope.isEditing = true;
    }
  } else {
    $scope.server = {
      name: "",
      ip: "",
      port: 21025,
      hasOtherAuthSys: false,
      user: {
        email: "",
        password: ""
      }
    };
    $scope.isEditing = false;
  }
  $scope.showOtherForm = false;

  Materialize.updateTextFields();
}
