import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
const { Component } = Ember;

export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------

  results: null,

  query: '',

  // Ember Props
  // ---------------------------------------------------------------------------

  classNames: ['fh-results-wrapper'],

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <section class="fh-results-content">
      <h3>Search Results for <span>{{query}}</span></h3>
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
      {{else}}
        <strong class="fh-results-group-title">No results were found</strong>
      {{/if}}
    </section>
  `
});
