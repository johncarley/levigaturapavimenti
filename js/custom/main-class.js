var app = angular.module('mainApp', ['ui.bootstrap', 'nya.bootstrap.select', 'ngRoute', 'matchMedia']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "view/index.html",
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
        .when("/productcategory/:type", {
            templateUrl: "view/product/product-route.html",
            controller: "productCategoryViewCtrl"
        })
        .when("/productdetail/:detail/:id", {
            templateUrl: "view/product/product-route.html",
            controller: "productViewCtrl"
        })
        .when("/mobilemenu", {
            templateUrl: "view/menu/mobile-menu.html",
            controller: "mobileMenuCtrl"
        })
        .when("/cotto", {
            templateUrl: "view/services/cotto-service.html"
        });
});

app.controller('productCategoryViewCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.type = $routeParams.type;
}]);

app.controller('mobileMenuCtrl', ['$scope', '$routeParams', 'utils', function ($scope, $routeParams, utils) {
    $scope.type = $routeParams.type;

    $scope.categories = utils.products.categories;
}]);

app.controller('productViewCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.id = $routeParams.id;
    $scope.detail = $routeParams.detail;
}]);

app.service("utils", function () {

    var service = this;
    service.pagesLink = {

        HOME: 'index.html',
        ABOUT: 'index.html',
        SERVICE: 'index.html',
        PRICE: 'index.html',
        CONTACT: 'index.html'
    };

    service.pageNames = {
        home: 'HOME',
        about: 'ABOUT',
        service: 'SERVICE',
        price: 'PRICE',
        contact: 'CONTACT'
    };

    service.linkPages = {
        home: '/',
        about: 'chi-siamo',
        price: 'prezzi',
        marmo: 'marmo',
        granito: 'granito',
        cemento: 'cemento',
        cotto: 'cotto',
        contact: 'contact'
    };

    service.cartList = [];

    service.addProdToCart = function (prod) {

        var isInCart = false;
        _.forEach(service.cartList, function (prodInCart) {

            if (prodInCart.prod.id === prod.id) {
                prodInCart.quantity++;
                isInCart = true;
            }
        });
        if (!isInCart) {
            var newCartProd = {
                prod: prod,
                quantity: 1
            };
            service.cartList.push(newCartProd);
        }
    };

    var products = {};

    $.ajax({
        url: 'res/product-config.json',
        async: false,
        dataType: 'json',
        success: function (response) {

            var allCategory = [];

            products['list'] = response;
            //aggiungo la lista degli id dei prodotti
            _.forEach(response, function (value) {
                allCategory.push(value.category);//popolo l'array con tutte le categorie senza intersezione
            });

            var categories = _.intersection(allCategory);//intersezione categorie
            products['categories'] = {};

            //per ogni categoria, viene creata un propr
            //e come value il numero di prodotti con quella determinata categoria
            _.forEach(categories, function (category) {

                var result = _.filter(allCategory, function (item) {
                    if (item === category) return item
                }).length;
                products['categories'][category] = result;
            });
            service.products = products;
        }
    });

    service.get = function () {

    };
    console.log(products);

});

app.config(['$provide', function ($provide) {
    $provide.decorator('screenSize', ['$delegate', function ($delegate) {
        $delegate.rules = {
            menuLimit: 'only screen and (min-width: 991px) and (max-width: 1200px) ',
            xlg: '(min-width: 1200px)',
            lg: '(min-width: 992px)',
            xs: '(min-width: 576px)',
            sm: '(min-width: 276px)'
        };

        return $delegate;
    }]);
}]);

app.controller('mainCtrl', ['$scope', 'utils', '$compile', '$uibModal', 'screenSize', function ($scope, utils, $compile, $uibModal, screenSize) {
    $scope.pageNames = utils.pageNames;
    $scope.linkPages = utils.linkPages;
    $scope.categories = utils.products.categories;

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

    if (screenSize.get() === 'xs' || screenSize.get() === 'sm') {
        $scope.isMobile = true;
    } else {
        $scope.isMobile = false;
    }

    $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
        $scope.isMobile = isMatch;
    });

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

app.directive('jcMenu', ['screenSize', function (screenSize) {

    return {
        restrict: 'E',
        scope: {
            current: '@'
        },
        controller: function ($scope, utils) {

            $scope.pageNames = utils.pageNames;
            $scope.linkPages = utils.linkPages;
            $scope.categories = utils.products.categories;

            var dimTemplate;

            if (screenSize.is(['xs', 'sm'])) {
                dimTemplate = 'sm';
            } else if (screenSize.is(['menuLimit'])) {
                $scope.menuLimit = screenSize.get() === 'menuLimit' ? true : false;
                dimTemplate = 'lg';
            } else {
                dimTemplate = 'lg';
            }
            $scope.template = 'view/menu/nav-menu/nav-menu-' + dimTemplate + '.html'

            $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
                $scope.isMobile = isMatch;

                if (screenSize.is(['menuLimit'])) {
                    $scope.menuLimit = screenSize.get() === 'menuLimit' ? true : false;
                    dimTemplate = 'lg';
                }

                dimTemplate = $scope.isMobile ? 'sm' : 'lg';
                $scope.template = 'view/menu/nav-menu/nav-menu-' + dimTemplate + '.html'
            });

            $scope.cartList = utils.cartList;
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
        link: function (scope, element, attrs) {
            element.replaceWith($compile(scope.template)(scope));
        }
    }
}]);

