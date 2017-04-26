powerdialerApp.directive('editFactors',
    [
        'ENV',
        '$sce',
        function (ENV, $sce) {
            return {
                restrict: 'AE',
                scope: {
                    'factors': '=factors',
                    'selected': '=selected',
                    'settings': '=settings'
                },
                templateUrl: '/public/common/templates/edit_factors_template.html',
                link: function (scope, element, attrs) {
                    scope.types = [
                        'Vacation Type',
                        'Activities',
                        'Other'
                    ];
                    scope.view = scope.types[0];
                    scope.switchView = function (newView) {
                        scope.view = newView;
                    };

                    scope.vacationTypeTooltip = $sce.trustAsHtml(`
                       <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">Vacation Type</div>
                                <div class="panel-body">
                                    ie: If you are planning on taking an RV to the redwoods, then camping for 3 days you
                                        may select RV and specify 2 days, and then select Camping and specify 3 days
                                </div>
                            </div>
                        </div>
                       </div>
                    `);
                    scope.activityTooltip = $sce.trustAsHtml(`
                       <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">Activities</div>
                                <div class="panel-body">
                                Specify any activities you are planning on doing during this vacation, also specify how
                                        many times/days you will be doing each activity
                                <br><br>
                                Note: the days is optional, if you don't specify the days we will assume it will
                                        occur every day of the vacation
                                </div>
                            </div>
                        </div>
                       </div>
                    `);
                    scope.otherTooltip = $sce.trustAsHtml(`
                       <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">Other</div>
                                <div class="panel-body">
                                    Specify any of the other factors that could affect the vacation. There are no days
                                        applied to these, so they will just span the whole vacation
                                    <br><br>
                                    ie: Summertime, snowing, raining, etc...
                                </div>
                            </div>             
                        </div>
                       </div>
                    `);
                    scope.factorVacTypeTooltip = $sce.trustAsHtml(`
                      Optional: specify how many days of the vacation will be of this type<br>
                      If left blank, we will assume it is the full length of the vacation
                    `);
                    scope.factorActivityTooltip = $sce.trustAsHtml(`
                      Optional: specify how many days of the vacation you will do this activity<br>
                      If left blank, we will assume it is the full length of the vacation
                    `);


                    function preSelectFactors(factors, type) {
                        let selectedLength = factors.length,
                            newFactors = [];
                        for (let i = 0; i < selectedLength; i++) {
                            let factor = factors[i];
                            factor.vacations_factors = {days:null};
                            let index = scope.settings.object ? findFactorId(factor.id) : scope.selected.indexOf(factor.id);
                            if (index > -1) {
                                if (scope.settings.object && scope.settings.showDays) {
                                    factor = scope.selected[index];
                                }
                                factor.selected = true;
                            }
                            newFactors.push(factor);
                        }
                        scope.factors[type] = newFactors;
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

                    let typesLength = scope.types.length;
                    for (let i = 0; i < typesLength; i++) {
                        let type = scope.types[i];
                        preSelectFactors(scope.factors[type], type);
                    }

                    scope.selectFactor = function (factor) {
                        let index = scope.settings.object ? findFactorId(factor.id) : scope.selected.indexOf(factor.id);
                        if (index > -1) {
                            scope.selected.splice(index, 1);
                            factor.selected = false;
                        } else {
                            let addedObject = scope.settings.object ? factor : factor.id;
                            scope.selected.push(addedObject);
                            factor.selected = true;
                        }
                    };
                }
            };
        }
    ]
);