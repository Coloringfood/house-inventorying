powerdialerApp.controller("SettingsController",
    [
        '$scope',
        '$location',
        'authService',
        'Notification',
        'HouseInventoryingService',
        function ($scope, $location, authService, NotificationProvider, HouseInventoryingService) {
            'use strict';
            let vm = this;
            vm.user = authService.authenticated.tokenData.user;

            let index = vm.user.name.indexOf(" ");
            vm.user.firstName = vm.user.name.substring(0, index).trim();
            vm.user.lastName = vm.user.name.substring(index).trim();
            delete vm.user.password;

            vm.ages = [
                {
                    range: "0-2",
                    name: "Baby"
                },
                {
                    range: "2-5",
                    name: "Toddler"
                },
                {
                    range: "5-13",
                    name: "Kid"
                },
                {
                    range: "13+",
                    name: "Adult"
                },
            ];

            HouseInventoryingService.getThemes().then((themes)=> {
                vm.themes = themes;
                if (!vm.user.settings.cssTheme) {
                    vm.user.settings.cssTheme = "Default";
                }
            });

            vm.save = () => {
                vm.dataLoading = true;
                vm.user.name = vm.user.firstName + " " + vm.user.lastName;
                if (vm.user.settings.cssTheme == "Default") {
                    delete vm.user.settings.cssTheme;
                }

                HouseInventoryingService.updateUser(vm.user)
                    .then(function (result) {
                        authService.signedIn(result.token, true);
                        NotificationProvider.success("Successfully Updated Settings. Please wait while we reload the app");
                        vm.dataLoading = false;
                    })
                    .catch((err) => {
                        NotificationProvider.error(err.data.message);
                        vm.dataLoading = false;
                    });
            };

            vm.setSelectedTheme = (theme) => {
                vm.user.settings.cssTheme = theme;
            };

            vm.useCss = () => {
                if (vm.user.settings.cssTheme == "Default") {
                    delete vm.user.settings.cssTheme;
                }
                let updateCssData = {
                    "id": vm.user.id,
                    "age": vm.user.age,
                    "settings": vm.user.settings
                };

                HouseInventoryingService.updateUser(updateCssData)
                    .then(function (result) {
                        authService.signedIn(result.token, true);
                        NotificationProvider.success("Successfully Selected Theme. Please wait while we reload the app");
                        vm.dataLoading = false;
                    })
                    .catch((err) => {
                        NotificationProvider.error(err.data.message);
                        vm.dataLoading = false;
                    });
            };
        }
    ]
);
