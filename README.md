# generator-sassdoc-theme

> [Yeoman] generator that scaffolds out a [SassDoc] theme.


## Features

* Let you chose your preferred template engine
* Build the theme views and `index.js` based on prompts
* Default Sass starter structure
* Let you use a pre-defined Grunt or Gulp workflow
* Templates loaded with examples and comments


## Usage

Install `generator-sassdoc-theme`:
```
npm install -g generator-sassdoc-theme
```

Make a new theme directory, and `cd` into it:
```
mkdir my-new-theme && cd $_
```

Run `yo sassdoc-theme`, optionally passing a theme name:
```
yo sassdoc-theme [options] [<themeName>]
```


## Options

* `--init`

  Force to prompt question and re-initialize `.yo-rc.json`

* `--skip-install`

  Skips the automatic execution of `npm` after
  scaffolding has finished.

* `--theme-engine=[engine]`

  Template engine
  Defaults to `swig`.  
  Supported engines: `jade`, `swig`, `nunjucks`, `handlebars`

## Documentation

SassDoc theme documentation:

* [Using Your Own Theme](https://github.com/SassDoc/sassdoc/wiki/Using-Your-Own-Theme)
* [Theme Context](https://github.com/SassDoc/sassdoc/wiki/Theme-Context)
* [SassDoc Data Interface](https://github.com/SassDoc/sassdoc/wiki/SassDoc-Data-Interface)
* [Themeleon theme engine](https://github.com/themeleon/themeleon/blob/master/README.md)


## Credits

* [Pascal Duez](https://twitter.com/pascalduez)
* [Valérian Galliat](https://twitter.com/valeriangalliat)
* [Fabrice Weinberg](https://twitter.com/fweinb)
* [Hugo Giraudel](http://twitter.com/HugoGiraudel)


## Licence

generator-sassdoc-theme is [unlicensed](http://unlicense.org/).


[Yeoman]: http://yeoman.io
[SassDoc]: https://github.com/SassDoc/sassdoc
