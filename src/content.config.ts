// Import utilities form 'astro:content'
import { z, defineCollection } from "astro:content";
import { glob } from 'astro/loaders';

// Define a 'type' and 'schema' for each collection
const blogCollection = defineCollection({
    loader: glob({
        pattern: '**/[^_]*.{md,mdx}',
        base: './src/content/blog'
    }),
    schema: ({ image }) => z.object({
        title: z.string(),
        pubDate: z.date(),
        modifiedDate: z.date().optional(),
        description: z.string(),
        author: z.string(),
        image: z.object({
            // url: image().refine((img) => img.width >= 500, {
            //     message: "cover image must be at least 500 wide!",
            // }),
            url: image(),
            alt: z.string(),
            caption: z.string().optional()
        }).optional(),
        // alternate image for social media sharing
        socialImage: z.object({
            // url: image().refine((img) => img.width >= 315, {
            //     message: "social image must be at least 315 wide!",
            // }),
            url: image(),
            alt: z.string(),
        }).optional(),
        tags: z.array(z.string()),
        toc: z.boolean().default(false),
        comments: z.boolean().default(true),
        draft: z.boolean().optional()
    })
})

// Export a single 'collections' object to register your collections
// 
export const collections = {
    blog: blogCollection
}