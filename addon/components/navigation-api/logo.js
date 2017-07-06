import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * The logo at the top of the API navigation is a component so that you can
 * easily extend it for custom logos that can't be contained in a merge image.
 *
 * If {{c-l 'meta' class='Fountainhead'}} has a logo, that will be used
 * otherwise we fall back to the Fountainhead logo.
 * @class NavigationAPI.Logo
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Path to a custom logo, can be set in your
   * [<span class='mono'>fountainhead.js</span>](/guides/configuration) file.
   * @property logo
   * @type {?string}
   * @passed NavigationAPI
   */
  logo: null,

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
    <div class='project-logo-wrapper fh-element'>
      {{#link-to 'index' classNames='logo-link'}}
        <img src={{if logo logo '/ember-fountainhead/fountainhead-logo-light.svg'}}
          class='project-logo {{unless logo 'fountainhead-logo'}}'
          alt='project logo' />
      {{/link-to}}
    </div>
  `
});
