var app = angular.module('mainApp', ['ui.bootstrap', 'nya.bootstrap.select']);

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
        home: 'index.html',
        about: 'chi-siamo.html',
        price: 'prezzi.html'
    };

});

app.controller('mainCtrl', function ($scope, utils,$compile) {
    $scope.pageNames = utils.pageNames;
    $scope.linkPages = utils.linkPages;

    $scope.about = {

        widget : {
            accordion: [

                {
                    label: "",
                    header: $compile('<h4>IO SONO QUI</h4>')($scope)
                }
            ]
        }
    };
});

app.directive('jcMenu', [function () {

    return {
        restrict: 'E',
        scope: {
            current: '@'
        },
        controller: function ($scope, utils) {

            $scope.pageNames = utils.pageNames;
            $scope.linkPages = utils.linkPages;
        },
        templateUrl: 'view/menu/nav-menu/nav-menu.html',
        link: function ($scope, element, attrs) {

        }
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

/**
 * PRICE CALCULATOR
 */

app.controller('sopralluogoModalCtrl',function ($uibModalInstance) {

    var $ctrl = this;

    $ctrl.ok = function () {
        $uibModalInstance.close();
    };

    $ctrl.cancel = function () {
        $uibModalInstance.close();
    };

});
app.directive('priceCalculator', function ($uibModal) {

    return {
        restrict: 'E',
        templateUrl: 'view/priceCalculator/price-calculator.html',
        controller: function ($scope) {

            $scope.resultPrice;

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

            $scope.enabledCalculateBtn = true;


            $scope.floorTypes = [
                'Superficie', 'Marmo', 'Granito', 'Pietra', 'Marmette in cementina',
                'Cotto', 'Cemento industriale'
            ];

            $scope.calculatePrice = function () {

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