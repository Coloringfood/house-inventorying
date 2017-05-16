powerdialerApp.controller('ViewHome',
    [
        '$scope',
        'HouseInventoryingService',
        '$routeParams',
        'Notification',
        '$q',
        function ($scope, HouseInventoryingService, $routeParams, NotificationProvider, $q) {
            'use strict';
            let vm = this;
            vm.name = "Items";
            vm.editing = $routeParams.edit;

            function getHomeInfo() {
                let home_id = $routeParams.house_id;
                let home_promise = HouseInventoryingService.getHome(home_id)
                    .then((home) => {
                        vm.home = home
                    })
                    .catch((error) => {
                        console.log(error);
                        NotificationProvider.error("Error Loading Home.");
                        return $q.reject(null);
                    });

                let items_promise = HouseInventoryingService.getHomesItems(home_id)
                    .then((items) => {
                        vm.items = items
                    })
                    .catch((error) => {
                        console.log(error);
                        NotificationProvider.error("Error Loading Items.");
                        return $q.reject(null);
                    });

                return $q.all([home_promise, items_promise])
                    .catch((error) => {
                        if (error != null) {
                            console.log(error);
                            NotificationProvider.error("Error Occurred, see logs.");
                        }
                    });
            }

            getHomeInfo();

            vm.editItem = (item) => {
                NotificationProvider.success("editing item: " + item.name);
            };

            vm.deleteItem = (item) => {
                NotificationProvider.error("deleting item: " + item.name);
            };
        }
    ]
);
