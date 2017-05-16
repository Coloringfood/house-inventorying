powerdialerApp.controller('HomeController',
    [
        '$scope',
        '$window',
        'HouseInventoryingService',
        'authService',
        function ($scope, $window, HouseInventoryingService, authService) {
            'use strict';

            let vm = this;

            vm.authenticated = !!authService.authenticated;
        }
    ]
);
