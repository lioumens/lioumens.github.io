// Import utilities form 'astro:content'
import { z, defineCollection } from "astro:content";

// Define a 'type' and 'schema' for each collection
const blogCollection = defineCollection({
    type: 'content', //  can also be type data
    schema: ({ image }) => z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        image: z.object({
            url: image().refine((img) => img.width >= 500, {
                message: "cover image must be at least 500 wide!",
            }),
            alt: z.string()
        }).optional(),
        tags: z.array(z.string()),
        toc: z.boolean().default(false),
        draft: z.boolean().optional()
    })
})

const quartoCollection = defineCollection({
    type: 'content', // 
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string().optional(),
        tags: z.array(z.string())
    })
})

// Export a single 'collections' object to register your collections
// 
export const collections = {
    blog: blogCollection,
    quarto: quartoCollection
}