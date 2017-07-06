import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * Parent navigation component for API route. Requires the entire docs meta
 * object.
 *
 * @class NavigationAPI
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Fountainhead meta passed from service
   * @property meta
   * @type {Object}
   * @passed Fountainhead
   * @required
   */
  meta: null,

  // Properties
  // ---------------------------------------------------------------------------
  /**
   * @property tagName
   * @type {string}
   * @default ''
   */
  tagName: '',

  // Actions
  // ---------------------------------------------------------------------------
  actions: {
    /**
     * Method to filter on doc elements for search.
     * @method doFilter
     * @param {string} query The search query to filter on
     * @return {undefined}
     */
    doFilter(query) {
      // @TODO make this do a thing
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <nav role='navigation' class='fh-api-navigation'>
      {{navigation-api/logo logo=meta.logo}}

      {{! TODO: Make these work }}
      {{!--
      {{#navigation-api/section title='Search'}}
        {{navigation-api/search-bar onUpdate=(action 'doFilter')}}
      {{/navigation-api/section}}

      {{#if meta.version}}
        {{TODO: This should be a link to this tag OR a version selector! }}
        {{navigation-api/section title=(concat 'tag: ' meta.version)}}
      {{/if}}
      --}}

      {{#if meta.modules}}
        {{navigation-api/section
          title='Modules'
          items=meta.modules}}
      {{/if}}

      {{#if meta.classes}}
        {{navigation-api/section
          title='Classes'
          items=meta.classes}}
      {{/if}}

      <div class='made-with'>
        Made with lots of&nbsp;&nbsp;{{fountainhead-svg svgId='heart'}}&nbsp;&nbsp;by <br>
        HealthSparq Open Source Labs
      </div>
    </nav>
  `
});
