'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  this.sourceRoot(path.join(__dirname, '../../templates/common'));
  this.template('_package.json', 'package.json');
  // this.template('_Gruntfile.js', 'Gruntfile.js');
  this.directory('assets');
  this.directory('scss');
};
