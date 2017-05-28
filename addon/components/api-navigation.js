import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';
import inject from 'ember-service/inject';
import $ from 'jquery';

/**
 * Parent navigation component for API route. Requires the entire docs meta
 * object.
 *
 * @class APINavigation
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({
  fhSearch: inject(),

  // Passed Properties
  // ---------------------------------------------------------------------------
  /**
   * Fountainhead meta passed from service
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

  // Hooks
  // ---------------------------------------------------------------------------

  didInsertElement() {
    $('body').on('keyup.sidebarSearch', evt => {
      if (evt.keyCode === 83) {
        $('.fh-api-search-input input').focus();
      }
    });
  },

  didReceiveAttrs() {
    this.get('fhSearch').send('clearMatches');
  },

  willDestroyElement() {
    $('body').off('keyup.sidebarSearch');
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <nav role='navigation' class='fh-api-navigation'>
      {{api-navigation/logo logo=meta.logo}}

      {{#if (or meta.modules meta.classes)}}
        {{#api-navigation/section
          title='Search'
          data-test='section-search'}}
          {{fountainhead-search-input
            classNames='fh-api-search-input'
            inputClassNames='w-100'
            meta=meta
            query=fhSearch.query}}
        {{/api-navigation/section}}
      {{/if}}

      {{!--
      {{#if meta.version}}
        {{TODO: This should be a link to this tag OR a version selector! }}
        {{api-navigation/section title=(concat 'tag: ' meta.version)}}
      {{/if}}
      --}}

      {{#if meta.modules}}
        {{api-navigation/section
          title='Modules'
          items=meta.modules
          data-test='section-modules'}}
      {{/if}}

      {{#if meta.classes}}
        {{api-navigation/section
          title='Classes'
          items=meta.classes
          data-test='section-classes'}}
      {{/if}}

      <div class='made-with'>
        Made with lots of&nbsp;&nbsp;{{fountainhead-svg svgId='heart'}}&nbsp;&nbsp;by <br>
        HealthSparq Open Source Labs
      </div>
    </nav>
  `
});
