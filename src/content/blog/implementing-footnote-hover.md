---
title: 'Hover Tooltip on Footnotes in Astro'
pubDate: 2023-05-27
description: 'Using tippy hover on footnotes.'
author: 'Michael Liou'
tags: ["astro", "web", "devlog"]
draft: true
---

<!-- https://github.com/quarto-dev/quarto-cli/blob/809fe8c1da6286c0c2d8028ff72fe70ec1cb6e4e/src/resources/formats/html/templates/quarto-html.ejs#L378 -->

## Tippy.js

The magic will be handled by [tippy.js](https://atomiks.github.io/tippyjs/). I'm going to use the CDN version, but you can also install it via npm. The interface is incredibly simple to use, and the overall design of the script will simply search a document for all elements with a footnote id, and link the tool tip to the footnote.

