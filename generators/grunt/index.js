'use strict';

var util = require('util');
var TaskRunner = require('../../lib/taskrunner-base');


var Generator = module.exports = function Generator() {
  TaskRunner.apply(this, arguments);
};

util.inherits(Generator, TaskRunner);

Generator.prototype.grunt = function grunt() {
  this.taskRunner = 'grunt';
  this.pkgs = {
    dependencies: [],
    devDependencies: [
      'chalk',
      'fs-extra',
      'q',
      'sassdoc',
      'grunt-autoprefixer',
      'grunt-browser-sync',
      'grunt-contrib-watch',
      'grunt-contrib-uglify',
      'grunt-newer',
      'grunt-svgmin',
      'grunt-contrib-imagemin',
      'load-grunt-tasks',
      'time-grunt'
    ],
    peerDependencies: [
      'grunt'
    ]
  };

  this.pkgs.devDependencies.push(
    this.useSass ? 'grunt-contrib-sass' : 'grunt-csso'
  );

  this.buildTasksFile();
  this.installDependencies();
};
