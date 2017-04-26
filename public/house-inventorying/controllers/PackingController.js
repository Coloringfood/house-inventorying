powerdialerApp.controller("PackingController",
    [
        '$scope',
        'Notification',
        'HouseInventoryingService',
        '$routeParams',
        '$q',
        'authService',
        function ($scope, NotificationProvider, HouseInventoryingService, $routeParams, $q, authService) {
            'use strict';
            let vm = this;
            vm.authenticated = !!authService.authenticated;

            vm.sortedItems = {};
            vm.dateFormat = "longDate";
            vm.ageId = 4;
            $scope.status = {};
            // Get all packing items
            let packingListPromise,
                vacationPromise;
            if (vm.authenticated) {
                packingListPromise = HouseInventoryingService.getAllPackingItems($routeParams.vacationId);
                vacationPromise = HouseInventoryingService.getVacation($routeParams.vacationId);
            }else{
                let vacation = JSON.parse(localStorage.vacations)[$routeParams.vacationId];
                packingListPromise = HouseInventoryingService.generatePackingList(vacation, vm.ageId);
                vacationPromise = $q.resolve(HouseInventoryingService.convertVacationForUi(vacation));
            }
            $q.all([packingListPromise, vacationPromise])
                .then(function (results) {
                    vm.vacation = results[1];
                    let oneDay = 24 * 60 * 60 * 1000;	// hours*minutes*seconds*milliseconds
                    let diffDays = Math.abs((vm.vacation.start_date.getTime() - vm.vacation.end_date.getTime()) / (oneDay));
                    vm.vacation.totalDays = diffDays;
                    createPackingList(results[0]);
                });

            function createPackingList(packingItems) {
                // Loop thorugh packingItems and sort by category
                let itemsLength = packingItems.length;
                for (let i = 0; i < itemsLength; i++) {
                    let item = packingItems[i];
                    if (!vm.sortedItems[item.category.name]) {
                        vm.sortedItems[item.category.name] = {
                            required: [],
                            optional: []
                        };
                        $scope.status[item.category.name] = true;
                    }
                    let required = item.required ? "required" : "optional";
                    vm.sortedItems[item.category.name][required].push(formatItem(item));
                }
            }

            function formatItem(item) {
                let newItem = {};
                newItem.name = item.name;
                //Calculate Quantity
                let days = item.ages[0].items_per_age.days;
                let items = item.ages[0].items_per_age.items;
                if (days && days !== null) {
                    let rate = (vm.vacation.totalDays / parseFloat(days));

                    newItem.packingAmount = multiplyNumbersInString(items, rate);
                } else {
                    // Default to just the item, or the number 1
                    newItem.packingAmount = items || 1;
                }
                return newItem;
            }

            function multiplyNumbersInString(stringToCheck, rate) {
                //Regex matches an int or float, but no negatives
                let matchingInfo = stringToCheck.match(/\d+(\.\d+)?/);
                if (!matchingInfo) {
                    return stringToCheck;
                }

                let itemAmount = matchingInfo[0],
                    index = matchingInfo.index,
                    length = itemAmount.length,
                    postText = stringToCheck.substr(length + index),
                    preText = "";

                if (index !== 0 && typeof index != "undefined") {
                    preText = stringToCheck.substr(0, index);
                }
                if (postText.length) {
                    postText = multiplyNumbersInString(postText, rate);
                }

                let quantity = Math.ceil(parseInt(itemAmount) * rate);
                return preText + quantity + postText;
            }
        }
    ]
);
