import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fountainhead-sidebar/sidebar', 'Integration | Component | fountainhead sidebar/sidebar', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{fountainhead-sidebar/sidebar}}`);

  assert.equal(this.$().text().trim().replace(/\s\s+/g, ' '), 'Made with lots of heart icon by HealthSparq Open Source Labs');
});
