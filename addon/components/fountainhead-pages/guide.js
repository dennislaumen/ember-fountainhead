import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * Fountainhead `/guide` page component
 * @class FountainheadPages.Guide
 * @constructor
 * @extends Ember.Component
 * @experimental
 */
export default Component.extend({

  /**
   * Guide backing model matching structure:
   * ```javascript
   * {
   *   id
   *   attributes
   *   body,
   * }
   * ```
   * @property file
   * @type {string}
   * @default ''
   */
  guide: null,

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <div class="page-title">
      {{#if guide.attributes.title}}
        <h1>{{guide.attributes.title}}</h1>
      {{/if}}
    </div>
    <main class="guide-page fh-wrapper">
      <div class="guide-content">
        {{fountainhead-runtime-description
          description=guide.body}}
      </div>
      {{! TODO: side nav }}
    </main>
  `
});
