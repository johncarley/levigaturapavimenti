var app = angular.module('mainApp', ['ui.bootstrap', 'nya.bootstrap.select', 'ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "view/index.html"
        })
        .when("/chi-siamo", {
            templateUrl: "chi-siamo.html"
        })
        .when("/prezzi", {
            templateUrl: "prezzi.html"
        })
        .when("/contact", {
            templateUrl: "contact.html"
        })
        .when("/marmo", {
            templateUrl: "view/services/marmo-service.html"
        })
        .when("/granito", {
            templateUrl: "view/services/granito-service.html"
        })
        .when("/cemento", {
            templateUrl: "view/services/cemento-service.html"
        })
        .when("/cotto", {
            templateUrl: "view/services/cotto-service.html"
        });
});

app.service("utils", function () {

    this.pagesLink = {

        HOME: 'index.html',
        ABOUT: 'index.html',
        SERVICE: 'index.html',
        PRICE: 'index.html',
        CONTACT: 'index.html'
    };

    this.pageNames = {
        home: 'HOME',
        about: 'ABOUT',
        service: 'SERVICE',
        price: 'PRICE',
        contact: 'CONTACT'
    };

    this.linkPages = {
        home: '/',
        about: 'chi-siamo',
        price: 'prezzi',
        marmo: 'marmo',
        granito: 'granito',
        cemento: 'cemento',
        cotto: 'cotto',
        contact: 'contact'
    };

    this.serviceContentId = 'marmo';

});

app.controller('mainCtrl', ['$scope', 'utils', '$compile', '$uibModal', function ($scope, utils, $compile, $uibModal) {
    $scope.pageNames = utils.pageNames;
    $scope.linkPages = utils.linkPages;

    $scope.about = {

        widget: {
            accordion: [

                {
                    label: "",
                    header: $compile('<h4>IO SONO QUI</h4>')($scope)
                }
            ]
        }
    };

    $scope.serviceContentId = utils.serviceContentId;

    $scope.openSopralluogoModal = function () {

        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'view/modal/sopralluogo-modal.html',
            controller: 'sopralluogoModalCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            resolve: {
                items: function () {

                }
            }
        });

    };
}]);

app.directive('jcMenu', [function () {

    return {
        restrict: 'E',
        scope: {
            current: '@'
        },
        controller: function ($scope, utils) {

            $scope.pageNames = utils.pageNames;
            $scope.linkPages = utils.linkPages;
            $scope.navigateService = function (id) {
                utils.serviceContentId = id;
            };
        },
        templateUrl: 'view/menu/nav-menu/nav-menu.html',
        link: function ($scope, element, attrs) {

        }
    }
}]);

app.directive('iconBadge', [function () {

    return {
        restrict: 'E',
        scope: {
            value: '@',
            customClass: '@',
            icon: '@'
        },
        controller: function ($scope) {

        },
        templateUrl: 'view/widget/icon-badge.html'
    }
}]);

app.directive('jcFooter', function () {

    return {
        restrict: 'E',
        templateUrl: 'view/menu/js-footer.html',
        link: function ($scope, element, attrs) {

        }
    }
});

app.controller('sopralluogoModalCtrl', function ($uibModalInstance) {

    var $ctrl = this;

    $ctrl.ok = function () {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.close();
    };

});

app.directive('dynamicElement', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            template: "="
        },
        replace: true,
        link: function(scope, element, attrs) {
            element.replaceWith($compile(scope.template)(scope));
        }
    }
}]);

