function addServer($scope, $http, $location) {
  $scope.back = () => {
    $location.path("/");
  }
}
