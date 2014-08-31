'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createViewFiles = function createViewFiles() {
  this.sourceRoot(path.join(__dirname, '../../templates/jade'));
  this.mkdir('views');
  this.copy('views/index.html.jade');
  this.copy('_index.js', 'index.js');
}

Generator.prototype.install = function install() {
  if (this.options['skip-install']) {
    return;
  }

  var pkgs = {
    dependencies: [
      'themeleon-jade'
    ],
    devDependencies: []
  };

  var done = this.async();

  this.npmInstall(pkgs.dependencies, {
    save: true
  }, done);
};
