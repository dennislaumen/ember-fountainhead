import Component from 'ember-component';
import inject from 'ember-service/inject';
import hbs from 'htmlbars-inline-precompile';

export default Component.extend({
  fhSearch: inject(),

  // Passed Props
  // ---------------------------------------------------------------------------

  inputClassNames: '',

  meta: null,

  // Ember Props
  // ---------------------------------------------------------------------------

  tagName: '',

  // Template
  // ---------------------------------------------------------------------------
  layout: hbs`
    {{fountainhead-omni-filter
      classNames=classNames
      inputClassNames=inputClassNames
      dataSet=meta
      matchOnFields='name'
      query=fhSearch.query
      placeholderText='Search API Classes'
      traverseData=(action 'searchClassesAndItems' target=fhSearch)
      clearAction=(action 'clearMatches' target=fhSearch)
      updateAction=(action 'markMatches' target=fhSearch)}}
  `
});