'use strict';

module.exports = function(cfg) {
  return {
    styles: {
      thirdParty: [
        cfg.publicDir + '/icomoon/style.css'
      ],
      app: [
        cfg.appDir + '/assets/main.less'
      ]
    },
    scripts: {
      thirdParty: [
        cfg.bowerDir + '/jquery/dist/jquery.js',
        cfg.bowerDir + '/bootstrap/dist/js/bootstrap.js',
        cfg.bowerDir + '/angular/angular.js',
        cfg.bowerDir + '/angular-route/angular-route.js'
      ],
      app: [
        cfg.appDir + '/perks.module.js',
        cfg.appDir + '/directives/main-menu.js',
        cfg.appDir + '/controllers/main.js'
      ]
    },
    fonts: [
      cfg.publicDir + '/icomoon/fonts/*'
    ]
  };
};
