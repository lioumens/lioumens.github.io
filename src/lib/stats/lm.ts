
import { Matrix,
    inverse,
    solve,
    linearDependencies,
    QrDecomposition,
    LuDecomposition,
    CholeskyDecomposition,
    EigenvalueDecomposition,
    AbstractMatrix} from 'ml-matrix';

// linear model module
type MatrixOrArrayOrVector = Matrix | number[][] | number[]

let a = new Matrix([
        [2, 3, 5.34234],
        [4, 1, 6],
        [1, 3, 1],
    ]);
let x = [2, 4.25, 5.5, 8]
let X = new Matrix([
    [1, 2],
    [1, 4.25],
    [1, 5.5],
    [1, 8],
  ]);
  
let y = [4.5, 4.25, 5.5, 5.5]
// console.log(solve(X, Matrix.columnVector(y)))
// console.log(Matrix.columnVector(x).addColumn(0, new Array(4).fill(1)))

let w = [4, 3, 2, 1]
// console.log(solve(W.mmul(A), W.mmul(B)))
// console.log(A);
// console.log(x)
// b = 56

// let numnum = [[1, 2], [3, 4]]
// console.log(Array.isArray(numnum))
// console.log(numnum)
// console.log(Matrix.isMatrix(a))


/**
 * @description checks if x is a number array. Used to narrow down types for ts.
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
function isNumberArray(x : MatrixOrArrayOrVector) : x is number[] {
    return (Array.isArray(x) && typeof x[0] === "number")
}

interface lmObject {
    coef: number[]
}
/**
 * Solves linear model with weighted least squares
 * @param y response vector
 * @param X model matrix
 * @param w weights
 * @param intercept whether to include intercept in model
 * @returns interface lmObject
 */
export function wls(y : number[], X : MatrixOrArrayOrVector , w ?: number[], intercept = true) : lmObject {
    // X = Matrix.checkMatrix(X)
    // if (typeof X) {
    // }
    if (!Matrix.isMatrix(X) && X.length === 0 ) { 
        throw new Error("X detected to be empty")
    }
    if (isNumberArray(X)) {
        X = Matrix.columnVector(X)
    } else {
        X = Matrix.checkMatrix(X)
    }

    // add intercept column
    let modelMatrix = intercept ? X.clone().addColumn(0,new Array(X.rows).fill(1)) : X
    
    let coef;
    // solve the normal equations X'Xb = X'y
    let Y = Matrix.columnVector(y)
    if (w === undefined) {
        coef = solve(modelMatrix, Y).getColumn(0)
    } else {
        let W = Matrix.diag(w.map((x) => Math.sqrt(x)))
        coef = solve(W.clone().mmul(modelMatrix), W.clone().mmul(Y)).getColumn(0)
    }
    // wls solution
    return {coef}
}

class Binomial {
    static link = (mu: number) => Math.log(mu / (1 - mu))
    static linkinv = (eta: number) => 1 / (1 + Math.exp(-eta))
}

function applyRows(M:Matrix, f: (x : number) => number) : Matrix{
    const A = M.clone()
    for (let i = 0; i < M.rows; i++) {
        A.setRow(i, M.getRow(i).map(f))
    }
    return A
}

function applyCols(M:Matrix, f: (value:number, index:number, array:number[]) => number) : Matrix {
    const A = M.clone()
    for (let i = 0; i < M.columns; i++) {
        A.setColumn(i, M.getColumn(i).map(f))
    }
    return A
}

// const bfam = new Binomial()
// console.log(Binomial.link(.5))
// console.log(new Binomial())

interface glmObject {
    coef: number[]
}

