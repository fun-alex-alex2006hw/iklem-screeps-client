function serverList($scope, $location, serverListService) {
  /**
   * Open the selected server informations
   * @param  {Server} server the server to use
   */
  $scope.openServerInfo = (server) => {
    $scope.server = server;
    Materialize.toast("Loading", 500);
    $scope.openModalDelay("#modalServerInfo", 500);
  };

  /**
   * Open a modal with a delay
   * @param  {Object} modal The modal to open
   * @param  {number} delay Delay in milliseconds
   */
  $scope.openModalDelay = (modal, delay) => {
    setTimeout(() => {
      $(modal).modal('open')
    }, delay);
  }

  /**
   * Add or Edit a selected server
   * @param {Server} [server=null] The server to edit if given
   */
  $scope.addServer = (server = null) => {
    $('.tooltipped').tooltip('remove');
    if (server) {
      $location.path(`/add/edit/${server.id}`);
    } else {
      $location.path("/add");
    }
    $('.tooltipped').tooltip({delay: 25});
  };

  /**
   * Remove a server from the list & servers.json file
   * @param  {Server}  server             The server to remove
   * @param  {Boolean} [modalValid=false] If the user said "Yes"
   */
  $scope.removeServer = (server, modalValid = false) => {
    if(!modalValid) {
      $('#modalRemoveServer').modal('open');
    } else {
      serverListService.removeServer(server);
      $scope.saveServerList();
      $scope.loadServerList();
    }
  };

  /**
   * Connect to a selected server
   * @param  {Server}  server            The server to connect to
   * @param  {Boolean} [withSteam=false] If you want to connect with Steam
   */
  $scope.connectToServer = (server, withSteam = false) => {
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

  /**
   * Function to launch the valid connexion
   * @param  {Object} data The return data from the connexion
   */
  $scope.connexionValid = (data) => {
    // $location.path("/game")

    console.log("Fetching data...");
    console.log(data);
    $scope.player = data;
    $("#modalServerConnecting").modal('close');
    $("#modalServerConnected").modal('open');

    $scope.$apply();
  };

  /**
   * Function to show the error message
   * @param  {string} err The error value
   */
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

  $scope.server = serverListService.getServerWithID(0);
  $scope.player = {}

  if (!$scope.serverList) {
    $scope.loadServerList();
  }

  // Loading modals windows
  $(".modalServerInfo").modal({
    dismissible: false,
    startingTop: "39%",
    endingTop: "40%"
  });
  $(".modalServerConnected").modal({
    startingTop: "39%",
    endingTop: "40%"
  });
  $(".modalServerConnecting").modal({
    dismissible: false,
    opacity: .9,
    inDuration: 500,
    startingTop: "39%",
    endingTop: "40%"
  });
  $(".modalServerRemove").modal({
    dismissible: false,
    startingTop: "39%",
    endingTop: "40%"
  })
  $('.tooltipped').tooltip({delay: 0});
  $('.collapsible').collapsible();
}
