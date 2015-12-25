'use strict';

var path = require('path');
var siteDir = path.normalize(__dirname +'/..');

require('./globals.js');
var environment = ENV_PRODUCTION;
try {
  environment = require(siteDir + '/.environment.json');
}
catch (e) {
  console.log('No /.environment.json file, falling back to "'+ ENV_PRODUCTION +'" environment');
}
if ([ENV_DEVELOPMENT, ENV_PRODUCTION].indexOf(environment) === -1) {
  console.log('Invalid or null environment supplied');
  environment = ENV_PRODUCTION;
}

var distDir = environment === ENV_DEVELOPMENT ? ENV_DIST_DIR_DEVELOPMENT : ENV_DIST_DIR_PRODUCTION
  ,baseUrl = environment === ENV_PRODUCTION ? 'https://elbahek.github.io/perks/' : '/';
var config = {
  environment: environment,
  baseUrl: baseUrl,
  siteDir: siteDir,
  bowerDir: siteDir + '/bower_components',
  appDir: siteDir + '/app',
  distDir: siteDir + '/' + distDir,
  publicDir: siteDir + '/public',
  dataDir: siteDir + '/data'
};

var assets = require('./assets')(config);
config.assets = assets;

module.exports = config;
