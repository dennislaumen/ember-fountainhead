---
id: scroll-targeting
linkLabel: Scroll Targets
title: Automatic Scrolling and Click To Copy Headers
group: Architecture
---

Fountainhead has different automatic scrolling to header and property ids for _Hash
Location_ consumers and _History Location_ consumers. The goal of this is to offer very
clean URLs for consumers using history location routing, while still supporting targeted
scrolling for consumers using hash location routing. History routing consumers will
generate URLs with fragment ids. Hash routing consumers will generate URLs with `id`
query params:

**History Location Routing:**<br/>
`your-docs.com/guides/your-guide#header-id`<br/>
**Hash Location Routing:**<br/>
`your-docs.com/#/guides/your-guide?id=header-id`

## Feature Overview
If you need to make an update or log a bug against the feature this overview will
provide background information on how the overall flow executes.

1. Addon `index.js` reads consuming application's `locationType` in addon `config`
   hook. The `locationType` is passed into every call to generate documentation data.
   In data generation, if the `locationType` is `hash`, the flag `hashRouting` is
   set to true and added to the documentation meta. _(History routing is the
   default routing expected. hashRouting is only set as an override)_
1. Addon begins tracking the location hash in order to pass the hash down as a data
   element. Routes `/api` and `/guides` activate hook trigger the `fountainhead`
   service to set an event listener for the `hashchange` event. This event fires
   anytime an in page url with a hash fragment is clicked. All routes will reset the
   tracked fragment id and then update it after the url changes _(Required due to
   route changes not firing the hashChange event)_.
1. Routes will reset the page scroll to the top on every transition. This ensures
   that if the page is scrolled, and the new route doesn't have a scroll target, the
   page is correctly scrolled to the top.
1. Page templates pass either the tracked hash fragment or the controller `id` query
   param to page components depending on the consuming routing type.
1. Any change in the model or passed scroll target will trigger the page's
   `didReceiveAttrs` hook, which is used to scroll to the passed target, or scroll to
   top of page if no target is present.
1. Headers and property links are wrapped in either an anchor with the href set to a
   fragment id for history location consumers or a `link-to` with the id query param
   for hash location users.

## Feature Overview II
1. Addon checks if consumer is using Hash or History location, updates Fountainhead's
   documentation meta with flag.
2. IF HASH => Use query params, and everything will Just Work™. Router, link-tos and
   controllers automatically track `id` query param. Passed down into page components
   we can use `didReceiveAttrs` hook to execute scrolling.
2. IF HISTORY => Hash has to be tracked:
    - Ember will leave fragment ids in urls on page reload
    - Anchors with ONLY fragment ids do not trigger Ember route changes, url updates
      with new hash (hashChange event fires) (this is 👍 for copyable headers and
      property links in class page index tab)
    - Link-tos (even with forced hash addition) have hash stripped from url at some
      point. (this is a problem for cross-link)
2. On route activation, send `trackHash`, creates new listener for hash change AND
   sets current hash if one has been set (this is how page reload still triggers a
   a scroll).
2. Clicking an anchor with fragment ONLY will fire a hash change event, but clicking
   a link-to to a different route OR clicking browser back button will NOT fire a
   hash change event.
3. For route changes:
    - Default behavior is to update the tracked fragment using `scheduleOnce` `render`
      queue. At that time the url is updated. (When clicking the back button, the url
      at this point may have a previous scroll target.)
    - For cross-links pointing to some target, Ember strips out the fragment during
      transition. Cross-links handle this by looking up current route and setting a
      `crossLinkFragmentOverride` on click of a cross link. Then in the `scheduleOnce`
      handler we can check for the fragment override to know that there SHOULD be a
      fragment in the url. (this is the navigating forward with hash scenario).
