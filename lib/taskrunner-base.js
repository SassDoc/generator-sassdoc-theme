'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var utils = require('../utils');
var isset = utils.isset;
var capitalize = utils.capitalize;


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.slugname = isset(this.options.slugname) ? this.options.slugname : '';
  this.themeEngine = isset(this.options.themeEngine) ? this.options.themeEngine : 'swig';
  this.useSass = isset(this.options.useSass) ? this.options.useSass : true;

  this.tplExtensions = {
    'swig': '.swig',
    'jade': '.jade',
    'nunjucks': '.nunjucks',
    'handlebars': '.+{handlebars|hbs}',
    'mustache': '.+{mustache|mst}'
  }[this.themeEngine];
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.buildTasksFile = function buildTasksFile() {
  var file = capitalize(this.taskRunner) + 'file.js';

  this.sourceRoot(path.join(__dirname, '../templates', this.taskRunner));
  this.template('_' + file, file);
}

Generator.prototype.installDependencies = function installDependencies() {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();

  this.log(chalk.yellow(
    '>> Installing npm dependencies for task runner: "' +
    capitalize(this.taskRunner) + '".' + '\n' +
    '>> Hold on tight.'
  ));

  this.npmInstall(this.pkgs.devDependencies, {
    'save-dev': true
  }, done);
};
