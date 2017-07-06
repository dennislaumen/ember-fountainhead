import hbs from 'htmlbars-inline-precompile';
import BasePage from './base-page';

/**
 * Fountainhead `/guide` page component
 * @class FountainheadPages.Guide
 * @constructor
 * @extends FountainheadPages.BasePage
 * @experimental
 */
export default BasePage.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------
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
    <div class='fh-page-in-page-wrapper'>
      <div class='page-title'>
        {{#if guide.attributes.title}}
          <h1>{{guide.attributes.title}}</h1>
        {{/if}}
      </div>
      <main class='guide-page fh-wrapper'>
        <div class='guide-content'>
          {{fountainhead-runtime-description
            description=guide.body}}
        </div>
        {{navigation-guides meta=fountainhead.meta}}
      </main>
    </div>
  `
});
