// Common configs for all environments
const common = {
  liveEdit: true, // Generate fountainhead docs before a build is run for live reloading
  includeVendorStyles: false, // We directly import styles for dev hot reloading
  quiet: false, // Supresses error logging
  whiteListTags: ['passed', 'action'], // Whitelist unknown tags
  entry: [
    'addon', 'app', 'blueprints', 'lib'
  ],
  // Include any Architecture guides specificly and then close with /releases
  guides: [
    'addon/scroll-target.md',
    'releases'
  ],
  output: {
    filename: 'fountainhead-data.json',
    path: 'docs'
  },
  external: {
    data: [
      {
        base: 'http://emberjs.com/api/',
        json: 'http://builds.emberjs.com/release/ember-docs.json'
      }
    ]
  }
};

// PRODUCTION: The demo app is a gh-pages app that is served from
// `/ember-fountainhead/`, and b/c it's a static site all assets
// need to be prefixed, including the logo.
const production = {
  logo: '/ember-fountainhead/ember-fountainhead/fountainhead-logo-light.svg'
};

// Similar to webpack, you can export a function that receives the
// the environemnt
module.exports = env => {
  if (env === 'production') {
    return Object.assign(common, production);
  } else {
    return common;
  }
};
