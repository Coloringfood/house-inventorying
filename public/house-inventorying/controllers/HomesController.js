powerdialerApp.controller('HomesPageController',
	[
		'$scope',
		'HouseInventoryingService',
		'Notification',
		'$uibModal',
		'$q',
		'authService',
		'ENV',
		function ($scope, HouseInventoryingService, NotificationProvider, $uibModal, $q, authService, ENV) {
			'use strict';

			let vm = this;
			let debugging = ENV.environment == 'dev';
			vm.name = "Homes";
			vm.homesList = [];
			vm.authenticated = !!authService.authenticated;

			function updateList() {
				let homesPromise;
				if (vm.authenticated) {
					homesPromise = HouseInventoryingService.getAllHomes();
				}
				else {
					try {
						homesPromise = $q.all(JSON.parse(localStorage.homes).map((home) => {
							return HouseInventoryingService.convertHomeForUi(home);
						}));
					}
					catch (e) {
						homesPromise = $q.resolve();
					}
				}
				homesPromise = homesPromise.then(function (homes) {
					vm.homesList = homes;
					return homes;
				}).catch(function (error) {
					console.log("Getting Homes Error: ", error);
					NotificationProvider.error({
						message: "Error Getting All Homes"
					});
				});
				return $q.all([homesPromise]).then(() => {
					if (debugging) {
						console.log(vm.homesList);
					}
				});
			}

			updateList();

			vm.deleteHome = (home) => {
				if (authService.authenticated) {
					return HouseInventoryingService.deleteHome(home.id)
						.then(function () {
							NotificationProvider.success({
								message: "Successfully removed " + home.name
							});
							updateList();
						})
						.catch(function (error) {
							console.log("Delete Error: ", error);
							NotificationProvider.error({
								title: "Error Deleting Home"
							});
						});
				}
				else {
					let homes = [];
					try {
						homes = JSON.parse(localStorage.homes);
					} catch (e) {
					}
					homes.splice(home.id, 1);
					let homesLength = homes.length;
					for (let i = 0; i < homesLength; i++) {
						let home = homes[i];
						home.id = i;
					}
					localStorage.homes = JSON.stringify(homes);
					updateList();
				}
			};
		}
	]
);
