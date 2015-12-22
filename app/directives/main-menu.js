'use strict';

var PerksModule = angular.module('PerksModule');

PerksModule.directive('mainMenu', [
  '$location',
  function($location) {
    return {
      restrict: 'A',
      templateUrl: '/views/components/main-menu.html',
      link: function($scope) {
        $scope.isActive = function(path) {
          return path === $location.path();
        };
      }
    };
  }
]);