export function logistic(y: number[], x: number[], maxIter = 200, tol = 1e-8) {
    // console.log(Matrix.columnVector(x).addColumn(0, new Array(x.length).fill(1)))
    let X = Matrix.columnVector(x).addColumn(0, new Array(x.length).fill(1))
    let Y = Matrix.columnVector(y)
   
    let theta = Matrix.zeros(2, 1) // initial guess
    // console.log(theta)
    // console.log(modelMatrix)
    // let eta = modelMatrix.mmul(theta)
    // // console.log(eta)
    // let mu = applyCols(eta, Binomial.linkinv)
    // // console.log(mu)
    // let score = Matrix.columnVector(y.map((yi, i) => yi/mu.get(i, 0) - (1 - yi)/(1 - mu.get(i, 0))))
    // // console.log(score)
    // let w = applyCols(mu, (mui) => mui * (1 - mui))

    // let D = applyCols(modelMatrix, (x, i) => x * mu.get(i, 0) * (1 - mu.get(i, 0)))
    // let yPseudo = D.mmul(theta).add(score.mulColumnVector(w))
    // let lmobj = wls(yPseudo.getColumn(0), D, applyCols(w, (x) => 1/x).getColumn(0), false)
    // let thetaNext = Matrix.columnVector(lmobj.coef)

    // for access outside of for, modify in place more annoying?
    // typescript complaining  about any type for mu
    let w, eta, score, D, yPseudo, lmObj, thetaNext, eps;
    for (let iter = 0; iter < maxIter; iter++) {
        // console.log("theta is:", theta.data)
        eta = X.clone().mmul(theta)
        // console.log("eta is:", eta.data)
        let mu = applyCols(eta, Binomial.linkinv) // this outputs Matrix, why is mu still any type?
        // console.log("mu is:", mu.data)
        // score = Y.divColumnVector(mu).subtract((Y.subtract(1).divColumnVector(mu.subtract(1))))
        score = Y.clone().divColumnVector(mu).subtract(Y.clone().subtract(1).divColumnVector(mu.clone().subtract(1)))
        // score = Matrix.columnVector(y.map((yi, i) => yi/mu.get(i, 0) - (1 - yi)/(1 - mu.get(i, 0))))
        // console.log("Y is", Y)
        // console.log("score is:", score.data)
        w = applyCols(mu, (mui) => mui * (1 - mui))
        // console.log("w is:", w.data)
        D = applyCols(X, (x, i) => x * mu.get(i, 0) * (1 - mu.get(i, 0)))
        // console.log("D is:", D.data)
        yPseudo = D.clone().mmul(theta).add(score.clone().mulColumnVector(w))
        // console.log("yPseudo is:", yPseudo.data)
        lmObj = wls(yPseudo.getColumn(0), D, applyCols(w, (x) => 1/x).getColumn(0), false)
        thetaNext = Matrix.columnVector(lmObj.coef)
        // console.log(thetaNext)
        eps = thetaNext.clone().subtract(theta).norm("frobenius")
        if (eps < tol) {
            break // convergence
        }
        theta = thetaNext
    }
    const coef = theta.getColumn(0)
    const separationDetected = coef.reduce((a, b) => a || Number.isNaN(b), false)
    const glmObj = {coef,separationDetected}
    return(glmObj)
}

// console.log(logistic([1, 0, 1, 1], [1, 2, 3, 4]).coef) // -0.2194337 0.56662
// console.log(logistic([1, 0, 1], [1, 2, 3]).coef) // 0.6931  0.0000 

// need to plot logistic function with polyline

export function add(a: number, b: number) {
    return a + b;
}
// function matrixRound(M, prec = 7) {
//     if (!AbstractMatrix.prototype.isPrototypeOf(M) || !("ta" in M)) {
//         throw new Error("function not implemented outside of abstract matrix")
//     }
//     M.data = M.data.map(row => {
//         // row needs forloop implementation because .map not defined for float64arrays
//         // would need to convert to regular array
//         for (var i = row.length - 1; i >= 0; i--){
//             row[i] = +row[i].toFixed(2)
//         }
//         return row
//     })
//     return M
// } 
