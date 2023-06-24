<script setup lang="ts">
import {computed, ref,Ref, watchEffect, onMounted, watch} from 'vue'
import createChart from "./chart.js"
import {VSlider} from 'vuetify/components/VSlider'
import katex from "katex"

const html = katex.renderToString("y_i \\sim \\text{Bernoulli}(p)")

// const p = ref(.5)
const n = ref(80)
const p = ref(.3)
const ySum = computed(() => Math.round(p.value * n.value))
const svgBox = ref() // pointer to svg
const focus = ref(false)

// const binll = computed( () => {
//     return(y.value.reduce((a:number, b:number) => a + b, 0) * Math.log(p.value / (1-p.value)) + n.value * Math.log(1-p.value))
// })
const chart = createChart({
    svgSelector: svgBox, // ref to svg
    xLim: [0, 1],
    yLim: [-200, 0],
    xTicks: [.25, .5, .75, 1.0],
    yTicks: [-200, -150, -100, -50, 0],
    xLabel: "p",
    yLabel: "Log Likelihood"
})

const makeBinLLPoints = computed(() =>{
    const steps = 100
    const xmin = .01
    const xmax = .99
    let pointString = ""
    for (let i = 0; i < steps; i++) {
        let xGrid = xmin + (xmax - xmin) * i / steps
        // let yGrid = (ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)) / n.value
        let yGrid = ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)
        // let yGrid = ySum.value * Math.log(xGrid / (1-xGrid))
        // console.log(ySum.value * Math.log(xGrid / (1 - xGrid)) + Math.log(1 - xGrid))
        let xSVG = chart.xScale(xGrid)
        let ySVG = chart.yScale(yGrid)
        pointString = pointString + `${xSVG},${ySVG} `
    }
    return pointString
})
// function makeBinLLPoints(xmin, xmax, steps) {
//     let pointString = ""
//     for (let i = 0; i < steps; i++) {
//         let xGrid = xmin + (xmax - xmin) * i / steps
//         // let yGrid = (ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)) / n.value
//         let yGrid = ySum.value * Math.log(xGrid / (1-xGrid)) + n.value * Math.log(1-xGrid)
//         // let yGrid = ySum.value * Math.log(xGrid / (1-xGrid))
//         // console.log(ySum.value * Math.log(xGrid / (1 - xGrid)) + Math.log(1 - xGrid))
//         let xSVG = chart.xScale(xGrid)
//         let ySVG = chart.yScale(yGrid)
//         pointString = pointString + `${xSVG},${ySVG} `
//     }
//     return pointString
// }

// watchEffect(() => {
//     y.value = Array.from({length: n.value}, () => Math.random() < p.value ? 1 : 0)
// })

onMounted(() => {
    document.querySelector("#sumY")?.setHTML(katex.renderToString(`\\sum_i y_i = `))
})
</script>

<template>
    <!-- <p>Binomial Likelihood: {{ makeBinLLPoints(0.01, .99, 100) }}</p> -->
    <svg ref="svgBox" class="svgBox" viewBox="0 0 600 300">
        <polyline :points="makeBinLLPoints" stroke="var(--nord6)" stroke-width="1" fill = "none"/>
    </svg>
    <v-app class="llslider">
        <v-row justify="center" class="mt-0">
            <v-col sm="10">
                <v-slider
                color="var(--nord6)"
                v-model="n"
                hint="total number of observations"
                step="1"
                min="1"
                max="100"
                thumb-size="15">
            <template v-slot:append> <v-label><span style="font-family: monospace">&nbsp;&nbsp;&nbsp;n = {{ n.toFixed(0).padEnd(3, "&nbsp;") }}&nbsp;</span></v-label> </template>
            </v-slider>
                <v-slider
                color="var(--nord6)"
                v-model="p"
                hint="proportion of 1's observed in the data (no stochasticity)"
                step=".01"
                min=".01"
                max=".99"
                thumb-size="15">
            <template v-slot:append> <v-label><span style="font-family: monospace"> prop =  {{ p.toFixed(2) }}</span></v-label> </template>
            </v-slider>
            </v-col>
        </v-row>
    </v-app>
</template>

<style scoped lang="scss">
.llslider :deep(.v-application__wrap) {
  min-height: 0;
}
.llslider :deep(.v-input__details){
    padding-top: 0rem;
    margin-top: -.5rem;
}
.llslider :deep(.v-messages){
    font-size: .9rem;
}
.llslider{
    height: fit-content;
}
// :deep(.v-application) {
//     height: fit-content;
// }
</style>