'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var isset = require('../../utils').isset;


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.useFilter = isset(this.options.useFilter) ? this.options.useFilter : true;
  this.useIndexer = isset(this.options.useIndexer) ? this.options.useFilter : true;
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.buildViews = function createViewFiles() {
  this.sourceRoot(path.join(__dirname, '../../templates/mustache'));

  var index = 'index.mustache';
  if (!this.useFilter && !this.useIndexer) {
    index = 'index_bare.mustache';
  }
  if (this.useFilter && !this.useIndexer) {
    index = 'index_filter.mustache';
  }
  if (!this.useFilter && this.useIndexer) {
    index = 'index_indexer.mustache';
  }

  this.mkdir('views');
  this.copy(path.join('views', index), 'views/index.mustache');
  this.template('_index.js', 'index.js');
}

Generator.prototype.install = function install() {
  if (this.options['skip-install']) {
    return;
  }

  var pkgs = {
    dependencies: [
      'themeleon-mustache'
    ],
    devDependencies: []
  };

  var done = this.async();

  this.npmInstall(pkgs.dependencies, {
    save: true
  }, done);
};
