'use strict';

module.exports = function(cfg) {
  return {
    styles: {
      app: [
        cfg.appDir + '/assets/main.less'
      ]
    }
  };
};
