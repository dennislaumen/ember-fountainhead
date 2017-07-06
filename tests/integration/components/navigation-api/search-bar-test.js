import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('navigation-api/search-bar', 'Integration | Component | navigation api/search bar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{navigation-api/search-bar}}`);

  assert.equal(this.$().text().trim(), '');
});
