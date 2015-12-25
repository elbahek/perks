'use strict';

var PerksModule = angular.module('PerksModule');

PerksModule.service('DataService', ['$http', function($http) {
  this.fetch = function() {
    return $http.get('data/data.json')
      .then(function(response) {
        return response.data;
      });
  };
}]);
