---
title: Web components without a framework
description: Why this site's design system is four plain Custom Elements — no Lit, no reactive-property framework — and what that trades away.
slug: web-components-without-a-framework
date: 2026-06-05
status: draft
locale: en
tags:
  - web-components
  - design-systems
cover:
  src: /images/mock/post-web-components.svg
  alt: Placeholder mock cover for the web components post.
---

Mock content for layout verification — not a real post yet.

Four components — a button, a tag, a badge, and a card — make up the whole design system, and none of them need much reactivity: an attribute changes, a small part of the shadow root updates, done. That's a good fit for the plain Custom Elements API directly: `static observedAttributes`, `attributeChangedCallback`, a shadow root built once in the constructor.

The tradeoff against a small reactive-rendering layer is manual bookkeeping — each component's `#update()` method is responsible for keeping the DOM in sync with its own attributes, rather than a diffing render function doing it automatically. For four small, mostly-static leaf components, that's a fair trade: less to install, less to explain, and the resulting `.js` files are just classes calling `customElements.define()`.

They still work exactly the same from Vue, React, or plain HTML — that was the whole point of reaching for Web Components in the first place, and it doesn't depend on which library (if any) renders their internals.
