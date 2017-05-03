import Component from 'ember-component';
import Set from 'ember-metal/set';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

/**
 * Parent navigation component for API route. Requires the entire docs meta
 * object.
 *
 * @class APINavigation
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

  // Methods
  // ---------------------------------------------------------------------------

  searchClassesAndItems(data, doUpdate) {
    const checkItems = set => {
      set.forEach(item => doUpdate(item));
    };

    checkItems(data.modules);
    checkItems(data.classes);
  },

  // Hooks
  // ---------------------------------------------------------------------------

  didInsertElement() {
    $('body').on('keyup.sidebarSearch', evt => {
      if (evt.keyCode === 83) {
        $('.fh-api-search-input input').focus();
      }
    });
  },

  didReceiveAttrs() {
    this.send('clearMatches');
  },

  willDestroyElement() {
    $('body').off('keyup.sidebarSearch');
  },

  // Actions
  // ---------------------------------------------------------------------------
  actions: {
    clearMatches() {
      let data = this.get('meta');
      const resetItems = items => {
        items.forEach(thing => {
          Set(thing, 'isVisible', true);
        });
      };

      if (!data || !(data instanceof Object)) { return; }

      resetItems(data.modules);
      resetItems(data.classes);
    },

    /**
     * Method to filter on doc elements for search.
     * @method doFilter
     * @param {Object} item The item to perform matching on or something I don't know
     * @param {Boolean} matchFound Whether the item matches or not
     * @return {undefined}
     */
    markMatches(item, matchFound) {
      Set(item, 'isVisible', matchFound);
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <nav role='navigation' class='fh-api-navigation'>
      {{api-navigation/logo logo=meta.logo}}

      {{#api-navigation/section title='Search'}}
        {{fountainhead-omni-filter
          classNames='fh-api-search-input'
          inputClassNames='w-100'
          dataSet=meta
          matchOnFields='name'
          placeholderText='Search API Classes'
          traverseData=searchClassesAndItems
          clearAction=(action 'clearMatches')
          updateAction=(action 'markMatches')}}
      {{/api-navigation/section}}

      {{!--
      {{#if meta.version}}
        {{TODO: This should be a link to this tag OR a version selector! }}
        {{api-navigation/section title=(concat 'tag: ' meta.version)}}
      {{/if}}
      --}}

      {{#if meta.modules}}
        {{api-navigation/section
          title='Modules'
          items=meta.modules}}
      {{/if}}

      {{#if meta.classes}}
        {{api-navigation/section
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
