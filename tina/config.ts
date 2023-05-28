import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io

  build: {
    outputFolder: "admin",
    publicFolder: "public",
    // basePath: "" // deployed at subpath, later probably not needed, when fully deployed
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {name: "blog",
      label: "Blog",
      path: "src/content/blog",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Title",
          isTitle: true,
          required: true,
        },
        {
          type: "string",
          name: "description",
          label: "Description",
        },
        {
          type: "string",
          name: "author",
          label: "Author",
        },
        {
          type: "datetime",
          name: "pubDate",
          label: "Date Published",
          required: true,
          ui: {
            component: "date",
            dateFormat: "YYYY-MM-DD",
          }
        }, 
        {
          label: "Tags",
          name: "tags",
          type: "string",
          list: true,
          required: true,
          options: [
            {value: "astro", label: "astro"},
            {value: "web", label: "web"},
            {value: "statistics", label: "statistics"}
          ]
        },
        {
          type: "rich-text",
          name: "body",
          label: "Body",
          isBody: true,
        }]
      },
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
