'use strict';

var PerksModule = angular.module('PerksModule', [
  'ngRoute'
]);

/**
 * Routing
 */
PerksModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/pages/main.html'
    })
    .when('/traits', {
      templateUrl: '/views/pages/traits.html'
    });
}]);
