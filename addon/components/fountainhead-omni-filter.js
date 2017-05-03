import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

/**
 * A totally rad component for using a text input to filter over arbitrary data
 * in search of a most exquisite match. This component makes only a the minimum
 * amount of assumptions necessary to be functional, but it's up to you to decide
 * specifically what it outputs, and what to do with that output in your consuming
 * context.
 *
 * ### Example:
 *
 * ```handlebars
 * {{!-- Minimal invocation within your hbs template --}}
 * {{fountainhead-omni-filter
 *   dataSet=fooData
 *   matchOnFields="chips, lacroix"
 *   clearAction=(action "clearCans")
 *   updateAction=(action "updateCans")}}
 * ```
 *
 * By default, the Omni Filter assumes that the `dataSet` you're passing into it
 * is a simple array of objects, and that the keys you want to match against in
 * each of those objects are all at the root level. However, in cases where the
 * keys you want to match on are multiple levels deep, or even within nested
 * arrays, you can pass a custom method into `traverseData` to tell Omni Filter
 * how to navigate your data set.
 *
 * ### Example:
 *
 * ```javascript
 * // Parent context
 * someMethod(data, updateCallback) {
 *   dataSet.forEach(category => {
 *     category.items.forEach(updateCallback);
 *   });
 * }
 * ```
 *
 * ```handlebars
 * {{!-- Invocation within your hbs template --}}
 * {{fountainhead-omni-filter
 *   dataSet=fooData
 *   matchOnFields="chips, lacroix"
 *   traverseData=someMethod
 *   clearAction=(action "clearCans")
 *   updateAction=(action "updateCans")}}
 * ```
 *
 * Note that `data` and `updateCallback` are required arguments for your custom
 * `traverseData` method if you want it to actually do anything and communicate
 * back to the Omni Filter component.
 *
 * Omni Filter also requires that you pass in actions to handle when text is
 * entered into the field, and when the field is cleared out. The component will
 * always attempt to fire these actions, but if you pass nothing in, their
 * default behavior is to no-op, and hence nothing will occur.
 *
 * This architecture allows Omni Filter to be versatile in nature, so that you
 * can feed it whatever data you like, tell it how to examine your data, and
 * control how to use the data about what matches were found within your parent
 * context. The filter should not directly update state outside of its context,
 * which is why there is no option for block invocation; there's no point in
 * duplicating a lot of data and further confusing what comes from where. The
 * Omni Filter simply looks for matches and reports back on what it finds.
 *
 * What you do from there... is up to you 🌈
 *
 * @class FountainheadOmniFilter
 * @constructor
 * @extends Ember.Component
 */
