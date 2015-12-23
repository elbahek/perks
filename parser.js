'use strict';

var fs = require('fs'),
  _ = require('lodash'),
  csvParse = require('csv-parse');

var columns = [
  'name',
  'level',
  'ranks',
  'st',
  'pe',
  'en',
  'ch',
  'in',
  'ag',
  'lk',
  'requirementsRaw',
  'summary'
];
var statKeys = ['st', 'pe', 'en', 'ch', 'in', 'ag', 'lk'];
var skillPatterns = [
  'Small Guns',
  'Big Guns',
  'Energy Weapons',
  'Unarmed',
  'Melee',
  'Throwing',
  'First Aid',
  'Doctor',
  'Sneak',
  'Lockpick',
  'Steal',
  'Traps',
  'Science',
  'Repair',
  'Pilot',
  'Speech',
  'Barter',
  'Gambling',
  'Outdoorsman'
];

function parseStats(rawPerk) {
  return _.transform(rawPerk, function(result, value, key) {
    if (statKeys.indexOf(key) === -1) {
      return result;
    }
    if (value.trim().length === 0) {
      return result;
    }
    result[key] = value.trim();

    return result;
  });
}

var file = fs.readFileSync('supplements/tabula-Perk_Chart.csv', {encoding: 'utf8'});
var parser = csvParse(file, {columns: columns}, function(error, rawData) {
  var perks = [];
  rawData.forEach(function(rawPerk) {
    var perk = {
      name: rawPerk.name.trim(),
      level: rawPerk.level.trim(),
      ranks: parseInt(rawPerk.ranks),
      requirements: {
        stats: parseStats(rawPerk),
        other: rawPerk.requirementsRaw.trim()
      },
      summary: rawPerk.summary.trim(),
      isOriginal: true
    };
    perks.push(perk);
  });
  fs.writeFile('data/data.json', JSON.stringify({perks: perks}), {encoding: 'utf8'});
});
