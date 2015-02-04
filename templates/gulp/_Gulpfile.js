'use strict';

var gulp = require('gulp');<% if (useSass) { %>
var sass = require('gulp-sass');<% } else { %>
var csso = require('gulp-csso');<% } %>
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var cache = require('gulp-cached');
// var imagemin = require('gulp-imagemin');
// var pngcrush = require('imagemin-pngcrush');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var path = require('path');
var fs = require('fs-extra');
var Promise = require('bluebird');
var copy = Promise.promisify(fs.copy);

var sassdoc = require('sassdoc');


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
  img: 'assets/img',
  svg: 'assets/svg',
  js: 'assets/js',
  tpl: 'views',
  src: project('sass'),
  docs: project('sassdoc')
};


gulp.task('styles', function () {
  var browsers = ['last 2 version', '> 1%', 'ie 9'];
  var processors = [
    require('autoprefixer-core')({ browsers: browsers }),
  ];<% if (useSass) { %>

  return gulp.src('./scss/**/*.scss')
    .pipe(sass())<% } else { %>
  return gulp.src('assets/css/main.css')<% } %>
    .pipe(postcss(processors))
    .pipe(gulp.dest('assets/css'));
});


gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: dirs.docs
    },
    files: [
      path.join(dirs.docs, '/*.html'),
      path.join(dirs.docs, '/assets/css/**/*.css'),
      path.join(dirs.docs, '/assets/js/**/*.js')
    ]
  });
});


// SassDoc compilation.
// See: http://sassdoc.com/customising-the-view/
gulp.task('compile', function () {
  var config = {
    verbose: true,
    dest: dirs.docs,
    theme: './',
    // Disable cache to enable live-reloading.
    // Usefull for some template engines (e.g. Swig).
    cache: false,
  };

  var sdStream = sassdoc(config);

  gulp.src(path.join(dirs.src, '**/*.scss'))
    .pipe(sdStream);

  // Await for the full documentation process.
  return sdStream.promise;
});


// Dump JS files from theme into `docs/assets` whenever they get modified.
// Prevent requiring a full `compile`.
gulp.task('dumpJS', function () {
  var src = dirs.js;
  var dest = path.join(dirs.docs, 'assets/js');

  return copy(src, dest).then(function () {
    gutil.log(src + ' copied to ' + path.relative(__dirname, dest));
  });
});


// Dump CSS files from theme into `docs/assets` whenever they get modified.
// Prevent requiring a full `compile`.
gulp.task('dumpCSS', ['styles'], function () {
  var src = dirs.css;
  var dest = path.join(dirs.docs, 'assets/css');

  return copy(src, dest).then(function () {
    gutil.log(src + ' copied to ' + path.relative(__dirname, dest));
  });
});


// Development task.
// While working on a theme.
gulp.task('develop', ['compile', 'styles', 'browser-sync'], function () {<% if (useSass) { %>
  gulp.watch('scss/**/*.scss', ['styles', 'dumpCSS']);<% } else { %>
  gulp.watch('assets/css/**/*.css', ['styles', 'dumpCSS']);<% }%>
  gulp.watch('assets/js/**/*.js', ['dumpJS']);
  gulp.watch('views/**/*<%= tplExtensions %>', ['compile']);
});<% if (!useSass) { %>


gulp.task('jsmin', function () {
  return gulp.src('assets/js/*.js')
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.extname = '.min.js';
    }))
    .pipe(gulp.dest('assets/js'));
});


gulp.task('cssmin', function () {
  return gulp.src(['assets/css/*.css', '!assets/css/*.min.css'])
    .pipe(csso())
    .pipe(gulp.dest('assets/css'));
});<% } %>


gulp.task('svgmin', function () {
  return gulp.src('assets/svg/*.svg')
    .pipe(cache(
      imagemin({
        svgoPlugins: [{ removeViewBox: false }]
      })
    ))
    .pipe(gulp.dest('assets/svg'));
});


gulp.task('imagemin', function () {
  return gulp.src('assets/img/{,*/}*.{gif,jpeg,jpg,png}')
    .pipe(cache(
      imagemin({
        progressive: true,
        use: [pngcrush()]
      })
    ))
    .pipe(gulp.dest('assets/img'));
});


// Pre release/deploy optimisation tasks.
gulp.task('dist', [
  'jsmin',<% if (!useSass) { %>
  'cssmin',<% } %>
  'svgmin',
  'imagemin',
]);
