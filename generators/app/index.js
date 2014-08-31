'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('themeName', { type: String, required: false });
  // this.themeName = this.themeName || path.basename(process.cwd());

  // this.option('themePath', {
  //   desc: 'Path of theme directory',
  //   type: 'String',
  //   defaults: 'theme'
  // });
  //
  // this.env.options.themePath = this.options.themePath;
  // this.config.set('themePath', this.env.options.themePath);

  this.option('init', {
    alias: 'i',
    desc: 'Force to prompt question and re-initialize of .yo-rc.json',
    type: String,
    defaults: false
  });
  this.init = this.options['init'] || this.options['i'] || false;

  this.option('themeEngine', {
    desc: 'Theme template engine.',
    type: 'String'
  });

  this.config.defaults({
    themeName: this.themeName,
    themeDesc: 'A fancy new SassDoc theme.',
    author: {
      name: this.user.git.name() || process.env.user || process.env.username
    },
    themeEngine: this.options.themeEngine
  });

  this.pkg = require(path.join(__dirname, '../../package.json'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  if (!this.options['skip-welcome-message']) {
    this.log(yosay(
      'SassDoc theme generator'
    ));
    this.log(chalk.magenta(
      'Scafold out a new theme with your prefered template engine.' + '\n'
    ));
  }
};

Generator.prototype.askFor = function askFor() {
  var done = this.async();

  var force = (!this.config.existed || this.init) ? true : false;

  var questions = [];

  (!this.config.get('themeName') || force) && questions.push({
    name: 'themeName',
    message: 'Theme name',
    default: this.themeName || path.basename(process.cwd())
  });

  (!this.config.get('themeDesc') || force) && questions.push({
    name: 'themeDesc',
    message: 'Theme description',
    default: this.themeDesc || this.config.get('themeDesc')
  });

  questions.push({
    name: 'version',
    message: 'Theme package version',
    default: '0.1.0'
  });

  (!this.config.get('themeEngine') || force) && questions.push({
    type: 'list',
    name: 'themeEngine',
    message: 'Which theme engine would you like to use ?',
    choices: [{
      name: 'Mustache',
      value: 'mustache',
      checked: false
    }, {
      name: 'Swig',
      value: 'swig',
      checked: false
    },{
      name: 'Jade',
      value: 'jade',
      checked: false
    }, {
      name: 'Nunjucks',
      value: 'nunjucks',
      checked: false
    }, {
      name: 'Handelbars',
      value: 'handelbars',
      checked: false
    }]
  });

  questions.push({
    type: 'confirm',
    name: 'useFilter',
    message: 'Include and use sassdoc-filter',
    default: true
  });

  questions.push({
    type: 'confirm',
    name: 'useIndexer',
    message: 'Include and use sassdoc-indexer',
    default: true
  });

  this.prompt(questions, function (answers) {
    var enabled = function (engine) {
      return this.themeEngine === engine;
    }.bind(this);

    this.slugname      = this._.slugify(answers.themeName || this.config.get('themeName'));
    this.description   = answers.themeDesc || this.config.get('themeEngine');
    this.version       = answers.version;
    this.themeEngine   = answers.themeEngine || this.config.get('themeEngine');
    this.useFilter     = answers.useFilter;
    this.useIndexer    = answers.useIndexer;

    this.useMustache   = enabled('mustache');
    this.useSwig       = enabled('swig');
    this.useJade       = enabled('jade');
    this.useNunjucks   = enabled('nunjucks');
    this.useHandelbars = enabled('handelbars');

    //save config to .yo-rc.json
    this.config.set(answers);

    done();
  }.bind(this));
};

Generator.prototype.buildPackage = function packageFiles() {
  this.sourceRoot(path.join(__dirname, '../../templates/common'));
  this.template('_package.json', 'package.json');
  this.directory('assets');
  this.directory('scss');
};

Generator.prototype.buildViews = function buildViews(done) {
  var generator = 'sassdoc-theme:' + (this.themeEngine).toLowerCase();
  var options = {
    'skip-message': this.options['skip-install-message'],
    'skip-install': this.options['skip-install']
  };

  this.invoke(generator, { options: options }, function () {

  }.bind(this));
};

Generator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  this.on('end', function() {
    var done = this.async();

    this.installDependencies({
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install'],
      callback: done
    });
  });
};
