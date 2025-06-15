import { defineConfig, sharpImageService } from 'astro/config';

// integrations
import vue from '@astrojs/vue';
import mdx from "@astrojs/mdx";
import sitemap from '@astrojs/sitemap';
// import preact from "@astrojs/preact"; // not using preact

// markdown plugins
import remarkMath from 'remark-math';
import remarkSectionize from 'remark-sectionize';
import rehypeKatex from 'rehype-katex';
import astroExpressiveCode from "astro-expressive-code";
// import remarkMermaid from 'remark-mermaid'

// astro-mdx-code-blocks
// import AutoImport from 'astro-auto-import';
// import MDXCodeBlocks, { mdxCodeBlockAutoImport } from 'astro-mdx-code-blocks';


// https://astro.build/config
export default defineConfig({
  site: "https://michaelliou.io",
  // Enable Vue to support Vue components.
  integrations: [
    sitemap(),
    // removed block because need to redo code blocks, auto import was only used for the mdx component "astro-mdx-code-blocks"
    //   AutoImport({
    //     imports: [mdxCodeBlockAutoImport('./src/components/MyCodeBlock/MyCodeBlock.astro')]
    // }),
    //   AutoImport({
    //     imports: ['./src/components/MyCodeBlock/MyCodeBlock.astro'],
    // }),
    // MDXCodeBlocks(),
    // for vuetify plugins
    vue({appEntrypoint: '/src/pages/_app'}),
    astroExpressiveCode(),
    mdx()
  ],
  // base: "/astro-website" // base routing also given here....since deployed at subpath
  experimental: {
    // assets no longer experimental as of Astro 3.0
    // assets: true
  },
  legacy: {
    collections: true
  },
  markdown: {
    drafts: false,
    shikiConfig: {
      theme: "nord",
      langs: ["python", "r", "html", "css", "javascript", "sass"]
    },
    remarkPlugins: [remarkMath, remarkSectionize
    // remarkMermaid,
    ],

    rehypePlugins: [[rehypeKatex, {
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