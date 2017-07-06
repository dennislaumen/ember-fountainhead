---
id: tag-type
linkLabel: type Tag
title: Using @type YUIDoc tag
protected: true
---

## On using the `@type` tag:

#### Enclosing Curlies
The enclosing `{}` are optional for YUIDoc, but we recommend using them in case
we are able to upgrade to JSDoc at some point in the future (where they are
required.)

#### Nullable Type Shorthand
Fountainhead recommends following the JSDoc convention for nullable types where
`{?number}` indicates the type is a number or null.

#### Non-Nullable Type Shorthand
Fountainhead recommends following the JSDoc convention for non-nullable types where
`{!number}` indicates the type is a number that CANNOT be null.

#### Types of Classes or Native Types
If your type matches a class or JavaScript native type, the default behavior is
to create a link to the documentation for that class/type. This can be disabled
by setting `linkNatives` to false in `fountainhead.js`. Eg:

`@type {node}` produces a link to `https://developer.mozilla.org/en-US/docs/Web/API/Node`

#### Capitalization
YUIDoc `@type` is case insensitive. You can use titlecase or all lower case
depending on your preference.

```handlebars
<div>
  {{#rad-button}}Button{{/rad-button}}
</div>
```
