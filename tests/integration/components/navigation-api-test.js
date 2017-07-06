import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import meta from '../../fixtures/meta';

moduleForComponent('navigation-api', 'Integration | Component | navigation api', {
  integration: true,
  beforeEach() {
    // Set a fresh copy of fixture data for each test
    this.set('meta', Object.assign({}, meta));
  }
});

test('it renders logo and made by message only with no data', function(assert) {
  this.set('meta.classes', []);
  this.set('meta.modules', []);
  this.render(hbs`{{navigation-api meta=meta}}`);

  assert.ok(this.$('.project-logo-wrapper'), 'project logo is rendered');
  assert.ok(this.$('.made-with-wrapper'), 'made with love message is rendered');
  assert.equal(this.$('.nav-section').length, 0,
    'No nav sections are created without data');
});

test('it renders meta logo if present and defaults to fountainhead logo', function(assert) {
  this.render(hbs`{{navigation-api meta=meta}}`);

  assert.equal(this.$('.logo-link img').attr('src'), '/test-logo.png',
    'meta logo is used for logo src');

  // When a logo isn't set, nav should default to fountainhead logo
  this.set('meta.logo', null);
  assert.ok(this.$('img.fountainhead-logo').length,
    'custom Fountainhead logo is rendered');
});

test('it renders sections for doc modules and classes', function(assert) {
  this.render(hbs`{{navigation-api meta=meta}}`);

  assert.equal(this.$('.nav-section').length, 2,
    'A section is created for modules and one for classes');
});

test('it doesnt render section for modules without data', function(assert) {
  this.set('meta.modules', []);
  this.render(hbs`{{navigation-api meta=meta}}`);

  assert.equal(this.$('.nav-section').length, 1,
    'A section is created for classes but not for modules');
});

test('it doesnt render section for classes without data', function(assert) {
  this.set('meta.classes', []);
  this.render(hbs`{{navigation-api meta=meta}}`);

  assert.equal(this.$('.nav-section').length, 1,
    'A section is created for modules but not for classes');
});
