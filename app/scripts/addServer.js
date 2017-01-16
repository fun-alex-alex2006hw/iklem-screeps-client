function addServer($scope, $location, $routeParams, serverListService) {
  $scope.back = () => $scope.home();

  $scope.add = () => {
    let server = $scope.server;
    if(!$scope.isEditing) {
      if (server.ip !== "") {
        console.log(`Adding ${server.ip}`);
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

  if ($routeParams.action === "edit") {
    $scope.server = serverListService.getServerFromList($routeParams.serverID);
    if(!$scope.server) {
      $scope.back();
    }
    $scope.isEditing = true;
  } else {
    $scope.server = {
      name: "",
      ip: "",
      port: 21025,
      hasOtherAuthSys: false
    };
    $scope.isEditing = false;
  }

  Materialize.updateTextFields();
}
