<script setup lang="ts">
import {ref, onMounted, watchEffect,computed} from "vue"
import LogisticRegression from "./LogisticRegression.vue";
import PlotlySurface from "./PlotlySurface.vue"
import {seqn} from "../../lib/util.ts"
import {Matrix} from "ml-matrix"
import Katex from "./Katex.vue"
import screenshot from "../../assets/blog-5/logistic_beta_likelihood_fvs1d4_c_scale,w_1400.png?url"

const showComponent = ref(false)
const x = ref([])
const y = ref([])
const beta = ref([0, 0])
const X = computed(() => {
    return(new Matrix(x.value.map((xi) => [1, xi])))
})
const maxLL = computed(() => {
    return(betall(beta.value[0], beta.value[1]))
})

function handlePoints(emittedPoints) {
    x.value = emittedPoints.map(p => p.x)
    y.value = emittedPoints.map(p => p.y)
    // console.log(x.value)
    // console.log(y.value)
}
function handleCoef(coefs) {
    beta.value[0] = coefs.b0
    beta.value[1] = coefs.b1
}

function betall(b0, b1) {
    // console.log(X.value.clone())
    // console.log([b0, b1])
    // console.log(Matrix.rowVector([b0, b1]))
    const eta = X.value.clone().mmul(Matrix.columnVector([b0, b1])).getColumn(0)
    const mui = eta.map(x => 1 / (1 + Math.exp(-x)))
    const sumll = mui.map((x,i) => y.value[i] * Math.log(x) + (1 - y.value[i]) * Math.log(1 - x)).reduce((a,b) => a+b, 0)
    return(sumll)
}

function outer(x:ArrayLike<any>,y:ArrayLike<any>, f:(x:any, y:any) => any) {
    let z = []
    for (let i = 0; i < y.length; i++) {
        z.push([])
        for (let j = 0; j < x.length; j++) {
            z[i].push(f(x[j], y[i])) // j and i switched for transpose
        }
    }
    return z
}

// console.log(seqn(-3, 3, 50))
const xGrid = seqn(-3, 3, 50) 
const yGrid = seqn(-3, 3, 50)
const z = computed(() => {        
    // if (yPos.value === undefined || xPos.value === undefined) {
    //     return([])
    // } 
    return(outer(xGrid, yGrid, betall))
})

const coefMLE = computed(() => {
    return(`\\hat{\\beta}_0 = ${beta.value[0].toFixed(2)}, \\quad \\hat{\\beta}_1 = ${beta.value[1].toFixed(2)}`)
})
</script>



<template>
    <figure>
    <div v-if="showComponent">
    <Katex :src="coefMLE" :inline="false" />
    <!-- <p>Beta0: {{ beta[0].toFixed(2) }}, Beta1: {{ beta[1].toFixed(2) }}</p> -->
    <LogisticRegression :showEquation="false" @pointsEvent="handlePoints" @coefEvent="handleCoef" />
    <Suspense>
        <PlotlySurface :x="xGrid" :y="yGrid" :z="z" :beta0="beta[0]" :beta1="beta[1]" :maxLL="maxLL"/>
    </Suspense>
    </div>
    <picture v-else>
<img
:src="screenshot"
style="max-width: 100%;width: 100%; height: auto;"
alt="">
</picture>
    <figcaption>
        This figure is very computationally intensive, so I've disabled it by default and replaced it with a screenshot. If you'd like to play with it, I'd recommend at the very least being on a laptop. It'll freeze on mobile in my testing. <span @click="(e) => showComponent = !showComponent"><a style="cursor:pointer">Click here to enable/disable it.</a></span> Left click to rotate, right click to pan. Double click on the surface to reset view.
    </figcaption>
    </figure>
</template>