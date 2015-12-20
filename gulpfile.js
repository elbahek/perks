'use strict';

var gulp = require('gulp');

gulp.task('inject', function() {
  return gulp.src('app/index.html')
    .pipe(gulp.dest('gh-pages'));
});

gulp.task('serve', [
  'inject'
]);

gulp.task('build', [
  'inject'
]);

gulp.task('default', ['serve']);
