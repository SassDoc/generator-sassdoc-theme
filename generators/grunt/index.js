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
      'grunt-contrib-uglify',
      'grunt-contrib-watch',
      'load-grunt-tasks',
      'time-grunt'
    ],
    peerDependencies: [
      'grunt'
    ]
  };
  this.useSass && this.pkgs.devDependencies.push('grunt-contrib-sass');

  this.buildTasksFile();
  this.installDependencies();
};
