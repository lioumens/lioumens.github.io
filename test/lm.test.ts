import { describe, expect, it, assert, beforeAll } from "vitest"
import {wls, logistic} from "../src/lib/stats/lm"
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
        expect(result[0]).toBeCloseTo(expected[0], 4)
        expect(result[1]).toBeCloseTo(expected[1], 4)
    })
    it.todo("works with matrix entries")
    it.todo("works on ANOVAs, and non full rank matrices")
})

describe("logistic regression", () => {
    describe("simple logistic regression", () => {
        const y = [1, 0, 1, 1]
        const x = [1, 2, 3, 4] 
        const glmObj = logistic(y, x)

        it("gives correct coef for simple logistic regression", () => {
            const resultCoef = glmObj.coef
            const expected = [-.2194337, 0.56662]
            expect(resultCoef[0]).toBeCloseTo(expected[0], 4)
            expect(resultCoef[1]).toBeCloseTo(expected[1], 4)
        })
        it("gives correct std errors for simple logistic regression", () => {
         expect(glmObj.coefstderr[0]).toBeCloseTo(2.719529, 4)
         expect(glmObj.coefstderr[1]).toBeCloseTo(1.131468, 4)
        })
    })
    it("works for almost separation", () => {
        const y = [0, 0, 1, 0, 1, 1]
        const x = [1, 2, 3, 4, 5, 6] 
        const glmObj = logistic(y, x)
        const coef = glmObj.coef
        const separationDetected = logistic(y, x).separationDetected
        const expected = [-4.249097, 1.214028]
        expect(coef[0]).toBeCloseTo(expected[0], 4)
        expect(coef[1]).toBeCloseTo(expected[1], 4)
        expect(separationDetected).toBe(false)
    })
    it.only("doesn't error for quasi separation", () => {
        const y = [0, 0, 1, 0, 1, 1]
        const x = [1, 2, 3, 3, 5, 6] 
        const glmObj = logistic(y, x)
        const glmCoef = glmObj.coef
        const separationDetected = logistic(y, x).separationDetected
        expect(glmCoef[0]).toBeNaN()
        expect(glmCoef[1]).toBeNaN()
        expect(separationDetected).toBe(true)
        glmObj.coefstderr.map((x) => expect(x).toBeNaN())
    })
    it("doesn't error for complete separation", () => {
        const y = [0, 0, 0, 1, 1, 1]
        const x = [1, 2, 3, 4, 5, 6] 
        const result = logistic(y, x).coef
        const separationDetected = logistic(y, x).separationDetected
        expect(result[0]).toBeNaN()
        expect(result[1]).toBeNaN()
        expect(separationDetected).toBe(true)
    })
    it.todo("emits warning for complete/quasi separation")
    it.todo("extends to multivariate logistic regression")
}
)