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
      alert(`Adding ${server.ip}`);
      serverListService.addServer(server);
      fs.writeFileSync(
        "app/servers.json",
        `${JSON.stringify(serverListService.getServerList(true))}`
      );
      $scope.back();
    } else {
      alert("You need to provide the IP address");
      console.log("Can't add a server with no IP");
    }
  }
}
