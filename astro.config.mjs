import { defineConfig, sharpImageService } from 'astro/config';
import vue from '@astrojs/vue';
import preact from "@astrojs/preact";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // Enable Vue to support Vue components.
  integrations: [vue(), preact(), mdx()],
  // base: "/astro-website" // base routing also given here....since deployed at subpath
  experimental: {
    assets: true
  },
  markdown: {
    drafts: false,
    shikiConfig: {
      theme: "nord",
      langs: ["python", "r", "html", "css", "javascript"]
    },
    remarkPlugins: ['remark-math', 'remark-mermaid'],
    rehypePlugins: [["rehype-katex", {
      // katex plugin options
      trust: true,
      strict: false // for html styling in math blocks
    }]]
  },
  image: {
    service: sharpImageService(),
    // use sharp for image optimization, faster than squoosh
    cacheDir: false // don't cache images in the local filesystem
  }
});