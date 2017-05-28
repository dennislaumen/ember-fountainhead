import Service from 'ember-service';
import Ember from 'ember';
import set from 'ember-metal/set';
const { ActionHandler } = Ember;

export default Service.extend(ActionHandler, {

  // Props
  // ---------------------------------------------------------------------------

  matchingResults: {},

  query: '',

  showResults: false,

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

      this.set('matchingResults', matchingResults);
      this.send('clearQuery');
    },

    clearQuery() {
      this.set('query', '');
    },

    closeResults() {
      this.set('showResults', false);
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
    },

    searchClassesAndItems(data, doUpdate) {
      this.setProperties({
        showResults: true,
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
    }
  }

});