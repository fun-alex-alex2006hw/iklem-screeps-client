function game($scope, $location, $routeParams) {
  $scope.reloadScript = () => {
    console.log("reload", $location.absUrl());
    setTimeout($scope.checkPIXI, 5000);
  };

  $scope.checkPIXI = () => {
    console.log("checkPIXI", $location.absUrl());
    window.PIXI ? $scope.loadScript("client/client.js", "scriptClient") : $scope.reloadScript();
  };

  $scope.loadScript = (s, id) => {
    console.log($location.absUrl(), s);
    const script = $("<script/>");
    script.attr("id", id);
    script.attr("src", s);
    console.log($(`#${id}`).length, script);
    if (!$(`#${id}`).length) {
      $("#game").append(script);
    } else {
      console.log("Element exist.");
    }
  };

  console.log("check1",$location.absUrl());
  $scope.loadScript("../node_modules/pixi.js/dist/pixi.js", "pixi");
  $scope.reloadScript();
  console.log("check2", $location.absUrl());
}
