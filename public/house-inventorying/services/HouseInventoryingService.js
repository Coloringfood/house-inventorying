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

            function convertHomeForApi(homeData) {
                return homeData;
            }

            HouseInventoryingService.convertHomeForUi = (homeData) =>{
                let format = "yyyy-MM-dd";
                homeData.start_date = uibDateParser.parse(homeData.start_date.split("T")[0], format);
                homeData.end_date = uibDateParser.parse(homeData.end_date.split("T")[0], format);
                return homeData;
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

            HouseInventoryingService.getAllHomes = () => {
                return restangularFactory.one('homes').get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllHomes: ", returnedData);
                        }
                        return $q.all(returnedData.map(HouseInventoryingService.convertHomeForUi))
                            .then(function (returnedData) {
                                if (debugging) {
                                    console.log("Converted Home Data: ", returnedData);
                                }
                                return returnedData;
                            });
                    });
            };

            HouseInventoryingService.getHome = (homeId) => {
                return restangularFactory.one('homes', homeId).get()
                    .then(function (returnedData) {
                        let home = HouseInventoryingService.convertHomeForUi(returnedData);
                        if (debugging) {
                            console.log("getHome: ", home);
                        }
                        return home;
                    });
            };

            HouseInventoryingService.saveHome = (homeData, homeId) => {
                let convertedHome = convertHomeForApi(homeData);

                return restangularFactory.allUrl('.').customPUT(convertedHome, "homes/" + homeId)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("saveHome: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.createHome = (homeData) => {
                let convertedHome = convertHomeForApi(homeData);

                return restangularFactory.all('homes').post(convertedHome)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createHome: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.deleteHome = (homeId) => {
                return restangularFactory.one('homes').all(homeId).remove()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("deleteHome: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.getAllPackingItems = (homeId) => {
                let userId = authService.authenticated.tokenData.userId;
                return restangularFactory.one('homes', homeId).one('pack', userId).get()
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("getAllPackingItems: ", returnedData);
                        }
                        return returnedData;
                    });
            };

            HouseInventoryingService.generatePackingList = (homeData, ageId) => {
                let convertedHome = convertHomeForApi(homeData);
                convertedHome.ageId = ageId;

                return restangularFactory.one('homes').all('pack').post(convertedHome)
                    .then(function (returnedData) {
                        if (debugging) {
                            console.log("createHome: ", returnedData);
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