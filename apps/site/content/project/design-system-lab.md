---
title: Design system lab
cover:
  src: /images/mock/project-design-system-lab.svg
  alt: Placeholder mock cover for the design system lab project entry.
date: 2026-06-15
description: A small, framework-agnostic component library — button, tag, badge, card — built as plain Web Components and documented in Storybook.
kind: project
links:
  - label: Component reference
    href: https://example.com
locale: en
role: Design systems engineer
slug: design-system-lab
stack:
  - TypeScript
  - Custom Elements
  - Storybook
status: published
tags:
  - web-components
  - storybook
---

Mock content for layout verification — not a real project write-up yet.

Four leaf components, each a small dependency-free `HTMLElement` subclass with real Shadow DOM: a button, an interactive filter tag, a non-interactive kind/status badge, and a card used as the entry-preview container across the site's list pages.

Documented and demoed in Storybook, with props/controls generated straight from each component's own TypeScript source via `@custom-elements-manifest/analyzer` — not hand-written docs that can drift out of sync with the code.
