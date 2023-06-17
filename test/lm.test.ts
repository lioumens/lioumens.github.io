import { describe, expect, it, assert } from "vitest"
import {wls} from "../src/lib/stats/lm"
import {Matrix} from "ml-matrix"


describe("weighted least squares", () => {
    it("works for slr, both number[]", () => { 
        const y = [4.5, 4.25, 5.5, 5.5]
        const X = [2, 4.25, 5.5, 8]

        const result = wls(y, X).coef
        const expected = [3.940, 0.202]
        //IMPROVE: Don't know how to compare equality of two arrays of floats
        // https://stackoverflow.com/questions/35318278/expect-an-array-of-float-numbers-to-be-close-to-another-array-in-jasmine 
        expect(result[0]).toBeCloseTo(expected[0], 2)
        expect(result[1]).toBeCloseTo(expected[1], 2)
    })
    it("works for slr, one number[] and one Matrix", () => {
        const y = [10, 4.4, 7.6, 3.9, 1.1]
        const X = new Matrix([[4], [7], [1], [2], [3]])

        const result = wls(y,X).coef
        const expected = [5.7689, -0.1085]
        expect(result[0]).toBeCloseTo(expected[0], 3)
        expect(result[1]).toBeCloseTo(expected[1], 3)
    })
    it("works with weights, both number[]", () => { 
        const y = [4.5, 4.25, 5.5, 5.5]
        const X = [2, 4.25, 5.5, 8] 
        const w = [4, 3, 2, 1]

        const result = wls(y, X, w).coef
        const expected = [3.980661, 0.187255]
        //IMPROVE: Don't know how to compare equality of two arrays of floats
        // https://stackoverflow.com/questions/35318278/expect-an-array-of-float-numbers-to-be-close-to-another-array-in-jasmine 
        expect(result[0]).toBeCloseTo(expected[0], 3)
        expect(result[1]).toBeCloseTo(expected[1], 3)
    })
})