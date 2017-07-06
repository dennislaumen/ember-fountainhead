import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * Guides page navigation is distinct from the API navigation. The Fountainhead
 * meta object is passed into this component.
 * @class NavigationGuides
 * @constructor
 * @extends Ember.Component
 * @experimental
 */
export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Fountainhead documentation meta. Component uses the `guides` meta to create
   * links to each guide page.
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

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <nav role='navigation' class='fh-guide-navigation'>
      {{link-to 'Home' 'index' classNames='guide-link'}}

      {{! TODO: make this a component for extending custom guide navs }}
      {{#each meta.guides as |guide|}}
        {{#if guide.guideGroup}}
          {{navigation-guides/group guideGroup=guide}}
        {{else}}
          {{link-to guide.attributes.linkText 'guides' guide.id classNames='guide-link'}}
        {{/if}}
      {{/each}}

      {{link-to 'API' 'api' classNames='guide-link'}}
    </nav>
  `
});