app.directive('priceCalculator', ['screenSize', '$uibModal', function (screenSize, $uibModal) {

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

                if (screenSize.get() === 'xs' || screenSize.get() === 'sm') {
                    $scope.isMobile = true;
                } else {
                    $scope.isMobile = false;
                }
            };

            $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
                $scope.isMobile = isMatch;
            });

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

}]);

app.directive('openHourBadge', function () {

    return {
        restrict: 'E',
        templateUrl: 'view/widget/open-hour-badge.html',
        controller: function ($scope) {

        }

    }
});

app.directive('workSlider', ['screenSize', function (screenSize) {

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

                    description: '<ul>cotto</ul>',
                    typeJobs: '<ul>cotto</ul>',
                    slides: [
                        {
                            imgUrl: pathImages + 'marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: pathImages + 'marmo/marmo-2.jpg',
                            id: 1,
                            description: 'Marmo bianco'
                        },
                        {
                            imgUrl: pathImages + 'marmo/marmo-3.jpg',
                            id: 2,
                            description: 'Marmo bianco'
                        }
                    ]
                },
                granito: {

                    description: '<ul>granito</ul>',
                    typeJobs: '<ul>granito</ul>',
                    slides: [
                        {
                            imgUrl: pathImages + 'granito/granito-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: pathImages + 'granito/granito-2.jpg',
                            id: 1,
                            description: ''
                        },
                        {
                            imgUrl: pathImages + 'granito/granito-3.jpg',
                            id: 2,
                            description: ''
                        }
                    ]
                },
                cemento: {

                    description: '<ul></ul>',
                    typeJobs: '<ul></ul>',
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

                    description: '<ul></ul>',
                    typeJobs: '<ul></ul>',
                    slides: [
                        {
                            imgUrl: 'images/work/marmo/marmo-1.jpg',
                            id: 0,
                            description: 'Marmo nero'
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-2.jpg',
                            id: 1,
                            description: 'Marmo bianco'
                        },
                        {
                            imgUrl: 'images/work/marmo/marmo-3.jpg',
                            id: 2,
                            description: 'Marmo bianco'
                        }
                    ]
                },
                pietra: {

                    description: '<ul></ul>',
                    typeJobs: '<ul></ul>',
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

                    description: '<ul></ul>',
                    typeJobs: '<ul></ul>',
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

            $scope.stop = function () {
                $scope.interval = -1;
            };

            $scope.play = function () {
                $scope.interval = 5000;
            };
            $scope.activeTab = 'description';

            if (screenSize.is(['xs', 'sm'])) {
                $scope.mobile = true;
            } else {
                $scope.mobile = false;
            }

            $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
                $scope.mobile = isMatch;
            });


            $scope.setActiveTab = function (id) {
                $scope.activeTab = id;
            };
            $scope.slides = $scope.typeInformation[$scope.type].slides;
            $scope.description = $scope.typeInformation[$scope.type].description;
            $scope.typeJobs = $scope.typeInformation[$scope.type].typeJobs;


        }

    }
}]);

app.directive('productCategory', ['utils', 'screenSize','$window', function (utils, screenSize,$window) {
    return {
        restrict: 'E',
        scope: {
            type: '@'
        },
        templateUrl: 'view/product/product-category.html',
        link: function ($scope, elem, attr) {

            $scope.products = utils.products.list;
            $scope.floorFilter = {};
            $scope.minPrice = 0;
            $scope.maxPrice = 0;

            $scope.addProdToCart = function (prod) {
                utils.addProdToCart(prod);
            };

            $scope.linkModelFunc = function (url){
                console.log('link model function');
                $window.open(url);
            };

            if (screenSize.get() === 'xs' || screenSize.get() === 'sm') {
                $scope.isMobile = true;
            } else {
                $scope.isMobile = false;
            }

            $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
                $scope.isMobile = isMatch;
            });

            function getFloorType() {

                var floorTypes = [];
                _.forEach($scope.products, function (prod) {

                    $scope.minPrice = prod.price;

                    if (prod.price > $scope.maxPrice) {
                        $scope.maxPrice = prod.price;
                    }
                    ;

                    if (prod.price < $scope.minPrice) {
                        $scope.minPrice = prod.price;
                    }

                    _.forEach(prod.floorType, function (type) {
                        floorTypes.push(type);
                    })
                });

                var intersection = _.intersection(floorTypes);

                _.forEach(intersection, function (type) {
                    $scope.floorFilter[type] = false;
                });

                $scope.priceRange = $scope.maxPrice;
                return intersection;
            };

            function filterProducts() {

                $scope.products = _.filter(utils.products.list, function (prod) {

                    var typesToCheck = [];

                    _.forEach($scope.floorFilter, function (value, key) {
                        if (value) {
                            typesToCheck.push(key);
                        }
                    });

                    //funzione che verifica se un array contiene un sotto-array
                    function arrayContainsArray(superset, subset) {
                        return subset.every(function (value) {
                            return (superset.indexOf(value) >= 0);
                        });
                    }

                    return arrayContainsArray(prod.floorType, typesToCheck);
                });
            };

            $scope.$watch('priceRange', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    $scope.products = _.filter(utils.products.list, function (prod) {
                        return prod.price <= $scope.priceRange;
                    });
                }
            });

            $scope.changeFloorFilter = function (floorType) {
                $scope.floorFilter[floorType] = !$scope.floorFilter[floorType];
                filterProducts();
            };

            $scope.floorTypes = getFloorType();

        }
    }
}]);

