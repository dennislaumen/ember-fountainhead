'use strict';
const path = require('path');
const VersionChecker = require('ember-cli-version-checker');
const generateDocs = require('./lib/index.js');

let config;

// Configuration is optional, load in a try/catch to handle possible error
try {
  config = require(path.resolve('fountainhead.js'));
} catch(ex) {
  config = {};
}

/**
 * The `Index` class from `index.js` handles addon consumption through Ember CLI.
 * @module EmberFountainhead
 */

/**
 * Addon index export handles all of the behind the scenes Ember magic that sets
 * up Ember Fountainhead consumption in a given app.
 * @class Index
 * @constructor
 */
module.exports = {
  name: 'ember-fountainhead',

  // Methods
  // ---------------------------------------------------------------------------

  /**
   * Handle importing required assets on behalf of consuming application. The
   * template compiler is required for the runtime-description component and
   * the styles are automatically included for simpler setup
   * @method _importBrowserDependencies
   * @param {Object} app Consuming application
   */
  _importBrowserDependencies(app) {
    const checker = new VersionChecker(this);

    // Unless `includeVendorStyles` is explicitly set to false, we auto bundle
    // Fountainhead's styles into the vendor.css file here
    if (config.includeVendorStyles !== false) {
      app.import(path.join(this.treePaths.vendor, 'ember-fountainhead.css'));
    }

    // We need to import the template compiler to the bundle in order to compile
    // templates at runtime. Use Ember version to construct correct path
    if (checker.forEmber().satisfies('>= 2.11.0')) {
      // Normally you can't app.import node deps and need to use a `treeForVendor`
      // like this: http://stackoverflow.com/questions/28201036/add-node-module-to-ember-cli-app
      // to Funnel node deps into the vendor dir AND THEN you can app.import them
      // in the include hook. For some reason though, this appears to work now,
      // hopefully this is part of the 2.11 improvements. If this ends up not
      // working for some people we'll need to conditionally do a treeFor Funnel
      // and then import from the /vendor dir here.
      // tl;dr: full resolve needed for cli and node_modules import, Ember 🔮
      app.import(path.resolve('node_modules', 'ember-source', 'dist', 'ember-template-compiler.js'));
    } else {
      app.import(path.join(app.bowerDirectory, 'ember', 'ember-template-compiler.js'));
    }
  },

  // Addon Hooks
  // ---------------------------------------------------------------------------

  /**
   * Handle walking addon tree to find consuming application and setting project
   * configs on addon for reference.
   *
   * If in development or addon is configured for inclusion to production build
   * handle addon setup
   * @method included
   */
  included(app, parentAddon) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    const env = process.env.EMBER_ENV || 'development';
    let projectConfiguration = this.project.config(env);
    let projectOptions = app.options;

    this.app = app;
    this.projectConfiguration = projectConfiguration;
    this.projectOptions = projectOptions;

    // Pulls in dependencies to /vendor, we always run this b/c the entire addon
    // should be blacklisted if not wanted in production
    this._importBrowserDependencies(app);
  },
  /**
   * Define cli commands in return object. Check out http://thejsguy.com/2016/07/10/creating-a-custom-ember-cli-command.html for a
   * nice high level intro to defining cli commands.
   * @method includedCommands
   * @return {Object} Object of command definitions according to some spec somewhere
   */
  includedCommands() {
    return {
      // Defines `ember docs` command that generates docs JSON files
      // TODO: Ability to specify config path
      docs: {
        name: 'docs',
        description: 'Generate Fountainhead documentation data and files',
        run(commandOptions, rawArgs) {
          generateDocs();
        }
      }
      // TODO: Help and init config commands
    };
  },
  /**
   * Generates fountainhead output before a build is run for live editing.
   * Feature is enabled by default and can be disabled by setting `liveEdit` to
   * `false` in your `fountainhead.js` configuration.
   * @method preBuild
   * @return {undefined}
   */
  preBuild() {
    const env = process.env.EMBER_ENV || 'development';

    if (env === 'development' && config.liveEdit !== false) { generateDocs(); }
  }

  // Fallback exclude feature if we need to nix using
  // app/instance-initializers/fountainhead-routes to setup fountainhead routes
  // automagically
  // postprocessTree(type, tree) {
  //   if (type !== 'js') { return tree; }
  //
  //   return new Funnel(tree, {
  //     exclude: [
  //       /components\/core-/, /* radical */
  //       /components\/fountain-head/,
  //       /routes\/docs/, /* works */
  //       /services\/fountainhead/,
  //       /services\/tagging/, /* radical */
  //       // /utils\/route-setup/, /* this is directly imported */
  //       /templates\/docs/
  //     ],
  //     description: 'Funnel: Conditionally Filtered Fountainhead'
  //   });
  // }
};
