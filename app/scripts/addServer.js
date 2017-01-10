function addServer($scope, $location, serverListService) {
  $scope.server = {
    name: "",
    ip: "",
    port: 21025,
    hasOtherAuthSys: false
  }

  $scope.back = () => $location.path("/");

  $scope.add = () => {
    let server = $scope.server;
    if (server.ip !== "") {
      console.log(`Adding ${server.ip}`);
      serverListService.addServer(server);
      fs.writeFile("app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`,
        function(err) {
          if (!err) {
            Materialize.toast(`Server added!`, 4000);
            $scope.$apply($location.path("/"));
          }
        }
      );
    } else {
      Materialize.toast("You need to provide the IP address", 5000);
    }
  }

  Materialize.updateTextFields();
}
