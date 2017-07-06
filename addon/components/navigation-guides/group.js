import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({

  propTypes: {
    /**
     * @property {Object} guideGroup
     * @public
     */
    guideGroup: null
  },

  /**
   * Protected tracking prop for guide group state.
   * @property {boolean} expanded
   * @protected
   * @default false
   */
  expanded: false,

  // Actions
  // ---------------------------------------------------------------------------
  actions: {
    /**
     * Called on click of group trigger, toggles height animation of group container
     * and toggles {{c-l 'expanded'}} value.
     * @method toggle
     */
    toggle() {
      this.toggleProperty('expanded');
      this.$('.guide-group').animate({ height: 'toggle' }, 250);
    }
  },

  // Template
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{#fountainhead-button
      classNames='guide-group-trigger'
      link=true
      click=(action 'toggle')}}
      <svg class='fh-svg{{if expanded ' active'}}' viewBox="0 0 32 32">
        <path d="M24.773 13.301c-0.651 0.669-7.512 7.205-7.512 7.205-0.349 0.357-0.805 0.534-1.261 0.534-0.458 0-0.914-0.178-1.261-0.534 0 0-6.861-6.536-7.514-7.205-0.651-0.669-0.696-1.87 0-2.586 0.698-0.714 1.669-0.77 2.522 0l6.253 5.997 6.251-5.995c0.854-0.77 1.827-0.714 2.522 0 0.698 0.714 0.654 1.917 0 2.584z"></path>
      </svg>
      {{guideGroup.linkText}}
    {{/fountainhead-button}}
    <div class='guide-group{{if expanded ' expanded'}}'>
      {{#each guideGroup.guides as |guide|}}
        {{link-to guide.attributes.linkText 'guides' guide.id classNames='guide-link'}}
      {{/each}}
    </div>
  `
});
