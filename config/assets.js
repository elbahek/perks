'use strict';

module.exports = function(cfg) {
  return {
    styles: {
      app: [
        cfg.appDir + '/assets/main.less'
      ]
    },
    scripts: {
      thirdParty: [
        cfg.bowerDir + '/angular/angular.js',
        cfg.bowerDir + '/angular-route/angular-route.js'
      ],
      app: [
        cfg.appDir + '/perks.module.js',
        cfg.appDir + '/controllers/main.js'
      ]
    },
    fonts: [
      cfg.publicDir + '/icomoon/fonts/*'
    ]
  };
};
