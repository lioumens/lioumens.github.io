// Import utilities form 'astro:content'
import { z, defineCollection } from "astro:content";

// Define a 'type' and 'schema' for each collection
const blogCollection = defineCollection({
    type: 'content', //  can also be type data
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        image: z.object({
            url: z.string(),
            alt: z.string()
        }).optional(),
        tags: z.array(z.string())
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