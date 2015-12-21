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
  advancedWatch = require('gulp-watch'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  cache = require('gulp-cached'),
  jshint = require('gulp-jshint'),
  jshintStylish = require('jshint-stylish'),
  jscs = require('gulp-jscs');

var config = require('./config');

function transformPaths(filePath) {
  var extension = path.extname(filePath).replace('.', '').toLowerCase();
  var fileName = path.basename(filePath);
  if (['js', 'css'].indexOf(extension) !== -1) {
    filePath = '/' + extension + '/' + fileName;
  }
  if (extension === 'js') {
    filePath = '<script type="text/javascript" src="' + filePath + '"></script>';
  }
  else if (extension === 'css') {
    filePath = '<link rel="stylesheet" href="' + filePath + '">';
  }

  return filePath;
}

// compile sass and copy to public dir
gulp.task('copyAppStyles', function() {
  return gulp.src(config.assets.styles.app)
    .pipe(gulpif(config.environment === ENV_DEVELOPMENT, sourcemaps.init()))
    .pipe(less())
    .pipe(gulpif(config.environment === ENV_PRODUCTION, minify()))
    .pipe(gulpif(config.environment === ENV_PRODUCTION, concat('app.min.css')))
    .pipe(gulpif(config.environment === ENV_DEVELOPMENT, sourcemaps.write()))
    .pipe(gulp.dest(config.distDir + '/css'))
    .pipe(gulpif(config.environment === ENV_DEVELOPMENT, browserSync.stream()));
});

var jshintedFiles = [
  'gulpfile.js',
  config.siteDir + '/config/**/*.js',
  config.appDir + '/**/*.js'
];
jshintedFiles.concat(config.assets.scripts.app);
// check all js files with jshint
gulp.task('jshint', function() {
  return gulp.src(jshintedFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish));
});

// check all js files with jscs
gulp.task('jscs', function() {
  return gulp.src(jshintedFiles)
    .pipe(jscs());
});

// copy third-party scripts to dist dir
gulp.task('copyThirdPartyScripts', function() {
  return gulp.src(config.assets.scripts.thirdParty)
    .pipe(gulpif(config.environment === ENV_PRODUCTION, concat('third-party.min.js')))
    .pipe(gulpif(config.environment === ENV_PRODUCTION, uglify()))
    .pipe(gulp.dest(config.distDir + '/js'));
});

// copy app scripts to dist dir
gulp.task('copyAppScripts', function() {
  return gulp.src(config.assets.scripts.app)
    .pipe(cache('appScripts'))
    .pipe(gulpif(config.environment === ENV_PRODUCTION, concat('app.min.js')))
    .pipe(gulpif(config.environment === ENV_PRODUCTION, uglify()))
    .pipe(gulp.dest(config.distDir + '/js'));
});

// injects compiled styles and scripts into index.html
// copy index.html to dist dir
gulp.task('inject', [
    'copyThirdPartyScripts',
    'copyAppScripts',
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
        appStylesCompiled,
        config.assets.scripts.thirdParty,
        config.assets.scripts.app
      );
    }
    else if (config.environment === ENV_PRODUCTION) {
      files = [
        config.distDir + '/css/app.min.css',
        config.distDir + '/js/third-party.min.js',
        config.distDir + '/js/app.min.js'
      ];
    }
    var sources = gulp.src(files, {read: false});

    return gulp.src(config.appDir + '/index.html')
      .pipe(inject(sources, {transform: transformPaths}))
      .pipe(gulp.dest(config.distDir));
  }
);

// browser sync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {baseDir: './gh-pages'},
    notify: false,
    open: false
  });
});

// ensure browser reload after injecting js/css
gulp.task('browserReloadAfterInject', ['inject'], browserSync.reload);

// ensure browser reload on app scripts change
gulp.task('browserReloadOnAppScripts', ['copyAppScripts'], browserSync.reload);

gulp.task('watch', function() {
  gulp.watch(config.appDir + '/index.html', ['browserReloadAfterInject']);
  advancedWatch(jshintedFiles, function() {
    gulp.start('jshint');
    gulp.start('jscs');
  });
  advancedWatch(config.appDir + '/assets/**/*.less', function() {
    gulp.start('copyAppStyles');
  });
  advancedWatch(config.appDir + '/**/*.js', function() {
    gulp.start('browserReloadOnAppScripts');
  });
});

gulp.task('serve', [
  'browserSync', // synchronous
  'jshint',
  'jscs',
  'inject',
  'watch'
]);

gulp.task('build', [
  'inject'
]);

gulp.task('default', ['serve']);
