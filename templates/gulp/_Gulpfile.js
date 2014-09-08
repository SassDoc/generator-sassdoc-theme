'use strict';

var gulp = require('gulp');<% if (useSass) { %>
var plumber = require('gulp-plumber');
var rubySass = require('gulp-ruby-sass');<% } %>
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var Q = require('q');
var sassdoc = require('sassdoc');

var copy = Q.denodeify(fse.copy);

// Set your Sass project (the one you're generating docs for) path.
// Relative to this Gulpfile.
var projectPath = '../';

// Project path helper.
var project = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(projectPath);
  return path.resolve.apply(path, args);
};

// Theme and project specific paths.
var dirs = {<% if (useSass) { %>
  scss: 'scss',<% } %>
  css: 'assets/css',
  js: 'assets/js',
  tpl: 'views',
  src: project('sass'),
  docs: project('docs')
};


gulp.task('styles', function () {<% if (useSass) { %>
  return gulp.src('scss/main.scss')
    .pipe(plumber())
    .pipe(rubySass({
      style: 'compressed'
    }))<% } else { %>
  return gulp.src('assets/css/main.css')<% } %>
    .pipe(autoprefixer('last 2 version', '> 1%', 'ie 9'))
    .pipe(gulp.dest('assets/css'));
});


gulp.task('compress', function () {
  return gulp.src('assets/js/*.js')
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.extname = '.min.js';
    }))
    .pipe(gulp.dest('assets/js'));
});


gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: dirs.docs
    },
    files: [
      dirs.docs + '/*.html',
      dirs.docs + '/assets/css/**/*.css',
      dirs.docs + '/assets/js/**/*.js'
    ]
  });
});


// A custom task to compile through SassDoc API.
gulp.task('compile', function () {
  var src = dirs.src;
  var dest = dirs.docs;

  var config = {
    verbose: true,
    theme: '.',
    // basePath: '',
    // package: project('package.json'),
    // groups: {
    //   'undefined': 'General'
    // }
  };

  // Enable verbose.
  sassdoc.logger.enabled = config['verbose'];

  return sassdoc.documentize(src, dest, config);
});


// Dump js files from theme into `docs/assets` whenever they get modified.
// Prevent requiring a full `compile`.
gulp.task('dumpJS', function () {
  var src = dirs.js;
  var dest = path.join(dirs.docs, 'assets/js');

  return copy(src, dest)
    .then(function () {
      gutil.log('JS ' + gutil.colors.cyan(src) + ' copied to ' + gutil.colors.cyan(dest) + '.');
    });
});


// Dump CSS files from theme into `docs/assets` whenever they get modified.
// Prevent requiring a full `compile`.
gulp.task('dumpCSS', ['styles'], function () {
  var src = dirs.css;
  var dest = path.join(dirs.docs, 'assets/css');

  return copy(src, dest)
    .then(function () {
      gutil.log('CSS ' + gutil.colors.cyan(src) + ' copied to ' + gutil.colors.cyan(dest) + '.');
    });
});


gulp.task('develop', ['compile', 'styles', 'browser-sync'], function () {<% if (useSass) { %>
  gulp.watch('scss/**/*.scss', ['styles', 'dumpCSS']);<% } else { %>
  gulp.watch('assets/css/**/*.css', ['styles', 'dumpCSS']);<% }%>
  gulp.watch('assets/js/**/*.js', ['dumpJS']);
  gulp.watch('views/**/*<%= tplExtensions %>', ['compile']);
});
