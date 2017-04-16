import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * ## Ember-Radical `rad-state` Component
 *
 * Component that can be used for tracking state changes with modals or drawers.
 * Wrap either in one of these and use the yielded state and actions to handle
 * showing/hiding/controlling your component.
 *
 * Useful mainly for demonstration/documentation purposes, but also handy for
 * when you don't have a convenient place to store state (particularly during
 * early development stages). It's also kind of nice for not cluttering up your
 * parent scope with a bunch of extra state and actions you might not want to
 * hang onto. Go nuts!
 *
 * ## Usage
 *
 * Instances of `rad-state` yield an `active` property and a hash of `actions`
 * for manipulating that state: `open`, `close`, and `toggleState`.
 *
 * ```handlebars
 * {{#rad-state as |state stateActions|}}
 *   {{bank-vault
 *     isOpen=state
 *     closeVault=stateActions.close
 *     openVault=stateActions.open}}
 * {{/rad-state}}
 * ```
 *
 * Or for a smipler toggling implementation:
 *
 * ```handlebars
 * {{#rad-state as |switchState switchActions|}}
 *   {{light-switch isOn=switchState toggleSwitch=switchActions.toggleState}}
 * {{/rad-state}}
 * ```
 *
 * The actions in the actions hash have already been yielded via the action
 * helper, so it is not necessary to continue using that helper when passing
 * actions into child components as properties (but you totally still can if
 * you would prefer to.
 *
 * @class FountainheadState
 * @constructor
 * @extends EmberRadical.RadState
 */
export default Component.extend({

  // Properties
  // ---------------------------------------------------------------------------
  /**
   * Boolean state tracking property. Use this to handle show/hide status.
   * {{if state 'state' 'no-state'}}
   * {{#fountainhead-button click=stateActions.toggleState}}Click{{/fountainhead-button}}
   * @property active
   * @type {Boolean}
   */
  active: false,
  /**
   * Rad State is a purely functional component with no rendered output of its
   * own, so it doesn't need a root element cluttering up the DOM when it's
   * being used.
   * {{if state 'state' 'no-state'}}
   * {{#fountainhead-button click=stateActions.toggleState}}Click{{/fountainhead-button}}
   * @property tagName
   * @type {string}
   */
  tagName: '',

  // Actions
  // ---------------------------------------------------------------------------
  /**
   * Actions hash
   * @property actions
   * @type {Object}
   */
  actions: {
    /**
     * Sets the {{c-l 'active'}} property to false.
     * @method closeModal
     */
    close() {
      this.set('active', false);
    },
    /**
     * Sets the {{c-l 'active'}} property to true.
     * @method openModal
     */
    open() {
      this.set('active', true);
    },
    /**
     * Sets the {{c-l 'active'}} property to passed state.
     * @method toggleState
     * @param {boolean} state State to set active to
     */
    toggleState() {
      this.toggleProperty('active');
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`{{yield active (hash
    open=(action 'open')
    close=(action 'close')
    toggleState=(action 'toggleState')
  )}}`
});
