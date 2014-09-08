'use strict';

var util = require('util');
var TaskRunner = require('../../lib/taskrunner-base');


var Generator = module.exports = function Generator(args, options) {
  TaskRunner.apply(this, arguments);
};

util.inherits(Generator, TaskRunner);

Generator.prototype.gulp = function gulp() {
  this.taskRunner = 'gulp';
  this.pkgs = {
    dependencies: [],
    devDependencies: [
      'fs-extra',
      'q',
      'sassdoc',
      'gulp',
      'gulp-plumber',
      'gulp-autoprefixer',
      'gulp-uglify',
      'gulp-rename',
      'gulp-util',
      'browser-sync'
    ]
  };
  this.useSass && this.pkgs.devDependencies.push('gulp-ruby-sass');

  this.buildTasksFile();
  this.installDependencies();
}
