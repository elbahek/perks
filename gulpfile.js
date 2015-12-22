'use strict';

var path = require('path'),
  fs = require('fs'),
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
  jscs = require('gulp-jscs'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  del = require('del');

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

// clean task (run to clean public dirs, build dirs etc)
gulp.task('clean', function() {
  del.sync([
    config.distDir + '/*'
  ]);
});

// copy data into dist dir
gulp.task('copyData', function() {
  return gulp.src(config.dataDir + '/data.json', {base: config.siteDir})
    .pipe(gulp.dest(config.distDir));
});

// copy fonts into dist dir
// css styles are copied in "copyThirdPartyStyles"
gulp.task('copyFonts', function() {
  return gulp.src(config.assets.fonts)
    .pipe(gulp.dest(config.distDir + '/fonts'));
});

// copy views to dist dir
gulp.task('copyAppViews', function() {
  return gulp.src(config.appDir + '/views/**/*.html', {base: config.appDir + '/views'})
    .pipe(cache('appViews'))
    .pipe(gulp.dest(config.distDir + '/views'));
});

// fix incorrect paths in icomoon style.css
gulp.task('fixPathsIcomoon', function(cb) {
  try {
    fs.accessSync(config.publicDir + '/icomoon/icomoon-fixed.css', fs.F_OK | fs.F_OK | fs.W_OK);
    console.log('try');
  }
  catch(e) {
    console.log('catch');
    return gulp.src(config.publicDir + '/icomoon/style.css')
      .pipe(replace("'fonts/icomoon.", "'../fonts/icomoon."))
      .pipe(rename('icomoon-fixed.css'))
      .pipe(gulp.dest(config.publicDir + '/icomoon'));
  }

  cb();
});

// copy third-party styles to dist dir
gulp.task('copyThirdPartyStyles', ['fixPathsIcomoon'], function() {
  return gulp.src(config.assets.styles.thirdParty)
    .pipe(gulpif(config.environment === ENV_PRODUCTION, minify()))
    .pipe(gulpif(config.environment === ENV_PRODUCTION, concat('third-party.min.css')))
    .pipe(gulp.dest(config.distDir + '/css'))
    .pipe(gulpif(config.environment === ENV_DEVELOPMENT, browserSync.stream()));
});

// compile less and copy to dist dir
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
    'copyThirdPartyStyles',
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
        config.assets.styles.thirdParty,
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
    server: {baseDir: config.distDir},
    notify: false,
    open: false
  });
});

// ensure browser reload after injecting js/css
gulp.task('browserReloadAfterInject', ['inject'], browserSync.reload);

// ensure browser reload on app scripts change
gulp.task('browserReloadOnAppScripts', ['copyAppScripts'], browserSync.reload);

// ensure browser reload on views change
gulp.task('browserReloadOnAppViews', ['copyAppViews'], browserSync.reload);

// ensure browser reload on fonts change
gulp.task('browserReloadOnFonts', ['copyFonts'], browserSync.reload);

// ensure browser reload on data change
gulp.task('browserReloadOnData', ['copyData'], browserSync.reload);

gulp.task('watch', function() {
  gulp.watch(config.appDir + '/index.html', ['browserReloadAfterInject']);
  advancedWatch(jshintedFiles, function() {
    gulp.start('jshint');
    gulp.start('jscs');
  });
  gulp.watch(config.assets.styles.thirdParty, ['copyThirdPartyStyles']);
  advancedWatch(config.dataDir + '/**/*.json', function() {
    gulp.start('browserReloadOnData');
  });
  advancedWatch(config.appDir + '/assets/**/*.less', function() {
    gulp.start('copyAppStyles');
  });
  advancedWatch(config.appDir + '/**/*.js', function() {
    gulp.start('browserReloadOnAppScripts');
  });
  advancedWatch(config.appDir + '/views/**/*.html', function() {
    gulp.start('browserReloadOnAppViews');
  });
  advancedWatch(config.assets.fonts, function() {
    gulp.start('browserReloadOnFonts');
  });
});

gulp.task('serve', [
  'browserSync', // synchronous
  'jshint',
  'jscs',
  'copyAppViews',
  'copyData',
  'copyFonts',
  'inject',
  'watch'
]);

gulp.task('build', [
  'clean', // synchronous
  'copyAppViews',
  'copyData',
  'copyFonts',
  'inject'
]);

gulp.task('default', ['serve']);
