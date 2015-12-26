'use strict';

module.exports = function(cfg) {
  return {
    styles: {
      thirdParty: [
        cfg.publicDir + '/icomoon/icomoon-fixed.css'
      ],
      app: [
        cfg.appDir + '/assets/main.less'
      ]
    },
    scripts: {
      thirdParty: [
        cfg.bowerDir + '/lodash/lodash.js',
        cfg.bowerDir + '/jquery/dist/jquery.js',
        cfg.bowerDir + '/bootstrap/dist/js/bootstrap.js',
        cfg.bowerDir + '/angular/angular.js',
        cfg.bowerDir + '/angular-route/angular-route.js',
        cfg.bowerDir + '/angular-filter/dist/angular-filter.js',
        cfg.bowerDir + '/fsm-sticky-header/src/fsm-sticky-header.js'
      ],
      app: [
        cfg.appDir + '/perks.module.js',
        cfg.appDir + '/services/data.js',
        cfg.appDir + '/directives/main-menu.js',
        cfg.appDir + '/controllers/main.js'
      ]
    },
    fonts: [
      cfg.publicDir + '/icomoon/fonts/*'
    ]
  };
};
