'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var isset = require('../../utils').isset;


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.useExtras = isset(this.options.useExtras) ? this.options.useExtras : true;
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.buildViews = function createViewFiles() {
  this.sourceRoot(path.join(__dirname, '../../templates/jade'));

  var index = 'index.jade';

  if (!this.useExtras) {
    index = 'index_bare.jade';
  }

  this.mkdir('views');
  this.copy(path.join('views', index), 'views/index.jade');
  this.template('_index.js', 'index.js');
};

Generator.prototype.install = function install() {
  if (this.options['skip-install']) {
    return;
  }

  var pkgs = {
    dependencies: [
      'jade'
    ],
    devDependencies: []
  };

  var done = this.async();

  this.npmInstall(pkgs.dependencies, {
    save: true
  }, done);
};
