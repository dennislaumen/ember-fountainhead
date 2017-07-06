import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import meta from '../../../fixtures/meta';

moduleForComponent('navigation-api/section', 'Integration | Component | navigation api/section', {
  integration: true
});

test('it renders the passed title', function(assert) {
  this.render(hbs`{{navigation-api/section title='Test Title'}}`);

  assert.ok(this.$().text().includes('Test Title'), 'passed title is rendered');
});

test('it renders passed items', function(assert) {
  this.set('meta', meta);
  this.render(hbs`
    {{navigation-api/section
      title='Test Title'
      items=meta.classes}}`);

  let anchors = this.$('a');
  assert.equal(anchors.length, 3,
    'an anchor is rendered for each passed item');
  assert.equal(this.$(anchors[0]).text(), 'Test Class 1',
    'name is rendered as link label');
  assert.ok(this.$().text().includes('Test Title'),
    'passed title is rendered');
});
