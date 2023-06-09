import fs from 'node:fs/promises'
import {compile, run} from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'

// react runtime
import * as runtime from "react/jsx-runtime.js";


export default async function mdxToHhtml(mdx) {
    const code = String(
    await compile(await fs.readFile('../../../content/posts/example.mdx'), {remarkPlugins: [remarkGfm]})
    )
const output = await run(code, runtime)
// console.log(output)
return "0";
}
