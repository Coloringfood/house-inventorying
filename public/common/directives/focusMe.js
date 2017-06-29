powerdialerApp.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
	return {
		link: function (scope, element, attrs) {
			let model = $parse(attrs.focusMe);
			scope.$watch(model, function (value) {
				console.log('value=', value);
				if (value === true) {
					$timeout(function () {
						element[0].focus();
					});
				}
			});
			// element.bind('blur', function () {
			//     scope.$apply(model.assign(scope, false));
			// });
		}
	};
}]);