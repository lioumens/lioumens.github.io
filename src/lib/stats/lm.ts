
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
type MatrixOrVector = Matrix | number[][] | number[]

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
function isNumberArray(x : MatrixOrVector) : x is number[] {
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
export function wls(y : number[], X : MatrixOrVector , w ?: number[], intercept = true) : lmObject {
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

    // add matrix of ones
    let modelMatrix = X.addColumn(0,new Array(X.rows).fill(1))
    // console.log("model Matrix", modelMatrix)
    
    let coef;
    // solve the normal equations X'Xb = X'y
    let Y = Matrix.columnVector(y)
    if (w === undefined) {
        coef = solve(modelMatrix, Y).getColumn(0)
    } else {
        let W = Matrix.diag(w.map((x) => Math.sqrt(x)))
        coef = solve(W.mmul(modelMatrix), W.mmul(Y)).getColumn(0)
    }
    // wls solution
    return {coef}
}



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
