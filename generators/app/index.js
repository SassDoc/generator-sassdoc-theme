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

  // this.option('theme-path', {
  //   desc: 'Path of theme directory',
  //   type: 'String',
  //   defaults: 'theme'
  // });

  this.option('init', {
    desc: 'Force to prompt questions and re-initialize of .yo-rc.json',
    type: String,
    defaults: false
  });

  this.option('theme-engine', {
    desc: 'Theme template engine.',
    type: 'String'
  });

  // Validate the theme-engine option,
  // fallback to prompts list.
  this.themeEngine = (function (themeEngine) {
    if (!isset(themeEngine)) {
      return;
    }

    this.config.delete('themeEngine');

    var allowed = this._.contains([
      'jade',
      'swig',
      'nunjucks',
      'handlebars',
      'handelbars'
      ], themeEngine.toLowerCase()
    );

    if (!allowed) {
      this.log(chalk.red(
        '>> Unsuported theme engine: "' + themeEngine + '".' + '\n' +
        '>> You will be given the choice below.'
      ));
    }

    return allowed ? themeEngine : undefined;
  }.bind(this)(this.options['theme-engine']));

  // Save some defaults to .yo-rc.json base on args/options results.
  this.config.defaults({
    themeName: this.themeName,
    themeEngine: this.themeEngine,
    author: {
      name: this.user.git.name() || process.env.user || process.env.username
    }
  });

  // this.pkg = require('../../package.json');
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
  if (this.options['skip-welcome-message']) {
    return;
  }

  this.log(yosay(
    'SassDoc theme generator'
  ));
  this.log(chalk.magenta(
    'Scafold out a new theme with your prefered template engine.' + '\n'
  ));
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
    message: 'Which theme engine would you like to use',
    choices: [{
      name: 'Swig',
      value: 'swig'
    },{
      name: 'Jade',
      value: 'jade'
    }, {
      name: 'Nunjucks',
      value: 'nunjucks'
    }, {
      name: 'Handlebars',
      value: 'handlebars'
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

  // Ask for task runner/build tool usage.
  shouldPrompt('useTaskRunner') && questions.push({
    type: 'confirm',
    name: 'useTaskRunner',
    message: 'Use a task runner or build tool [Grunt|Gulp] for managing your theme',
    default: true
  }, {
    when: function (answers) {
      return isset(answers) && isset(answers.useTaskRunner) && answers.useTaskRunner;
    },
    type: 'list',
    name: 'useTaskRunner',
    message: 'Which one would you like to use',
    choices: [{
      name: 'Grunt',
      value: 'grunt',
      checked: true
    }, {
      name: 'Gulp',
      value: 'gulp',
      checked: false
    }]
  });

  this.prompt(questions, function (answers) {
    var isEnabled = function (engine) {
      return this.themeEngine === engine;
    }.bind(this);

    var isAnswered = function (question) {
      return isset(answers[question]) ? answers[question] : this.config.get(question);
    }.bind(this);

    this.themeName = this.themeName || answers.themeName || this.config.get('themeName');
    this.slugname = this._.slugify(this.themeName);
    this.description = answers.themeDesc || this.config.get('themeDesc');
    this.version = answers.version;
    this.themeEngine = answers.themeEngine || this.config.get('themeEngine');
    this.useFilter = isAnswered('useFilter');
    this.useIndexer = isAnswered('useIndexer');
    this.useSass = isAnswered('useSass')

    this.useSwig = isEnabled('swig');
    this.useJade = isEnabled('jade');
    this.useNunjucks = isEnabled('nunjucks');
    this.usehandlebars = isEnabled('handlebars');

    this.useTaskRunner = answers.useTaskRunner || this.config.get('useTaskRunner');
    this.useGrunt = this.useTaskRunner === 'grunt' || false;
    this.useGulp = this.useTaskRunner === 'gulp' || false;

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

  // Package.
  this.template('_package.json', 'package.json');
  this.template('_README.md', 'README.md');

  // Assets.
  this.directory('assets');
  if (this.useSass) {
    this.directory('scss');
  }
};

Generator.prototype.buildViews = function buildViews() {
  if (!this.themeEngine) {
    return;
  }

  var generator = 'sassdoc-theme:' + this.themeEngine.toLowerCase();
  var options = {
    'skip-message': this.options['skip-install-message'],
    'skip-install': this.options['skip-install'],
    useFilter: this.useFilter,
    useIndexer: this.useIndexer
  };

  this.on('install', function () {
    // Call specified task runner sub-generator.
    this.composeWith(generator, { options: options });
  });
};

Generator.prototype.buildTaskRunner = function buildTaskRunner() {
  if (!this.useTaskRunner) {
    return;
  }

  var generator = 'sassdoc-theme:' + this.useTaskRunner.toLowerCase();
  var options = {
    'skip-message': this.options['skip-install-message'],
    'skip-install': this.options['skip-install'],
    slugname: this.slugname,
    themeEngine: this.themeEngine,
    useSass: this.useSass
  };

  this.on('install', function () {
    // Call specified task runner sub-generator.
    this.composeWith(generator, { options: options });
  });
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
