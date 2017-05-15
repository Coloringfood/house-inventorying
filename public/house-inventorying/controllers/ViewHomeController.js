powerdialerApp.controller('ViewHome',
    [
        '$scope',
        'HouseInventoryingService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        function ($scope, HouseInventoryingService, NotificationProvider, $uibModal, $q, $window) {
            'use strict';

            let vm = this;
            vm.name = "Items";
            console.log("Viewing Specific Home");
        }
    ]
);
