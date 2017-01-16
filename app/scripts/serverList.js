function serverList($scope, $location, serverListService) {
  // Load server list
  // If file doesn't exist, notify the user to add servers to the list
  $scope.server = serverListService.getServerFromList(0);

  $scope.openServerInfo = (serverID) => {
    $scope.serverID = serverID;
    $scope.server = $scope.serverList[serverID];
    $('#modalServerInfo').modal('open');
  };

  $scope.addServer = (editMode = false, serverID = -1) => {
    if (editMode) {
      $location.path(`/add/edit/${serverID}`);
    } else {
      $location.path("/add");
    }
  };

  $scope.removeServer = (serverID, modalValid = false) => {
    if(!modalValid) {
      $('#modalRemoveServer').modal('open');
    } else {
      serverListService.removeServer(serverID);
      $scope.saveServerList();
    }
  };

  $scope.connectToServer = (serverID) => {};

  $scope.loadServerList();
  $(".modalServerInfo").modal();
  $(".modalServerRemove").modal({
    dismissible: false,
    starting_top: "15%",
    ending_top: "25%"
  })
}
