import Component from 'ember-component';
import inject from 'ember-service/inject';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';

export default Component.extend({
  fhSearch: inject(),
  fountainhead: inject(),

  // Passed Properties
  // ---------------------------------------------------------------------------

  results: null,

  query: '',

  // Ember Props
  // ---------------------------------------------------------------------------

  classNames: ['fh-results-wrapper'],

  // Hooks
  // ---------------------------------------------------------------------------

  didInsertElement() {
    $(`#${this.get('elementId')}`).find('.fh-results-input').focus();

    $('body').on('keyup.fhResults', evt => {
      if (evt.keyCode === 27) {
        this.send('closeResults');
      }
    });

    $('body').on('click.fhResults', '.result-item', evt => {
      this.send('closeResults');
    });
  },

  willDestroyElement() {
    $('body').off('keyup.fhResults');
  },

  // Actions
  // ---------------------------------------------------------------------------

  actions: {
    closeResults() {
      this.get('fhSearch').send('clearMatches');
      this.get('fhSearch').send('closeResults');
    }
  },

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <section class="fh-results-content">
      <h3>
        {{fountainhead-search-input
          inputClassNames='w-100 fh-results-input'
          meta=fountainhead.meta
          query=fhSearch.query
          tagName=''}}
      </h3>
      {{#fountainhead-button
        classNames='fh-close-search'
        link=true
        click=(action 'closeResults')}}
        Close
      {{/fountainhead-button}}
      {{#if results.totalResults}}
        {{#each-in results as |category group|}}
          {{#if group.items.length}}
            <strong class="fh-results-group-title">{{group.title}}</strong>
            {{#each group.items as |result|}}
              {{#if (eq result.type 'method')}}
                {{c-l class=result.class classNames='result-item' item=result.name}}
              {{else}}
                {{link-to
                  result.name
                  (concat 'api.' result.type)
                  result.name
                  classNames='result-item'}}
              {{/if}}
            {{/each}}
          {{/if}}
        {{/each-in}}
      {{else if (not fhSearch.query)}}
        <strong class="fh-results-group-title">Type to search</strong>
      {{else}}
        <strong class="fh-results-group-title">No results were found</strong>
      {{/if}}
    </section>
  `
});
