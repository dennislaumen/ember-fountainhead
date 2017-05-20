import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
const { Component } = Ember;

export default Component.extend({

  // Passed Properties
  // ---------------------------------------------------------------------------

  results: null,

  // Layout
  // ---------------------------------------------------------------------------
  layout: hbs`
    <section>
      {{#each results as |result|}}
        {{#if (eq result.type 'method')}}
          {{c-l classNames='item-link' class=result.class item=result.name}}
        {{else}}
          {{link-to
            result.name
            (concat 'api.' result.type)
            result.name
            classNames='item-link fh-element'}}
        {{/if}}
      {{else}}
        <h2>Naw, son.</h2>
      {{/each}}
    </section>
  `
});
