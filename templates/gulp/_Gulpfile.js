'use strict';

var gulp = require('gulp');<% if (useSass) { %>
var plumber = require('gulp-plumber');
var rubySass = require('gulp-ruby-sass');<% } %>
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Project specific paths.
var dirs = {
  scss: 'scss',
  css: 'assets/css',
  js: 'assets/js',
  tpl: 'views',
  docs: 'docs'
};

gulp.task('styles', function () {<% if (useSass) { %>
  return gulp.src('scss/main.scss')
    .pipe(plumber())
    .pipe(rubySass({
      style: 'compressed'
    }))<% } else { %>
  return gulp.src('assets/css/main.css')<% } %>
    .pipe(autoprefixer('last 2 version', '> 1%', 'ie 9'))
    .pipe(gulp.dest('assets/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('compress', function () {
  return gulp.src('assets/js/*.js')
    .pipe(uglify())
    .pipe(rename('assets/js/*.min.js')) // untested
    .pipe(gulp.dest('assets/js'));
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('develop', ['styles', 'browser-sync'], function () {<% if (useSass) { %>
  gulp.watch('scss/*.scss', ['styles']);<% } else { %>
  gulp.watch('assets/css/*.css', ['styles']);<% }%>
});
