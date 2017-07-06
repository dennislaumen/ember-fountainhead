const assert = require('assert');
const generateGuide = require('./generate-guide');

describe('generate-guide', function() {
  it('defaults to filepath if guide has no front matter', () => {
    const file = '### Some Guide\nWithout any front matter';

    const actual = generateGuide({ fileSrc: file, filePath: 'some/file-path.md' });

    assert.equal(actual.id, 'some_file-path.md',
      'defaults to file path for guide id');
    assert.ok(actual.attributes, 'has attributes prop even without front matter');
  });

  it('uses id if declared in front matter', () => {
    const file = '---\nid: some-guide\n---\n### Some Guide\nWITH front matter';

    const actual = generateGuide({ fileSrc: file, filePath: 'some/file-path.md' });

    assert.equal(actual.id, 'some-guide',
      'defaults to file path for guide id');
  });

  it('parses markdown in guide', () => {
    const file = '### Some Guide\nWithout any front matter';

    const actual = generateGuide({ fileSrc: file, filePath: 'some/file-path.md' });

    assert.equal(actual.body, '{{#fountainhead-header tagName="h3" elementId="some-guide"}}Some Guide{{/fountainhead-header}}\n<p>Without any front matter</p>\n',
      'guide body markdown is parsed to HTML');
  });
});
