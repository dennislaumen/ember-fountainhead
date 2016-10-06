import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('docs-page/attributes', 'Integration | Component | docs page/attributes', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{docs-page/attributes}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#docs-page/attributes}}
      template block text
    {{/docs-page/attributes}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
