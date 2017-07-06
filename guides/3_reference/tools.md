---
id: tools
linkLabel: Fountainhead Tools
title: Fountainhead Documentation Tools and Features
---

Fountainhead isn't just about writing _beautiful_ documentation. Fountainhead
comes with a set of tools for writing interactive documentation.

## Runtime Template Compilation
All DocBlock descriptions and guides are compiled to template partials during
runtime. This lets you use any component available in your app into your descriptions.
This means that you're not limited to a predefined set of documentation components
pre-bundled with some library. Want to make a custom drawer component for rendering
examples of property values? With Fountainhead all you have to do is add the
component to your application and use it in a DocBlock.

## CrossLink Component
Use the {{c-l class='CrossLink'}} component to reference modules, classes, methods
and properties elsewhere in your documentation:

```javascript
/**
 * DocBlock for some class, with a direct link to the {{c-l 'init'}} method.
 * @property active
 * @type {boolean}
 */
```

{{#c-l class='CrossLink'}}See the CrossLink Component for examples.{{/c-l}}

## State in DocBlock Descriptions
Your documentation descriptions are wrapped in an instance of
[Ember Radical's `rad-state`](https://healthsparq.github.io/ember-radical/docs/classes/Component.RadState)
for a convenient and sandboxed state property and state actions. This is
convenient for including examples in your documentation that require simple
state management.

Use `state` to access the sandboxed state and any of `stateActions.open`,
`stateActions.close` and `stateActions.toggleState` to mutate the state.

## Glimmer Code Blocks
Use the identifier `glimmer` with a fenced code block to highlight the code block
contents and render an unescaped example of the code block immediately after
the code block.

Eg, the following code block:
<pre class="language-markdown"><code class="language-markdown"><span class="token template-string"><span class="token string">``</span></span><span class="token template-string"><span class="token string">`glimmer
  {{some-component example=true}}
`</span></span><span class="token template-string"><span class="token string">``</span></span>
</code></pre>

Will actually be parsed as:
<pre class="language-markdown"><code class="language-markdown"><span class="token template-string"><span class="token string">``</span></span><span class="token template-string"><span class="token string">`glimmer
  {{some-component example=true}}
`</span></span><span class="token template-string"><span class="token string">``</span></span>
<span class="token punctuation">{</span><span class="token punctuation">{</span>some<span class="token operator">-</span>component example<span class="token operator">=</span><span class="token boolean">true</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre>

You can also add data when rendering you components, this is super useful for showing
variations of a theme or components in different states.

At the top of your `glimmer` add data using a JSON string
e.g. `data={"things": ["primary", "secondary", "success"]}`.  This will make every top level key available
to your example and will be stripped from the displayed code.

You can then use the properties in the template.

```glimmer
data={"colors": ["primary", "secondary", "success"]}
{{#each colors as |color|}}
  {{#fountainhead-button brand=color}}{{color}}{{/fountainhead-button}}
{{/each}}
```

## Markdown in DocBlock Descriptions and Guides
Fountainhead has full support for markdown in documentation blocks and guides.
If you're not familiar with markdown, you can start with a tutorial at
[Markdown Tutorial](http://www.markdowntutorial.com/)

_<small>(Markdown is parsed using [markdown-it](https://markdown-it.github.io/markdown-it/))</small>_
