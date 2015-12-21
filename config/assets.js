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
        cfg.bowerDir + '/angular/angular.js'
      ],
      app: [
        cfg.appDir + '/perks.module.js'
      ]
    }
  };
};
