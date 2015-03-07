var module = angular.module('oly.dialog', []);

module.directive('olyDialog', [function() {
    return {
        restrict: 'E',
        transclude: true,
        link: function(scope, element) {
            console.log('linked!');
        },
        template: '<dialog><ng-transclude></ng-transclude></dialog>'
    };
}]);