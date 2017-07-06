---
id: writing-guides
linkLabel: Writing Guides
title: Writing Guides with Ember Fountainhead
---

Ember Fountainhead makes writing guides easy. Guides can be written in markdown
and Ember components can be used the same as in DocBlocks. For easy previewing, any
guide saved in `/guides` will be observed by Ember CLI and live reload on change.

{{#fountainhead-alert canDismiss=false brand='info'}}
{{fountainhead-svg svgId='info'}} You can save guides in any location in your app,
but if they are not in `/guides` or `/app` changes will not trigger live reloads.
{{/fountainhead-alert}}

## Consuming Guides
Currently Fountainhead must be configured to consume each guide using a `fountainhead.js`
configuration file. _(This will be updated in the future for automatic consumption
of files in the `/guides` directory)_

<div class="code-block-file-name">fountainhead.js</div>

```javascript
module.exports = {
  guides: [
    'guides/getting-started.md',
    'guides/configuration.md',
    'guides/writing-guides.md',
    'guides/tools.md',
    'guides/markdown-in-fountainhead.md'
  ]
}
```

{{#fountainhead-alert canDismiss=false brand='info'}}
{{fountainhead-svg svgId='info'}} Guide order will be matched in the guide page
navigation.
{{/fountainhead-alert}}


## Adding Meta Data

Fountainhead uses [yaml front matter](https://www.npmjs.com/package/front-matter)
when parsing guide files. This lets you easily configure a guide in the file.
The following configurations can optionally be used to control how your guide
is created:

Attribute | Use
--- | ---
`id` | Unique identifier for a guide. Also used as the url model id
`linkLabel` | Anchor text used in guide navigation
`title` | Page header text

<div class="code-block-file-name">your-guide&period;md</div>

```markdown
---
id: writing-guides
linkLabel: Writing Guides
title: Writing Guides with Ember Fountainhead
---

Ember Fountainhead makes writing guides easy...
```

#### Guide Access
[Description Private && Protected]

## Grouping Guides
Sets of guides can be grouped together in the guide navigation using a `guideGroup`.
[Description]

#### Ordering Guides
Guides are included in the nav in the order they're configured + read from the file system. If you want to control the order of the nav there is two ways:
1. Explicitly include all of the guides you want ordered in the `fountainhead.guides` config.
2. Use ordered file names for your guides, eg: `1_first-guide.md`, `2_second-guide.md`
