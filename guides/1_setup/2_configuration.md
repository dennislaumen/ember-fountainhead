---
id: configuration
linkLabel: Configuring Fountainhead
title: Configuring Fountainhead
---

Fountainhead has sane defaults for all configuration options. Standard apps/addons
should be able to generate documentation files and use Fountainhead without any
configuration. When needed though, Fountainhead can be customized as desired using
a `fountainhead.js` file.

## fountainhead.js Configuration Options

<div class="code-block-file-name">fountainhead.js</div>

```javascript
/*
 * Fountainhead Default Configurations
 * These are the configuration defaults, they can be overwritten as needed
 */
module.exports = {
  // Sets url for repository link in top left of API page
  repository: ''
  // Generate data files before builds for live reloading
  liveEdit: true,
  // Import Fountainhead styles into vendor.css
  includeVendorStyles: true,
  // Set to true to suppress error logging during data file generation
  quiet: false,
  // Fountainhead custom tags not recognized by YUIDoc
  whiteListTags: ['passed', 'closure', 'action'],
  // Set custom logo path
  logo: ''
  // Directories to parse for API documentation
  entry: ['app'],
  // Paths to guide files
  guides: [],
  // Output directory and filename for master data set
  output: {
    filename: 'fountainhead-data.json',
    path: path.resolve('docs')
  },
  // Automatically set to consuming application's locationType, but can
  // be explicitly specified (sets internal link id target types between
  // query params and hash fragments)
  locationType: locationType
};
```
{{#fountainhead-alert canDismiss=false brand='info'}}
{{fountainhead-svg svgId='info'}} All paths are resolved using `path.resolve`,
meaning that either a relative path or paths starting with `./` will resolve to
your project's root directory.
{{/fountainhead-alert}}

## Environment Specific Configuration
You can export a function from `fountainhead.js` that will receive the build
environment as a parameter if you need environment specific configurations:

<div class="code-block-file-name">fountainhead.js</div>

```javascript
// EG: Include only your app files for production documentation. In dev builds
// include internal dev utilities documentation
module.exports = env => {
  entry: env === 'production' ? ['app'] : ['app', 'dev-utilities']
}
```

## Fountainhead Service Namespace

You can override the root namespace that all Fountainhead requests use by setting
the {{c-l class='Fountainhead' item='apiNamespace'}}. The default value is `/docs`.

<div class="code-block-file-name">app.js</div>

```javascript
import Fountainhead from 'ember-fountainhead/services/fountainhead';

Fountainhead.reopen({ apiNamespace: '/special-namespace/v1/' });
```

The meta request would now use url: `/special-namespace/v1/meta.json`
