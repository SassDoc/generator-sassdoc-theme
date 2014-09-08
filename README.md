# generator-sassdoc-theme

> [Yeoman] generator that scaffolds out a [SassDoc] theme.


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

  Force to prompt question and re-initialize .yo-rc.json.

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
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
* [Themeleon](https://github.com/themeleon/themeleon/blob/master/README.md) theme engine


## Authors

[Pascal Duez](https://github.com/pascalduez)


## Licence

generator-sassdoc-theme is [unlicensed](http://unlicense.org/).


[Yeoman]: http://yeoman.io
[SassDoc]: https://github.com/SassDoc/sassdoc
