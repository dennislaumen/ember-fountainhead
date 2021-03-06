import hbs from 'htmlbars-inline-precompile';
import BasePage from './base-page';

/**
 * Fountainhead `/doc/module` page component
 * @class FountainheadPages.Module
 * @constructor
 * @extends FountainheadPages.BasePage
 */
export default BasePage.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Module model content
   * @property module
   * @type {string}
   * @default ''
   */
  module: {},

  // Hooks
  // ---------------------------------------------------------------------------
  /**
   * Handle nulling out properties `submodules` and `classes` if they don't have
   * any keys.
   * @event didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);

    // Check if submodules is empty
    if (this.get('module.submodules')) {
      const keys = Object.keys(this.get('module.submodules'));
      if (!keys.length) { this.set('module.submodules', null); }
    }

    // Check if classes && namespaces is empty
    if (this.get('module.classes')) {
      const keys = Object.keys(this.get('module.classes'));
      if (!keys.length) { this.set('module.classes', null); }
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <h2 class='fh-page-header'>
      {{module.name}}
      <small>
        {{! @TODO: Link component needed to handle external vs internal file links }}
        {{link-to '[source]' 'api.files' module.srcFileId classNames='source-icon'}}
      </small>
    </h2>
    {{! Not sure if this is right, attempting to match Ember docs, see ember-routing}}
    {{#if module.is_submodule}}
      {{! TODO: Module parent should be a link }}
      <p class='fh-parent'>Parent: {{link-to module.module 'api.modules' module.module}}</p>
    {{/if}}

    {{fountainhead-runtime-description
      description=module.description}}

    {{#if module.submodules}}
      <h4 class='fh-docs-category uppercase'>Submodules</h4>
      <ul class='fh-module-category'>
        {{#each-in module.submodules as |key|}}
          <li>{{link-to key 'api.modules' key}}</li>
        {{/each-in}}
      </ul>
    {{/if}}

    {{#if module.classes}}
      <h4 class='fh-docs-category uppercase'>Classes and Namespaces</h4>
      <ul class='fh-module-category'>
        {{#each-in module.classes as |key|}}
          <li>{{link-to key 'api.classes' key}}</li>
        {{/each-in}}
      </ul>
    {{/if}}
  `
});
