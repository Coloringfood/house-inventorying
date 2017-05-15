powerdialerApp.controller('HomesPageController',
    [
        '$scope',
        'HouseInventoryingService',
        'Notification',
        '$uibModal',
        '$q',
        '$window',
        'authService',
        'ENV',
        function ($scope, HouseInventoryingService, NotificationProvider, $uibModal, $q, $window, authService, ENV) {
            'use strict';

            let vm = this;
            let debugging = ENV.environment == 'dev';
            vm.name = "Homes";
            // vm.homesList = [];
            // vm.factors = [];
            // vm.factorSettings = {
            //     object: true,
            //     showDays: true
            // };
            // vm.authenticated = !!authService.authenticated;
            //
            // function updateList() {
            //     let homesPromise, factorsPromise;
            //     if (vm.authenticated) {
            //         homesPromise = HouseInventoryingService.getAllHomes();
            //     }
            //     else {
            //         try {
            //             homesPromise = $q.all(JSON.parse(localStorage.homes).map((home) => {
            //                 return HouseInventoryingService.convertHomeForUi(home);
            //             }));
            //         }
            //         catch (e) {
            //             homesPromise = $q.resolve();
            //         }
            //     }
            //     homesPromise = homesPromise.then(function (homes) {
            //         vm.homesList = homes;
            //         return homes;
            //     }).catch(function (error) {
            //         console.log("Getting Homes Error: ", error);
            //         NotificationProvider.error({
            //             message: "Error Getting All Homes"
            //         });
            //     });
            //     factorsPromise = HouseInventoryingService.getAllFactors().then(function (factors) {
            //         vm.factors = factors;
            //         return factors;
            //     });
            //     return $q.all([homesPromise, factorsPromise]);
            // }
            //
            // updateList();
            //
            // function openEditModal(home) {
            //     let modalInstance = $uibModal.open({
            //         templateUrl: '/public/house-inventorying/views/edit_home_modal.html',
            //         controller: 'EditHomeModalController',
            //         controllerAs: 'vm',
            //         size: "lg",
            //         resolve: {
            //             home: function () {
            //                 return home;
            //             }
            //         }
            //     });
            //     modalInstance.result.then(function (result) {
            //         if (result.success) {
            //             NotificationProvider.success(result.message);
            //         }
            //         else {
            //             NotificationProvider.error(result.message);
            //         }
            //         updateList();
            //
            //     }).catch(function (reason) {
            //         if (debugging) {
            //             console.log("error: ", reason);
            //         }
            //         // NotificationProvider.info(reason);
            //     });
            // }
            //
            // vm.createHome = () => {
            //     openEditModal({factors: []});
            // };
            //
            // vm.editHome = (home) => {
            //     openEditModal(home);
            // };
            //
            // vm.deleteHome = (home) => {
            //     if (authService.authenticated) {
            //         return HouseInventoryingService.deleteHome(home.id)
            //             .then(function () {
            //                 NotificationProvider.success({
            //                     message: "Successfully removed " + home.name
            //                 });
            //                 updateList();
            //             })
            //             .catch(function (error) {
            //                 console.log("Delete Error: ", error);
            //                 NotificationProvider.error({
            //                     title: "Error Deleting Home"
            //                 });
            //             });
            //     }
            //     else {
            //         let homes = [];
            //         try {
            //             homes = JSON.parse(localStorage.homes);
            //         } catch (e) {
            //         }
            //         homes.splice(home.id, 1);
            //         let homesLength = homes.length;
            //         for (let i = 0; i < homesLength; i++) {
            //             let home = homes[i];
            //             home.id = i;
            //         }
            //         localStorage.homes = JSON.stringify(homes);
            //         updateList();
            //     }
            // };
        }
    ]
);
