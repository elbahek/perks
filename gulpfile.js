'use strict';

var path = require('path'),
  _ = require('lodash'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  gulpif = require('gulp-if'),
  inject = require('gulp-inject'),
  minify = require('gulp-minify-css'),
  less = require('gulp-less'),
  sourcemaps = require('gulp-sourcemaps'),
  advancedWatch = require('gulp-watch');

var config = require('./config');

function transformPaths(filePath) {
  var extension = path.extname(filePath).replace('.', '').toLowerCase();
  var fileName = path.basename(filePath);
  var localPathPart = config.environment === ENV_DEVELOPMENT ? '.' : '';
  if (['js', 'css'].indexOf(extension) !== -1) {
    filePath = localPathPart + '/' + extension + '/' + fileName;
  }
  if (extension === 'js') {
    filePath = '<script type="text/javascript" src="' + filePath + '"></script>';
  }
  else if (extension === 'css') {
    filePath = '<link rel="stylesheet" href="' + filePath + '">';
  }

  return filePath;
}

gulp.task('copyAppStyles', function() {
  return gulp.src(config.assets.styles.app)
    .pipe(gulpif(config.environment === ENV_DEVELOPMENT, sourcemaps.init()))
    .pipe(less())
    .pipe(gulpif(config.environment === ENV_PRODUCTION, minify()))
    .pipe(gulpif(config.environment === ENV_PRODUCTION, concat('app.min.css')))
    .pipe(gulpif(config.environment === ENV_DEVELOPMENT, sourcemaps.write()))
    .pipe(gulp.dest(config.distDir + '/css'));
    //.pipe(gulpif(config.environment === ENV_DEVELOPMENT, browserSync.stream()));
});

gulp.task('inject', [
    'copyAppStyles'
  ],
  function() {
    var files = null;
    if (config.environment === ENV_DEVELOPMENT) {
      var appStylesCompiled = [];
      _.forOwn(config.assets.styles.app, function(asset) {
        var newFile = path.basename(asset).replace('.less', '.css');
        appStylesCompiled.push(config.distDir + '/css/' + newFile);
      });
      files = [].concat(
        appStylesCompiled
      );
    }
    else if (config.environment === ENV_PRODUCTION) {
      files = [
        config.distDir + '/css/app.min.css'
      ];
    }
    var sources = gulp.src(files, {read: false});

    return gulp.src(config.appDir + '/index.html')
      .pipe(inject(sources, {transform: transformPaths}))
      .pipe(gulp.dest(config.distDir));
  }
);

gulp.task('serve', [
  'inject'
]);

gulp.task('build', [
  'inject'
]);

gulp.task('default', ['serve']);
