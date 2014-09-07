'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var isset = require('../../utils').isset;


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.slugname = isset(this.options.slugname) ? this.options.slugname : '';
  this.useSass = isset(this.options.useSass) ? this.options.useSass : true;
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.buildViews = function createViewFiles() {
  this.sourceRoot(path.join(__dirname, '../../templates/grunt'));

  this.template('_Gruntfile.js', 'Gruntfile.js');
}

Generator.prototype.install = function install() {
  if (this.options['skip-install']) {
    return;
  }

  var pkgs = {
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

  this.useSass && pkgs.devDependencies.push('grunt-contrib-sass');

  var done = this.async();

  this.npmInstall(pkgs.devDependencies, {
    'save-dev': true
  }, done);
};
