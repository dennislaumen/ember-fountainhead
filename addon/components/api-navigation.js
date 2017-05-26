import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';
import set from 'ember-metal/set';
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

  isSearching: false,

  matchingResults: {},

  // Methods
  // ---------------------------------------------------------------------------

  searchClassesAndItems(data, doUpdate) {
    this.setProperties({
      isSearching: true,
      matchingResults: {
        modules: {
          title: 'Modules',
          items: []
        },
        classes: {
          title: 'Classes',
          items: []
        },
        method: {
          title: 'Methods',
          items: []
        },
        other: {
          title: 'Other',
          items: []
        },
        totalResults: 0
      }
    });

    const checkItems = dataSet => {
      dataSet.forEach(item => doUpdate(item));
    };

    checkItems(data.modules);
    checkItems(data.classes);
    checkItems(data.methods);
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
      let matchingResults = Object.assign({}, this.get('matchingResults'));

      for (let group in matchingResults) {
        if (matchingResults[group].items) {
          set(matchingResults[group], 'items', []);
        }
      }

      set(matchingResults, 'totalResults', 0);

      this.setProperties({
        isSearching: false,
        matchingResults
      });
    },

    /**
     * Method to filter on doc elements for search.
     * @method doFilter
     * @param {Object} item The item to perform matching on or something I don't know
     * @param {Boolean} matchFound Whether the item matches or not
     * @param {String} query The query string
     * @return {undefined}
     */
    markMatches(item, matchFound, query) {
      this.set('query', query);
      if (matchFound) {
        let itemType = item.type ? item.type : 'other';
        let itemsList = this.get(`matchingResults.${itemType}.items`).concat([item]);
        this.set(`matchingResults.${itemType}.items`, itemsList);
        this.incrementProperty('matchingResults.totalResults');
      }
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
          traverseData=(action searchClassesAndItems)
          clearAction=(action 'clearMatches')
          updateAction=(action 'markMatches')}}
      {{/api-navigation/section}}

      {{#if isSearching}}
        {{fountainhead-search-results
          query=query
          results=matchingResults}}
      {{/if}}

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
