'use strict';

var PerksModule = angular.module('PerksModule');

PerksModule.controller('MainController', [
  '$scope',
  'DataService',
  function($scope, DataService) {
    $scope.data = null;
    DataService.fetch()
      .then(function(response) {
        $scope.data = response;
      });
  }
]);
