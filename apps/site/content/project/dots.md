---
title: Picture Lines
cover:
  src: ""
  alt: ""
date: 2026-07-08
description: Photographs rebuilt entirely from short lines and dots
kind: project
locale: en
seo:
  title: Only Lines
  description: A photograph rebuilt entirely from short lines and dots, sized by local brightness.
slug: dots
stack:
  - p5.js
  - TypeScript
status: draft
tags:
  - p5js
  - generative-art
  - image-processing
---

Mock content for layout verification — not a real project write-up yet.

Every sample point on a source photograph becomes either a short line or a single dot, depending on how dark that patch of the image is — dark areas draw longer strokes, light areas fade to single points, and the photo re-emerges as a field of ink.

:p5js-sketch{sketch="dots"}
