'use strict'

var path = require('path')
var util = require('util')
var yeoman = require('yeoman-generator')
var isset = require('../../utils').isset

var Generator = module.exports = function Generator () {
  yeoman.generators.Base.apply(this, arguments)

  this.useExtras = isset(this.options.useExtras) ? this.options.useExtras : true
}

util.inherits(Generator, yeoman.generators.Base)

Generator.prototype.buildViews = function createViewFiles () {
  this.sourceRoot(path.join(__dirname, '../../templates/swig'))

  var index = 'index.swig'

  if (!this.useExtras) {
    index = 'index_bare.swig'
  }

  this.mkdir('views')
  this.copy(path.join('views', index), 'views/index.swig')
  this.template('_index.js', 'index.js')
}

Generator.prototype.install = function install () {
  if (this.options['skip-install']) {
    return
  }

  var pkgs = {
    dependencies: [
      'swig'
    ],
    devDependencies: []
  }

  var done = this.async()

  this.npmInstall(pkgs.dependencies, {
    save: true
  }, done)
}
