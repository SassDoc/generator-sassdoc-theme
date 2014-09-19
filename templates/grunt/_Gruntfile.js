'use strict';

var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var chalk = require('chalk');
var Q = require('q');
var sassdoc = require('sassdoc');

var copy = Q.denodeify(fse.copy);

// Set your Sass project (the one you're generating docs for) path.
// Relative to this Gruntfile.
var projectPath = '../';

// Project path helper.
var project = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(projectPath);
  return path.resolve.apply(path, args);
};

// Project specific paths.
var dirs = {<% if (useSass) { %>
  scss: 'scss',<% } %>
  css: 'assets/css',
  img: 'assets/img',
  svg: 'assets/svg',
  js: 'assets/js',
  tpl: 'views',
  src: project('sass'),
  docs: project('docs')
};

// Tasks configs.
var config = {

  dirs: dirs,<% if (useSass) { %>

  sass: {
    options: {
      style: 'compressed'
    },
    develop: {
      files: [{
        expand: true,
        cwd: '<%%= dirs.scss %>',
        src: ['*.scss'],
        dest: '<%%= dirs.css %>',
        ext: '.css'
      }]
    }
  },<% } %>

  watch: {<% if (useSass) { %>
    scss: {
      files: ['<%%= dirs.scss %>/**/*.scss'],
      tasks: ['sass:develop', 'autoprefixer:develop', 'dumpCSS']
    },<% } else { %>
    css: {
      files: ['<%%= dirs.css %>/**/*.css'],
      tasks: ['autoprefixer:develop', 'dumpCSS']
    },<% } %>
    js: {
      files: ['<%%= dirs.js %>/**/*.js'],
      tasks: ['dumpJS']
    },
    tpl: {
      files: ['<%%= dirs.tpl %>/**/*<%= tplExtensions %>'],
      tasks: ['compile:develop']
    }
  },

  browserSync: {
    options: {
      watchTask: true,
      server: {
        baseDir: '<%%= dirs.docs %>'
      }
    },
    develop: {
      bsFiles: {
        src: [
          '<%%= dirs.docs %>/*.html',
          '<%%= dirs.docs %>/**/*.css',
          '<%%= dirs.docs %>/**/*.js'
        ]
      }
    }
  },

  autoprefixer: {
    options: {
      browsers: ['last 2 version', '> 1%', 'ie 9']
    },
    develop: {
      files: [{
        expand: true,
        cwd: '<%%= dirs.css %>',
        src: '{,*/}*.css',
        dest: '<%%= dirs.css %>'
      }]
    }
  },<% if (!useSass) { %>

  csso: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= dirs.css %>',
        src: ['*.css', '!*.min.css'],
        dest: '<%%= dirs.css %>',
        ext: '.min.css'
      }]
    }
  },<% } %>

  uglify: {
    options: {},
    develop: {
      files: {
        '<%%= dirs.js %>/main.min.js': ['<%%= dirs.js %>/main.js']
      }
    }
  },

  svgmin: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= dirs.svg %>',
        src: '{,*/}*.svg',
        dest: '<%%= dirs.svg %>'
      }]
    }
  },

  imagemin: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%%= dirs.img %>',
        src: '{,*/}*.{gif,jpeg,jpg,png}',
        dest: '<%%= dirs.img %>'
      }]
    }
  },

  // SassDoc compilation (documentize).
  // See: https://github.com/SassDoc/sassdoc/wiki/Customising-the-View
  compile: {
    options: {
      verbose: true,
      theme: '.',
      // basePath: '',
      // package: project('package.json'),
      // groups: {
      //   'undefined': 'General'
      // }
    },
    develop: {
      src: '<%%= dirs.src %>',
      dest: '<%%= dirs.docs %>',
    }
  }

};


module.exports = function (grunt) {

  // Load all grunt tasks matching the `grunt-*` pattern.
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take.
  require('time-grunt')(grunt);


  grunt.initConfig(config);


  // A custom task to compile through SassDoc API.
  grunt.registerMultiTask('compile', 'Generates documentation', function () {
    var done = this.async();
    var config = this.options({});

    // Enable verbose.
    sassdoc.logger.enabled = config['verbose'];

    var src = this.filesSrc[0];
    var dest = this.files[0].dest;

    sassdoc
      .documentize(src, dest, config)
      .then(done);
  });


  // Dump js files from theme into `docs/assets` whenever they get modified.
  // Prevent requiring a full `compile`.
  grunt.registerTask('dumpJS', 'Dump JS to docs/assets', function () {
    var done = this.async();
    var src = dirs.js;
    var dest = path.join(dirs.docs, 'assets/js');

    copy(src, dest)
      .then(function () {
        grunt.log.writeln('JS ' + chalk.cyan(src) + ' copied to ' + chalk.cyan(dest) + '.');
        done();
      });
  });


  // Dump CSS files from theme into `docs/assets` whenever they get modified.
  // Prevent requiring a full `compile`.
  grunt.registerTask('dumpCSS', 'Dump CSS to docs/assets', function () {
    var done = this.async();
    var src = dirs.css;
    var dest = path.join(dirs.docs, 'assets/css');

    copy(src, dest)
      .then(function () {
        grunt.log.writeln('CSS ' + chalk.cyan(src) + ' copied to ' + chalk.cyan(dest) + '.');
        done();
      });
  });


  // Development task.
  // While working on a theme.
  grunt.registerTask('develop', 'Development task', function () {
    var tasks = ['browserSync:develop', 'watch'];
    var docs = fs.existsSync(dirs.docs);

    if (!docs) {
      grunt.log.writeln('Running initial compile: ' + chalk.cyan(dirs.docs) + '.');
      tasks.unshift('compile:develop');
    }

    grunt.task.run(tasks);
  });


  // Pre release/deploy optimisation tasks.
  grunt.registerTask('dist', [<% if (!useSass) { %>
    'newer:csso:dist',<% } %>
    'newer:svgmin:dist',
    'newer:imagemin:dist'
  ]);

};
