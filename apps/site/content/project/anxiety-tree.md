---
title: Flower of Mistakes
cover:
  src: /images/mock/project-anxiety-tree.svg
  alt: Placeholder mock cover for the Flower of Mistakes project entry.
date: 2026-07-05
description: A recursive branching structure that blossoms while debugging a collision algorithm — click to grow it.
kind: project
locale: en
slug: anxiety-tree
stack:
  - p5.js
  - TypeScript
  - Canvas
status: draft
tags:
  - p5js
  - generative-art
  - recursion
---

Mock content for layout verification — not a real project write-up yet.

While debugging a collision algorithm, every failed attempt kept branching off the last one instead of disappearing — so the mistakes themselves became the drawing. Each new line tries a random angle and length, retries if it crosses an existing branch or leaves the frame, and gives up on that path once it's tried enough times.

:p5js-sketch{prompt="Click anywhere to start" sketch="anxiety-tree"}
