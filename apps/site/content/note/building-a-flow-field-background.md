---
title: Building a flow-field background with p5.js
cover:
  src: /images/mock/note-flow-field.svg
  alt: Placeholder mock cover for the flow-field background note.
date: 2026-06-20
description: Notes on the Clifford-attractor flow field behind the homepage hero, and why it's drawn on canvas instead of shipped as a video.
kind: note
locale: en
slug: building-a-flow-field-background
status: draft
tags:
  - p5js
  - canvas
  - homepage
---

Mock content for layout verification — not a real note yet.

Test

The homepage background is a small p5.js sketch, not a pre-rendered video or a CSS animation. Every frame it steps a grid of particles through a Clifford-attractor vector field, leaving faint trails that slowly fade rather than being cleared outright. That fade is what gives the motion its "ink in water" quality instead of a hard, mechanical redraw.

Canvas over video meant the effect could react to the actual viewport size and color scheme at runtime — the particle color shifts to match `--color-accent`, so switching between light and dark mode doesn't leave the background looking like it belongs to a different site. It also meant no asset to download before the hero could render.

The tradeoff is CPU/GPU cost on low-end devices, and respecting `prefers-reduced-motion` genuinely matters here — most of the visual weight is the motion itself, not any single frame.