app.directive('priceCalculator', function ($uibModal) {

    return {
        restrict: 'E',
        scope: {
            compat: '@'
        },
        templateUrl: 'view/priceCalculator/price-calculator.html',
        controller: function ($scope) {

            var ctrl = this;

            ctrl.$onInit = function init() {
                if ($scope.compat) {
                    $scope.floorType = $scope.compat;
                }

                $scope.$watch('dimensionMq', function (newVal, oldVal) {

                    if (newVal !== oldVal && newVal) {
                        calculatePrice();
                    }
                });

                $scope.$watch('isTratment', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                        calculatePrice();
                    }
                });

                $scope.$watch('isNuovaPosa', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                        calculatePrice();
                    }
                });

                $scope.$watch('isResina', function (newVal, oldVal) {

                    if (newVal !== oldVal) {
                        calculatePrice();
                    }
                });
            };

            $scope.resultPrice;

            $scope.enabledCalculateBtn = true;

            $scope.openSopralluogoModal = function () {

                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'view/modal/sopralluogo-modal.html',
                    controller: 'sopralluogoModalCtrl',
                    controllerAs: '$ctrl',
                    size: 'sm',
                    resolve: {
                        items: function () {

                        }
                    }
                });

            };


            $scope.floorTypes = [
                'Superficie', 'Marmo', 'Granito', 'Pietra', 'Marmette in cementina',
                'Cotto', 'Cemento industriale'
            ];

            function calculatePrice() {

                $scope.resultPrice = ( $scope.dimensionMq >= 200 ? getPriceType() - 1 : getPriceType() ) * $scope.dimensionMq;

                if ($scope.isTratment) {
                    var additional = $scope.dimensionMq * 10;
                    $scope.resultPrice += additional;
                }

                if ($scope.isNuovaPosa) {
                    var additional = $scope.dimensionMq * 3;
                    $scope.resultPrice += additional;
                }

                if ($scope.isResina) {
                    var additional = $scope.dimensionMq * 3;
                    $scope.resultPrice += additional;
                }
            };

            function getPriceType() {

                var MARMO = 20;
                var GRANITO = 30;
                var PIETRA = 16;
                var CEMENTINA = 18;
                var COTTO = 20;
                var CEMENTO_INDUSTRIALE = 10;

                switch ($scope.floorType) {

                    case 'Marmo':
                        return MARMO;
                        break;

                    case 'Granito':
                        return GRANITO;
                        break;

                    case 'Pietra':
                        return PIETRA;
                        break;

                    case 'Marmette in cementina':
                        return CEMENTINA;
                        break;

                    case 'Cotto':
                        return COTTO;
                        break;

                    case 'Cemento industriale':
                        return CEMENTO_INDUSTRIALE;
                        break;
                }
            };

            function calculateResult() {

                if ($scope.floorTypes && $scope.dimensionMq) {
                    $scope.enabledCalculateBtn = false;
                } else {
                    $scope.enabledCalculateBtn = true;
                }
            };

            $scope.$watch('floorType', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    calculateResult();
                }
            });

            $scope.$watch('dimensionMq', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    calculateResult();
                }
            });
        }
    }

});

app.directive('openHourBadge', function () {

    return {
        restrict: 'E',
        templateUrl: 'view/widget/open-hour-badge.html',
        controller: function ($scope) {

        }

    }
});

app.directive('workSlider',['$compile', function ($compile) {

    return {

        restrict: 'E',
        controllerAs: '',
        scope: {
            type: '@'
        },
        templateUrl: 'view/work-slider/work-slider.html',
        controller: function ($scope) {

            var pathImages = 'images/work/';
            $scope.typeInformation = {

                cotto: {

                    description : '<ul>cotto</ul>',
                    typeJobs : '<ul>cotto</ul>',
                    slides: [
                        {
                            imgUrl: pathImages+'marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: pathImages+'marmo/marmo-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: pathImages+'marmo/marmo-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                },
                granito: {

                    description : '<ul>granito</ul>',
                    typeJobs : '<ul>granito</ul>',
                    slides: [
                        {
                            imgUrl: pathImages+'granito/granito-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: pathImages+'granito/granito-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: pathImages+'granito/granito-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                },
                cemento: {

                    description : '<ul></ul>',
                    typeJobs : '<ul></ul>',
                    slides: [
                        {
                            imgUrl: 'images/work/marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                },
                marmo: {

                    description : '<ul></ul>',
                    typeJobs : '<ul></ul>',
                    slides: [
                        {
                            imgUrl: 'images/work/marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                },
                pietra: {

                    description : '<ul></ul>',
                    typeJobs : '<ul></ul>',
                    slides: [
                        {
                            imgUrl: 'images/work/marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                },
                industriali: {

                    description : '<ul></ul>',
                    typeJobs : '<ul></ul>',
                    slides: [
                        {
                            imgUrl: 'images/work/marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                }


            };

            $scope.interval = 3000;
            $scope.activeTab = 'description';

            $scope.setActiveTab = function (id) {
                $scope.activeTab = id;
            };
            $scope.slides = $scope.typeInformation[$scope.type].slides;
            $scope.description = $scope.typeInformation[$scope.type].description;
            $scope.typeJobs = $scope.typeInformation[$scope.type].typeJobs;


        }

    }
}]);