powerdialerApp.controller("LogoutController",
	[
		'$location',
		'authService',
		'Notification',
		function ($location, authService, NotificationProvider) {
			'use strict';

			authService.clearCredentials();
			NotificationProvider.success("Successfully Logged Out. Please wait while we reload the app");
			$location.path("/");
		}
	]
);
