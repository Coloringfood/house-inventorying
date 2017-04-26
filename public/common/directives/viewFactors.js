powerdialerApp.directive('viewFactors',
    [
        'ENV',
        function (ENV) {
            return {
                restrict: 'AE',
                scope: {
                    'factors': '=factors',
                    'selected': '=selected',
                    'settings': '=settings'
                },
                templateUrl: '/public/common/templates/view_factors_template.html',
                link: function (scope, element, attrs) {
                    function renderView() {
                        scope.types = [
                            'Vacation Type',
                            'Activities',
                            'Other'
                        ];

                        scope.filteredFactors = {
                            'Vacation Type': [],
                            'Activities': [],
                            'Other': []
                        };
                        if (!scope.settings) {
                            scope.settings = {
                                object: false
                            };
                        }
                        let factorsLength = scope.factors.length;
                        for (let i = 0; i < factorsLength; i++) {
                            let factor = scope.factors[i];
                            let index = scope.settings.object ? findFactorId(factor.id) : scope.selected.indexOf(factor.id);
                            if (index > -1) {
                                let pushedItem = factor;
                                if (scope.settings.showDays) {
                                    pushedItem = scope.selected[index];
                                }
                                scope.filteredFactors[factor.type].push(pushedItem);
                            }
                        }
                    }

                    function findFactorId(id) {
                        if (!scope.settings.object) {
                            return -1;
                        }
                        let selectedLength = scope.selected.length;
                        for (let i = 0; i < selectedLength; i++) {
                            let selected = scope.selected[i];
                            if (selected.id === id) {
                                return i;
                            }
                        }
                        return -1;
                    }

                    scope.$watch('selected', function (oldValue, newValue) {
                        if (newValue) {
                            renderView();
                        }
                    });
                }
            };
        }
    ]
)
;