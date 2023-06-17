import {describe, expect, it, assert} from "vitest"
import genTOC from "../src/scripts/toc-algorithm.js"
import { KeepAlive } from "vue";

describe('Math.sqrt()', () => {
    it("works for low numbers", () => {
        expect(Math.sqrt(4)).toBe(2);
    })
})

describe("genTOC", () => {
    it("works for all the same depth", () => {
        const test1 = [2, 2, 2, 2].map((depth) => ({depth}))

        const result = genTOC(test1)
        const expected = [
            { depth: 2, children: [] },
            { depth: 2, children: [] },
            { depth: 2, children: [] },
            { depth: 2, children: [] }
          ]
        assert.deepEqual(expected, result)

    })
    it("works for deeper at end", () => {
        const test2 = [2, 2, 2, 3].map((depth) => ({depth}))

        const result = genTOC(test2)
        const expected = [
            { depth: 2, children: []},
            { depth: 2, children: []},
            { depth: 2, children: [{ depth: 3, children: []}]},
        ]
        assert.deepEqual(expected, result)
    })
    it("works going twice deeper at end", () => {
        const test2 = [2, 2, 2, 3, 4].map((depth) => ({depth}))

        const result = genTOC(test2)
        const expected = [
            { depth: 2, children: []},
            { depth: 2, children: []},
            { depth: 2, children: [
                { depth: 3, children: [
                    {depth: 4, children: []}
                ]}]},
        ]
        assert.deepEqual(expected, result)
    })
    it("works going twice deeper at end", () => {
        const test2 = [2, 2, 2, 3, 4].map((depth) => ({depth}))

        const result = genTOC(test2)
        const expected = [
            { depth: 2, children: []},
            { depth: 2, children: []},
            { depth: 2, children: [
                { depth: 3, children: [
                    {depth: 4, children: []}
                ]}]},
        ]
        assert.deepEqual(expected, result)
    })
})