export default Ember.Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------

  /**
   * The set of data you want Omni Filter to examine. Typically this is an Array
   * of Objects, one or more levels deep. It doesn't matter how complex this data
   * is; the Omni Filter can handle it (provided of course that you can write a
   * concise method to tell Omni Filter how to handle it).
   *
   * @property dataSet
   * @type {Array}
   * @default null
   */
  dataSet: null,
  /**
   * Class names to apply to the filter text input for ultimate styling control
   * @property inputClassNames
   * @type {string}
   */
  inputClassNames: '',
  /**
   * A list of keys you want Omni Filter to check against. You can pass as many
   * as you want. It doesn't matter.
   *
   * Better still, you can pass in an array of strings, OR a string containing
   * a comma-separated list of keys. This allows for greater flexibility across
   * implementations.
   *
   * @property matchOnFields
   * @type {Array|String}
   * @default []
   */
  matchOnFields: [],
  /**
   * The text to use as the placeholder in the search field. It can be whatever
   * you want, ya turkey!
   *
   * @property placeholderText
   * @type {string}
   * @default ''
   */
  placeholderText: '',
  /**
   * A custom method for examining/traversing your data structure. This is
   * basically required for situations where your data set contains multiple
   * levels of nested arrays/objects that you need to be able to match against
   * because of some kind of crazy requirements combined with whacko nutball
   * data structure.
   *
   * Did you even realize you can pass functions/methods into components? It's
   * true, you can, and it works SUPER well. I mean, why not, they're just Objects
   * anyway. Everything is.
   *
   * @property traverseData
   * @type {Function}
   * @default null
   */
  traverseData: null,

  // Passed Actions
  // ---------------------------------------------------------------------------

  /**
   * The action to call on the parent context when all data has been
   * cleared from the input field.
   *
   * Use this method to do something in your parent context; typically this will
   * be making all filterable data visible, or clearing out a list of "matched"
   * data.
   *
   * @method clearAction
   * @return {undefined}
   */
  clearAction() {},
  /**
   * The action to call on the parent context when data has been entered
   * into the input field. The component expects that your action will have two
   * arguments: `item` and `matchFound`.
   *
   * Use this method to do something in your parent context, typically to update
   * a list of matches or remove non-matching items from view.
   *
   * @method updateAction
   * @param {Object} item The object that the Omni Filter has just searched within for a match
   * @param {Boolean} matchFound Whether a match was found within one of the Object's specified keys
   * @return {[undefined]}
   */
  updateAction() {},

  // Methods
  // ---------------------------------------------------------------------------

  /**
   * This method is the meat of Omni Filter's matching logic. It's actually
   * relatively simple. The method creates a sanitized version of the query input,
   * and subsequently uses that to create a regex pattern to match again.
   *
   * Then, either the default method of iterating over the objects in the data set,
   * or the custom data traversal method is invoked, and for each item returned
   * by the data traversal, an internal function `performUpdate` is run. This
   * function attempts to look up the specified keys on the current object,
   * and if that key exists, it runs the regex pattern against the key's value.
   *
   * Once the function is through with iterating over every key that Omni Filter
   * has been instructed to check against for matches, it reports back to the
   * parent context about whether a given object contains matchin data or not
   * via the `updateAction` action.
   *
   * @method checkForMatches
   * @param {[type]} query [description]
   * @return {[type]}
   */
  checkForMatches(query) {
    const { dataSet, matchOnFields, traverseData } = this.getProperties('dataSet', 'matchOnFields', 'traverseData');
    const cleanQuery = query.replace(/[^a-z0-9áéíóúñü ]/gim, '') // remove all characters except alpha, numbers and spaces
          .toLowerCase() // convert text to lowercase
          .trim(); // trim whitespace from the edges
    // The regex filter has to be defined after the sanitized query has been generated
    const regexFilter = new RegExp(cleanQuery, 'g');
    /**
     * Standard matching routine for iterating over all requested fields within
     * an object; ideally should be used by all custom logic routines, however
     * it can be ignored in your custom filter in favor of some other means of
     * determining matches... if you're a nutball.
     *
     * @method performUpdate
     * @param {Object} item The item to iterate over and perform a match against
     */
    const performUpdate = (item) => {
      let matchFound = matchOnFields.find(field => {
        // Make sure the field we're trying to check actually exists
        if (item[field]) {
          // Hey its time to use that t rad regex filter we created 😎
          // TELL US IF THERE IS A MATCH OR NOT
          return item[field].toLowerCase().match(regexFilter);
        }
      });
      this.updateAction(item, !!matchFound, query);
    };

    // If custom filter logic has been passed in, use that to perform the data
    // traversal, as there may be multiple levels to navigate. It is up to the
    // `traverseData` method to invoke the `performUpdate` callback.
    if (traverseData) {
      traverseData(dataSet, performUpdate);
    // Otherwise, just assume we are matching against a simple array of objects
    // and execute the `performUpdate` callback for each item.
    } else {
      dataSet.forEach(performUpdate);
    }
  },
  /**
   * This method is called any time the component instance's attributes are
   * updated. Its purpose is to check the value supplied to `matchOnFields`,
   * and if the value is a string, it will attempt to convert the string into
   * an Array of strings containing each of the keys in the original string.
   *
   * Ergo, `"chips, lacroix"` becomes `['chips', 'lacroix']`
   *
   * @method updateMatchFields
   * @return {undefined}
   */
  updateMatchFields() {
    let fieldsAsArray,
        fieldsToMatch = this.get('matchOnFields');

    // If the fields to match against are already an Array, do nothing
    if (fieldsToMatch instanceof Array) { return; }

    fieldsAsArray = fieldsToMatch.split(',').map(item => item.trim());
    this.set('matchOnFields', fieldsAsArray);
  },

  // Hooks
  // ---------------------------------------------------------------------------

  /**
   * The component's `didReceiveAttrs` hook; used to execute `updateMatchFields`
   * so that if a string was passed into `matchOnFields`, it can be converted
   * into a value that the component can actually use to do some iteration.
   *
   * @event didReceiveAttrs
   * @return {undefined}
   */
  didReceiveAttrs() {
    this.updateMatchFields();
  },

  // Actions
  // ---------------------------------------------------------------------------

  actions: {
    /**
     * Simple action passed into the component's input field so that it can
     * report back to Omni Filter when text is typed into or cleared out of it.
     * This action either checks for matches when something was typed in, or
     * calls the clear action back to the parent.
     *
     * @method queryDidChange
     * @param {String|Keyboard} query The query typed into the text field
     * @return {undefined}
     */
    queryDidChange(query) {
      if (event instanceof KeyboardEvent) {
        query = event.target.value;
      }
      if (query) {
        this.checkForMatches(query);
      } else {
        this.clearAction();
      }
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <input
      type="text"
      class="{{inputClassNames}}"
      onkeyup={{action 'queryDidChange'}}
      placeholder={{placeholderText}}
      />
  `
});
