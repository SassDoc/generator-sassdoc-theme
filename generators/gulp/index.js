'use strict';

var util = require('util');
var TaskRunner = require('../../lib/taskrunner-base');


var Generator = module.exports = function Generator() {
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
      'gulp-cached',
      'gulp-imagemin',
      'imagemin-pngcrush',
      'gulp-rename',
      'gulp-util',
      'browser-sync'
    ]
  };

  if (this.useSass) {
    this.pkgs.devDependencies.push('gulp-ruby-sass');
  }
  else {
    this.pkgs.devDependencies.push('gulp-csso');
  }

  this.buildTasksFile();
  this.installDependencies();
};
