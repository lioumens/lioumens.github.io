// import {assert, expect, test} from "vitest";

const test1 = [2, 2, 2, 2].map((depth) => ({depth}))
const test2 = [2, 2, 2, 3].map((depth) => ({depth})) // ye
const test3 = [2, 2, 2, 3, 4, 2].map((depth) => ({depth})) // ye
const test4 = [2, 2, 3, 4, 2, 3, 2].map((depth) => ({depth})) // ye
const test5 = [2, 2, 3, 4, 2, 3, 2, 2].map((depth) => ({depth})) // ye
const test6 = [2, 2, 4, 4, 2, 3, 2].map((depth) => ({depth})) // ye
const test7 = [2, 3, 3, 2, 3, 2].map((depth) => ({depth})) // ye
const test8 = [2, 3, 4, 4, 3].map((depth) => ({depth})) // ye

const testa = [{depth:2}, {depth:2}, {depth:3}, {depth:3}, {depth:2}]
const testb = [2, 3, 4, 2, 3, 3, 2, 2].map((depth) => ({depth}))

function genTOC(flat) {
   const toc = []
   let currentDepth = 1;
  
   const tree = new Map()
   let current = []
   flat.forEach((h) => {
    // console.log("Currently processing: ", h, ", currentDepth: ", currentDepth)
    const entry = {...h, children: []}
     if (entry.depth > currentDepth) {
        tree.get(currentDepth) === undefined ?
            tree.set(currentDepth, current) :
            tree.get(currentDepth).push(...current)
        current = [entry]
        currentDepth = entry.depth
     } else if (entry.depth === currentDepth) {
        current.push(entry)
     } else { // lower than current
        // console.log(currentDepth, current)
        tree.get(currentDepth) === undefined ?
            tree.set(currentDepth, current) :
            tree.get(currentDepth).push(...current)
        // pop all higher 
        while (currentDepth > entry.depth) {
            const prevNode = tree.get(currentDepth - 1)
            if (prevNode !== undefined) {
                prevNode[prevNode.length - 1].children.push(...tree.get(currentDepth))
                tree.delete(currentDepth)
            } 
            currentDepth--
        }
        // tree.get(entry.depth).push(entry)
        current = [entry]
        // console.log("After Reduction:" )
        // console.dir(tree, {depth: null})
     }
   })

   // final processing 
   if (currentDepth >= 2) {
    tree.get(currentDepth) === undefined ?
        tree.set(currentDepth, current) :
        tree.get(currentDepth).push(...current)
   }
   while (currentDepth > 2) {
    const prevNode = tree.get(currentDepth - 1)
    if (prevNode !== undefined) {
        prevNode[prevNode.length - 1].children.push(...tree.get(currentDepth))
        tree.delete(currentDepth)
    }
    currentDepth--
   }
   return tree.get(2)
}

function buildToc(headings) {
    const toc = [];
    const parentHeadings = new Map();
    headings.forEach((h) => {
      const heading = { ...h, subheadings: [] };
      parentHeadings.set(heading.depth, heading);
    //   console.dir(parentHeadings, {depth: null})
      // Change 2 to 1 if your markdown includes your <h1>
      if (heading.depth === 2) {
        toc.push(heading);
      } else {
        parentHeadings.get(heading.depth - 1).subheadings.push(heading);
      }
      console.dir(toc, {depth: null})
    });
    return toc;
  }

// console.dir(genTOC(testa), {depth: null})


// console.dir(genTOC(test3), {depth: null})
console.dir(genTOC(test6), {depth: null})
// console.dir(genTOC(testb), {depth: null})

// console.log(testb)
// const a = new Map()
// a.set(1, "one")
// a.set(1, "two")
// console.log(a)

// test('Math.sqrt()', () => {
// 	expect(Math.sqrt(4)).toBe(2);
// 	expect(Math.sqrt(144)).toBe(12);
// 	expect(Math.sqrt(2)).toBe(Math.SQRT2);
// });