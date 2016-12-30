import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fountain-head/docs/sidebar', 'Integration | Component | fountain head/docs/sidebar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{fountain-head/docs/sidebar}}`);

  assert.equal(this.$().text().trim(), 'Search');
});