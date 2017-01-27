function serverList($scope, $location, serverListService) {
  // Load server list
  // If file doesn't exist, notify the user to add servers to the list
  $scope.server = serverListService.getServerWithID(0);
  $scope.player = {}

  $scope.openServerInfo = (serverID) => {
    $scope.serverID = serverID;
    $scope.server = $scope.serverList[serverID];
    Materialize.toast("Loading", 500);
    setTimeout($scope.openModalDelay, 500, '#modalServerInfo');
  };

  $scope.openModalDelay = (modal) => {
    $(modal).modal('open');
  }

  $scope.addServer = (editMode = false, serverID = -1) => {
    $('.tooltipped').tooltip('remove');
    if (editMode) {
      $location.path(`/add/edit/${serverID}`);
    } else {
      $location.path("/add");
    }
    $('.tooltipped').tooltip({delay: 25});
  };

  $scope.removeServer = (serverID, modalValid = false) => {
    if(!modalValid) {
      $('#modalRemoveServer').modal('open');
    } else {
      serverListService.removeServer(serverID);
      $scope.saveServerList();
      $scope.loadServerList();
    }
  };

  $scope.connectToServer = (serverID, withSteam = false) => {
    let server = serverListService.getServerWithID(serverID);
    $('.tooltipped').tooltip('remove');

    if (!withSteam) {
      let api = new ScreepsAPI({
        email: server.user.email,
        password: server.user.password,
        host: server.ip,
        port: server.port
      }),
      connexion = api.connect();
      $("#modalServerConnecting").modal('open');

      connexion
        .then(() => api.me($scope.connexionValid))
        .catch($scope.connexionError);
    } else if ($scope.steamRunning) {
      $("#modalServerConnecting").modal('open');
      greenworks.getAuthSessionTicket(
        (ticket) => {
          console.log(ticket);
          let api = new ScreepsAPI({
            ticket: ticket.ticket,
            host: server.ip,
            port: server.port
          }),
          connexion = api.connect();

          connexion
            .then(() => api.me($scope.connexionValid))
            .catch($scope.connexionError);
        },
        (err) => console.log(err)
      );
    }
    $('.tooltipped').tooltip({delay: 25});
  };

  $scope.connexionValid = (data) => {
    console.log("Fetching data...");
    console.log(data);
    $scope.player = data;
    $("#modalServerConnecting").modal('close');
    $("#modalServerConnected").modal('open');
    $scope.$apply()
  };

  $scope.connexionError = (err) => {
    $("#modalServerConnecting").modal('close');
    switch (err) {
      case "ECONNREFUSED":
      case "ENOTFOUND":
        Materialize.toast("[ERROR]<br/>The server can't be reached or you used the wrong ip address.", 5000);
        console.log(err, "- [Error] The server can't be reached or you used the wrong ip address.");
        break;
      case "BADREQUEST":
        Materialize.toast("[ERROR]<br/>Some credentials are missing or haven't been provided.", 5000);
        console.log(err, "- [Error] Some credentials are missing or haven't been provided.");
        break;
      case "AUTHMODMISSING":
        Materialize.toast("[ERROR]<br/>The server doesn't have the ags131 screepsmod-auth installed.<br/>Please use Steam authentification.", 7500);
        console.log(err, "- [Error] The server doesn't have the ags131 screepsmod-auth installed. Please use Steam authentification.");
        break;
      case "UNAUTHORIZED":
        Materialize.toast("[ERROR]<br/>The username or password is wrong.", 5000);
        console.log(err, "- [Error] The username or password is wrong.");
        break;
      case "ETIMEDOUT":
        Materialize.toast("[ERROR]<br/>The server take too long to response.", 5000);
        console.log(err, "- [Error] The server take too long to response.");
        break;
    }
  }

  $scope.loadServerList();

  // Loading modals windows
  $(".modalServerInfo").modal({
    dismissible: false,
    starting_top: "25%",
    ending_top: "30%"
  });
  $(".modalServerConnected").modal();
  $(".modalServerConnexionChoice").modal({
    dismissible: false
  });
  $(".modalServerConnecting").modal({
    dismissible: false,
    starting_top: "25%",
    ending_top: "30%"
  });
  $(".modalServerRemove").modal({
    dismissible: false,
    starting_top: "25%",
    ending_top: "30%"
  })
  $('.tooltipped').tooltip({delay: 25});
}
