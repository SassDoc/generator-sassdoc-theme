'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var isset = require('../../utils').isset;

var Generator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('themeName', {
    desc: 'Theme package name.',
    type: String,
    required: false
  });

  // this.option('themePath', {
  //   desc: 'Path of theme directory',
  //   type: 'String',
  //   defaults: 'theme'
  // });
  //
  // this.env.options.themePath = this.options.themePath;
  // this.config.set('themePath', this.env.options.themePath);

  this.option('init', {
    desc: 'Force to prompt questions and re-initialize of .yo-rc.json',
    type: String,
    defaults: false
  });

  this.option('themeEngine', {
    desc: 'Theme template engine.',
    type: 'String'
  });

  // Validate the themeEngine option,
  // fallback to prompts list.
  this.options.themeEngine = (function () {
    var engine = this.options.themeEngine;
    if (!isset(engine)) {
      return;
    }

    this.config.delete('themeEngine');

    var allowed = this._.contains([
      'jade',
      'swig',
      'nunjucks',
      'handlebars',
      'handelbars'],
      engine.toLowerCase()
    );

    if (!allowed) {
      this.log(chalk.red(
        '>> Unsuported theme engine: "' + engine + '".' + '\n' +
        '>> You will be given the choice below.'
      ));
    }

    return allowed ? engine : undefined;
  }.bind(this)());

  // Save some defaults to .yo-rc.json base on args/options results.
  this.config.defaults({
    themeName: this.themeName,
    author: {
      name: this.user.git.name() || process.env.user || process.env.username
    },
    themeEngine: this.options.themeEngine
  });

  this.pkg = require('../../package.json');
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

  var shouldPrompt = function (question) {
    var force = (this.config.existed && this.options.init) ? true : false;
    return (!isset(this.config.get(question)) || force);
  }.bind(this);

  var questions = [];

  // Ask for the new theme name.
  shouldPrompt('themeName') && questions.push({
    name: 'themeName',
    message: 'Theme package name',
    default: this.config.get('themeName') || path.basename(process.cwd())
  });

  // Ask for the new theme description.
  shouldPrompt('themeDesc') && questions.push({
    name: 'themeDesc',
    message: 'Theme description',
    default: this.config.get('themeDesc') || 'A fancy new SassDoc theme.'
  });

  // Ask for a specific theme package version.
  questions.push({
    name: 'version',
    message: 'Theme package version',
    default: '0.1.0'
  });

  // Ask for which theme engine to use.
  shouldPrompt('themeEngine') && questions.push({
    type: 'list',
    name: 'themeEngine',
    message: 'Which theme engine would you like to use ?',
    choices: [{
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
      name: 'handlebars',
      value: 'handlebars',
      checked: false
    }]
  });

  // Ask for sassdoc-filter usage.
  shouldPrompt('useFilter') && questions.push({
    type: 'confirm',
    name: 'useFilter',
    message: 'Include and use sassdoc-filter',
    default: true
  });

  // Ask for sassdoc-indexer usage.
  shouldPrompt('useIndexer') && questions.push({
    type: 'confirm',
    name: 'useIndexer',
    message: 'Include and use sassdoc-indexer',
    default: true
  });

  // Ask for Sass usage.
  shouldPrompt('useSass') && questions.push({
    type: 'confirm',
    name: 'useSass',
    message: 'Use Sass for your theme stylesheets',
    default: true
  }, {
    when: function (answers) {
      return isset(answers) && isset(answers.useSass) && !answers.useSass;
    },
    type: 'confirm',
    name: 'useSass',
    message: chalk.red('Wait a second, u no want use Sass !?'),
    default: true
  });

  this.prompt(questions, function (answers) {
    var enabled = function (engine) {
      return this.themeEngine === engine;
    }.bind(this);

    this.themeName     = this.themeName || answers.themeName || this.config.get('themeName');
    this.slugname      = this._.slugify(this.themeName);
    this.description   = answers.themeDesc || this.config.get('themeDesc');
    this.version       = answers.version;
    this.themeEngine   = answers.themeEngine || this.config.get('themeEngine');
    this.useFilter     = answers.useFilter || this.config.get('useFilter');
    this.useIndexer    = answers.useIndexer || this.config.get('useIndexer');
    this.useSass       = answers.useSass || this.config.get('useSass');

    this.useSwig       = enabled('swig');
    this.useJade       = enabled('jade');
    this.useNunjucks   = enabled('nunjucks');
    this.usehandlebars = enabled('handlebars');

    // Save config to .yo-rc.json
    this.config.set('themeName', this.themeName);
    this.config.set(answers);

    done();
  }.bind(this));
};

Generator.prototype.buildPackage = function packageFiles() {
  this.sourceRoot(path.join(__dirname, '../../templates/common'));

  // Dotfiles.
  this.template('_gitignore', '.gitignore');
  this.template('_sassdocrc', '.sassdocrc');

  // Package.
  this.template('_package.json', 'package.json');
  this.template('_README.md', 'README.md');

  // Assets.
  this.directory('assets');
  if (this.useSass) {
    this.directory('scss');
  }
};

Generator.prototype.buildViews = function buildViews(done) {
  var generator = 'sassdoc-theme:' + (this.themeEngine).toLowerCase();
  var options = {
    'skip-message': this.options['skip-install-message'],
    'skip-install': this.options['skip-install'],
    useFilter: this.useFilter,
    useIndexer: this.useIndexer
  };

  // Call specified theme engine sub-generator.
  this.composeWith(generator, { options: options });
};

Generator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  this.on('end', function () {
    var done = this.async();

    this.installDependencies({
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install'],
      callback: done
    });
  });
};
