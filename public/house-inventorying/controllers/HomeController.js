powerdialerApp.controller('HomeController',
    [
        '$scope',
        '$window',
        'HouseInventoryingService',
        'authService',
        'Notification',
        function ($scope, $window, HouseInventoryingService, authService, NotificationProvider) {
            'use strict';

            let vm = this;

            vm.authenticated = !!authService.authenticated;

            if (vm.authenticated) {
                console.log(authService.authenticated);
                HouseInventoryingService.getAllHomes().then(function (vacations) {
                    vm.housesList = vacations;
                }).catch(function (error) {
                    console.log("Getting Homes Error: ", error);
                    NotificationProvider.error({
                        message: "Error Getting All Homes"
                    });
                });
            }
        }
    ]
);
