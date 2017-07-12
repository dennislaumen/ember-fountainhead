---
id: getting-started
linkLabel: Getting Started
title: Getting Started
---

## Installation
Install Ember Fountainhead using Ember CLI:

`ember install ember-fountainhead`

_<small>* Currently Ember Fountainhead must be used inside of an Ember application.</small>_

## Documentation Generation
If you already have YUIDoc documentation comments block _(DocBlocks)_ in your
source code, you can generate Fountainhead documentation data files with the
command `ember docs`.

By default Fountainhead will generate data files any time you build your app,
as well as rebuild the files any time your app changes. This can be disabled
using the [liveEdit](#configuration) configuration.

If you don't have DocBlock comments to your source code, you can start adding
them. Fountainhead uses [YUIDoc](https://yui.github.io/yuidoc/) for
source code DocBlock parsing. YUIDoc uses a syntax similar to JSDoc, but does not
parse your source code, only the comments.

_<small>See [YUIDoc Syntax](https://yui.github.io/yuidoc/syntax/index.html) for details
on YUIDoc tags.</small>_

## Excluding from Production
To exclude Fountainhead from your production builds you can **blacklist** in your
`ember-cli-build` configuration using the `addons.blacklist` array:

##### ember-cli-build.js
```javascript
module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    addons: {
      blacklist: EmberApp.env() === 'production' ? ['ember-fountainhead'] : []
    }
  });

  return app.toTree();
};
```
<!-- TODO: Delete when we add hash fragment nav handling -->
<div id="configuration"></div>

## Configuration
The Ember Fountainhead addon as well as the data file generation process can
be configured in a `fountainhead.js` file located in your repo's root:

##### fountainhead.js
```javascript
module.exports = {
  entry: ['app'], // Defaults to 'app' for apps and 'addon' for addons
  output: {
    path: 'docs' // path to save generated docs to
    filename: 'fountainhead-data.json' // name to save generated file to
  }
}
```

{{#fountainhead-alert brand='info' dismiss=false}}
{{fountainhead-svg svgId='info'}}See [Configuring Fountainhead](/guides/configuration.md)
for all possible configuration options.
{{/fountainhead-alert}}

## Addon Styles
Ember Fountainhead's styles are bundled into your `vendor.css` by
default. The styles are scoped to addon namespaces to prevent conflicts with
your application's styles. You can disable style sheet bundling by setting
`includeVendorStyles` to false in your `fountainhead.js` configuration file.

If you'd like to extend Fountainhead's styles and your project uses SASS, you
can turn off the auto bundle to the vendor file and directly import Fountainhead
into your SASS: `@import 'ember-fountainhead'`

_<small>See the [themes](https://github.com/healthsparq/ember-fountainhead/tree/master/app/styles/ember-fountainhead/themes)
for variables you can override.</small>_

## Ember Component Playground
The [Ember Component Playground](https://github.com/healthsparq/ember-component-playground)
addon is a great compliment to this addon that allows real time examples of
components. See the repo for installation.
