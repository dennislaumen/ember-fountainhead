import Router from '../router';

/**
 * Fountainhead's routes are automatically mounted to the consuming application's
 * router through an `instance-initializer`. We're currently directly importing
 * the consuming application's router by declaring this initializer in the `/app`
 * directory instead of the `/addon` directory.
 * @module App
 */

/**
 * Automagically mount Fountainhead routes through an `instance-initializer`.
 *
 * NOTE: this initializer needs to be in the `/app` directory so that the the
 * consuming application's router can be directly imported and manipulated.
 *
 * TODO: See if we can use some kind of lookup to do this from within an
 * initializer in the `/addon` directory
 * @class FountainheadRoutes
 * @constructor
 */

/**
 * Initialize route that is called by consuming Ember application
 * `Router` instance from the consuming application can directly mapped.
 * @method initialize
 * @return {undefined}
 */
export function initialize(/* appInstance */) {
  Router.map(function() {
    this.route('guides', { path: '/guides/:guide_id' });
    this.route('api', function() {
      this.route('classes', { path: '/classes/:class_id' });
      this.route('modules', { path: '/modules/:module_id' });
      this.route('files', { path: '/files/:file_id' });
    });
  });
}

/*
 * If we want, it is also possible to inject content into files using the blueprint
 * index file and insertIntoFile: https://ember-cli.com/api/classes/Blueprint.html#method_insertIntoFile
 * insertIntoFile('app/router.js', '  this.route("admin");', {
 *   after: 'Router.map(function() {' + EOL
 * });
 */

export default {
  name: 'fountainhead-routes',
  initialize
};
