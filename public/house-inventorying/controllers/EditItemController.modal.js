powerdialerApp.controller('EditItemModalController',
    [
        '$scope',
        '$uibModalInstance',
        'item',
        'HouseInventoryingService',
        'Notification',
        '$sce',
        function ($scope, $uibModalInstance, item, HouseInventoryingService, NotificationProvider, $sce) {
            'use strict';
            let vm = this,
                markedFactors = {};

            vm.privateItemTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Private</label>
                    Something that only you will be told to pack<br> 
                    It is not shared with any other user.<br>
                    ie: Personal Medication, favorite teddy bear, etc...
                </div>
            `);
            vm.optionalItemTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Optional</label>
                    An item that is not required, but people may want to pack.<br>
                    Note: By default all items are required<br>
                    ie: Water Shoes, Hat, Laptop  
                </div>
            `);
            vm.itemCategoryTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Categories</label>
                    Shows which section of the packing list this item will show up .<br>
                    Note: By default all items are Misc
                </div>
            `);
            vm.ageQuantityTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Age/Quantity</label>
                    - Specifies which ages should pack this item. And how much each age group may need to pack<br>
                    - The number of items will be multiplied according to the amount of days<br>
                    - If you leave it blank we assume you only need 1 for the whole vacation
                </div>
            `);
            vm.itemsAmountTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Items Amount</label>
                    It also allows you to specify how many items will be needed on the vacation<br>
                    You can include text or it can just be a number.<br>
                    Examples:
                    <ul style="text-align: left">
                        <li>4 water bottles</li>
                        <li>1 outfit</li>
                        <li>2</li>
                    </ul>
                </div>
            `);
            vm.itemsDaysTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Items Days</label>
                    For the specified amount of items, how many days is it good for.<br>
                    It must be a number.<br>
                    ie: 4 Water Bottles are good for 1 day, 1 pair of Pajamas for 7 days.
                </div>
            `);
            vm.factorsTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Factors or Scenario</label>
                    Specify what type of vacation you will be having.<br>
                    Specify what type of activities you will do on it.<br>
                    Specify any scenarios that apply to your vacation.
                </div>
            `);
            vm.neededEveryVacationTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Need on Every Vacation</label>
                    Mark if this item is something that should always be packed.<br>
                    ie: Shirts, Cell Phone, First-Aid kit
                </div>
            `);

            vm.newItem = angular.copy(item);
            vm.newItem.optional = !vm.newItem.required;
            vm.newItem.category = vm.newItem.category || 4;
            console.log("vm.newItem: ", vm.newItem);
            if (!vm.newItem.required) {
                vm.newItem.required = false;
            }
            if (!vm.newItem.ages) {
                vm.newItem.ages = [];
            }
            vm.factorSettings = {
                object: false
            };
            vm.view = "Vacation Type";
            vm.types = [
                'Vacation Type',
                'Activities',
                'Other'
            ];
            vm.factors = {
                'Vacation Type': [],
                'Activities': [],
                'Other': []
            };
            vm.show = {
                Baby: false,
                Toddler: false,
                Kid: false,
                Adult: false
            };


            let agesLength = vm.newItem.ages.length;
            for (let i = 0; i < agesLength; i++) {
                let age = vm.newItem.ages[i];
                vm.show[age.name] = true;
            }

            vm.updateAges = (selectedAge) => {
                if (selectedAge === 'all') {
                    if (!vm.showAll) {
                        vm.showAll = false;
                        vm.allItems = null;
                        vm.allAges = null;
                        vm.newItem.ages = [];
                    } else {
                        vm.newItem.ages = [
                            {name: "Baby", items_per_age: {}},
                            {name: "Toddler", items_per_age: {}},
                            {name: "Kid", items_per_age: {}},
                            {name: "Adult", items_per_age: {}}
                        ];
                        vm.show = {
                            Baby: false,
                            Toddler: false,
                            Kid: false,
                            Adult: false
                        };
                    }
                }
                else {
                    let agesLength;
                    if (vm.show[selectedAge]) {
                        vm.newItem.ages.push({
                            name: selectedAge,
                            items_per_age: {}
                        });
                    }
                    else {
                        agesLength = vm.newItem.ages.length;
                        for (let i = 0; i < agesLength; i++) {
                            let age = vm.newItem.ages[i];
                            if (age.name == selectedAge) {
                                vm.newItem.ages.splice(i, 1);
                                break;
                            }
                        }
                    }
                    // Check if vm.showAll should be checked
                    agesLength = vm.newItem.ages.length;
                    let matching = agesLength === 4;
                    if (matching) {
                        let matchingItem = vm.newItem.ages[0].items_per_age.items,
                            matchingDay = vm.newItem.ages[0].items_per_age.days;
                        for (let j = 0; j < agesLength && matching; j++) {
                            let itemsPerAge = vm.newItem.ages[j].items_per_age;
                            matching = (matchingDay == itemsPerAge.days);
                            if (matching) {
                                matching = (matchingItem == itemsPerAge.items);
                            }
                        }
                        if (matching && (matchingItem || matchingDay)) {
                            vm.showAll = true;
                            vm.show = {
                                Baby: false,
                                Toddler: false,
                                Kid: false,
                                Adult: false
                            };
                            vm.allItems = matchingItem;
                            vm.allDays = matchingDay;
                        }
                    }
                }
            };
            vm.updateAges();

            vm.updateAllAges = () => {
                let agesLength = vm.newItem.ages.length;
                for (let i = 0; i < agesLength; i++) {
                    let age = vm.newItem.ages[i];
                    age.items_per_age.items = vm.allItems;
                    age.items_per_age.days = vm.allDays;
                }
            };

            vm.switchView = (newView, age) => {
                age.view = newView;
            };

            HouseInventoryingService.getAllCategories()
                .then((categories) => {
                    vm.categories = categories;
                });

            vm.setCategoryType = (choice) => {
                vm.newItem.category = choice;
            };
            function updateFactors() {
                return HouseInventoryingService.getAllFactors()
                    .then(function (factors) {
                        vm.factors = {
                            'Vacation Type': [],
                            'Activities': [],
                            'Other': []
                        };
                        let factorsLength = factors.length;
                        let useMarkedFactors = !Object.keys(markedFactors).length;
                        for (let i = 0; i < factorsLength; i++) {
                            let factor = factors[i];
                            if (!useMarkedFactors) {
                                factor.selected = markedFactors[factor.name];
                            }
                            else {
                                let index = vm.newItem.factors.indexOf(factor.id);
                                if (index > -1) {
                                    factor.selected = true;
                                }
                            }
                            vm.factors[factor.type].push(factor);
                        }
                        markedFactors = {};
                    });
            }

            updateFactors();

            vm.setFactorType = (type) => {
                vm.newFactor.type = type;
            };
            vm.createFactor = () => {
                if (vm.newFactor.name && vm.newFactor.type) {
                    // Loop current factors and save which ones are selected
                    markedFactors = {};
                    let factorsTypeLength = vm.types.length;
                    for (let i = 0; i < factorsTypeLength; i++) {
                        let factorType = vm.types[i];
                        let factorsLength = vm.factors[factorType].length;
                        for (let j = 0; j < factorsLength; j++) {
                            let factor = vm.factors[factorType][j];
                            if (factor.selected) {
                                markedFactors[factor.name] = true;
                            }
                        }
                    }

                    HouseInventoryingService.createFactor(vm.newFactor).then(function () {
                        vm.showNewFactor = false;
                        updateFactors().then(function () {
                            NotificationProvider.success("Factor created");
                        });
                    }).catch((error) => {
                        console.log("error: ", error);
                        NotificationProvider.error(error.data.message || "Error trying to save factor");
                    });
                } else {
                    NotificationProvider.error("Please fill out all the factor information");
                }
            };
            vm.openNewFactor = () => {
                vm.newFactor = {};
                vm.showNewFactor = true;
            };
            vm.closeNewFactor = () => {
                vm.showNewFactor = false;
            };

            vm.ok = () => {
                if (!vm.newItem.name) {
                    NotificationProvider.error("Please enter a name");
                    return;
                }
                if (vm.newItem.ages.length === 0) {
                    NotificationProvider.error("You this item must apply to an age group");
                    return;
                }
                vm.newItem.required = !vm.newItem.optional;
                if (item.id) {
                    HouseInventoryingService.saveItem(vm.newItem, item.id)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully saved " + vm.newItem.name,
                                success: true
                            });
                        })
                        .catch(function (error) {
                            console.log("error: ", error);
                            NotificationProvider.error({
                                message: error.data.message || "Error Saving Item",
                                success: false
                            });
                        });
                }
                else {
                    HouseInventoryingService.createItem(vm.newItem)
                        .then(function (result) {
                            $uibModalInstance.close({
                                message: "Successfully created " + vm.newItem.name,
                                success: true
                            });
                        })
                        .catch(function (error) {
                            console.log("error: ", error);
                            NotificationProvider.error({
                                message: error.data.message || "Error Creating Item",
                                success: false
                            });
                        });
                }
            };

            vm.cancel = () => {
                console.log("vm.newItem: ", vm.newItem);
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);