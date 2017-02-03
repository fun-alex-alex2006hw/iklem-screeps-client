function addServer($scope, $location, $routeParams, serverListService) {
  $scope.add = () => {
    let server = $scope.server;
    console.log($scope.server);
    if(!$scope.isEditing) {
      if (server.ip !== "") {
        serverListService.addServer(server);
        file.writeFile("app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`,
        function(err) {
          if (!err) {
            Materialize.toast(`Server added!`, 4000);
            $scope.$apply($scope.home());
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
        file.writeFile("app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`,
        function(err) {
          if (!err) {
            Materialize.toast(`Server updated!`, 4000);
            $scope.$apply($scope.home());
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
      });

    /*
      Checking for any installed authentification mod
      (if auth mod using the /authmod http endpoint)
      If server doesn't have one, we using Steam authentification
    */
    api.req("GET", "/authmod", {}, (err, data) => {
      console.log(data);
      if (data.body.ok) {
        // TODO: if more than 1 auth mod, check name to change the form.
        server.hasOtherAuthSys = true;
        $scope.showOtherForm = true;
      } else if (data.res.statusCode === 404){
        server.hasOtherAuthSys = false;
        $scope.showOtherForm = false;
      }
      Materialize.updateTextFields();
      $scope.$apply();
    });
  }

  if ($routeParams.action === "edit") {
    $scope.server = serverListService.getServerWithID($routeParams.serverID);
    if(!$scope.server) {
      $scope.home();
    } else {
      $scope.checkAuthMod();
      $scope.isEditing = true;
    }
  } else {
    // TODO: if more than 1 auth mod, add authName.
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
  $('.tooltipped').tooltip('remove');
}
