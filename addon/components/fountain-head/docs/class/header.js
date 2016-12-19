import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

/**
 * Docs Page class header. Contains class name with a link to source file for
 * class.
 * @class FountainHead.Class.Header
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------

  /**
   * Src file id for this file. Used for link to for source.
   * @property srcFileId
   * @type {string}
   * @default ''
   */
  srcFileId: '',
  /**
   * Name of the class. Is generated by the `@constructor` tag.
   * @property name
   * @type {string}
   * @default ''
   */
  name: '',

  // Properties
  // ---------------------------------------------------------------------------

  /**
   * @property classNames
   * @type {Array}
   * @default ['fh-docs-header']
   */
  classNames: ['fh-docs-header'],
  /**
   * @property tagName
   * @type {string}
   * @default 'h2'
   */
  tagName: 'h2',

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{name}} Class
    <small>
      {{! @TODO: Link component needed to handle external vs internal file links }}
      {{#link-to 'docs.files' srcFileId classNames='source-icon'}}
        [source]
      {{/link-to}}
    </small>
  `
});
