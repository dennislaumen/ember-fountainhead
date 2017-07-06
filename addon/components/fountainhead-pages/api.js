import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';
import inject from 'ember-service/inject';

/**
 * Fountainhead `/api` page component handles rendering the API sidebar, welcome
 * messaging and all API related subroutes including modules, classes and source
 * files. The `outlet` for this route is yielded by this component, which
 * is how we use components to handle rendering all of our pages, even with
 * subroutes.
 *
 * Because we want the default setup of Fountainhead to look like it's own app
 * we render everything in a `fh-page-in-page-wrapper` wrapper which is position
 * fixed to cover the entire screen. This allows us to have our own header and
 * footer even if a consuming application has one in their `application.hbs`
 * template.
 *
 * Page data is passed from the `fountainhead` service, which is the primary
 * store for the addon and handles fetching the meta data for the API docs.
 * @class FountainheadPages.API
 * @uses FountainheadRepoLink
 * @uses FountainheadSidebar.Sidebar
 * @constructor
 * @extends Ember.Component
 */
export default Component.extend({
  fountainhead: inject(),

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
    <div class='fh-page-in-page-wrapper'>
      {{! Octocat page corner SVG logo }}
      {{fountainhead-repo-link repository=fountainhead.meta.repository}}

      <main class='fh-container'>
        {{navigation-api meta=fountainhead.meta}}
        <div class='fh-content-container'>
          <div class='fh-content api-documentation'>
            {{! This is where subroutes are rendered through the outlet }}
            {{yield}}
          </div>
        </div>
      </main>
    </div>
  `
});
