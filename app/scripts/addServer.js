function addServer($scope, $location, $routeParams, serverListService) {

  /**
   * Add a server to the servers.json file.
   */
  $scope.add = () => {
    let server = $scope.server;
    if(!$scope.isEditing) {
      if (server.ip !== "") {
        serverListService.addServer(server);
        file.writeFile("app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`,
        function(err) {
          if (!err) {
            Materialize.toast(`Server added!`, 4000);
            $scope.reload(true);
            $scope.checkServerStatus(server);
            $scope.$apply($scope.home());
          }
        });
      } else {
        Materialize.toast("You need to provide the IP address", 5000);
      }
    }
  }

  /**
   * Edit the selected server with the serverList
   */
  $scope.edit = () => {
    let server = $scope.server;
      oldServer = serverListService.getServerWithID($routeParams.serverID);
    if($scope.isEditing) {
      if (server.ip !== "") {
        serverListService.updateServer(oldServer, server);
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

  /**
   * Check if the server is running any authentification mods
   */
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
      if (data) {
        if (data.body.ok) {
          // TODO: if more than 1 auth mod, check name to change the form.
          $scope.showOtherForm = true;
        } else if (data.res.statusCode === 404){
          $scope.showOtherForm = false;
        }
      } else if (server.user.email !== "") {
        $scope.showOtherForm = true;
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
      id: serverListService.getNextID(),
      name: "",
      ip: "",
      port: 21025,
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