app.directive('productDetail', ['utils','$window','screenSize', function (utils,$window,screenSize) {

    return {

        restrict: 'E',
        templateUrl: 'view/product/product-detail.html',
        scope: {
            id: '@'
        },
        link: function ($scope, elem, attr) {

            $scope.product = _.find(utils.products.list, function (prod) {
                return prod.id === $scope.id;
            });

            if (screenSize.get() === 'xs' || screenSize.get() === 'sm') {
                $scope.isMobile = true;
            } else {
                $scope.isMobile = false;
            }

            $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
                $scope.isMobile = isMatch;
            });

            $scope.linkModelFunc = function (url){
                console.log('link model function');
                $window.open(url);
            };

            $scope.addProdToCart = function (prod) {
                utils.addProdToCart(prod);
            }
        }
    }

}]);

app.directive('cartManager', ['utils', 'screenSize', '$uibModal', function (utils, screenSize, $uibModal) {

    return {
        restrict: 'E',
        templateUrl: 'view/product/cart-manager.html',
        controller: function ($scope) {

            $scope.cartList = utils.cartList;

            if (screenSize.get() === 'xs' || screenSize.get() === 'sm') {
                $scope.isMobile = true;
            } else {
                $scope.isMobile = false;
            }

            $scope.isMobile = screenSize.onChange($scope, 'xs, sm', function (isMatch) {
                $scope.isMobile = isMatch;
            });

            $scope.openModal = function () {

                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'view/product/cart-modal-sm.html',
                    controller: function ($scope, cartList, options, $uibModalInstance) {

                        $scope.options = options;
                        $scope.cartList = cartList;
                        $scope.removeProd = removeProd;

                        /**
                         * CartProduct è diverso dall'oggetto prodotto standard.
                         * CartProduct properties:
                         * prod:     oggetto prodotto
                         * quantity: integer - quantità per quel prodotto
                         * @param cartProduct
                         */
                        $scope.addProdToCart = addProdToCart;

                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                    },
                    controllerAs: '$ctrl',
                    size: 'sm',
                    resolve: {
                        cartList: function () {
                            return $scope.cartList;
                        },
                        options: function () {
                            var obj = {
                                totProducts: $scope.totProducts,
                                totalPrice: $scope.totalPrice
                            };

                            return obj;
                        }
                    }
                });

            };


            function getItems() {
                var tot = 0;
                _.forEach($scope.cartList, function (prodInCart) {
                    tot += prodInCart.quantity;
                });

                return tot;
            };

            function getTotalPrice() {
                var tot = 0;
                _.forEach($scope.cartList, function (prodInCart) {
                    tot += prodInCart.quantity * prodInCart.prod.price;
                });

                return tot;
            };

            var removeProd = function (prodId) {

                _.remove(utils.cartList, function (prodInCart) {

                    if (prodInCart.prod.id === prodId) {
                        if (prodInCart.quantity > 1) {
                            prodInCart.quantity--;
                            return false;
                        } else if (prodInCart.quantity === 1) {
                            return true;
                        }
                    } else {
                        return false;
                    }
                });

            };

            var addProdToCart = function (cartProduct) {
                utils.addProdToCart(cartProduct.prod);
            };

            $scope.totProducts = getItems();

            $scope.totalPrice = getTotalPrice();

            $scope.removeProd = removeProd;

            /**
             * CartProduct è diverso dall'oggetto prodotto standard.
             * CartProduct properties:
             * prod:     oggetto prodotto
             * quantity: integer - quantità per quel prodotto
             * @param cartProduct
             */
            $scope.addProdToCart = addProdToCart;

            $scope.$watch('cartList', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    $scope.totProducts = getItems();
                    $scope.totalPrice = getTotalPrice();
                }
            }, true);
        }
    }
}]);