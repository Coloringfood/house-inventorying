powerdialerApp.controller('EditVacationModalController',
    [
        '$scope',
        '$uibModalInstance',
        'vacation',
        'HouseInventoryingService',
        'Notification',
        '$sce',
        'authService',
        function ($scope, $uibModalInstance, vacation, HouseInventoryingService, NotificationProvider, $sce, authService) {
            'use strict';
            let vm = this;
            $scope.vacationName = vacation.name;

            vm.factorsTooltip = $sce.trustAsHtml(`
                <div>
                    <label style="width: 200px">Factors or Scenario</label>
                    Specify what type of vacation you will be having.<br>
                    Specify what type of activities you will do on it.<br>
                    Specify any scenarios that apply to your vacation.
                </div>
            `);

            vm.newVacation = angular.copy(vacation);
            if (!vm.newVacation.required) {
                vm.newVacation.required = false;
            }

            vm.factorSettings = {
                object: true,
                showDays: true
            };

            vm.datePickerFormat = 'dd-MMMM-yyyy';
            vm.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 0,
                showWeeks: false
            };
            vm.startDate = {
                opened: false
            };
            vm.endDate = {
                opened: false
            };
            vm.openStart = () => {
                vm.startDate.opened = true;
            };
            vm.openEnd = () => {
                vm.endDate.opened = true;
            };

            // START FACTOR STUFF
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
            function updateFactors() {
                return HouseInventoryingService.getAllFactors()
                    .then(function (factors) {
                        let markedFactors = {};
                        let selectedLength = vm.newVacation.factors.length;
                        for (let i = 0; i < selectedLength; i++) {
                            let factor = vm.newVacation.factors[i];
                            markedFactors[factor.name] = factor.vacations_factors;
                        }

                        vm.factors = {
                            'Vacation Type': [],
                            'Activities': [],
                            'Other': []
                        };
                        let factorsLength = factors.length;
                        for (let i = 0; i < factorsLength; i++) {
                            let factor = factors[i];
                            factor.selected = markedFactors[factor.name] ? true : false;
                            factor.vacations_factors = {days: null};
                            factor.vacations_factors.days = markedFactors[factor.name] ? markedFactors[factor.name].days : null;
                            vm.factors[factor.type].push(factor);
                        }
                    });
            }

            updateFactors();
            // END FACTOR STUFF

            vm.ok = () => {
                if (!vm.newVacation.name) {
                    NotificationProvider.error("Please enter a name for this vacation");
                    return;
                }
                if (!vm.newVacation.start_date) {
                    NotificationProvider.error("You must have a start date");
                    return;
                }
                if (!vm.newVacation.end_date) {
                    NotificationProvider.error("You must have an end date");
                    return;
                }
                if (vm.newVacation.start_date >= vm.newVacation.end_date) {
                    NotificationProvider.error("The vacation must start before the end date");
                    return;
                }
                if (vm.newVacation.factors.length === 0) {
                    NotificationProvider.error("You must select at least one Factor for the vacation");
                    return;
                }
                if (typeof vacation.id !== "undefined") {
                    if (authService.authenticated) {
                        HouseInventoryingService.saveVacation(vm.newVacation, vacation.id)
                            .then((result) => {
                                $uibModalInstance.close({
                                    message: "Successfully saved " + vm.newVacation.name,
                                    success: true
                                });
                            })
                            .catch(() => {
                                NotificationProvider.error({
                                    message: "Error Saving Vacation",
                                    success: false
                                });
                            });
                    }
                    else {
                        HouseInventoryingService.generatePackingList(vm.newVacation, 4)
                            .then((result) => {
                                let vacations = [];
                                try {
                                    vacations = JSON.parse(localStorage.vacations);
                                }catch(e){}
                                vacations[vacation.id] = vm.newVacation;
                                localStorage.vacations = JSON.stringify(vacations);
                                $uibModalInstance.close({
                                    message: "Successfully created " + vm.newVacation.name,
                                    success: true
                                });
                            })
                            .catch(() => {
                                NotificationProvider.error({
                                    message: "Error Creating Vacation",
                                    success: false
                                });
                            });
                    }
                }
                else {
                    if (authService.authenticated) {
                        HouseInventoryingService.createVacation(vm.newVacation)
                            .then((result) => {
                                $uibModalInstance.close({
                                    message: "Successfully created " + vm.newVacation.name,
                                    success: true
                                });
                            })
                            .catch(() => {
                                NotificationProvider.error({
                                    message: "Error Creating Vacation",
                                    success: false
                                });
                            });
                    }
                    else {
                        HouseInventoryingService.generatePackingList(vm.newVacation, 4)
                            .then((result) => {
                                let vacations = [];
                                try {
                                    vacations = JSON.parse(localStorage.vacations);
                                }catch(e){}
                                vm.newVacation.id = vacations.length;
                                vacations.push(vm.newVacation);
                                localStorage.vacations = JSON.stringify(vacations);
                                $uibModalInstance.close({
                                    message: "Successfully created " + vm.newVacation.name,
                                    success: true
                                });
                            })
                            .catch(() => {
                                NotificationProvider.error({
                                    message: "Error Creating Vacation",
                                    success: false
                                });
                            });
                    }
                }
            };

            vm.cancel = () => {
                console.log("vm.newVacation: ", vm.newVacation);
                $uibModalInstance.dismiss("clicked cancel button");
            };
        }
    ]
);