import { defineConfig, sharpImageService } from 'astro/config';
import vue from '@astrojs/vue';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  // Enable Vue to support Vue components.
  integrations: [vue(), preact()],
  // base: "/astro-website" // base routing also given here....since deployed at subpath
  experimental: {
    assets: true
  },
  markdown: {
    shikiConfig: {
      theme: "nord",
    },
    remarkPlugins: [
      'remark-math',
    ],
    rehypePlugins: [
      ["rehype-katex", {
         // katex plugin options
         trust: true,
         strict: false
      }]
    ]
  },
  image: {
    service: sharpImageService(), // use sharp for image optimization, faster than squoosh
  }
});