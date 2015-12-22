'use strict';

var PerksModule = angular.module('PerksModule');

PerksModule.service('DataService', ['$http', function($http) {
  function prepareRaceRequirements(races) {
    // races can only be true or false
    var isPositiveRequirement = _.every(races, function(value) {
      return value === true;
    });
    var isNegativeRequirement = _.every(races, function(value) {
      return value === false;
    });

    var raceList = _.keys(races);
    raceList = _.map(raceList, function(race) {
      return _.capitalize(race);
    });

    var raceRequirements = raceList.join(', ');
    if (isPositiveRequirement) {
      raceRequirements = 'Only ' + raceRequirements;
    }
    if (isNegativeRequirement) {
      raceRequirements = 'No ' + raceRequirements;
    }

    return raceRequirements;
  }

  function prepareSkillRequirements(skills) {
    var skillList = [];
    _.forEach(skills, function(value, name) {
      skillList.push(_.capitalize(name) + ': ' + value + '%');
    });

    return skillList.join(', ');
  }

  function prepare(response) {
    response.data.perks.forEach(function(perk) {
      if (angular.isUndefined(perk.requirements)) {
        perk.requirements = {};
      }
      if (angular.isUndefined(perk.requirements.stats)) {
        perk.requirements.stats = {};
      }
      perk.requirements.misc = [];

      if (!angular.isUndefined(perk.requirements.skills)) {
        perk.requirements.misc.push(prepareSkillRequirements(perk.requirements.skills));
      }

      if (!angular.isUndefined(perk.requirements.races)) {
        perk.requirements.misc.push(prepareRaceRequirements(perk.requirements.races));
      }

      perk.requirements.misc = perk.requirements.misc.join('; ');
    });

    return response.data;
  }

  this.fetch = function() {
    return $http.get('/data/data.json')
      .then(prepare);
  };
}]);
