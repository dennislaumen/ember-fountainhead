import Ember from 'ember';
import layout from './template';
const { getOwner, HTMLBars } = Ember;

export default Ember.Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------

  description: '',

  // Properties
  // ---------------------------------------------------------------------------

  layout,

  partialName: '',

  // Methods
  // ---------------------------------------------------------------------------

  /**
   * Looks through the passed-in template string and checks for action helpers;
   * when it finds some, it checks for the actions referenced and registers no-ops
   * for them on this component's context so that the application doesn't explode
   * when trying to reference a non-existent action.
   *
   * @method _checkActionRefs
   * @param {String} templateString The template string to run the check for action matches on
   * @return {undefined}
   */
  _checkActionRefs(templateString) {

    if (!templateString) { return; }

    const firstFilter = /action\s"(\w*?)"/gim;
    const secondFilter = /\'(.*?)\'/gi;
    let matchedActions = templateString.match(firstFilter);

    if (!matchedActions) { return; }

    let actionNames = matchedActions.map(item => {
      return item.replace(/\"/g, '\'').match(secondFilter)[0].replace(/\'/g, '');
    });

    // Loop through the list of actions and set up no-ops on the local context
    // so that the test app doesn't explode
    actionNames.forEach(action => {
      if (!this.get(`actions.${action}`)) {
        this.set(`actions.${action}`, function() {});
        console.log(`Setting up a no-op for action name of ${action}`);
      }
    });
  },

  /**
   * Grabs the input from the parent instance's code editor, compiles it into a
   * real-live HTMLBars template, registers it on the container as a partial
   * and makes it available as output for the preview component's template to
   * render.
   *
   * New partials are created for every change, using a date string as the
   * partial name to avoid collisions.
   *
   * @method _generateDescription
   * @param {[type]} templateString [description]
   * @return {[type]}
   */
  _generateDescription(templateString) {
    try {
      let timestamp = Date.now();

      // Ensure non-existant passed in actions don't cause the app to explode
      this._checkActionRefs(templateString);

      // Compile the string into a template and register it on the container
      getOwner(this).register(`template:partials/live-preview-${timestamp}`, HTMLBars.compile(templateString));
      // Update the reference of the preview's partialName to match the newly generated partial
      this.set('partialName', `partials/live-preview-${timestamp}`);
      this.set('compilerError', '');
    } catch(ex) {
      this.set('compilerError', ex);
    }
  },

  // Hooks
  // ---------------------------------------------------------------------------

  /**
   * The component's default `init` hook. Allows us to map the contextActions
   * to real actions on the preview components' actions hash to ensure they're
   * available at compile time.
   *
   * @method init
   * @return {unefined}
   */
  init() {
    this._super(...arguments);

    const actions = this.get('contextActions');
    const yellAboutIt = (thang) => { console.log(`${thang} called`); };

    for (let action in actions) {

      if (!(actions.hasOwnProperty(action))) { return; }
      if (this.get(`actions.${action}`)) { return; } // already set, do less

      if (typeof actions[action] === 'function') {
        this.set(`actions.${action}`, action);
      } else {
        this.set(`actions.${action}`, yellAboutIt(action));
      }
    }
  },

  /**
   * The component's native `didReceiveAttrs` hook. Used to fire the
   * `_generateDescription` method for rendering an updated template partial
   * based on the parent's code editor input.
   *
   * @event didReceiveAttrs
   * @param {[type]} { newAttrs } [description]
   * @return {[type]}
   */
  didReceiveAttrs({ newAttrs }) {
    if (!newAttrs.description.value) { newAttrs.description.value = ''; }
    this._generateDescription(newAttrs.description.value);
  },

  // Actions
  // ---------------------------------------------------------------------------

  /**
   * The component actions hash; to be filled in by the parent context, and/or
   * by failsafe action detection
   *
   * @property actions
   * @type {Object}
   */
  actions: {}
});