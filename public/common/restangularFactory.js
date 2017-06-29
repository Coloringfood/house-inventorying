powerdialerApp.factory('RestangularFactory', ['Restangular', 'ENV', function (Restangular, ENV) {
	'use strict';

	return Restangular.withConfig(function (RestangularConfigurer) {
		RestangularConfigurer.setBaseUrl(ENV.backend.host);
	});
}]);
