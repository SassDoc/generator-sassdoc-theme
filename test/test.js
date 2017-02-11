'use strict'

var path = require('path')
var yeoman = require('yeoman-generator')
var helpers = yeoman.test
var assert = yeoman.assert

describe('SassDoc theme generator', function () {
  var generators = [
    '../generators/app',
    '../generators/grunt',
    '../generators/gulp',
    '../generators/handlebars',
    '../generators/jade',
    '../generators/nunjucks',
    '../generators/swig'
  ]

  it('the generators can be required without throwing', function () {
    generators.forEach(function (gen) {
      this.requireTest = require(gen)
    }.bind(this))
  })

  describe('run test', function () {
    var expectedContent = [
      ['package.json', /"name": "tmp"/],
      ['README.md', /tmp/]
    ]

    var expected = [
      '.gitignore',
      'package.json',
      'README.md',
      'assets/css',
      'assets/js',
      'assets/img',
      'assets/svg',
      'assets/css/main.css',
      'assets/js/main.js'
    ]

    var options = {
      'skip-install-message': true,
      'skip-install': true,
      'skip-welcome-message': true,
      'skip-message': true
    }

    var prompts = {
      themeEngine: false,
      useExtras: false,
      useSass: false,
      useTaskRunner: false
    }

    var deps = generators.map(function (gen) {
      return '../' + gen
    }).concat([
      [helpers.createDummyGenerator(), 'mocha:app']
    ])

    var runGenerator

    beforeEach(function () {
      runGenerator = helpers
        .run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(__dirname, './.tmp'))
        .withGenerators(deps)
        .withOptions(options)
        .withPrompt(prompts)
    })

    /**
     * app:common
     */
    it('creates expected common files', function (done) {
      runGenerator
        .on('end', function () {
          assert.file(expected)
          assert.fileContent(expectedContent)
          assert.noFile([
            'index.js',
            'Gruntfile.js',
            'Gulpfile.js',
            'views',
            'scss/main.scss'
          ])
          done()
        })
    })

    /**
     * app:sass
     */
    it('creates expected sass files', function (done) {
      runGenerator
        .withPrompt({
          useSass: true
        })
        .on('end', function () {
          assert.file([].concat(
            expected,
            'scss/main.scss'
          ))
          assert.fileContent(expectedContent)
          done()
        })
    })

    /**
     * app:swig
     */
    it('creates expected views files', function (done) {
      runGenerator
        .withPrompt({
          themeEngine: 'swig'
        })
        .on('end', function () {
          assert.file([].concat(
            expected,
            'index.js',
            'views/index.swig'
          ))
          assert.fileContent(expectedContent)
          done()
        })
    })

    /**
     * app:grunt
     */
    it('creates expected tasks runner files', function (done) {
      runGenerator
        .withPrompt({
          useTaskRunner: 'grunt'
        })
        .on('end', function () {
          assert.file([].concat(
            expected,
            'Gruntfile.js'
          ))
          assert.fileContent(expectedContent)
          done()
        })
    })
  })
})
