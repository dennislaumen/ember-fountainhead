import $ from 'jquery';
import BaseRoute from './base-route';

/**
 * Fountainhead guides route.
 * @class Guides
 * @constructor
 * @extends Ember.Route
 */
export default BaseRoute.extend({

  // Hooks
  // ---------------------------------------------------------------------------
  /**
   * When in Fountainhead we need to pass down id query param OR the hash depending
   * on LocationType. Kick off hash tracking on activate.
   * @method activate
   */
  activate() {
    this.get('fountainhead').send('trackHash');
  },
  /**
   * We check for and fetch meta data if needed in the parent routes of
   * Fountainhead. This lets consumers overwrite the `apiNamespace` if they
   * need before we request the meta data that drives Fountainhead.
   *
   * NOTE: We only fetch meta data if it isn't present yet.
   * @method beforeModel
   * @return {Promise|true}
   */
  beforeModel() {
    if (!this.get('fountainhead.meta')) {
      return this.get('fountainhead').fetchMeta();
    }

    return true;
  },
  /**
   * Fetches modules's JSON at: `${this.get('fountainhead.apiNamespace')}/modules/${params.file_id}.json`
   * @method model
   * @param {Object} params
   * @param {string} params.guide_id Name of this class, use to fetch data
   * @return {Promise} jQuery ajax promise
   */
  model({ guide_id }) {
    return $.ajax(`${this.get('fountainhead.apiNamespace')}/guides/${guide_id}.json`);
  }
});
