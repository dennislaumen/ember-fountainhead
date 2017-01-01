import Ember from 'ember';
import config from './config/environment';
import fountainheadRoutes from 'ember-fountainhead/utils/route-setup';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('getting-started');

  fountainheadRoutes(this);
});

export default Router;
