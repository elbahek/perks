'use strict';

var PerksModule = angular.module('PerksModule', [
  'ngRoute',
  'angular.filter',
  'fsm'
]);

/**
 * Routing
 */
PerksModule.config([
  '$routeProvider',
  '$locationProvider',
  function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/pages/home.html'
    })
    .when('/traits', {
      templateUrl: 'views/pages/traits.html'
    });

  $locationProvider.html5Mode(false);
}]);
