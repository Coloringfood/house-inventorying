powerdialerApp.controller('HeaderController',
    [
        '$scope',
        '$location',
        'authService',
        function ($scope, $location, authService) {
            $scope.authenticated = authService.authenticated !== false;
            if ($scope.authenticated) {
                $scope.name = authService.authenticated.tokenData.user.name;
            }
            $scope.isActive = (viewLocation) => {
                return viewLocation === $location.path();
            };
            $scope.toggleMenu = () => {
                $scope.showMenu = !$scope.showMenu;
            };
        }
    ]
);