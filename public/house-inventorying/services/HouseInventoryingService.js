powerdialerApp.factory(
    'HouseInventoryingService',
    [
        '$q',
        '$location',
        'RestangularFactory',
        'ENV',
        'uibDateParser',
        'authService',
        function ($q, $location, restangularFactory, ENV, uibDateParser, authService) {
            'use strict';
            let debugging = ENV.environment == 'dev';
            console.log("debugging: ", debugging);

            let HouseInventoryingService = {};

            function convertItemForApi(itemData) {
                return itemData;
            }

            function convertFactorForApi(factorData) {
                return factorData;
            }

            function convertVacationForApi(vacationData) {
                return vacationData;
            }

            HouseInventoryingService.convertVacationForUi = (vacationData) =>{
                let format = "yyyy-MM-dd";
                vacationData.start_date = uibDateParser.parse(vacationData.start_date.split("T")[0], format);
                vacationData.end_date = uibDateParser.parse(vacationData.end_date.split("T")[0], format);
                return vacationData;
            };

            HouseInventoryingService.getAllItems = () => {
                return restangularFactory.one('items').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllItems: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.saveItem = (itemData, itemId) => {
                let convertedItem = convertItemForApi(itemData);
                return restangularFactory.allUrl('.').customPUT(convertedItem, "items/" + itemId)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("saveItem: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.createItem = (itemData) => {
                let convertedItem = convertItemForApi(itemData);
                return restangularFactory.all('items').post(convertedItem)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createItem: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.deleteItem = (itemId) => {
                return restangularFactory.one('items').all(itemId).remove()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("deleteItem: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.getAllFactors = () => {
                return restangularFactory.one('factors').one("list").get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllFactors: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.createFactor = (factorData) => {
                let convertedFactor = convertFactorForApi(factorData);
                return restangularFactory.all('factors').post([convertedFactor])
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createFactor: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.getAllCategories = () => {
                return restangularFactory.one('items').one('categories').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllCategories: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.getAllVacations = () => {
                return restangularFactory.one('vacations').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllVacations: ", returnedData);
                        }
                        return $q.all(returnedData.map(HouseInventoryingService.convertVacationForUi))
                            .then(function (returnedData) {
                                if (debugging) {
                                    console.log("Converted Vacation Data: ", returnedData);
                                }
                                return returnedData;
                            });
                    });
            };

            HouseInventoryingService.getVacation = (vacationId) => {
                return restangularFactory.one('vacations', vacationId).get()
                    .then(function (returnedData) {
                        let vacation = HouseInventoryingService.convertVacationForUi(returnedData);
                        if (debugging) {
                            console.log("getVacation: ", vacation);
                        }
                        return vacation;
                    });
            };

            HouseInventoryingService.saveVacation = (vacationData, vacationId) => {
                let convertedVacation = convertVacationForApi(vacationData);

                return restangularFactory.allUrl('.').customPUT(convertedVacation, "vacations/" + vacationId)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("saveVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.createVacation = (vacationData) => {
                let convertedVacation = convertVacationForApi(vacationData);

                return restangularFactory.all('vacations').post(convertedVacation)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.deleteVacation = (vacationId) => {
                return restangularFactory.one('vacations').all(vacationId).remove()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("deleteVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.getAllPackingItems = (vacationId) => {
                let userId = authService.authenticated.tokenData.userId;
                return restangularFactory.one('vacations', vacationId).one('pack', userId).get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllPackingItems: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.generatePackingList = (vacationData, ageId) => {
                let convertedVacation = convertVacationForApi(vacationData);
                convertedVacation.ageId = ageId;

                return restangularFactory.one('vacations').all('pack').post(convertedVacation)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createVacation: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.authenticate = (username, password) => {
                let submitData = {
                    username: username,
                    password: password
                };
                return restangularFactory.all('authentication').post(submitData)
                    .then((result) => {
                        if (debugging) {
                            console.log("Authentication: ", result);
                        }
                        return result;
                    });
            };

            HouseInventoryingService.register = (signUpData) => {
                return restangularFactory.one('authentication').all('create').post(signUpData)
                    .then(function (result) {
                        if (debugging) {
                            console.log("Signup: ", result);
                        }
                        return result;
                    });
            };

            HouseInventoryingService.updateUser = (userData) => {
                return restangularFactory.allUrl('.').customPUT(userData, "authentication/update")
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("saveUser: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.getThemes = () => {
                return restangularFactory.one('authentication').one('themes').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("themes: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            return HouseInventoryingService;
        }
    ]
);