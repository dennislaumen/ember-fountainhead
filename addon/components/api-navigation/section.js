import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * Component creates a section for the {{c-l class='APINavigation'}}. Accepts
 * a {{c-l 'title'}} and an {{c-l 'items'}} array, both optional.
 *
 * Component can be used in block form if just the wrapping section markup is
 * needed with a header.
 * @class APINavigation.Section
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Array of documentation items to create links for. Each item should be of
   * form:
   * ```json
   * {
   *   name: 'Item name - used as text for anchor',
   *   type: 'Either classes or modules'
   * }
   * ```
   * @property items
   * @type {Array}
   * @passed APINavigation
   * @required
   */
  items: null,
  /**
   * Section header text content
   * @property title
   * @type {string}
   * @passed
   * @optional
   * @default ''
   */
  title: '',

  // Properties
  // ---------------------------------------------------------------------------
  /**
   * @property attributeBindings
   * @type {Array}
   * @default ['data-test'],
   */
  attributeBindings: ['data-test'],
  /**
   * @property classNames
   * @type {Array}
   * @default ['nav-section']
   */
  classNames: ['nav-section'],
  /**
   * @property tagName
   * @type {string}
   * @default 'section'
   */
  tagName: 'section',

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{#if title}}
      <h4 class='section-header fh-element'>{{title}}</h4>
    {{/if}}
    {{! Optional array of links }}
    {{#each items as |item|}}
      {{link-to
        item.name
        (concat 'api.' item.type)
        item.name
        classNames='item-link fh-element'}}
    {{/each}}
    {{! You can use a section in block form if you just need wrapping markup }}
    {{yield}}
  `
});
