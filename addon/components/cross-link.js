import Component from 'ember-component';
import inject from 'ember-service/inject';
import getOwner from 'ember-owner/get';
import hbs from 'htmlbars-inline-precompile';

/**
 * The `{{cross-link}}` component lets you easily reference other classes,
 * modules, properties and methods in your documentation. It handles creating the
 * appropriate link depending on application routing type and presence of a
 * class property. The cross link component is also available using the shorthand
 * syntax: `{{c-l}}`.
 *
 * {{#fountainhead-alert brand='info' dismiss=false}}
 *   {{fountainhead-svg svgId='info'}} The cross link component is also available as
 *   `{{c-l}}` for terseness.
 * {{/fountainhead-alert}}
 *
 * #### Same Class Cross Linking
 * ```glimmer
 * Quickly link to a property in the same class using positional params:
 * Take a look at the {{c-l 'init'}} method to see how the {{c-l '_route'}} property
 * is set.
 * ```
 *
 * #### Other Class Cross Linking
 * ```glimmer
 * Link to any other class, module, property, or method by passing a `class` or
 * `module` property:
 * Take a look at the {{c-l 'setFragmentId' class='Fountainhead'}} method to see
 * how the URL hash is set.
 * ```
 *
 * #### Block Form
 * When used as an inline component, the rendered link-to's text will be the
 * ID of the module or class along with any passed query params. If you want
 * different link text you can use the component in block form.
 *
 * Property | Description
 * --- | ---
 * `class` | Documentation class to link to
 * `module` | Documentation module to link to
 * `item` | Specific documentation item to link to, appended as a query param
 *
 * {{! --------------------------------------------------------------------- }}
 * {{! TEST CASES: B/c Ember Integration Tests + link-to === 💣              }}
 * {{! Uncomment cases below and check in browser                            }}
 * {{! --------------------------------------------------------------------- }}
 * {{! Postional Params }}
 * {{! ## Testing }}
 * {{!-- {{c-l 'init'}}<br> --}}
 * {{!-- {{#c-l 'init'}}BLOCK TEXT{{/c-l}}<br> --}}
 * {{! Passed Item }}
 * {{!-- {{c-l item='init'}}<br> --}}
 * {{!-- {{#c-l item='init'}}BLOCK TEXT{{/c-l}}<br> --}}
 * {{! Passed Module }}
 * {{!-- {{c-l module='Addon'}}<br> --}}
 * {{!-- {{#c-l module='Addon'}}ADDON MODULE{{/c-l}}<br> --}}
 * {{! Passed Class }}
 * {{!-- {{c-l class='CrossLink' item='init'}} <br> --}}
 * {{!-- {{#c-l class='CrossLink' item='init'}}BLOCK TEXT{{/c-l}}<br> --}}
 * {{!-- {{c-l class='Fountainhead'}}<br> --}}
 * {{!-- {{c-l class='Fountainhead' item='meta'}}<br> --}}
 * {{!-- {{#c-l class='Fountainhead' item='meta'}}BLOCK TEXT{{/c-l}}<br> --}}
 *
 * @class CrossLink
 * @public
 * @constructor
 * @extends Ember.Component
 */
const CrossLink = Component.extend({
  fountainhead: inject(),

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Documentation Class to crosslink to.
   * @property class
   * @type {?string}
   * @passed
   */
  class: null,
  /**
   * Optionally specify an item (property/method) to cross link to on a class.
   * @property item
   * @type {?string}
   * @passed
   */
  item: null,
  /**
   * Documentation module to crosslink to.
   * @property module
   * @type {?string}
   * @passed
   */
  module: null,

  // Properties
  // ---------------------------------------------------------------------------
  /**
   * Computed route passed to rendered `link-to` defined in {{c-l 'init'}}
   * @property _route
   * @type {?string}
   * @private
   */
  _route: null,
  /**
   * Computed model ID passed to rendered `link-to` defined in {{c-l 'init'}}
   * @property _modelID
   * @type {?string}
   * @private
   */
  _modelID: null,
  /**
   * @property tagName
   * @type {string}
   * @default ''
   */
  tagName: '',

  // Hooks
  // ---------------------------------------------------------------------------
  /**
   * Handle setting a route and model for the template when appropriate + set text
   * for cross link for when component is used in inline form.
   * @method init
   */
  init() {
    this._super(...arguments);
    let text;
    const { item, module, class: _class } = this.getProperties('item', 'module', 'class');

    const currentRoute = getOwner(this).lookup('router:main').get('currentRouteName');
    const currentModel = getOwner(this).lookup(`route:${currentRoute}`).get('currentModel.name');

    // Set a single route and model to reference when a module or class is passed
    // in to pass to linking components in template.
    if (module || _class) {
      if (!(this.get('fountainhead.meta.hashRouting'))
          && (module === currentModel || _class === currentModel)) {
        // In this case the consumer is using History location, and cross linking to
        // a property on the same page. In this case, we need to NOT use a link-to
        // and instead use a <a> with a fragment href. The link-to recognizes that
        // the route + model are the same and does not recognize the hash, so it
        // does nothing on click. Using an <a> with a href fragment fires a hash
        // change and the new fragmentId is passed down from Fountainhead service 👍
      } else {
        this.setProperties({
          _route: `api.${module ? 'modules' : 'classes'}`,
          _model: module || _class
        });
      }
    }

    // Handle creating text for when cross-link is used in inline form
    if (module || _class) {
      text = `${module || _class}${item ? `:${item}`:''}`;
    } else {
      text = item;
    }

    this.set('text', text);
  },

  // Actions
  // ---------------------------------------------------------------------------
  actions: {
    /**
     * Ember strips out hash fragments from link-tos, which means that when consumers
     * with History location click a cross-link pointing to a different route, Ember
     * will strip the hash.
     *
     * 'Fix' this by setting `crossLinkFragmentOverride` on the route. When the
     * route `didTransition` fires, it will see the override and update the history +
     * scroll to the cross link target.
     * @method setFragmentOverride
     */
    setFragmentOverride() {
      if (!this.get('item')) { return true; }

      const currentRouteName = getOwner(this)
        .lookup('router:main')
        .get('currentRouteName');

      getOwner(this).lookup(`route:${currentRouteName}`)
        .set('crossLinkFragmentOverride', this.get('item')); // empty for no item
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{#if _route}}
      {{#if fountainhead.meta.hashRouting}}
        {{#link-to _route _model (query-params id=item) class=classNames}}
          {{#if hasBlock}}{{yield}}{{else}}{{text}}{{/if}}
        {{/link-to}}
      {{else}}
        {{#fh-href _route _model fragmentId=item click=(action 'setFragmentOverride') class=classNames}}
          {{#if hasBlock}}{{yield}}{{else}}{{text}}{{/if}}
        {{/fh-href}}
      {{/if}}
    {{else}}
      {{#if fountainhead.meta.hashRouting}}
        {{#link-to (query-params id=item) class=classNames}}
          {{#if hasBlock}}{{yield}}{{else}}{{text}}{{/if}}
        {{/link-to}}
      {{else}}
        <a href={{concat '#' item}} class="{{classNames}}">
          {{#if hasBlock}}{{yield}}{{else}}{{text}}{{/if}}
        </a>
      {{/if}}
    {{/if}}
  `
});

// SOME SWEET MAGIC TO ALLOW US TO USE POSITIONAL PARAMS WITH COMPONENT
CrossLink.reopenClass({
  positionalParams: ['item']
});

export default CrossLink;
