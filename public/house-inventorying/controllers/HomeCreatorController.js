powerdialerApp.controller('HomeCreatorController',
	[
		'$scope',
		'$window',
		'HouseInventoryingService',
		'authService',
		function ($scope, $window, HouseInventoryingService, authService) {
			'use strict';

			let vm = this;
			vm.name = "Create A House";
			vm.authenticated = !!authService.authenticated;
			vm.pagination = {
				current_page: 1,
				totalItems: 3,
				num_pages: 0, // Read-only
				items_per_page: 1,
				furthest_page: 1
			};

			vm.home = {};
			vm.rooms = [];

			vm.setPage = (page_number) => {
				vm.pagination.current_page = page_number;
				vm.pageChanged();
			};

			vm.pageChanged = () => {
				vm.pagination.furthest_page = vm.pagination.furthest_page > vm.pagination.current_page ?
					vm.pagination.furthest_page : vm.pagination.current_page;
			};

			vm.validateHouse = () => {
				let valid = true;
				if (valid) {
					vm.setPage(2);
				}
			};

			vm.createLocation = () => {

			}
		}
	]
);
